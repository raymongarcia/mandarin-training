"use client";

import { useEffect, useRef, useState } from "react";
import type { LessonProgress } from "../lib/useLearningProgress";

const lessonSections = [
  { title: "Pinyin sounds & tones", duration: "20 min", icon: "01" },
  { title: "Build your first words", duration: "12 min", icon: "02" },
  { title: "Introduce yourself", duration: "12 min", icon: "03" },
  { title: "Check your understanding", duration: "8 min", icon: "04" },
  { title: "Speak with confidence", duration: "8 min", icon: "05" },
];

const pinyinGroups = [
  { id: "pinyin-bpmf", category: "INITIALS", letters: [{ symbol: "b", sound: "p without a puff" }, { symbol: "p", sound: "p with a puff" }, { symbol: "m", sound: "m in me" }, { symbol: "f", sound: "f in fun" }], example: "bā · pā · mā · fā", audio: "bā pā mā fā" },
  { id: "pinyin-dtnl", category: "INITIALS", letters: [{ symbol: "d", sound: "t without a puff" }, { symbol: "t", sound: "t with a puff" }, { symbol: "n", sound: "n in no" }, { symbol: "l", sound: "l in let" }], example: "dā · tā · nā · lā", audio: "dā tā nā lā" },
  { id: "pinyin-gkh", category: "INITIALS", letters: [{ symbol: "g", sound: "k without a puff" }, { symbol: "k", sound: "k with a puff" }, { symbol: "h", sound: "h, from the throat" }], example: "gā · kā · hā", audio: "gā kā hā" },
  { id: "pinyin-jqx", category: "INITIALS", letters: [{ symbol: "j", sound: "j in jeep; tongue forward" }, { symbol: "q", sound: "ch in cheese; tongue forward" }, { symbol: "x", sound: "soft sh; tongue forward" }], example: "jī · qī · xī", audio: "jī qī xī" },
  { id: "pinyin-zcsr", category: "INITIALS", letters: [{ symbol: "zh", sound: "j, tongue curled back" }, { symbol: "ch", sound: "ch, tongue curled back" }, { symbol: "sh", sound: "sh, tongue curled back" }, { symbol: "r", sound: "r, tongue curled back" }], example: "zhī · chī · shī · rì", audio: "zhī chī shī rì" },
  { id: "pinyin-zcs", category: "INITIALS", letters: [{ symbol: "z", sound: "ts without a puff" }, { symbol: "c", sound: "ts with a puff" }, { symbol: "s", sound: "s in see" }], example: "zī · cī · sī", audio: "zī cī sī" },
  { id: "pinyin-yw", category: "INITIALS", letters: [{ symbol: "y", sound: "y in yes" }, { symbol: "w", sound: "w in we" }], example: "yī · wū", audio: "yī wū" },
  { id: "pinyin-aoe", category: "FINALS · VOWELS", letters: [{ symbol: "a", sound: "ah, as in father" }, { symbol: "o", sound: "aw/oh" }, { symbol: "e", sound: "uh (approx.)" }], example: "ā · ō · ē", audio: "ā ō ē" },
  { id: "pinyin-iuy", category: "FINALS · VOWELS", letters: [{ symbol: "i", sound: "ee" }, { symbol: "u", sound: "oo, as in food" }, { symbol: "ü", sound: "ee with rounded lips" }], example: "yī · wū · yū", audio: "yī wū yū" },
];

const tones = [
  { id: "tone-1", number: "1", name: "First tone", pinyin: "mā", hanzi: "妈", contour: "high-flat", cue: "High and steady, like holding one piano note.", meaning: "mother" },
  { id: "tone-2", number: "2", name: "Second tone", pinyin: "má", hanzi: "麻", contour: "rising", cue: "Starts in the middle and rises, like asking “huh?”", meaning: "hemp; numb" },
  { id: "tone-3", number: "3", name: "Third tone", pinyin: "mǎ", hanzi: "马", contour: "low-dip", cue: "A low, dipping sound. In normal speech it often stays low.", meaning: "horse" },
  { id: "tone-4", number: "4", name: "Fourth tone", pinyin: "mà", hanzi: "骂", contour: "falling", cue: "A crisp fall from high to low, like a firm “stop!”", meaning: "to scold" },
  { id: "tone-5", number: "5", name: "Neutral tone", pinyin: "ma", hanzi: "吗", contour: "neutral", cue: "Short and light; it takes its pitch from the syllable before it.", meaning: "question particle" },
];

