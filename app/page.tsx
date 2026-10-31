"use client";

import { useCallback, useState } from "react";
import LessonPlayer from "./components/LessonPlayer";
import AccountDialog from "./components/AccountDialog";
import { useLearningProgress } from "./lib/useLearningProgress";

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

const curriculum = [
  { number: "01", title: "Your first conversations", detail: "Greetings, introductions & tones", lessons: "6 lessons", color: "coral", progress: 17 },
  { number: "02", title: "Everyday work talk", detail: "Numbers, time & daily routines", lessons: "8 lessons", color: "blue", progress: 0 },
  { number: "03", title: "Meetings & collaboration", detail: "Opinions, plans & follow-ups", lessons: "8 lessons", color: "yellow", progress: 0 },
  { number: "04", title: "Clients & partnerships", detail: "Build trust and talk business", lessons: "10 lessons", color: "lavender", progress: 0 },
  { number: "05", title: "Suppliers & negotiation", detail: "Orders, pricing & delivery", lessons: "8 lessons", color: "green", progress: 0 },
  { number: "06", title: "Put it into practice", detail: "Real-world conversations & review", lessons: "6 lessons", color: "peach", progress: 0 },
];

const weekDays = [
  { label: "M", date: "26", done: false },
  { label: "T", date: "27", done: false },
  { label: "W", date: "28", done: true },
  { label: "T", date: "29", done: true },
  { label: "F", date: "30", done: false, today: true },
  { label: "S", date: "31", done: false },
  { label: "S", date: "1", done: false },
];

const lessonGoals = [
  { title: "Meet your first tones", time: "20 min", done: false },
  { title: "Say hello & introduce yourself", time: "20 min", done: false },
  { title: "Practice & review aloud", time: "20 min", done: false },
];

