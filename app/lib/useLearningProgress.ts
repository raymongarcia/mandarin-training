"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  lessonPath: "kids" | "casual" | "business" | null;
}

const EMPTY_PROGRESS: LearningProgress = {
  completedGoals: [],
  completedLessons: [],
  lesson: null,
  lessonPath: null,
};

const LOCAL_PROGRESS_ID = "local";

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isIndexArray(value: unknown, maximum: number): value is number[] {
  return Array.isArray(value) && value.every(
    (item) => Number.isInteger(item) && item >= 0 && item < maximum,
  );
}

function parseProgress(value: unknown): LearningProgress | null {
  if (!value || Array.isArray(value) || typeof value !== "object") return null;

  const record = value as Record<string, unknown>;
  if (!isIndexArray(record.completedGoals, 3) || !isStringArray(record.completedLessons)) return null;

  if (record.lesson === null) {
    return {
      completedGoals: [...new Set(record.completedGoals)],
      completedLessons: [...new Set(record.completedLessons)],
      lesson: null,
      lessonPath: null,
    };
  }

  if (!record.lesson || Array.isArray(record.lesson) || typeof record.lesson !== "object") return null;
  const lessonPath = record.lessonPath === undefined ? "business" : record.lessonPath;
  if (lessonPath !== "kids" && lessonPath !== "casual" && lessonPath !== "business") return null;
  const lesson = record.lesson as Record<string, unknown>;
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
    lessonPath,
    lesson: {
      sectionIndex: lesson.sectionIndex as number,
      playedAudio: [...new Set(lesson.playedAudio)],
      answers: lesson.answers as (number | null)[],
      practiceChecks: [...new Set(lesson.practiceChecks)],
      textPracticeSections: [...new Set(lesson.textPracticeSections)],
    },
  };
}

function getProgressDraftKey(userId: string) {
  return `mandarin-training:progress:${userId}`;
}

function readProgressDraft(userId: string) {
  try {
    const stored = window.localStorage.getItem(getProgressDraftKey(userId));
    if (!stored) return null;

    const value: unknown = JSON.parse(stored);
    if (!value || typeof value !== "object" || Array.isArray(value)) return null;
    const draft = value as Record<string, unknown>;
    const progress = parseProgress(draft.progress);
    if (!progress || typeof draft.savedAt !== "number" || !Number.isFinite(draft.savedAt)) return null;
    return { progress, savedAt: draft.savedAt };
  } catch (error) {
    console.error("Could not read the local learning progress draft.", error);
    return null;
  }
}

function writeProgressDraft(userId: string, progress: LearningProgress) {
  try {
    window.localStorage.setItem(getProgressDraftKey(userId), JSON.stringify({
      savedAt: Date.now(),
      progress: serializeProgress(progress),
    }));
    return true;
  } catch (error) {
    console.error("Could not save the local learning progress draft.", error);
    return false;
  }
}

function clearProgressDraft(userId: string, expectedProgress?: string) {
  try {
    const key = getProgressDraftKey(userId);
    if (expectedProgress) {
      const draft = readProgressDraft(userId);
      if (!draft || JSON.stringify(serializeProgress(draft.progress)) !== expectedProgress) return;
    }
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error("Could not clear the local learning progress draft.", error);
  }
}

