"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient, type User } from "@supabase/supabase-js";
import type { Database, Json } from "./database.types";

export interface LessonProgress {
  sectionIndex: number;
  playedAudio: string[];
  answers: (number | null)[];
  practiceChecks: number[];
  textPracticeSections: number[];
}

export interface LearningProgress {
  completedGoals: number[];
  completedLessons: string[];
  lesson: LessonProgress | null;
}

const EMPTY_PROGRESS: LearningProgress = {
  completedGoals: [],
  completedLessons: [],
  lesson: null,
};

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isIndexArray(value: unknown, maximum: number): value is number[] {
  return Array.isArray(value) && value.every(
    (item) => Number.isInteger(item) && item >= 0 && item < maximum,
  );
}

function parseProgress(value: Json): LearningProgress | null {
  if (!value || Array.isArray(value) || typeof value !== "object") return null;

  const record = value as Record<string, Json | undefined>;
  if (!isIndexArray(record.completedGoals, 3) || !isStringArray(record.completedLessons)) return null;

  if (record.lesson === null) {
    return {
      completedGoals: [...new Set(record.completedGoals)],
      completedLessons: [...new Set(record.completedLessons)],
      lesson: null,
    };
  }

  if (!record.lesson || Array.isArray(record.lesson) || typeof record.lesson !== "object") return null;
  const lesson = record.lesson as Record<string, Json | undefined>;
  const validAnswers = Array.isArray(lesson.answers)
    && lesson.answers.length <= 3
    && lesson.answers.every((answer) => answer === null || (typeof answer === "number" && Number.isInteger(answer) && answer >= 0 && answer <= 2));
  if (
    typeof lesson.sectionIndex !== "number"
    || !Number.isInteger(lesson.sectionIndex)
    || (lesson.sectionIndex as number) < 0
    || (lesson.sectionIndex as number) > 4
    || !isStringArray(lesson.playedAudio)
    || lesson.playedAudio.length > 32
    || !validAnswers
    || !isIndexArray(lesson.practiceChecks, 3)
    || !isIndexArray(lesson.textPracticeSections, 3)
  ) return null;

  return {
    completedGoals: [...new Set(record.completedGoals)],
    completedLessons: [...new Set(record.completedLessons)],
    lesson: {
      sectionIndex: lesson.sectionIndex as number,
      playedAudio: [...new Set(lesson.playedAudio)],
      answers: lesson.answers as (number | null)[],
      practiceChecks: [...new Set(lesson.practiceChecks)],
      textPracticeSections: [...new Set(lesson.textPracticeSections)],
    },
  };
}

function serializeProgress(progress: LearningProgress): Json {
  return {
    completedGoals: progress.completedGoals,
    completedLessons: progress.completedLessons,
    lesson: progress.lesson
      ? {
          sectionIndex: progress.lesson.sectionIndex,
          playedAudio: progress.lesson.playedAudio,
          answers: progress.lesson.answers,
          practiceChecks: progress.lesson.practiceChecks,
          textPracticeSections: progress.lesson.textPracticeSections,
        }
      : null,
  };
}

export type ProgressSyncStatus =
  | "unconfigured"
  | "loading"
  | "signed-out"
  | "ready"
  | "saving"
  | "saved"
  | "error";

