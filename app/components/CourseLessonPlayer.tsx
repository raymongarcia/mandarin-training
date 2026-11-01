"use client";

import { useEffect, useRef, useState } from "react";
import type { CourseLesson } from "../lib/courseLessons";
import type { LessonProgress } from "../lib/useLearningProgress";

const sectionTitles = ["Learn the phrases", "Practice aloud", "Check your understanding"];
const sectionDurations = ["5 min", "5 min", "5 min"];

export default function CourseLessonPlayer({
  lesson,
  initialProgress,
  onProgressChange,
  onStudySeconds,
  onClose,
  onComplete,
}: {
  lesson: CourseLesson;
  initialProgress: LessonProgress | null;
  onProgressChange: (progress: LessonProgress) => void;
  onStudySeconds: (seconds: number) => void;
  onClose: () => void;
  onComplete: () => Promise<{ saved: boolean; cloudSaved?: boolean; message?: string }>;
}) {
  const [activeSection, setActiveSection] = useState(Math.min(initialProgress?.sectionIndex ?? 0, 2));
  const [answers, setAnswers] = useState<(number | undefined)[]>(initialProgress?.answers.map((answer) => answer ?? undefined) ?? []);
  const [textPracticeSections, setTextPracticeSections] = useState<number[]>(initialProgress?.textPracticeSections ?? []);
  const [isCompleting, setIsCompleting] = useState(false);
  const [completionError, setCompletionError] = useState("");
  const lastStudyReport = useRef(Date.now());

  const questions = lesson.phrases.map((phrase, questionIndex) => {
    const choices = lesson.phrases.map((choice, phraseIndex) => ({
      phrase: choice,
      phraseIndex,
    }));
    const offset = (questionIndex * 2 + 1) % choices.length;
    const orderedChoices = [...choices.slice(offset), ...choices.slice(0, offset)];
    return {
      prompt: `Choose the Mandarin phrase for “${phrase.meaning}.”`,
      choices: orderedChoices,
      answer: orderedChoices.findIndex((choice) => choice.phraseIndex === questionIndex),
    };
  });

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
      const elapsedSeconds = Math.floor((now - lastStudyReport.current) / 1000);
      if (elapsedSeconds > 0) {
        lastStudyReport.current = now;
        let remainingSeconds = elapsedSeconds;
        while (remainingSeconds > 0) {
          const batch = Math.min(remainingSeconds, 120);
          onStudySeconds(batch);
          remainingSeconds -= batch;
        }
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
    if (activeSection < sectionTitles.length - 1) {
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
      <section className="lesson-player" role="dialog" aria-modal="true" aria-labelledby="course-lesson-title">
        <header className="player-header">
          <a className="player-brand" href="#" onClick={(event) => event.preventDefault()}>
            <span className="brand-mark">文</span>
            <span><strong>little mandarin</strong><small>YOUR GUIDED LESSON</small></span>
          </a>
          <div className="player-header-center">
            <span>UNIT {String(lesson.unit).padStart(2, "0")} <i>·</i> LESSON {lesson.number}</span>
            <strong>{lesson.title}</strong>
          </div>
          <button className="player-close" onClick={onClose} aria-label="Exit lesson">Exit lesson <span>×</span></button>
        </header>

        <div className="player-progress">
          <span style={{ width: `${(readySections.filter(Boolean).length / sectionTitles.length) * 100}%` }} />
        </div>

        <div className="player-body">
          <aside className="lesson-outline" aria-label="Lesson sections">
            <span className="outline-label">YOUR 15-MINUTE LESSON</span>
            <strong className="outline-title">{lesson.title}</strong>
            <span className="outline-total">3 guided activities · 15 minutes</span>
            <nav className="outline-nav" aria-label="Lesson activities">
              {sectionTitles.map((title, index) => (
                <button
                  className={`outline-item ${activeSection === index ? "outline-active" : ""} ${readySections[index] ? "outline-done" : ""}`}
                  key={title}
                  onClick={() => setActiveSection(index)}
                >
                  <span className="outline-index">{readySections[index] ? "✓" : String(index + 1).padStart(2, "0")}</span>
                  <span className="outline-info"><strong>{title}</strong><small>{sectionDurations[index]}</small></span>
                </button>
              ))}
            </nav>
            <div className="outline-tip"><span>學</span><p><strong>Take your time.</strong><br />Read each phrase aloud at your own pace.</p></div>
          </aside>

          <div className="lesson-stage" role="region" aria-label="Lesson activity">
            <div className="lesson-stage-inner">
              <span className="stage-eyebrow">PART {String(activeSection + 1).padStart(2, "0")} OF 03 <i>·</i> {sectionDurations[activeSection].toUpperCase()}</span>

              {activeSection === 0 && (
                <section aria-labelledby="course-lesson-title">
                  <h1 id="course-lesson-title">{lesson.title}</h1>
                  <p className="stage-intro">{lesson.focus} Read each phrase, listen to the sounds in your head, then practice saying it aloud.</p>
                  <div className="dialogue-list">
                    {lesson.phrases.map((phrase, index) => (
                      <article className="dialogue-line" key={phrase.hanzi}>
                        <span className="dialogue-number">{String(index + 1).padStart(2, "0")}</span>
                        <div className="dialogue-bubble">
                          <span className="dialogue-speaker">KEY PHRASE {index + 1}</span>
                          <strong>{phrase.hanzi}</strong>
                          <small>{phrase.pinyin} · {phrase.meaning}</small>
                        </div>
                      </article>
                    ))}
                  </div>
                  <button className="text-practice-button" onClick={() => setTextPracticeSections((current) => current.includes(0) ? current : [...current, 0])}>
                    {textPracticeSections.includes(0) ? "Phrases practiced ✓" : "I practiced these phrases"} <span>→</span>
                  </button>
                </section>
              )}

              {activeSection === 1 && (
                <section aria-labelledby="course-lesson-title">
                  <h1 id="course-lesson-title">Put the phrases into practice.</h1>
                  <p className="stage-intro">{lesson.focus} Use each phrase as a role-play prompt and imagine how it would fit into a real work conversation.</p>
                  <div className="dialogue-list">
                    {lesson.phrases.map((phrase, index) => (
                      <article className={`dialogue-line ${index % 2 ? "dialogue-other" : ""}`} key={phrase.hanzi}>
                        <span className="dialogue-number">{String(index + 1).padStart(2, "0")}</span>
                        <div className="dialogue-bubble">
                          <span className="dialogue-speaker">ROLE-PLAY PHRASE {index + 1}</span>
                          <strong>{phrase.hanzi}</strong>
                          <small>{phrase.pinyin} · {phrase.meaning}</small>
                        </div>
                      </article>
                    ))}
                  </div>
                  <button className="text-practice-button" onClick={() => setTextPracticeSections((current) => current.includes(1) ? current : [...current, 1])}>
                    {textPracticeSections.includes(1) ? "Conversation practiced ✓" : "I read the conversation aloud"} <span>→</span>
                  </button>
                </section>
              )}

              {activeSection === 2 && (
                <section aria-labelledby="course-lesson-title">
                  <h1 id="course-lesson-title">Check your understanding.</h1>
                  <p className="stage-intro">Choose the Mandarin phrase that matches each meaning. You can change your answers before finishing.</p>
                  <div className="quiz-list">
                    {questions.map((question, questionIndex) => (
                      <article className="quiz-card" key={question.prompt}>
                        <span className="quiz-count">QUESTION {questionIndex + 1} <span>OF {questions.length}</span></span>
                        <h2>{question.prompt}</h2>
                        <div className="quiz-options">
                          {question.choices.map(({ phrase, phraseIndex }, optionIndex) => (
                            <button
                              className={`quiz-option ${answers[questionIndex] === optionIndex ? "option-selected" : ""}`}
                              key={phrase.hanzi}
                              onClick={() => setAnswers((current) => {
                                const next = [...current];
                                next[questionIndex] = optionIndex;
                                return next;
                              })}
                            >
                              <span>{String.fromCharCode(65 + optionIndex)}</span>{phrase.hanzi}<small> · {phrase.pinyin}</small>
                              {answers[questionIndex] === optionIndex && <span className="option-check" aria-label={`Selected answer ${phraseIndex + 1}`}>✓</span>}
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
          <div className="footer-lesson-progress"><strong>{activeSection + 1}</strong><span> / 3 sections</span><small>{sectionTitles[activeSection]}</small></div>
          {activeSection > 0 && <button className="player-back" onClick={() => setActiveSection((current) => current - 1)}>← Previous</button>}
          <button className="player-next" disabled={!readySections[activeSection] || (activeSection === sectionTitles.length - 1 && !readySections.slice(0, -1).every(Boolean)) || isCompleting} onClick={() => void handleContinue()}>
            {isCompleting ? "Saving lesson…" : activeSection === sectionTitles.length - 1 ? "Complete lesson" : "Complete section & continue"}
            <span aria-hidden="true">{activeSection === sectionTitles.length - 1 ? "✓" : "→"}</span>
          </button>
        </footer>
      </section>
    </div>
  );
}