type PronunciationSyllable = {
  character: string;
  pinyin: string;
  sound: string;
  tone: string;
};

const vocabulary = [
  { id: "word-hello", hanzi: "你好", meaning: "Hello (friendly)", note: "The written tones are third + third. Together, the first is pronounced closer to second tone: ní hǎo.", syllables: [
    { character: "你", pinyin: "nǐ", sound: "nee", tone: "3rd, low; rises before hǎo" },
    { character: "好", pinyin: "hǎo", sound: "how", tone: "3rd, low" },
  ] },
  { id: "word-polite", hanzi: "您好", meaning: "Hello (polite)", note: "Use 您 with clients, senior colleagues, and people you have just met.", syllables: [
    { character: "您", pinyin: "nín", sound: "neen", tone: "2nd, rising" },
    { character: "好", pinyin: "hǎo", sound: "how", tone: "3rd, low" },
  ] },
  { id: "word-name", hanzi: "我叫…", meaning: "My name is…", note: "Add your name after 叫. 我 (wǒ) means “I”; 叫 (jiào) means “to be called.”", syllables: [
    { character: "我", pinyin: "wǒ", sound: "wuh", tone: "3rd, low" },
    { character: "叫", pinyin: "jiào", sound: "jyaow", tone: "4th, falling" },
  ] },
  { id: "word-meet", hanzi: "很高兴认识您", meaning: "Pleased to meet you", note: "A warm, professional way to close an introduction.", syllables: [
    { character: "很", pinyin: "hěn", sound: "huhn", tone: "3rd, low" },
    { character: "高", pinyin: "gāo", sound: "gow", tone: "1st, high and level" },
    { character: "兴", pinyin: "xìng", sound: "shing", tone: "4th, falling" },
    { character: "认", pinyin: "rèn", sound: "run", tone: "4th, falling" },
    { character: "识", pinyin: "shi", sound: "shr", tone: "neutral, light" },
    { character: "您", pinyin: "nín", sound: "neen", tone: "2nd, rising" },
  ] },
];

const dialogue = [
  { id: "line-1", speaker: "You", hanzi: "您好！我叫 Alex。", translation: "Hello! My name is Alex.", syllables: [
    { character: "您", pinyin: "nín", sound: "neen", tone: "2nd, rising" },
    { character: "好", pinyin: "hǎo", sound: "how", tone: "3rd, low" },
    { character: "我", pinyin: "wǒ", sound: "wuh", tone: "3rd, low" },
    { character: "叫", pinyin: "jiào", sound: "jyaow", tone: "4th, falling" },
    { character: "Alex", pinyin: "your name", sound: "say your name", tone: "" },
  ] },
  { id: "line-2", speaker: "Client", hanzi: "您好，很高兴认识您。", translation: "Hello, pleased to meet you.", syllables: [
    { character: "您", pinyin: "nín", sound: "neen", tone: "2nd, rising" },
    { character: "好", pinyin: "hǎo", sound: "how", tone: "3rd, low" },
    { character: "很", pinyin: "hěn", sound: "huhn", tone: "3rd, low" },
    { character: "高", pinyin: "gāo", sound: "gow", tone: "1st, high and level" },
    { character: "兴", pinyin: "xìng", sound: "shing", tone: "4th, falling" },
    { character: "认", pinyin: "rèn", sound: "run", tone: "4th, falling" },
    { character: "识", pinyin: "shi", sound: "shr", tone: "neutral, light" },
    { character: "您", pinyin: "nín", sound: "neen", tone: "2nd, rising" },
  ] },
  { id: "line-3", speaker: "You", hanzi: "我也很高兴认识您。", translation: "I’m pleased to meet you, too.", syllables: [
    { character: "我", pinyin: "wǒ", sound: "wuh", tone: "3rd, low" },
    { character: "也", pinyin: "yě", sound: "yeh", tone: "3rd, low" },
    { character: "很", pinyin: "hěn", sound: "huhn", tone: "3rd, low" },
    { character: "高", pinyin: "gāo", sound: "gow", tone: "1st, high and level" },
    { character: "兴", pinyin: "xìng", sound: "shing", tone: "4th, falling" },
    { character: "认", pinyin: "rèn", sound: "run", tone: "4th, falling" },
    { character: "识", pinyin: "shi", sound: "shr", tone: "neutral, light" },
    { character: "您", pinyin: "nín", sound: "neen", tone: "2nd, rising" },
  ] },
];