export default function Home() {
  const {
    client,
    user,
    progress,
    updateProgress,
    syncStatus,
    syncError,
    signInWithEmail,
    signOut,
  } = useLearningProgress();
  const [activeNav, setActiveNav] = useState("Overview");
  const [activeLesson, setActiveLesson] = useState(false);
  const [accountDialogOpen, setAccountDialogOpen] = useState(false);
  const [notice, setNotice] = useState("");

  const completedGoals = progress.completedGoals;
  const learnedPhrases = new Set(
    (progress.lesson?.playedAudio ?? []).filter((id) => id.startsWith("word-")),
  ).size;
  const phraseCount = progress.completedLessons.includes("unit-01-lesson-01")
    ? 4
    : learnedPhrases;

  const saveLessonProgress = useCallback((lesson: NonNullable<typeof progress.lesson>) => {
    updateProgress((current) => ({ ...current, lesson }));
  }, [updateProgress]);

  const toggleGoal = (index: number) => {
    updateProgress((current) => ({
      ...current,
      completedGoals: current.completedGoals.includes(index)
        ? current.completedGoals.filter((goal) => goal !== index)
        : [...current.completedGoals, index],
    }));
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
        <a className="brand" href="#" aria-label="Mandarin for Work home">
          <span className="brand-mark">文</span>
          <span className="brand-copy">little<span>mandarin</span></span>
        </a>

        <div className="course-switcher">
          <div className="course-icon">中</div>
          <div className="course-copy"><span>LEARNING</span><strong>Business Mandarin</strong></div>
          <Icon name="chevron" size={16} />
        </div>

        <span className="nav-label">YOUR SPACE</span>
        <nav className="primary-nav" aria-label="Main navigation">
          {navigation.map((item) => (
            <button
              className={`nav-item ${activeNav === item.name ? "selected" : ""}`}
              key={item.name}
              onClick={() => {
                setActiveNav(item.name);
                if (item.name === "My course") {
                  document.getElementById("curriculum")?.scrollIntoView({ behavior: "smooth" });
                } else if (item.name === "Practice") {
                  setActiveLesson(true);
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
          <span className="avatar">{user?.email?.slice(0, 1).toUpperCase() ?? "R"}</span>
          <span className="profile-copy"><strong>{user?.email ?? "Raymond Pogi"}</strong><small>{user ? syncStatus === "saved" ? "Progress synced" : syncStatus === "saving" ? "Saving progress…" : "Learner account" : "Sign in to sync progress"}</small></span>
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
              aria-label={user ? `Account progress sync: ${syncStatus}` : client ? "Sign in to save progress" : "Configure account sync"}
              title={syncError || undefined}
            >
              <span className="sync-indicator" />
              <span>{user ? syncStatus === "saved" ? "Progress saved" : syncStatus === "saving" || syncStatus === "loading" ? "Syncing…" : syncStatus === "error" ? "Sync issue" : "Account synced" : client ? "Sign in to save" : "Connect to save"}</span>
            </button>
          </div>
        </header>

        <div className="page-content">
          <section className="welcome-row">
            <div>
              <div className="eyebrow"><span className="eyebrow-line" /> FRIDAY, OCTOBER 30</div>
              <h1>A little Mandarin,<br /><span>goes a long way.</span></h1>
              <p className="welcome-copy">Build real-world confidence for the conversations that matter at work.</p>
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

          <section className="stats-row" id="progress" aria-label="Your learning at a glance">
            <article className="stat-card">
              <span className="stat-icon stat-time"><Icon name="clock" size={18} /></span>
              <div><span className="stat-label">THIS WEEK</span><strong>1.5 <small>/ 7–10 hrs</small></strong></div>
              <span className="stat-note">A lovely start</span>
            </article>
            <article className="stat-card">
              <span className="stat-icon stat-fire">✳</span>
              <div><span className="stat-label">DAY STREAK</span><strong>3 <small>days</small></strong></div>
              <span className="stat-note">Keep it going</span>
            </article>
            <article className="stat-card">
              <span className="stat-icon stat-learn"><Icon name="book" size={18} /></span>
              <div><span className="stat-label">PHRASES PRACTICED</span><strong>{phraseCount} <small>of 4</small></strong></div>
              <span className="stat-note">One phrase at a time</span>
            </article>
            <article className="stat-card">
              <span className="stat-icon stat-course"><span>中</span></span>
              <div><span className="stat-label">COURSE</span><strong>{progress.completedLessons.length} <small>of 6 units</small></strong></div>
              <span className="stat-note">Nice and steady</span>
            </article>
          </section>

          <section className="dashboard-grid">
            <div className="primary-column">
              <article className="today-card">
                <div className="today-topline"><span className="today-label"><span className="today-dot" /> YOUR FRIDAY PLAN</span><span className="duration-pill">60 min guided lesson</span></div>
                <div className="today-main">
                  <div className="lesson-art">
                    <span className="art-sun" />
                    <span className="art-character">你好</span>
                    <span className="art-pinyin">nǐ hǎo</span>
                    <span className="art-floor" />
                    <span className="art-plant"><i /><i /><i /></span>
                  </div>
                  <div className="today-details">
                    <span className="unit-kicker">UNIT 01 <span>·</span> LESSON 1</span>
                    <h2>Your first Mandarin<br />sounds</h2>
                    <p>Start with Pinyin pronunciation, then practice greeting and introducing yourself to a new client.</p>
                    <button className="primary-button" onClick={() => {
                      if (syncStatus === "loading") {
                        setNotice("Checking your saved progress. Please try again in a moment.");
                        return;
                      }
                      setActiveLesson(true);
                    }}>Start today&apos;s lesson <Icon name="arrow" size={17} /></button>
                  </div>
                  <div className="lesson-meta"><span><Icon name="clock" size={15} /> 60 min</span><span><Icon name="chart" size={15} /> Beginner</span></div>
                </div>
                <div className="lesson-footer"><span>UP NEXT</span><span>Meeting someone new <Icon name="chevron" size={14} /></span></div>
              </article>

              <section className="curriculum-section" id="curriculum">
                <div className="section-heading">
                  <div><span className="eyebrow">YOUR LEARNING PATH</span><h2>From hello to let&apos;s work together.</h2></div>
                  <button className="text-button" onClick={() => setActiveNav("My course")}>View course <Icon name="arrow" size={15} /></button>
                </div>
                <div className="curriculum-list">
                  {curriculum.map((unit) => (
                    <button
                      className={`unit-row ${unit.number === "01" ? "current-unit" : ""}`}
                      key={unit.number}
                      onClick={() => unit.number === "01" ? setActiveLesson(true) : setNotice(`${unit.title} is coming up in your learning path.`)}
                    >
                      <span className={`unit-number ${unit.color}`}>{unit.number}</span>
                      <span className="unit-info"><strong>{unit.title}</strong><small>{unit.detail}</small></span>
                      <span className="unit-progress"><span className="progress-track"><span style={{ width: `${unit.number === "01" && progress.completedLessons.includes("unit-01-lesson-01") ? 17 : 0}%` }} /></span><small>{unit.number === "01" ? progress.completedLessons.includes("unit-01-lesson-01") ? "1 of 6" : "0 of 6" : unit.lessons}</small></span>
                      <span className="unit-arrow"><Icon name="chevron" size={18} /></span>
                    </button>
                  ))}
                </div>
                <p className="course-note">A practical path from zero to everyday business communication. Progress at your own pace—fluency takes time, and every lesson counts.</p>
              </section>
            </div>

            <aside className="right-column">
              <section className="week-card">
                <div className="card-heading"><div><span className="eyebrow">YOUR RHYTHM</span><h3>This week</h3></div><button className="more-button" aria-label="More weekly options" onClick={() => setNotice("Your study target is 1–2 hours a day, aiming for 7–10 hours across the week.")}>···</button></div>
                <div className="week-summary"><strong>1.5 <span>hours</span></strong><span>of your 7–10 hour target</span></div>
                <div className="week-progress"><span /></div>
                <div className="week-days">{weekDays.map((day, index) => <div className={`day-column ${day.today ? "is-today" : ""}`} key={`${day.label}-${day.date}`}><span className="day-label">{day.label}</span><span className={`day-date ${day.done ? "is-done" : ""}`}>{day.done ? <Icon name="check" size={14} /> : day.date}</span></div>)}</div>
                <div className="week-footnote"><span className="footnote-spark">✳</span><p><strong>Progress, not perfection.</strong><br />Aim for 1–2 hours a day, at your pace.</p></div>
              </section>

              <section className="goals-card">
                <div className="card-heading"><div><span className="eyebrow">SMALL STEPS, BIG PROGRESS</span><h3>Today&apos;s goals</h3></div><span className="goal-count">{completedGoals.length}/3</span></div>
                <div className="goal-list">{lessonGoals.map((goal, index) => <button className={`goal-item ${completedGoals.includes(index) ? "goal-complete" : ""}`} key={goal.title} onClick={() => toggleGoal(index)}><span className="goal-check"><Icon name="check" size={13} /></span><span className="goal-copy"><strong>{goal.title}</strong><small>{goal.time}</small></span><Icon name="chevron" size={16} /></button>)}</div>
                <div className="goal-footer"><span className="goal-avatar">你</span><span>You&apos;re building a great habit.</span><span className="goal-spark">✳</span></div>
              </section>

              <section className="phrase-card">
                <div className="phrase-label"><span>PHRASE TO TAKE WITH YOU</span><span>01 / 12</span></div>
                <p className="phrase-hanzi">你好</p>
                <p className="phrase-pinyin">nǐ hǎo</p>
                <div className="phrase-bottom"><span>hello · a friendly greeting</span><button aria-label="Save phrase" onClick={() => setNotice("Saved 你好 to your phrases.")}><Icon name="bookmark" size={17} /></button></div>
              </section>
            </aside>
          </section>

          <footer className="page-footer"><span>LEARN A LITTLE. USE IT A LOT.</span><span>Made for real conversations, one lesson at a time <span className="footer-flower">✳</span></span></footer>
        </div>
      </section>

      {activeLesson && <LessonPlayer
        initialProgress={progress.lesson}
        onProgressChange={saveLessonProgress}
        onClose={() => {
          setActiveLesson(false);
          window.speechSynthesis?.cancel();
        }}
        onComplete={() => {
          updateProgress((current) => ({
            ...current,
            completedGoals: [0, 1, 2],
            completedLessons: current.completedLessons.includes("unit-01-lesson-01")
              ? current.completedLessons
              : [...current.completedLessons, "unit-01-lesson-01"],
            lesson: null,
          }));
          setActiveLesson(false);
          window.speechSynthesis?.cancel();
          setNotice("Excellent work. Your full 60-minute lesson is complete!");
        }}
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
