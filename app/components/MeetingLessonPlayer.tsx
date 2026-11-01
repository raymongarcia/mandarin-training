"use client";

import { useEffect, useRef, useState } from "react";
import type { LessonProgress } from "../lib/useLearningProgress";

const sections = [
  { title: "Learn the greeting", duration: "5 min" },
  { title: "Practice the conversation", duration: "5 min" },
  { title: "Check your understanding", duration: "5 min" },
];

const questions = [
  { prompt: "How do you politely say “My name is…”?", options: ["我叫…", "再见", "谢谢"], answer: 0 },
  { prompt: "What does 很高兴认识您 mean?", options: ["Where are you from?", "Pleased to meet you.", "Goodbye for now."], answer: 1 },
  { prompt: "Which greeting is polite for a new client?", options: ["您好", "吗", "好"], answer: 0 },
];

export default function MeetingLessonPlayer({
  initialProgress,
  onProgressChange,
  onStudySeconds,
  onClose,
  onComplete,
}: {
  initialProgress: LessonProgress | null;
  onProgressChange: (progress: LessonProgress) => void;
  onStudySeconds: (seconds: number) => void;
  onClose: () => void;
  onComplete: () => Promise<{ saved: boolean; cloudSaved?: boolean; message?: string }>;
}) {
  const [activeSection, setActiveSection] = useState(Math.min(initialProgress?.sectionIndex ?? 0, sections.length - 1));
  const [answers, setAnswers] = useState<(number | undefined)[]>(initialProgress?.answers.map((answer) => answer ?? undefined) ?? []);
  const [textPracticeSections, setTextPracticeSections] = useState<number[]>(initialProgress?.textPracticeSections ?? []);
  const [isCompleting, setIsCompleting] = useState(false);
  const [completionError, setCompletionError] = useState("");
  const lastStudyReport = useRef(Date.now());

  useEffect(() => {
    onProgressChange({
      sectionIndex: activeSection,
      playedAudio: [],
      answers: answers.map((answer) => answer ?? null),
      practiceChecks: [],
      textPracticeSections,
    });
  }, [activeSection, answers, onProgressChange, textPracticeSections]);

  useEffect(() => {
    const reportStudyTime = () => {
      const now = Date.now();
      if (document.visibilityState === "hidden") {
        lastStudyReport.current = now;
        return;
      }
      const seconds = Math.floor((now - lastStudyReport.current) / 1000);
      if (seconds > 0) {
        lastStudyReport.current = now;
        onStudySeconds(Math.min(seconds, 120));
      }
    };
    const timer = window.setInterval(reportStudyTime, 60_000);
    return () => {
      window.clearInterval(timer);
      reportStudyTime();
    };
  }, [onStudySeconds]);

  const readySections = [
    textPracticeSections.includes(0),
    textPracticeSections.includes(1),
    questions.every((question, index) => answers[index] === question.answer),
  ];

  const handleContinue = async () => {
    if (!readySections[activeSection]) return;
    if (activeSection < sections.length - 1) {
      setActiveSection((current) => current + 1);
      document.querySelector(".lesson-stage")?.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (isCompleting) return;
    setIsCompleting(true);
    setCompletionError("");
    try {
      const result = await onComplete();
      if (!result.saved) setCompletionError(result.message ?? "Your lesson could not be saved. Please try again.");
    } catch (error) {
      console.error("Could not complete the lesson.", error);
      setCompletionError("Your lesson could not be saved. Please try again.");
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <div className="lesson-overlay">
      <section className="lesson-player" role="dialog" aria-modal="true" aria-labelledby="lesson-title">
        <header className="player-header">
          <a className="player-brand" href="#" onClick={(event) => event.preventDefault()}>
            <span className="brand-mark">文</span>
            <span><strong>little mandarin</strong><small>YOUR GUIDED LESSON</small></span>
          </a>
          <div className="player-header-center">
            <span>UNIT 01 <i>·</i> LESSON 2</span>
            <strong>Meeting someone new</strong>
          </div>
          <button className="player-close" onClick={onClose} aria-label="Exit lesson">Exit lesson <span>×</span></button>
        </header>

        <div className="player-progress">
          <span style={{ width: `${(readySections.filter(Boolean).length / sections.length) * 100}%` }} />
        </div>

        <div className="player-body">
          <aside className="lesson-outline" aria-label="Lesson sections">
            <span className="outline-label">YOUR 15-MINUTE LESSON</span>
            <strong className="outline-title">A confident<br />introduction</strong>
            <span className="outline-total">3 guided activities · 15 minutes</span>
            <nav className="outline-nav" aria-label="Lesson activities">
              {sections.map((section, index) => (
                <button
                  className={`outline-item ${activeSection === index ? "outline-active" : ""} ${readySections[index] ? "outline-done" : ""}`}
                  key={section.title}
                  onClick={() => setActiveSection(index)}
                >
                  <span className="outline-index">{readySections[index] ? "✓" : String(index + 1).padStart(2, "0")}</span>
                  <span className="outline-info"><strong>{section.title}</strong><small>{section.duration}</small></span>
                </button>
              ))}
            </nav>
            <div className="outline-tip"><span>學</span><p><strong>Take your time.</strong><br />Read each phrase aloud at your own pace.</p></div>
          </aside>

          <div className="lesson-stage" role="region" aria-label="Lesson activity">
            <div className="lesson-stage-inner">
              <span className="stage-eyebrow">PART {String(activeSection + 1).padStart(2, "0")} OF 03 <i>·</i> {sections[activeSection].duration.toUpperCase()}</span>

              {activeSection === 0 && (
                <section aria-labelledby="lesson-title">
                  <h1 id="lesson-title">Make a warm introduction.</h1>
                  <p className="stage-intro">Use these polite phrases when meeting a new colleague or client. Read each line aloud, then mark the practice complete.</p>
                  <div className="dialogue-list">
                    <div className="dialogue-line"><span className="dialogue-number">01</span><div className="dialogue-bubble"><span className="dialogue-speaker">POLITE GREETING</span><strong>您好</strong><small>nín hǎo · Hello (polite)</small></div></div>
                    <div className="dialogue-line"><span className="dialogue-number">02</span><div className="dialogue-bubble"><span className="dialogue-speaker">INTRODUCE YOURSELF</span><strong>我叫…</strong><small>wǒ jiào… · My name is…</small></div></div>
                    <div className="dialogue-line"><span className="dialogue-number">03</span><div className="dialogue-bubble"><span className="dialogue-speaker">BE COURTEOUS</span><strong>很高兴认识您</strong><small>hěn gāo xìng rèn shi nín · Pleased to meet you</small></div></div>
                  </div>
                  <button className="text-practice-button" onClick={() => setTextPracticeSections((current) => current.includes(0) ? current : [...current, 0])}>
                    {textPracticeSections.includes(0) ? "Phrases practiced ✓" : "I practiced these phrases"} <span>→</span>
                  </button>
                </section>
              )}

              {activeSection === 1 && (
                <section aria-labelledby="lesson-title">
                  <h1 id="lesson-title">Put the phrases together.</h1>
                  <p className="stage-intro">Follow this short first-meeting exchange. Try saying your own name in place of Alex.</p>
                  <div className="dialogue-list">
                    <div className="dialogue-line"><span className="dialogue-number">01</span><div className="dialogue-bubble"><span className="dialogue-speaker">YOU</span><strong>您好！我叫 Alex。</strong><small>nín hǎo! wǒ jiào Alex. · Hello! My name is Alex.</small></div></div>
                    <div className="dialogue-line dialogue-other"><span className="dialogue-number">02</span><div className="dialogue-bubble"><span className="dialogue-speaker">NEW COLLEAGUE</span><strong>很高兴认识您。</strong><small>hěn gāo xìng rèn shi nín. · Pleased to meet you.</small></div></div>
                    <div className="dialogue-line"><span className="dialogue-number">03</span><div className="dialogue-bubble"><span className="dialogue-speaker">YOU</span><strong>我也很高兴认识您。</strong><small>wǒ yě hěn gāo xìng rèn shi nín. · I’m pleased to meet you, too.</small></div></div>
                  </div>
                  <button className="text-practice-button" onClick={() => setTextPracticeSections((current) => current.includes(1) ? current : [...current, 1])}>
                    {textPracticeSections.includes(1) ? "Conversation practiced ✓" : "I read the conversation aloud"} <span>→</span>
                  </button>
                </section>
              )}

              {activeSection === 2 && (
                <section aria-labelledby="lesson-title">
                  <h1 id="lesson-title">Check your understanding.</h1>
                  <p className="stage-intro">Choose the best answer for each question. You can change your answers before finishing.</p>
                  <div className="quiz-list">
                    {questions.map((question, questionIndex) => (
                      <article className="quiz-card" key={question.prompt}>
                        <span className="quiz-count">QUESTION {questionIndex + 1} <span>OF 3</span></span>
                        <h2>{question.prompt}</h2>
                        <div className="quiz-options">
                          {question.options.map((option, optionIndex) => (
                            <button
                              className={`quiz-option ${answers[questionIndex] === optionIndex ? "option-selected" : ""}`}
                              key={option}
                              onClick={() => setAnswers((current) => {
                                const next = [...current];
                                next[questionIndex] = optionIndex;
                                return next;
                              })}
                            >
                              <span>{String.fromCharCode(65 + optionIndex)}</span>{option}
                            </button>
                          ))}
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              )}

              {completionError && <p className="audio-notice" role="alert">{completionError}</p>}
            </div>
          </div>
        </div>

        <footer className="player-footer">
          <div className="footer-lesson-progress"><strong>{activeSection + 1}</strong><span> / 3 sections</span><small>{sections[activeSection].title}</small></div>
          {activeSection > 0 && <button className="player-back" onClick={() => setActiveSection((current) => current - 1)}>← Previous</button>}
          <button className="player-next" disabled={!readySections[activeSection] || (activeSection === sections.length - 1 && !readySections.slice(0, -1).every(Boolean)) || isCompleting} onClick={() => void handleContinue()}>
            {isCompleting ? "Saving lesson…" : activeSection === sections.length - 1 ? "Complete lesson" : "Complete section & continue"}
            <span aria-hidden="true">{activeSection === sections.length - 1 ? "✓" : "→"}</span>
          </button>
        </footer>
      </section>
    </div>
  );
}