export function useLearningProgress() {
  const client = useMemo(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
      || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    return url && key ? createClient<Database>(url, key) : null;
  }, []);

  const [user, setUser] = useState<User | null>(null);
  const [progress, setProgress] = useState<LearningProgress>(EMPTY_PROGRESS);
  const [syncStatus, setSyncStatus] = useState<ProgressSyncStatus>(client ? "loading" : "unconfigured");
  const [syncError, setSyncError] = useState("");
  const [progressReady, setProgressReady] = useState(false);

  useEffect(() => {
    if (!client) {
      setSyncStatus("unconfigured");
      return;
    }

    let active = true;
    let loadRequest = 0;

    const loadProgress = async (userId: string) => {
      const request = ++loadRequest;
      setProgressReady(false);
      setSyncStatus("loading");
      setSyncError("");
      const { data, error } = await client
        .from("learning_progress")
        .select("progress")
        .eq("user_id", userId)
        .maybeSingle();

      if (!active || request !== loadRequest) return;
      if (error) {
        console.error("Could not load learning progress.", error);
        setSyncError("We couldn’t load your saved progress. Check the Supabase table and sign-in configuration.");
        setSyncStatus("error");
        return;
      }

      if (data) {
        const savedProgress = parseProgress(data.progress);
        if (!savedProgress) {
          console.error("The saved learning progress has an unexpected format.", data.progress);
          setSyncError("Your saved progress has an unexpected format, so it was not overwritten.");
          setSyncStatus("error");
          return;
        }
        setProgress(savedProgress);
      } else {
        setProgress(EMPTY_PROGRESS);
      }

      setProgressReady(true);
      setSyncStatus("ready");
    };

    const { data: { subscription } } = client.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setSyncError("");
      if (session?.user) {
        window.setTimeout(() => {
          if (active) void loadProgress(session.user.id);
        }, 0);
      } else {
        ++loadRequest;
        setProgressReady(false);
        setProgress(EMPTY_PROGRESS);
        setSyncStatus("signed-out");
      }
    });

    void client.auth.getSession().then(({ data, error }) => {
      if (!active) return;
      if (error) {
        console.error("Could not read the Supabase session.", error);
        setSyncError("We couldn’t verify your sign-in. Refresh the page and try again.");
        setSyncStatus("error");
        return;
      }
      setUser(data.session?.user ?? null);
      if (data.session?.user) {
        void loadProgress(data.session.user.id);
      } else {
        setProgressReady(false);
        setProgress(EMPTY_PROGRESS);
        setSyncStatus("signed-out");
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [client]);

  useEffect(() => {
    if (!client || !user || !progressReady) return;

    setSyncStatus("saving");
    let active = true;
    const controller = new AbortController();
    const timeout = window.setTimeout(() => {
      void client
        .from("learning_progress")
        .upsert(
          {
            user_id: user.id,
            progress: serializeProgress(progress),
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" },
        )
        .abortSignal(controller.signal)
        .then(({ error }) => {
          if (!active) return;
          if (error) {
            console.error("Could not save learning progress.", error);
            setSyncError("We couldn’t save your latest progress. Check the connection and try again.");
            setSyncStatus("error");
            return;
          }
          setSyncError("");
          setSyncStatus("saved");
        });
    }, 500);

    return () => {
      active = false;
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [client, progress, progressReady, user]);

  const updateProgress = useCallback((update: (current: LearningProgress) => LearningProgress) => {
    setProgress((current) => {
      const next = update(current);
      return JSON.stringify(current) === JSON.stringify(next) ? current : next;
    });
  }, []);

  const signInWithEmail = useCallback(async (email: string) => {
    if (!client) return { error: "Progress sync is not configured yet." };
    try {
      const { error } = await client.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: window.location.origin },
      });
      if (error) console.error("Could not send the sign-in link.", error);
      return { error: error?.message ?? null };
    } catch (error) {
      console.error("Could not reach the email sign-in service.", error);
      return { error: error instanceof Error ? error.message : "The email sign-in service could not be reached." };
    }
  }, [client]);

  const signOut = useCallback(async () => {
    if (!client) return { error: "Progress sync is not configured yet." };
    try {
      const { error } = await client.auth.signOut();
      if (error) console.error("Could not sign out.", error);
      return { error: error?.message ?? null };
    } catch (error) {
      console.error("Could not reach the sign-out service.", error);
      return { error: error instanceof Error ? error.message : "The sign-out service could not be reached." };
    }
  }, [client]);

  return {
    client,
    user,
    progress,
    updateProgress,
    syncStatus,
    syncError,
    signInWithEmail,
    signOut,
  };
}