const introductionSyllables: PronunciationSyllable[] = [
  { character: "您", pinyin: "nín", sound: "neen", tone: "2nd, rising" },
  { character: "好", pinyin: "hǎo", sound: "how", tone: "3rd, low" },
  { character: "我", pinyin: "wǒ", sound: "wuh", tone: "3rd, low" },
  { character: "叫", pinyin: "jiào", sound: "jyaow", tone: "4th, falling" },
];

const rehearsalLines = [
  { hanzi: "您好！", translation: "Greet your client politely.", audio: "scene-hello", syllables: vocabulary[1].syllables },
  { hanzi: "我叫 ______。", translation: "Say your name.", audio: "scene-name", syllables: introductionSyllables.slice(2) },
  { hanzi: "很高兴认识您。", translation: "Say you’re pleased to meet them.", audio: "scene-meet", syllables: vocabulary[3].syllables },
];

const quizQuestions = [
  {
    question: "You are greeting a new client. Which is the most polite choice?",
    options: ["你好 (nǐ hǎo)", "您好 (nín hǎo)", "吗 (ma)"],
    answer: 1,
    explanation: "您好 (nín hǎo) is the polite form, a good choice with a new client.",
  },
  {
    question: "What does 我叫李安 (wǒ jiào Lǐ Ān) mean?",
    options: ["I’m pleased to meet you.", "My company is Li An.", "My name is Li An."],
    answer: 2,
    explanation: "我叫 + name is a natural way to say “My name is …”",
  },
  {
    question: "In 你好, how does the first syllable usually sound when spoken?",
    options: ["It rises, like a second tone.", "It stays high and flat.", "It is silent."],
    answer: 0,
    explanation: "Two third tones together: the first is usually pronounced like a second tone, ní hǎo.",
  },
];

function SpeakerIcon({ speaking = false }: { speaking?: boolean }) {
  return (
    <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 5 6 9H3v6h3l5 4z" />
      {speaking ? <><path d="M16 9a5 5 0 0 1 0 6" /><path d="M19 6a9 9 0 0 1 0 12" /></> : <path d="M16 9a5 5 0 0 1 0 6" />}
    </svg>
  );
}

function PronunciationGuide({ syllables }: { syllables: PronunciationSyllable[] }) {
  return (
    <span className="pronunciation-guide" aria-label={syllables.map((syllable) => `${syllable.character}: ${syllable.pinyin}, sounds like ${syllable.sound}${syllable.tone ? `, ${syllable.tone}` : ""}`).join("; ")}>
      {syllables.map((syllable, index) => (
        <span className="pronunciation-syllable" key={`${syllable.character}-${index}`}>
          <span className="pronunciation-character">{syllable.character}</span>
          <span className="pronunciation-pinyin">{syllable.pinyin}</span>
          <span className="pronunciation-sound">sounds like {syllable.sound}</span>
          {syllable.tone && <span className="pronunciation-tone">{syllable.tone}</span>}
        </span>
      ))}
    </span>
  );
}