function serializeProgress(progress: LearningProgress): Json {
  return {
    completedGoals: progress.completedGoals,
    completedLessons: progress.completedLessons,
    lessonPath: progress.lesson ? progress.lessonPath : null,
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

function getApiError(value: unknown, fallback: string) {
  if (value && typeof value === "object" && "error" in value && typeof value.error === "string") {
    return value.error;
  }
  return fallback;
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
  const progressRef = useRef(progress);
  const currentUserIdRef = useRef<string | null>(null);
  const lastSavedProgressRef = useRef<string | null>(null);
  const saveQueueRef = useRef<Promise<void>>(Promise.resolve());

  progressRef.current = progress;
  currentUserIdRef.current = user?.id ?? null;

  const enqueueProgressSave = useCallback((snapshot: LearningProgress, userId: string) => {
    const saveRequest = saveQueueRef.current.catch(() => undefined).then(async () => {
      if (!client) throw new Error("Progress sync is not configured.");
      const { data, error } = await client.auth.getSession();
      if (error) throw error;
      if (!data.session || data.session.user.id !== userId) {
        throw new Error("Your session expired. Sign in again to sync your progress.");
      }

      const response = await fetch("/api/progress", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${data.session.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ progress: serializeProgress(snapshot) }),
      });
      const result: unknown = await response.json();
      if (!response.ok) {
        throw new Error(getApiError(result, "Could not save your learning progress."));
      }
      if (!result || typeof result !== "object" || !("updatedAt" in result) || typeof result.updatedAt !== "string") {
        throw new Error("The progress API returned an unexpected save response.");
      }
    });
    saveQueueRef.current = saveRequest.then(() => undefined, () => undefined);
    return saveRequest;
  }, [client]);

  useEffect(() => {
    if (!client) {
      setSyncStatus("unconfigured");
      const draft = readProgressDraft(LOCAL_PROGRESS_ID);
      progressRef.current = draft?.progress ?? EMPTY_PROGRESS;
      setProgress(draft?.progress ?? EMPTY_PROGRESS);
      setProgressReady(true);
      return;
    }

    let active = true;
    let loadRequest = 0;

    const loadProgress = async (userId: string) => {
      const request = ++loadRequest;
      setProgressReady(false);
      setSyncStatus("loading");
      setSyncError("");
      const restoreLocalDraft = () => {
        const drafts = [readProgressDraft(userId), readProgressDraft(LOCAL_PROGRESS_ID)]
          .filter((candidate): candidate is NonNullable<typeof candidate> => candidate !== null)
          .sort((left, right) => right.savedAt - left.savedAt);
        const draft = drafts[0];
        if (draft) {
          progressRef.current = draft.progress;
          setProgress(draft.progress);
          setProgressReady(true);
        }
      };
      const { data: sessionData, error: sessionError } = await client.auth.getSession();

      if (!active || request !== loadRequest) return;
      if (sessionError || !sessionData.session || sessionData.session.user.id !== userId) {
        if (sessionError) console.error("Could not verify the session for learning progress.", sessionError);
        const message = sessionError
          ? "We couldn’t verify your sign-in. Refresh the page and try again."
          : "Your session has expired. Sign in again to load your progress.";
        setSyncError(message);
        restoreLocalDraft();
        setSyncStatus("error");
        return;
      }

      let response: Response;
      let result: unknown;
      try {
        response = await fetch("/api/progress", {
          headers: { Authorization: `Bearer ${sessionData.session.access_token}` },
          cache: "no-store",
        });
        result = await response.json();
      } catch (error) {
        if (!active || request !== loadRequest) return;
        console.error("Could not reach the learning progress API.", error);
        setSyncError("We couldn’t reach the progress service. Check your connection and try again.");
        restoreLocalDraft();
        setSyncStatus("error");
        return;
      }

      if (!active || request !== loadRequest) return;
      if (!response.ok) {
        const message = getApiError(result, "Could not load your learning progress.");
        console.error("The learning progress API returned an error.", message);
        setSyncError(message);
        restoreLocalDraft();
        setSyncStatus("error");
        return;
      }
      if (!result || typeof result !== "object" || !("progress" in result) || !("updatedAt" in result)
        || (result.updatedAt !== null && typeof result.updatedAt !== "string")) {
        console.error("The learning progress API returned an unexpected response.", result);
        setSyncError("The progress service returned unexpected data.");
        restoreLocalDraft();
        setSyncStatus("error");
        return;
      }

      const responseProgress = result.progress;
      const updatedAt = result.updatedAt;
      if (responseProgress !== null) {
        const savedProgress = parseProgress(responseProgress);
        if (!savedProgress) {
          console.error("The saved learning progress has an unexpected format.", responseProgress);
          setSyncError("Your saved progress has an unexpected format, so it was not overwritten.");
          restoreLocalDraft();
          setSyncStatus("error");
          return;
        }
        const draft = readProgressDraft(userId);
        const localDraft = readProgressDraft(LOCAL_PROGRESS_ID);
        const savedAt = typeof updatedAt === "string" ? Date.parse(updatedAt) : Number.NaN;
        const pendingDraft = [draft, localDraft]
          .filter((candidate): candidate is NonNullable<typeof candidate> => candidate !== null)
          .sort((left, right) => right.savedAt - left.savedAt)[0];
        if (pendingDraft && (!Number.isFinite(savedAt) || pendingDraft.savedAt > savedAt)) {
          progressRef.current = pendingDraft.progress;
          setProgress(pendingDraft.progress);
          lastSavedProgressRef.current = JSON.stringify(serializeProgress(savedProgress));
          setProgressReady(true);
          setSyncStatus("ready");
          return;
        }
        clearProgressDraft(userId);
        clearProgressDraft(LOCAL_PROGRESS_ID);
        lastSavedProgressRef.current = JSON.stringify(serializeProgress(savedProgress));
        progressRef.current = savedProgress;
        setProgress(savedProgress);
      } else {
        if (updatedAt !== null) {
          console.error("The learning progress API returned a timestamp without saved progress.", result);
          setSyncError("The progress service returned unexpected data.");
          restoreLocalDraft();
          setSyncStatus("error");
          return;
        }
        const drafts = [readProgressDraft(userId), readProgressDraft(LOCAL_PROGRESS_ID)]
          .filter((candidate): candidate is NonNullable<typeof candidate> => candidate !== null)
          .sort((left, right) => right.savedAt - left.savedAt);
        if (drafts[0]) {
          progressRef.current = drafts[0].progress;
          setProgress(drafts[0].progress);
          lastSavedProgressRef.current = null;
          setProgressReady(true);
          setSyncStatus("ready");
          return;
        }
        lastSavedProgressRef.current = null;
        progressRef.current = EMPTY_PROGRESS;
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
        const draft = readProgressDraft(LOCAL_PROGRESS_ID);
        setProgressReady(true);
        progressRef.current = draft?.progress ?? EMPTY_PROGRESS;
        lastSavedProgressRef.current = null;
        setProgress(draft?.progress ?? EMPTY_PROGRESS);
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
        const draft = readProgressDraft(LOCAL_PROGRESS_ID);
        setProgressReady(true);
        progressRef.current = draft?.progress ?? EMPTY_PROGRESS;
        lastSavedProgressRef.current = null;
        setProgress(draft?.progress ?? EMPTY_PROGRESS);
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

    const serialized = JSON.stringify(serializeProgress(progress));
    if (lastSavedProgressRef.current === serialized) return;
    setSyncStatus("saving");
    const timeout = window.setTimeout(() => {
      if (lastSavedProgressRef.current === serialized) return;
      void enqueueProgressSave(progress, user.id).then(() => {
        lastSavedProgressRef.current = serialized;
        clearProgressDraft(user.id, serialized);
        if (currentUserIdRef.current === user.id && JSON.stringify(serializeProgress(progressRef.current)) === serialized) {
          setSyncError("");
          setSyncStatus("saved");
        }
      }).catch((error: unknown) => {
        console.error("Could not save learning progress.", error);
        if (currentUserIdRef.current === user.id && JSON.stringify(serializeProgress(progressRef.current)) === serialized) {
          setSyncError("We couldn’t save your latest progress. Check the connection and try again.");
          setSyncStatus("error");
        }
      });
    }, 500);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [client, enqueueProgressSave, progress, progressReady, user]);

  useEffect(() => {
    if (!progressReady) return;
    const serialized = JSON.stringify(serializeProgress(progress));
    const draftId = user?.id ?? LOCAL_PROGRESS_ID;
    if (user && lastSavedProgressRef.current === serialized) {
      clearProgressDraft(user.id);
      clearProgressDraft(LOCAL_PROGRESS_ID);
      return;
    }
    writeProgressDraft(draftId, progress);
  }, [progress, progressReady, user]);

  const updateProgress = useCallback((update: (current: LearningProgress) => LearningProgress) => {
    setProgress((current) => {
      const next = update(current);
      if (JSON.stringify(current) === JSON.stringify(next)) return current;
      progressRef.current = next;
      return next;
    });
  }, []);

  const saveProgressImmediately = useCallback(async (next: LearningProgress) => {
    progressRef.current = next;
    setProgress(next);
    if (!writeProgressDraft(user?.id ?? LOCAL_PROGRESS_ID, next)) {
      const error = "Could not save your lesson on this device. Check your browser storage and try again.";
      setSyncError(error);
      return { saved: false, message: error };
    }
    if (!client || !user || !progressReady) {
      const message = !client
        ? "Lesson completed and saved on this device. Connect Supabase to sync it across devices."
        : !user
          ? "Lesson completed and saved on this device. Sign in to sync it across devices."
          : "Lesson completed and saved on this device. Cloud sync will resume when your progress finishes loading.";
      if (user && !progressReady) setSyncError(message);
      return { saved: true, cloudSaved: false, message };
    }

    setSyncError("");
    setSyncStatus("saving");
    const serialized = JSON.stringify(serializeProgress(next));
    try {
      await enqueueProgressSave(next, user.id);
      lastSavedProgressRef.current = serialized;
      clearProgressDraft(user.id, serialized);
      clearProgressDraft(LOCAL_PROGRESS_ID, serialized);
      if (currentUserIdRef.current === user.id && JSON.stringify(serializeProgress(progressRef.current)) === serialized) {
        setSyncStatus("saved");
      }
      return { saved: true, cloudSaved: true };
    } catch (error) {
      console.error("Could not save completed lesson progress.", error);
      const message = "We couldn’t save your lesson. Check your connection and try again.";
      if (currentUserIdRef.current === user.id && JSON.stringify(serializeProgress(progressRef.current)) === serialized) {
        setSyncError(message);
        setSyncStatus("error");
      }
      return {
        saved: true,
        cloudSaved: false,
        message: "Lesson completed and saved on this device. Cloud sync failed; check your connection and account settings.",
      };
    }
  }, [client, enqueueProgressSave, progressReady, user]);

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
    saveProgressImmediately,
    syncStatus,
    syncError,
    signInWithEmail,
    signOut,
  };
}
