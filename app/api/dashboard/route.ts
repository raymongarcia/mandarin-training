import { NextResponse, type NextRequest } from "next/server";
import { getAuthenticatedClient } from "../../lib/authenticatedSupabase";
import type { Json } from "../../lib/database.types";

function getDateString(date: Date) {
  return date.toISOString().slice(0, 10);
}

function readProgressCounts(value: Json | null) {
  if (!value || Array.isArray(value) || typeof value !== "object") {
    return { phrasesPracticed: 0, completedLessons: 0, completedGoals: 0 };
  }

  const progress = value as Record<string, Json | undefined>;
  const completedLessonIds = Array.isArray(progress.completedLessons)
    ? progress.completedLessons.filter((lesson): lesson is string => typeof lesson === "string")
    : [];
  const completedLessons = completedLessonIds.length;
  const completedGoals = Array.isArray(progress.completedGoals)
    ? progress.completedGoals.filter((goal) => typeof goal === "number").length
    : 0;
  const lesson = progress.lesson && !Array.isArray(progress.lesson) && typeof progress.lesson === "object"
    ? progress.lesson as Record<string, Json | undefined>
    : null;
  const playedAudio = Array.isArray(lesson?.playedAudio) ? lesson.playedAudio : [];
  const phrasesPracticed = completedLessonIds.includes("unit-01-lesson-01")
    ? 4
    : new Set(playedAudio.filter((id) => typeof id === "string" && id.startsWith("word-"))).size;

  return { phrasesPracticed, completedLessons, completedGoals };
}

function calculateStreak(activeDates: Set<string>, today: Date) {
  const todayString = getDateString(today);
  const yesterday = new Date(today);
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);
  let cursor = activeDates.has(todayString) ? today : activeDates.has(getDateString(yesterday)) ? yesterday : null;
  let streak = 0;

  while (cursor && activeDates.has(getDateString(cursor))) {
    streak += 1;
    cursor = new Date(cursor);
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }

  return streak;
}

async function loadDashboard(request: NextRequest) {
  const authenticated = await getAuthenticatedClient(request);
  if ("response" in authenticated) return authenticated.response;
  const { client, user } = authenticated;
  const [activityResult, progressResult] = await Promise.all([
    client
      .from("learning_activity")
      .select("activity_date, active_seconds")
      .eq("user_id", user.id)
      .order("activity_date", { ascending: true }),
    client
      .from("learning_progress")
      .select("progress")
      .eq("user_id", user.id)
      .maybeSingle(),
  ]);

  if (activityResult.error) {
    console.error("Could not load dashboard study activity.", activityResult.error);
    return NextResponse.json({ error: "Could not load your study activity. Apply the dashboard migration and try again." }, { status: 500 });
  }
  if (progressResult.error) {
    console.error("Could not load dashboard learning progress.", progressResult.error);
    return NextResponse.json({ error: "Could not load your learning progress. Check the Supabase table and try again." }, { status: 500 });
  }

  const today = new Date();
  const todayString = getDateString(today);
  const monday = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
  const dayOfWeek = monday.getUTCDay();
  monday.setUTCDate(monday.getUTCDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

  const activityRows = activityResult.data;
  const activityByDate = new Map(activityRows.map((row) => [row.activity_date, row.active_seconds]));
  const weekDays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(monday);
    date.setUTCDate(monday.getUTCDate() + index);
    const dateString = getDateString(date);
    return {
      date: dateString,
      label: new Intl.DateTimeFormat("en", { weekday: "narrow", timeZone: "UTC" }).format(date),
      day: date.getUTCDate(),
      studySeconds: activityByDate.get(dateString) ?? 0,
      today: dateString === todayString,
    };
  });
  const activeDates = new Set(activityRows.map((row) => row.activity_date));
  const weeklyStudySeconds = weekDays.reduce((total, day) => total + day.studySeconds, 0);
  const progressCounts = readProgressCounts(progressResult.data?.progress ?? null);
  const metadataName = user.user_metadata.full_name ?? user.user_metadata.name;
  const displayName = typeof metadataName === "string" && metadataName.trim()
    ? metadataName.trim()
    : user.email?.split("@")[0] ?? "Learner";

  return NextResponse.json({
    displayName,
    weeklyStudySeconds,
    currentStreakDays: calculateStreak(activeDates, today),
    phrasesPracticed: progressCounts.phrasesPracticed,
    completedLessons: progressCounts.completedLessons,
    completedGoals: progressCounts.completedGoals,
    weekDays,
  }, { headers: { "Cache-Control": "no-store" } });
}

export async function GET(request: NextRequest) {
  return loadDashboard(request);
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Send a valid JSON activity update." }, { status: 400 });
  }

  if (!body || typeof body !== "object" || !("seconds" in body)
    || typeof body.seconds !== "number" || !Number.isInteger(body.seconds)
    || body.seconds < 1 || body.seconds > 120) {
    return NextResponse.json({ error: "Activity updates must contain between 1 and 120 whole seconds." }, { status: 400 });
  }

  const authenticated = await getAuthenticatedClient(request);
  if ("response" in authenticated) return authenticated.response;

  const { error } = await authenticated.client.rpc("record_learning_activity", { p_seconds: body.seconds });
  if (error) {
    console.error("Could not record dashboard study activity.", error);
    return NextResponse.json({ error: "Could not save your study time. Apply the dashboard migration and try again." }, { status: 500 });
  }

  return loadDashboard(request);
}