function LessonPlayer({
  onClose,
  onComplete,
  initialProgress,
  onProgressChange,
}: {
  onClose: () => void;
  onComplete: () => void;
  initialProgress: LessonProgress | null;
  onProgressChange: (progress: LessonProgress) => void;
}) {
  const [activeSection, setActiveSection] = useState(initialProgress?.sectionIndex ?? 0);
  const [playedAudio, setPlayedAudio] = useState<string[]>(initialProgress?.playedAudio ?? []);
  const [playingAudio, setPlayingAudio] = useState("");
  const [audioNotice, setAudioNotice] = useState("");
  const [audioFailed, setAudioFailed] = useState(false);
  const [answers, setAnswers] = useState<(number | undefined)[]>(initialProgress?.answers.map((answer) => answer ?? undefined) ?? []);
  const [practiceChecks, setPracticeChecks] = useState<number[]>(initialProgress?.practiceChecks ?? []);
  const [textPracticeSections, setTextPracticeSections] = useState<number[]>(initialProgress?.textPracticeSections ?? []);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    onProgressChange({
      sectionIndex: activeSection,
      playedAudio,
      answers: answers.map((answer) => answer ?? null),
      practiceChecks,
      textPracticeSections,
    });
  }, [activeSection, answers, onProgressChange, playedAudio, practiceChecks, textPracticeSections]);

  const markAudioPlayed = (id: string) => {
    setPlayedAudio((current) => current.includes(id) ? current : [...current, id]);
    setPlayingAudio("");
  };

  const playAudio = (id: string, text: string) => {
    setAudioNotice("");
    setAudioFailed(false);
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }

    const mandarinVoice = "speechSynthesis" in window
      ? window.speechSynthesis.getVoices().find((voice) => /^(zh-CN|zh-SG|zh-Hans|zh)$/i.test(voice.lang))
      : undefined;

    if (mandarinVoice && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "zh-CN";
      utterance.rate = 0.78;
      utterance.voice = mandarinVoice;
      utterance.onstart = () => setPlayingAudio(id);
      utterance.onend = () => markAudioPlayed(id);
      utterance.onerror = () => {
        setPlayingAudio("");
        setAudioFailed(true);
        setAudioNotice("Your Mandarin voice could not play this phrase. You can still practice with the pinyin below.");
      };
      window.speechSynthesis.speak(utterance);
      return;
    }

    const audio = new Audio(`/api/pronunciation?text=${encodeURIComponent(text)}`);
    audioRef.current = audio;
    audio.onplay = () => setPlayingAudio(id);
    audio.onended = () => markAudioPlayed(id);
    audio.onerror = () => {
      setPlayingAudio("");
      setAudioFailed(true);
      setAudioNotice("Mandarin audio could not load. Check your connection, or continue with the pinyin and tone guides below.");
    };
    void audio.play().catch(() => {
      setPlayingAudio("");
      setAudioFailed(true);
      setAudioNotice("Mandarin audio could not play. Check your connection, or continue with the pinyin and tone guides below.");
    });
  };

  const readySections = [
    (pinyinGroups.every((group) => playedAudio.includes(group.id)) && tones.every((tone) => playedAudio.includes(tone.id))) || textPracticeSections.includes(0),
    vocabulary.every((word) => playedAudio.includes(word.id)) || textPracticeSections.includes(1),
    dialogue.every((line) => playedAudio.includes(line.id)) || textPracticeSections.includes(2),
    quizQuestions.every((question, index) => answers[index] === question.answer),
    practiceChecks.length === 3,
  ];
  const sectionReady = readySections[activeSection];

  const stopAudio = () => {
    audioRef.current?.pause();
    if (audioRef.current) audioRef.current.currentTime = 0;
    audioRef.current = null;
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  };

  const continueWithText = () => {
    const ids = activeSection === 0 ? [...pinyinGroups.map((group) => group.id), ...tones.map((tone) => tone.id)]
      : activeSection === 1 ? vocabulary.map((word) => word.id)
        : dialogue.map((line) => line.id);
    setPlayedAudio((current) => [...new Set([...current, ...ids])]);
    setTextPracticeSections((current) => [...new Set([...current, activeSection])]);
    setAudioFailed(false);
    setAudioNotice("Text practice marked complete. Read each pinyin sound aloud and follow the tone guides.");
  };

  const handleContinue = () => {
    if (!sectionReady) return;
    if (activeSection === lessonSections.length - 1) {
      stopAudio();
      onComplete();
      return;
    }
    setActiveSection((current) => current + 1);
    document.querySelector(".lesson-stage")?.scrollTo({ top: 0, behavior: "smooth" });
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
            <span>UNIT 01 <i>·</i> LESSON 1</span>
            <strong>Your first Mandarin sounds</strong>
          </div>
          <button className="player-close" onClick={() => {
            stopAudio();
            onClose();
          }} aria-label="Exit lesson">Exit lesson <span>×</span></button>
        </header>

        <div className="player-progress">
          <span style={{ width: `${(readySections.filter(Boolean).length / lessonSections.length) * 100}%` }} />
        </div>

        <div className="player-body">
          <aside className="lesson-outline" aria-label="Lesson sections">
            <span className="outline-label">YOUR 60-MINUTE LESSON</span>
            <strong className="outline-title">A warm first<br />impression</strong>
            <span className="outline-total">5 guided activities · 60 minutes</span>
            <nav className="outline-nav" aria-label="Lesson activities">
              {lessonSections.map((section, index) => (
                <button
                  className={`outline-item ${activeSection === index ? "outline-active" : ""} ${readySections[index] ? "outline-done" : ""}`}
                  key={section.title}
                  onClick={() => setActiveSection(index)}
                >
                  <span className="outline-index">{readySections[index] ? "✓" : section.icon}</span>
                  <span className="outline-info"><strong>{section.title}</strong><small>{section.duration}</small></span>
                </button>
              ))}
            </nav>
            <div className="outline-tip"><span>學</span><p><strong>Take your time.</strong><br />Listen, repeat, and let the sounds settle in.</p></div>
          </aside>

          <div className="lesson-stage" role="region" aria-label="Lesson activity">
            <div className="lesson-stage-inner">
              <span className="stage-eyebrow">PART {String(activeSection + 1).padStart(2, "0")} OF {String(lessonSections.length).padStart(2, "0")} <i>·</i> {lessonSections[activeSection].duration.toUpperCase()}</span>

              {activeSection === 0 && (
                <section aria-labelledby="lesson-title">
                  <h1 id="lesson-title">Start with Pinyin.<br /><span>Learn the sounds.</span></h1>
                  <p className="stage-intro">Chinese is written with characters rather than an alphabet. Hanyu Pinyin uses familiar Latin letters to show how to pronounce them. Start with initials (beginning sounds) and finals (vowel sounds). The English hints are approximate—listen to the Mandarin examples too.</p>
                  <p className="audio-provider-note">Pronunciation plays with a Mandarin voice when available, or online speech audio.</p>
                  <div className="pinyin-heading"><strong>Initials</strong><span>Starting sounds</span></div>
                  <div className="pinyin-progress"><span>{pinyinGroups.filter((group) => playedAudio.includes(group.id)).length} of {pinyinGroups.length} Pinyin groups heard</span></div>
                  <div className="pinyin-grid">
                    {pinyinGroups.filter((group) => group.category === "INITIALS").map((group) => (
                      <article className={`pinyin-card ${playedAudio.includes(group.id) ? "pinyin-heard" : ""}`} key={group.id}>
                        <span className="pinyin-category">{group.category}</span>
                        <div className="pinyin-letters">{group.letters.map((letter) => <span key={letter.symbol}><strong>{letter.symbol}</strong><small>{letter.sound}</small></span>)}</div>
                        <span className="pinyin-example">{group.example}</span>
                        <button className={`audio-button pinyin-audio ${playingAudio === group.id ? "audio-active" : ""}`} onClick={() => playAudio(group.id, group.audio)} aria-label={`Hear the Mandarin initials ${group.letters.map((letter) => letter.symbol).join(", ")}: ${group.example}`}><SpeakerIcon speaking={playingAudio === group.id} />{playingAudio === group.id ? "Playing…" : playedAudio.includes(group.id) ? "Play again" : "Hear examples"}</button>
                      </article>
                    ))}
                  </div>
                  <div className="pinyin-heading"><strong>Simple finals</strong><span>Vowel sounds</span></div>
                  <div className="pinyin-grid pinyin-finals">
                    {pinyinGroups.filter((group) => group.category === "FINALS · VOWELS").map((group) => (
                      <article className={`pinyin-card ${playedAudio.includes(group.id) ? "pinyin-heard" : ""}`} key={group.id}>
                        <span className="pinyin-category">{group.category}</span>
                        <div className="pinyin-letters">{group.letters.map((letter) => <span key={letter.symbol}><strong>{letter.symbol}</strong><small>{letter.sound}</small></span>)}</div>
                        <span className="pinyin-example">{group.example}</span>
                        <button className={`audio-button pinyin-audio ${playingAudio === group.id ? "audio-active" : ""}`} onClick={() => playAudio(group.id, group.audio)} aria-label={`Hear the Mandarin vowel finals ${group.letters.map((letter) => letter.symbol).join(", ")}: ${group.example}`}><SpeakerIcon speaking={playingAudio === group.id} />{playingAudio === group.id ? "Playing…" : playedAudio.includes(group.id) ? "Play again" : "Hear examples"}</button>
                      </article>
                    ))}
                  </div>
                  <div className="lesson-explainer"><strong>How to practice Pinyin</strong><p>Read the letter, look at its English sound hint, then play and repeat the example syllables. Mandarin has four main tones plus a light neutral tone; the same syllable can mean different things with a different tone.</p></div>
                  <div className="pinyin-heading tone-heading"><strong>Now hear the tones</strong><span>Same syllable, five tones</span></div>
                  <p className="stage-intro">Listen to how the pitch changes the meaning of mā. Try to copy the shape, not just the sound.</p>
                  <div className="tone-note"><span>♫</span><p><strong>How to practice</strong><br />Click each sound. Listen once, then imitate its pitch out loud.</p><span className="tone-note-time">5 sounds</span></div>
                  <div className="tone-grid">
                    {tones.map((tone) => (
                      <article className={`tone-card ${playingAudio === tone.id ? "audio-playing" : ""}`} key={tone.id}>
                        <div className="tone-contour" aria-hidden="true"><svg viewBox="0 0 100 40" preserveAspectRatio="none"><path className="pitch-guide" d="M12 20 H88" /><path className={`contour-${tone.contour}`} d={{
                          "high-flat": "M12 11 L88 11",
                          rising: "M12 29 Q49 28 88 8",
                          "low-dip": "M12 15 Q34 34 49 30 Q70 26 88 12",
                          falling: "M12 8 L88 30",
                          neutral: "M37 18 L63 18",
                        }[tone.contour]} /></svg></div>
                        <span className="tone-name">{tone.name}</span>
                        <div className="tone-word"><strong>{tone.hanzi}</strong><span>{tone.pinyin}</span></div>
                        <p>{tone.cue}</p>
                        <button className="audio-button tone-audio" onClick={() => playAudio(tone.id, tone.hanzi)} aria-label={`Hear ${tone.name}: ${tone.hanzi}, ${tone.pinyin}`}>
                          <SpeakerIcon speaking={playingAudio === tone.id} />{playingAudio === tone.id ? "Playing…" : playedAudio.includes(tone.id) ? "Play again" : "Hear the sound"}
                        </button>
                        <span className="tone-meaning">Example meaning: {tone.meaning}</span>
                      </article>
                    ))}
                  </div>
                  <div className="lesson-explainer"><strong>Why tones matter at work</strong><p>A tone can change the meaning of a word completely. You do not need perfect tones today—first, train your ear to notice them.</p></div>
                </section>
              )}

              {activeSection === 1 && (
                <section aria-labelledby="lesson-title">
                  <h1 id="lesson-title">Useful words,<br /><span>right from hello.</span></h1>
                  <p className="stage-intro">Meet someone new with these four building blocks. Each character has its pinyin and an approximate English sound below it; use the tone label as a guide. Click each speaker and repeat the Chinese aloud.</p>
                  <div className="vocab-progress"><span>{vocabulary.filter((word) => playedAudio.includes(word.id)).length} of {vocabulary.length} phrases heard</span><div><i style={{ width: `${(vocabulary.filter((word) => playedAudio.includes(word.id)).length / vocabulary.length) * 100}%` }} /></div></div>
                  <div className="vocab-list">
                    {vocabulary.map((word, index) => (
                      <article className={`vocab-card ${playedAudio.includes(word.id) ? "vocab-heard" : ""}`} key={word.id}>
                        <span className="vocab-number">0{index + 1}</span>
                        <div className="vocab-main"><strong>{word.hanzi}</strong><small>{word.meaning}</small></div>
                        <PronunciationGuide syllables={word.syllables} />
                        <button className={`audio-button vocab-audio ${playingAudio === word.id ? "audio-active" : ""}`} onClick={() => playAudio(word.id, word.id === "word-name" ? "我叫李安" : word.hanzi)} aria-label={`Hear ${word.hanzi}`}><SpeakerIcon speaking={playingAudio === word.id} />{playingAudio === word.id ? "Playing…" : playedAudio.includes(word.id) ? "Play again" : "Listen"}</button>
                        <p className="vocab-note">{word.note}</p>
                      </article>
                    ))}
                  </div>
                  <div className="lesson-explainer"><strong>A small but useful distinction</strong><p>你好 is friendly and widely understood. For a first client meeting, 您好 sounds more respectful—like using “Hello, ma’am/sir” rather than “Hey.”</p></div>
                </section>
              )}

              {activeSection === 2 && (
                <section aria-labelledby="lesson-title">
                  <h1 id="lesson-title">Put the words<br /><span>into a conversation.</span></h1>
                  <p className="stage-intro">Each character is paired with pinyin, an approximate English sound, and its tone. In Mandarin, the name comes after 我叫 (wǒ jiào, “I am called”). Listen, then repeat one syllable at a time.</p>
                  <div className="sentence-pattern"><span className="pattern-label">YOUR INTRODUCTION</span><strong>您好，我叫 <i>+ your name</i>。</strong><PronunciationGuide syllables={introductionSyllables} /><span>Hello, my name is …</span></div>
                  <div className="dialogue-list">
                    {dialogue.map((line, index) => (
                      <article className={`dialogue-line ${line.speaker === "Client" ? "dialogue-other" : ""}`} key={line.id}>
                        <span className="dialogue-number">{String(index + 1).padStart(2, "0")}</span>
                        <div className="dialogue-bubble"><span className="dialogue-speaker">{line.speaker === "You" ? "YOU" : "YOUR CLIENT"}</span><strong>{line.hanzi}</strong><PronunciationGuide syllables={line.syllables} /><small>{line.translation}</small></div>
                        <button className={`audio-button dialogue-audio ${playingAudio === line.id ? "audio-active" : ""}`} onClick={() => playAudio(line.id, line.hanzi.replace("Alex", "艾力克斯"))} aria-label={`Hear dialogue: ${line.hanzi}`}><SpeakerIcon speaking={playingAudio === line.id} />{playingAudio === line.id ? "Playing…" : playedAudio.includes(line.id) ? "Play again" : "Listen"}</button>
                      </article>
                    ))}
                  </div>
                  <div className="lesson-explainer"><strong>Your turn</strong><p>Replace “Alex” with your name: 您好，我叫 [your name]。 Pause after your name and let your new colleague respond.</p></div>
                </section>
              )}

              {activeSection === 3 && (
                <section aria-labelledby="lesson-title">
                  <h1 id="lesson-title">A quick check-in.<br /><span>You’ve got this.</span></h1>
                  <p className="stage-intro">Choose the best answer for each situation. If you miss one, read the explanation and give it another try.</p>
                  <div className="quiz-list">
                    {quizQuestions.map((item, index) => {
                      const answered = answers[index] !== undefined;
                      const correct = answers[index] === item.answer;
                      return (
                        <article className={`quiz-card ${answered ? correct ? "quiz-correct" : "quiz-incorrect" : ""}`} key={item.question}>
                          <span className="quiz-count">QUESTION 0{index + 1} <span>OF 03</span></span>
                          <h2>{item.question}</h2>
                          <div className="quiz-options">{item.options.map((option, optionIndex) => (
                            <button className={`quiz-option ${answers[index] === optionIndex ? "option-selected" : ""} ${answered && optionIndex === item.answer ? "option-answer" : ""}`} key={option} onClick={() => setAnswers((current) => {
                              const next = [...current];
                              next[index] = optionIndex;
                              return next;
                            })}>
                              <span>{String.fromCharCode(65 + optionIndex)}</span>{option}
                              {answered && optionIndex === item.answer && <span className="option-check">✓</span>}
                            </button>
                          ))}</div>
                          {answered && <p className={`quiz-feedback ${correct ? "feedback-correct" : "feedback-incorrect"}`} role="status">{correct ? "That’s right. " : "Not quite. "} {item.explanation}</p>}
                        </article>
                      );
                    })}
                  </div>
                </section>
              )}

              {activeSection === 4 && (
                <section aria-labelledby="lesson-title">
                  <h1 id="lesson-title">Take a breath.<br /><span>Now say it yourself.</span></h1>
                  <p className="stage-intro">Speaking out loud—even on your own—is how new phrases start to feel natural. Use the pinyin, approximate English sounds, and tone labels to practice each syllable in this client-meeting rehearsal.</p>
                  <div className="speaking-scene"><span>THE SCENE</span><p>You’re welcoming a new client at the start of a video call. Say hello, introduce yourself, and let them know you’re pleased to meet them.</p><span className="scene-translation">Take your time. You can listen to the sample again any time.</span></div>
                  <div className="rehearsal-lines">
                    {rehearsalLines.map((line) => (
                      <article className="rehearsal-line" key={line.audio}>
                        <div><strong>{line.hanzi}</strong><PronunciationGuide syllables={line.syllables} /><small>{line.translation}</small></div>
                        <button className={`audio-button rehearsal-audio ${playingAudio === line.audio ? "audio-active" : ""}`} onClick={() => playAudio(line.audio, line.hanzi.replace("______", "名字"))} aria-label={`Hear ${line.hanzi}`}><SpeakerIcon speaking={playingAudio === line.audio} />{playingAudio === line.audio ? "Playing…" : playedAudio.includes(line.audio) ? "Play again" : "Hear example"}</button>
                      </article>
                    ))}
                  </div>
                  <div className="practice-checklist">
                    <span className="pattern-label">BEFORE YOU FINISH, CHECK IN WITH YOURSELF</span>
                    {[
                      "I said each line out loud, not just in my head.",
                      "I introduced myself using my own name.",
                      "I tried the greeting without looking at the sample.",
                    ].map((item, index) => (
                      <label className="practice-check" key={item}>
                        <input type="checkbox" checked={practiceChecks.includes(index)} onChange={() => setPracticeChecks((current) => current.includes(index) ? current.filter((value) => value !== index) : [...current, index])} />
                        <span className="practice-box" />
                        <span>{item}</span>
                      </label>
                    ))}
                  </div>
                  <div className="lesson-finale"><span>THE GOAL ISN’T PERFECT.</span><p>It’s a real hello to a real person. Every conversation gets easier when you start.</p></div>
                </section>
              )}

              {audioNotice && <p className="audio-notice" role="status">{audioNotice}</p>}
              {audioFailed && activeSection < 3 && <button className="text-practice-button" onClick={continueWithText}>Continue with text-only practice <span>→</span></button>}
            </div>
          </div>
        </div>

        <footer className="player-footer">
          <div className="footer-lesson-progress"><strong>{activeSection + 1}</strong><span> / {lessonSections.length} sections</span><small>{lessonSections[activeSection].title}</small></div>
          {activeSection > 0 && <button className="player-back" onClick={() => setActiveSection((current) => current - 1)}>← Previous</button>}
          <button className="player-next" disabled={!sectionReady || (activeSection === lessonSections.length - 1 && !readySections.slice(0, -1).every(Boolean))} onClick={handleContinue}>
            {activeSection === lessonSections.length - 1 ? readySections.slice(0, -1).every(Boolean) ? "Complete lesson" : "Finish previous sections first" : "Complete section & continue"}
            <span aria-hidden="true">{activeSection === lessonSections.length - 1 ? "✓" : "→"}</span>
          </button>
        </footer>
      </section>
    </div>
  );
}

export default LessonPlayer;
