"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import LessonPlayer from "./components/LessonPlayer";
import CourseLessonPlayer from "./components/CourseLessonPlayer";
import WordOfTheDay from "./components/WordOfTheDay";
import AccountDialog from "./components/AccountDialog";
import {
  courseCatalogs,
  getCourseLessonCount,
  isLearnerPath,
  learnerPathById,
  learnerPathOptions,
  type LearnerPath,
} from "./lib/learnerPaths";
import { useLearningProgress } from "./lib/useLearningProgress";

const FIRST_LESSON_ID = "unit-01-lesson-01";
const LEARNER_PATH_STORAGE_KEY = "mandarin-training:learner-path";

type IconName =
  | "grid"
  | "book"
  | "chat"
  | "chart"
  | "bookmark"
  | "settings"
  | "search"
  | "bell"
  | "clock"
  | "arrow"
  | "play"
  | "check"
  | "chevron"
  | "close";

function Icon({
  name,
  size = 20,
}: {
  name: IconName;
  size?: number;
}) {
  const paths: Record<IconName, React.ReactNode> = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /></>,
    book: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 1 4 17.5z" /><path d="M4 16h16M8 7h8" /></>,
    chat: <><path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8z" /><path d="M8 12h.01M12 12h.01M16 12h.01" /></>,
    chart: <><path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-5 5" /></>,
    bookmark: <><path d="M6 4.5A1.5 1.5 0 0 1 7.5 3h9A1.5 1.5 0 0 1 18 4.5V21l-6-4-6 4z" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.7a8 8 0 0 1-1.7 1l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.7-1l-1.7.7-1.4-2.4L5.3 15a8 8 0 0 1 0-2l-1.4-1.1 1.4-2.4 1.7.7a8 8 0 0 1 1.7-1L9 7.4h2.8l.3 1.8a8 8 0 0 1 1.7 1l1.7-.7 1.4 2.4-1.4 1.1a8 8 0 0 1-.1 2z" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    arrow: <><path d="M7 17 17 7M7 7h10v10" /></>,
    play: <><path d="m9 6 10 6-10 6z" /></>,
    check: <><path d="m5 12 4 4L19 6" /></>,
    chevron: <path d="m9 18 6-6-6-6" />,
    close: <><path d="m18 6-12 12M6 6l12 12" /></>,
  };

  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}

type DashboardSummary = {
  displayName: string;
  weeklyStudySeconds: number;
  currentStreakDays: number;
  phrasesPracticed: number;
  completedLessons: number;
  completedGoals: number;
  weekDays: { date: string; label: string; day: number; studySeconds: number; today: boolean }[];
};

function isDashboardDay(value: unknown): value is DashboardSummary["weekDays"][number] {
  if (!value || typeof value !== "object") return false;
  const day = value as Record<string, unknown>;
  return typeof day.date === "string"
    && typeof day.label === "string"
    && typeof day.day === "number"
    && typeof day.studySeconds === "number"
    && typeof day.today === "boolean";
}

function isDashboardSummary(value: unknown): value is DashboardSummary {
  if (!value || typeof value !== "object") return false;
  const summary = value as Record<string, unknown>;
  return typeof summary.displayName === "string"
    && typeof summary.weeklyStudySeconds === "number" && Number.isFinite(summary.weeklyStudySeconds) && summary.weeklyStudySeconds >= 0
    && typeof summary.currentStreakDays === "number" && Number.isInteger(summary.currentStreakDays) && summary.currentStreakDays >= 0
    && typeof summary.phrasesPracticed === "number" && Number.isInteger(summary.phrasesPracticed) && summary.phrasesPracticed >= 0
    && typeof summary.completedLessons === "number" && Number.isInteger(summary.completedLessons) && summary.completedLessons >= 0
    && typeof summary.completedGoals === "number" && Number.isInteger(summary.completedGoals) && summary.completedGoals >= 0
    && Array.isArray(summary.weekDays)
    && summary.weekDays.length === 7
    && summary.weekDays.every(isDashboardDay);
}

