import { NextResponse, type NextRequest } from "next/server";
import { getAuthenticatedClient } from "../../lib/authenticatedSupabase";

type LessonProgressPayload = {
  sectionIndex: number;
  playedAudio: string[];
  answers: (number | null)[];
  practiceChecks: number[];
  textPracticeSections: number[];
};

type LearningProgressPayload = {
  completedGoals: number[];
  completedLessons: string[];
  lesson: LessonProgressPayload | null;
  lessonPath?: "kids" | "casual" | "business" | null;
};

function isIndexArray(value: unknown, maximum: number) {
  return Array.isArray(value) && value.every(
    (item) => Number.isInteger(item) && item >= 0 && item < maximum,
  );
}

function isLearningProgress(value: unknown): value is LearningProgressPayload {
  if (!value || Array.isArray(value) || typeof value !== "object") return false;
  const progress = value as Record<string, unknown>;
  if (!isIndexArray(progress.completedGoals, 3)
    || !Array.isArray(progress.completedLessons)
    || !progress.completedLessons.every((lesson) => typeof lesson === "string")
    || (progress.lessonPath !== undefined
      && progress.lessonPath !== null
      && progress.lessonPath !== "kids"
      && progress.lessonPath !== "casual"
      && progress.lessonPath !== "business")) {
    return false;
  }
  if (progress.lesson === null) return progress.lessonPath === undefined || progress.lessonPath === null;
  if (!progress.lesson || Array.isArray(progress.lesson) || typeof progress.lesson !== "object") return false;
  if (progress.lessonPath === null) return false;

  const lesson = progress.lesson as Record<string, unknown>;
  return typeof lesson.sectionIndex === "number"
    && Number.isInteger(lesson.sectionIndex)
    && lesson.sectionIndex >= 0
    && lesson.sectionIndex <= 4
    && Array.isArray(lesson.playedAudio)
    && lesson.playedAudio.length <= 32
    && lesson.playedAudio.every((id) => typeof id === "string")
    && Array.isArray(lesson.answers)
    && lesson.answers.length <= 3
    && lesson.answers.every((answer) => answer === null || (typeof answer === "number" && Number.isInteger(answer) && answer >= 0 && answer <= 2))
    && isIndexArray(lesson.practiceChecks, 3)
    && isIndexArray(lesson.textPracticeSections, 3);
}

export async function GET(request: NextRequest) {
  const authenticated = await getAuthenticatedClient(request);
  if ("response" in authenticated) return authenticated.response;
  const { data, error } = await authenticated.client
    .from("learning_progress")
    .select("progress, updated_at")
    .eq("user_id", authenticated.user.id)
    .maybeSingle();

  if (error) {
    console.error("Could not load learning progress from Supabase.", error);
    return NextResponse.json({ error: "Could not load your learning progress. Check the Supabase table and try again." }, { status: 500 });
  }

  return NextResponse.json({
    progress: data?.progress ?? null,
    updatedAt: data?.updated_at ?? null,
  }, { headers: { "Cache-Control": "no-store" } });
}

export async function PUT(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Send a valid JSON progress update." }, { status: 400 });
  }

  if (!body || Array.isArray(body) || typeof body !== "object"
    || !("progress" in body) || !isLearningProgress(body.progress)) {
    return NextResponse.json({ error: "The progress update has an invalid format." }, { status: 400 });
  }

  const authenticated = await getAuthenticatedClient(request);
  if ("response" in authenticated) return authenticated.response;

  const { data, error } = await authenticated.client
    .from("learning_progress")
    .upsert(
      {
        user_id: authenticated.user.id,
        progress: body.progress,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    )
    .select("updated_at")
    .single();

  if (error) {
    console.error("Could not save learning progress to Supabase.", error);
    return NextResponse.json({ error: "Could not save your learning progress. Check the Supabase table and try again." }, { status: 500 });
  }

  return NextResponse.json({ updatedAt: data.updated_at }, { headers: { "Cache-Control": "no-store" } });
}