function getApiError(value: unknown, fallback: string) {
  if (value && typeof value === "object" && "error" in value && typeof value.error === "string") {
    return value.error;
  }
  return fallback;
}

export default function Home() {
  const {
    client,
    user,
    progress,
    updateProgress,
    saveProgressImmediately,
    syncStatus,
    syncError,
    signInWithEmail,
    signOut,
  } = useLearningProgress();
  const [activeNav, setActiveNav] = useState("Overview");
  const [activeLesson, setActiveLesson] = useState<string | null>(null);
  const [accountDialogOpen, setAccountDialogOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [dashboard, setDashboard] = useState<DashboardSummary | null>(null);
  const [dashboardError, setDashboardError] = useState("");
  const [todayLabel, setTodayLabel] = useState("");
  const [selectedPath, setSelectedPath] = useState<LearnerPath>("casual");
  const activityQueue = useRef(Promise.resolve());
  const pathInfo = learnerPathById[selectedPath];
  const { lessons: courseLessons, units: courseUnits } = courseCatalogs[selectedPath];
  const completedGoals = progress.completedGoals;
  const completedLessonsInPath = getCourseLessonCount(courseLessons, progress.completedLessons);
  const nextLesson = courseLessons.find((lesson) => !progress.completedLessons.includes(lesson.id)) ?? null;
  const nextLessonId = nextLesson?.id ?? null;
  const activeCourseLesson = courseLessons.find((lesson) => lesson.id === activeLesson);
  const activeLessonProgress = progress.lesson
    && (progress.lessonPath ?? "business") === selectedPath
    ? progress.lesson
    : null;

  useEffect(() => {
    let savedPath: string | null = null;
    try {
      savedPath = window.localStorage.getItem(LEARNER_PATH_STORAGE_KEY);
    } catch (error) {
      console.error("Could not read the saved learner path.", error);
    }
    if (isLearnerPath(savedPath)) {
      setSelectedPath(savedPath);
      return;
    }

    const hasLegacyBusinessProgress = progress.lessonPath === "business"
      || progress.completedLessons.some((lessonId) => /^unit-\d+-lesson-\d+$/.test(lessonId));
    if (!hasLegacyBusinessProgress) return;
    setSelectedPath("business");
    try {
      window.localStorage.setItem(LEARNER_PATH_STORAGE_KEY, "business");
    } catch (error) {
      console.error("Could not save the migrated learner path.", error);
    }
  }, [progress.completedLessons, progress.lessonPath]);

  const fetchDashboard = useCallback(async () => {
    if (!client || !user) return;
    const { data, error } = await client.auth.getSession();
    if (error) {
      console.error("Could not read the session for dashboard sync.", error);
      setDashboardError("Could not verify your account. Sign in again to load your dashboard.");
      return;
    }
    if (!data.session) return;

    try {
      const response = await fetch("/api/dashboard", {
        headers: { Authorization: `Bearer ${data.session.access_token}` },
        cache: "no-store",
      });
      const result: unknown = await response.json();
      if (!response.ok) {
        setDashboardError(getApiError(result, "Could not load your dashboard."));
        return;
      }
      if (!isDashboardSummary(result)) {
        console.error("The dashboard API returned an unexpected response.", result);
        setDashboardError("The dashboard service returned unexpected data.");
        return;
      }
      setDashboard(result);
      setDashboardError("");
    } catch (error) {
      console.error("Could not reach the dashboard API.", error);
      setDashboardError("Could not reach the dashboard service. Check your connection and try again.");
    }
  }, [client, user]);

  useEffect(() => {
    setTodayLabel(new Intl.DateTimeFormat("en", { weekday: "long", month: "long", day: "numeric" }).format(new Date()));
  }, []);

  useEffect(() => {
    if (!client || !user) {
      setDashboard(null);
      setDashboardError("");
      return;
    }
    if (syncStatus !== "ready" && syncStatus !== "saved") return;
    void fetchDashboard();
  }, [client, fetchDashboard, syncStatus, user]);

  const recordStudySeconds = useCallback((seconds: number) => {
    activityQueue.current = activityQueue.current.then(async () => {
      if (!client || !user) {
        setDashboardError("Sign in to save study time to your dashboard.");
        return;
      }
      const { data, error } = await client.auth.getSession();
      if (error || !data.session) {
        console.error("Could not read the session while saving study activity.", error);
        setDashboardError("Could not verify your account. Sign in again to save study time.");
        return;
      }
      try {
        const response = await fetch("/api/dashboard", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${data.session.access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ seconds }),
        });
        const result: unknown = await response.json();
        if (!response.ok) {
          setDashboardError(getApiError(result, "Could not save your study time."));
          return;
        }
        if (!isDashboardSummary(result)) {
          console.error("The dashboard API returned an unexpected activity response.", result);
          setDashboardError("The dashboard service returned unexpected data.");
          return;
        }
        setDashboard(result);
        setDashboardError("");
      } catch (error) {
        console.error("Could not save dashboard study activity.", error);
        setDashboardError("Could not reach the dashboard service. Your study time was not synced.");
      }
    }).catch((error: unknown) => {
      console.error("The dashboard activity queue failed.", error);
      setDashboardError("Your study time could not be synced. Check your connection.");
    });
  }, [client, user]);

  const saveLessonProgress = useCallback((lesson: NonNullable<typeof progress.lesson>) => {
    updateProgress((current) => ({ ...current, lesson, lessonPath: selectedPath }));
  }, [selectedPath, updateProgress]);

  const completeLesson = useCallback(async (lessonId: string) => {
    const completedLessons = progress.completedLessons.includes(lessonId)
      ? progress.completedLessons
      : [...progress.completedLessons, lessonId];
    const result = await saveProgressImmediately({
      ...progress,
      completedGoals: [0, 1, 2],
      completedLessons,
      lesson: null,
      lessonPath: null,
    });
    if (!result.saved) return result;

    const unlockedLesson = courseLessons.find((lesson) => !completedLessons.includes(lesson.id));
    setActiveLesson(null);
    window.speechSynthesis?.cancel();
    setNotice(result.cloudSaved
      ? `Lesson complete and saved to Supabase.${unlockedLesson ? ` Next lesson unlocked: ${unlockedLesson.title}.` : " You completed the whole course!"}`
      : `Lesson complete and saved on this device.${unlockedLesson ? ` Next lesson unlocked: ${unlockedLesson.title}.` : " You completed the whole course!"}`);
    return result;
  }, [courseLessons, progress, saveProgressImmediately]);

  const selectLearnerPath = (path: LearnerPath) => {
    if (path === selectedPath) return;
    setSelectedPath(path);
    setActiveLesson(null);
    try {
      window.localStorage.setItem(LEARNER_PATH_STORAGE_KEY, path);
    } catch (error) {
      console.error("Could not save the selected learner path.", error);
      setNotice("This learning path is selected for now, but your browser could not save the choice.");
      return;
    }
    if (progress.lesson) {
      updateProgress((current) => ({ ...current, lesson: null, lessonPath: null }));
      setNotice(`Switched to ${learnerPathById[path].title}. Your completed lessons are kept; the unfinished lesson was cleared.`);
      return;
    }
    setNotice(`${learnerPathById[path].title} selected. Your progress for other paths is kept.`);
  };

  const toggleGoal = (index: number) => {
    updateProgress((current) => ({
      ...current,
      completedGoals: current.completedGoals.includes(index)
        ? current.completedGoals.filter((goal) => goal !== index)
        : [...current.completedGoals, index],
    }));
  };

  const goToCourse = () => {
    setActiveNav("My course");
    document.getElementById("curriculum-list")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const navigation: { name: string; icon: IconName }[] = [
    { name: "Overview", icon: "grid" },
    { name: "My course", icon: "book" },
    { name: "Practice", icon: "chat" },
    { name: "My progress", icon: "chart" },
    { name: "Saved phrases", icon: "bookmark" },
  ];

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#" aria-label="Little Mandarin home">
          <span className="brand-mark">文</span>
          <span className="brand-copy">little<span>mandarin</span></span>
        </a>

        <div className="course-switcher">
          <div className="course-icon">{pathInfo.icon}</div>
          <div className="course-copy"><span>LEARNING PATH</span><strong>{pathInfo.courseTitle}</strong></div>
          <Icon name="chevron" size={16} />
        </div>

        <span className="nav-label">YOUR SPACE</span>
        <nav className="primary-nav" aria-label="Main navigation">
          {navigation.map((item) => (
            <button
              className={`nav-item ${activeNav === item.name ? "selected" : ""}`}
              key={item.name}
              onClick={() => {
                if (item.name === "My course") {
                  goToCourse();
                  return;
                }
                setActiveNav(item.name);
                if (item.name === "Practice") {
                  if (nextLessonId) setActiveLesson(nextLessonId);
                  else setNotice("You’ve completed all currently available lessons.");
                } else if (item.name === "My progress") {
                  document.getElementById("progress")?.scrollIntoView({ behavior: "smooth" });
                } else if (item.name === "Saved phrases") {
                  setNotice("Your saved phrases will show up here as you learn.");
                }
              }}
            >
              <Icon name={item.icon} size={19} />
              <span>{item.name}</span>
              {item.name === "Saved phrases" && <span className="nav-count">0</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-spacer" />
        <div className="sidebar-tip">
          <span className="tip-spark">✳</span>
          <p>Little by little,<br />a little becomes a lot.</p>
          <span className="tip-credit">— Chinese proverb</span>
        </div>
        <button className="nav-item settings-link" onClick={() => setNotice("Settings are coming soon.")}>
          <Icon name="settings" size={19} /><span>Settings</span>
        </button>
        <button className="profile" onClick={() => setAccountDialogOpen(true)}>
          <span className="avatar">{(dashboard?.displayName ?? user?.email?.slice(0, 1) ?? "L").slice(0, 1).toUpperCase()}</span>
          <span className="profile-copy"><strong>{dashboard?.displayName ?? user?.email ?? "Learner"}</strong><small>{user ? syncStatus === "saved" ? "Progress synced" : syncStatus === "saving" ? "Saving progress…" : "Learner account" : "Sign in to sync progress"}</small></span>
          <Icon name="chevron" size={16} />
        </button>
      </aside>

      <section className="main-area">
        <header className="topbar">
          <div className="breadcrumb"><span>My learning</span><Icon name="chevron" size={14} /><strong>{activeNav}</strong></div>
          <div className="topbar-actions">
            <span className="standard-tag"><span className="status-dot" /> Standard Mandarin <span className="tag-divider">·</span> 简体中文</span>
            <button className="icon-button" aria-label="Search" onClick={() => setNotice("Search your course lessons and phrases.")}><Icon name="search" /></button>
            <button className="icon-button notification-button" aria-label="Notifications" onClick={() => setNotice("You're all caught up.")}><Icon name="bell" /><span /></button>
            <button
              className={`sync-button sync-${syncStatus}`}
              onClick={() => setAccountDialogOpen(true)}
              aria-label={user ? `Account progress sync: ${syncStatus}` : client ? "Sign in to sync progress" : "Progress saved on this device; Supabase sync is not configured"}
              title={syncError || undefined}
            >
              <span className="sync-indicator" />
              <span>{user ? syncStatus === "saved" ? "Progress saved" : syncStatus === "saving" || syncStatus === "loading" ? "Syncing…" : syncStatus === "error" ? "Sync issue" : "Account synced" : client ? "Sign in to sync" : "Saved on this device"}</span>
            </button>
          </div>
        </header>

        <div className="page-content">
          <section className="welcome-row">
            <div>
              <div className="eyebrow"><span className="eyebrow-line" /> {todayLabel || "YOUR LEARNING DASHBOARD"}</div>
              <h1>A little Mandarin,<br /><span>goes a long way.</span></h1>
              <p className="welcome-copy">{pathInfo.welcomeCopy}</p>
            </div>
            <div className="welcome-illustration" aria-label="Illustration of a teacup and Chinese greeting">
              <span className="illustration-sun" />
              <span className="illustration-character">你好</span>
              <span className="illustration-pinyin">nǐ hǎo</span>
              <span className="illustration-teacup"><span /></span>
              <span className="illustration-leaf leaf-one" />
              <span className="illustration-leaf leaf-two" />
              <span className="illustration-squiggle">〰</span>
            </div>
          </section>

          <section className="learner-paths" aria-labelledby="learner-path-heading">
            <div className="learner-path-heading">
              <div><span className="eyebrow">MAKE IT YOURS</span><h2 id="learner-path-heading">What kind of learner are you?</h2></div>
              <span>Change your path anytime</span>
            </div>
            <div className="learner-path-options" role="group" aria-label="Choose your Mandarin learning path">
              {learnerPathOptions.map((option) => (
                <button
                  aria-pressed={selectedPath === option.id}
                  className={`learner-path-option ${selectedPath === option.id ? "learner-path-selected" : ""}`}
                  key={option.id}
                  onClick={() => selectLearnerPath(option.id)}
                >
                  <span className="learner-path-icon" aria-hidden="true">{option.icon}</span>
                  <span className="learner-path-copy"><strong>{option.title}</strong><small>{option.description}</small></span>
                  <span className="learner-path-radio" aria-hidden="true">{selectedPath === option.id ? "✓" : ""}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="stats-row" id="progress" aria-label="Your learning at a glance">
            <article className="stat-card">
              <span className="stat-icon stat-time"><Icon name="clock" size={18} /></span>
              <div><span className="stat-label">THIS WEEK</span><strong>{dashboard ? (dashboard.weeklyStudySeconds / 3600).toFixed(1) : "—"} <small>/ {pathInfo.weeklyTarget}</small></strong></div>
              <span className="stat-note">{dashboard ? dashboard.weeklyStudySeconds ? "Time well spent" : "Ready when you are" : "Sign in to track time"}</span>
            </article>
            <article className="stat-card">
              <span className="stat-icon stat-fire">✳</span>
              <div><span className="stat-label">DAY STREAK</span><strong>{dashboard ? dashboard.currentStreakDays : "—"} <small>days</small></strong></div>
              <span className="stat-note">{dashboard ? dashboard.currentStreakDays ? "Keep it going" : "Study today to start" : "Sign in to track activity"}</span>
            </article>
            <article className="stat-card">
              <span className="stat-icon stat-learn"><Icon name="book" size={18} /></span>
              <div><span className="stat-label">PHRASES PRACTICED</span><strong>{dashboard?.phrasesPracticed ?? "—"}</strong></div>
              <span className="stat-note">One phrase at a time</span>
            </article>
            <article className="stat-card">
              <span className="stat-icon stat-course"><span>{pathInfo.icon}</span></span>
              <div><span className="stat-label">LESSONS COMPLETED</span><strong>{completedLessonsInPath} <small>of {courseLessons.length}</small></strong></div>
              <span className="stat-note">At your own pace</span>
            </article>
          </section>

          <section className="dashboard-grid">
            <div className="primary-column">
              <article className="today-card">
                <div className="today-topline"><span className="today-label"><span className="today-dot" /> YOUR STUDY PLAN</span><span className="duration-pill">{nextLesson ? `${nextLesson.id === FIRST_LESSON_ID ? "60 min" : pathInfo.duration} guided lesson` : "Guided lessons"}</span></div>
                <div className="today-main">
                  <div className="lesson-art">
                    <span className="art-sun" />
                    <span className="art-character">你好</span>
                    <span className="art-pinyin">nǐ hǎo</span>
                    <span className="art-floor" />
                    <span className="art-plant"><i /><i /><i /></span>
                  </div>
                  <div className="today-details">
                    <span className="unit-kicker">{nextLesson
                      ? <>UNIT {String(nextLesson.unit).padStart(2, "0")} <span>·</span> LESSON {nextLesson.number}</>
                      : "COURSE COMPLETE"}</span>
                    <h2>{nextLesson?.title ?? "All lessons complete"}</h2>
                    <p>{nextLesson?.focus ?? `Wonderful! You’ve completed all ${courseLessons.length} lessons in this path.`}</p>
                    <button className="primary-button" disabled={!nextLessonId} onClick={() => {
                      if (syncStatus === "loading") {
                        setNotice("Checking your saved progress. Please try again in a moment.");
                        return;
                      }
                      setActiveLesson(nextLessonId);
                    }}>{nextLesson ? completedLessonsInPath === 0 ? "Start learning" : "Start next lesson" : "Course complete"} <Icon name="arrow" size={17} /></button>
                  </div>
                  {nextLesson && <div className="lesson-meta"><span><Icon name="clock" size={15} /> {nextLesson.id === FIRST_LESSON_ID ? "60 min" : pathInfo.duration}</span><span><Icon name="chart" size={15} /> Beginner</span></div>}
                </div>
                <div className="lesson-footer"><span>{nextLesson ? "UP NEXT" : "COMPLETE"}</span><span>{nextLesson?.title ?? `${courseLessons.length} of ${courseLessons.length} lessons complete`} <Icon name="chevron" size={14} /></span></div>
              </article>

              <section className="curriculum-section" id="curriculum">
                <div className="section-heading">
                  <div><span className="eyebrow">YOUR LEARNING PATH</span><h2>{pathInfo.courseHeading}</h2></div>
                  <button className="text-button" onClick={goToCourse}>View course <Icon name="arrow" size={15} /></button>
                </div>
                <div className="curriculum-list" id="curriculum-list">
                  {courseUnits.map((unit) => {
                    const unitNumber = Number(unit.number);
                    const completedInUnit = courseLessons.filter((lesson) => lesson.unit === unitNumber && progress.completedLessons.includes(lesson.id)).length;
                    const isNextUnit = nextLesson?.unit === unitNumber;
                    return (
                      <button
                        className={`unit-row ${isNextUnit ? "current-unit" : ""}`}
                        key={unit.number}
                        onClick={() => isNextUnit && nextLessonId
                          ? setActiveLesson(nextLessonId)
                          : setNotice(completedInUnit === unit.lessons
                            ? `${unit.title} is complete.`
                            : nextLesson ? `Complete “${nextLesson.title}” to unlock the next unit.` : "You’ve completed the course.")}
                      >
                        <span className={`unit-number ${unit.color}`}>{unit.number}</span>
                        <span className="unit-info"><strong>{unit.title}</strong><small>{unit.detail}</small></span>
                        <span className="unit-progress"><span className="progress-track"><span style={{ width: `${(completedInUnit / unit.lessons) * 100}%` }} /></span><small>{completedInUnit} of {unit.lessons}</small></span>
                        <span className="unit-arrow"><Icon name="chevron" size={18} /></span>
                      </button>
                    );
                  })}
                </div>
                <p className="course-note">{pathInfo.courseNote}</p>
              </section>
            </div>

            <aside className="right-column">
              <section className="week-card">
                <div className="card-heading"><div><span className="eyebrow">YOUR RHYTHM</span><h3>This week</h3></div><button className="more-button" aria-label="More weekly options" onClick={() => setNotice(`Your suggested weekly study target is ${pathInfo.weeklyTarget}. Go at a pace that feels right for you.`)}>···</button></div>
                <div className="week-summary"><strong>{dashboard ? (dashboard.weeklyStudySeconds / 3600).toFixed(1) : "—"} <span>hours</span></strong><span>of your {pathInfo.weeklyTarget} goal</span></div>
                <div className="week-progress"><span style={{ width: `${dashboard ? Math.min((dashboard.weeklyStudySeconds / pathInfo.weeklyGoalSeconds) * 100, 100) : 0}%` }} /></div>
                {dashboard ? (
                  <div className="week-days">{dashboard.weekDays.map((day) => <div className={`day-column ${day.today ? "is-today" : ""}`} key={day.date} title={`${day.studySeconds ? Math.round(day.studySeconds / 60) : 0} minutes studied`}><span className="day-label">{day.label}</span><span className={`day-date ${day.studySeconds > 0 ? "is-done" : ""}`}>{day.studySeconds > 0 ? <Icon name="check" size={14} /> : day.day}</span></div>)}</div>
                ) : <p className="week-empty">{dashboardError || (user ? "Loading your study activity…" : "Sign in to track your study activity.")}</p>}
                <div className="week-footnote"><span className="footnote-spark">✳</span><p><strong>Progress, not perfection.</strong><br />A little practice at your own pace goes a long way.</p></div>
                {dashboardError && dashboard && <p className="dashboard-error" role="alert">{dashboardError}</p>}
              </section>

              <section className="goals-card">
                <div className="card-heading"><div><span className="eyebrow">SMALL STEPS, BIG PROGRESS</span><h3>Today&apos;s goals</h3></div><span className="goal-count">{dashboard ? dashboard.completedGoals : completedGoals.length}/3</span></div>
                <div className="goal-list">{pathInfo.goals.map((goal, index) => <button className={`goal-item ${completedGoals.includes(index) ? "goal-complete" : ""}`} key={goal.title} onClick={() => toggleGoal(index)}><span className="goal-check"><Icon name="check" size={13} /></span><span className="goal-copy"><strong>{goal.title}</strong><small>{goal.time}</small></span><Icon name="chevron" size={16} /></button>)}</div>
                <div className="goal-footer"><span className="goal-avatar">你</span><span>You&apos;re building a great habit.</span><span className="goal-spark">✳</span></div>
              </section>

              <WordOfTheDay audience={selectedPath} />
            </aside>
          </section>

          <footer className="page-footer"><span>LEARN A LITTLE. USE IT A LOT.</span><span>Made for real conversations, one lesson at a time <span className="footer-flower">✳</span></span></footer>
        </div>
      </section>

      {activeLesson === FIRST_LESSON_ID && <LessonPlayer
        initialProgress={activeLessonProgress}
        onProgressChange={saveLessonProgress}
        onStudySeconds={recordStudySeconds}
        onClose={() => {
          setActiveLesson(null);
          window.speechSynthesis?.cancel();
        }}
        onComplete={() => completeLesson(FIRST_LESSON_ID)}
      />}
      {activeCourseLesson && activeCourseLesson.id !== FIRST_LESSON_ID && <CourseLessonPlayer
        lesson={activeCourseLesson}
        initialProgress={activeLessonProgress}
        onProgressChange={saveLessonProgress}
        onStudySeconds={recordStudySeconds}
        onClose={() => setActiveLesson(null)}
        onComplete={() => completeLesson(activeCourseLesson.id)}
      />}

      {accountDialogOpen && <AccountDialog
        client={client}
        user={user}
        syncStatus={syncStatus}
        syncError={syncError}
        onClose={() => setAccountDialogOpen(false)}
        onSignIn={signInWithEmail}
        onSignOut={signOut}
      />}

      {notice && !activeLesson && <div className="toast" role="status"><span>{notice}</span><button aria-label="Dismiss message" onClick={() => setNotice("")}><Icon name="close" size={16} /></button></div>}
    </main>
  );
}
