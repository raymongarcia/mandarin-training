"use client";

import { useEffect, useRef, useState } from "react";

const words = [
  { hanzi: "合作", pinyin: "hézuò", meaning: "collaboration", example: "期待与您合作。", examplePinyin: "qīdài yǔ nín hézuò.", exampleMeaning: "I look forward to working with you." },
  { hanzi: "会议", pinyin: "huìyì", meaning: "meeting", example: "我们下午有一个会议。", examplePinyin: "wǒmen xiàwǔ yǒu yí ge huìyì.", exampleMeaning: "We have a meeting this afternoon." },
  { hanzi: "客户", pinyin: "kèhù", meaning: "client; customer", example: "客户今天会来。", examplePinyin: "kèhù jīntiān huì lái.", exampleMeaning: "The client will come today." },
  { hanzi: "同事", pinyin: "tóngshì", meaning: "colleague", example: "她是我的同事。", examplePinyin: "tā shì wǒ de tóngshì.", exampleMeaning: "She is my colleague." },
  { hanzi: "公司", pinyin: "gōngsī", meaning: "company", example: "我们在一家小公司工作。", examplePinyin: "wǒmen zài yì jiā xiǎo gōngsī gōngzuò.", exampleMeaning: "We work at a small company." },
  { hanzi: "计划", pinyin: "jìhuà", meaning: "plan", example: "这是我们的计划。", examplePinyin: "zhè shì wǒmen de jìhuà.", exampleMeaning: "This is our plan." },
  { hanzi: "时间", pinyin: "shíjiān", meaning: "time", example: "您什么时候有时间？", examplePinyin: "nín shénme shíhou yǒu shíjiān?", exampleMeaning: "When do you have time?" },
  { hanzi: "方便", pinyin: "fāngbiàn", meaning: "convenient", example: "明天上午方便吗？", examplePinyin: "míngtiān shàngwǔ fāngbiàn ma?", exampleMeaning: "Is tomorrow morning convenient?" },
  { hanzi: "确认", pinyin: "quèrèn", meaning: "to confirm", example: "请确认会议时间。", examplePinyin: "qǐng quèrèn huìyì shíjiān.", exampleMeaning: "Please confirm the meeting time." },
  { hanzi: "讨论", pinyin: "tǎolùn", meaning: "to discuss", example: "我们一起讨论这个问题。", examplePinyin: "wǒmen yìqǐ tǎolùn zhège wèntí.", exampleMeaning: "Let's discuss this question together." },
  { hanzi: "问题", pinyin: "wèntí", meaning: "question; problem", example: "您有什么问题吗？", examplePinyin: "nín yǒu shénme wèntí ma?", exampleMeaning: "Do you have any questions?" },
  { hanzi: "解决", pinyin: "jiějué", meaning: "to solve", example: "我们会尽快解决。", examplePinyin: "wǒmen huì jǐnkuài jiějué.", exampleMeaning: "We will resolve it as soon as possible." },
  { hanzi: "需要", pinyin: "xūyào", meaning: "to need", example: "您需要什么帮助？", examplePinyin: "nín xūyào shénme bāngzhù?", exampleMeaning: "What help do you need?" },
  { hanzi: "负责", pinyin: "fùzé", meaning: "to be responsible for", example: "我负责这个项目。", examplePinyin: "wǒ fùzé zhège xiàngmù.", exampleMeaning: "I am responsible for this project." },
  { hanzi: "进展", pinyin: "jìnzhǎn", meaning: "progress", example: "项目进展很顺利。", examplePinyin: "xiàngmù jìnzhǎn hěn shùnlì.", exampleMeaning: "The project is progressing smoothly." },
  { hanzi: "质量", pinyin: "zhìliàng", meaning: "quality", example: "质量对我们很重要。", examplePinyin: "zhìliàng duì wǒmen hěn zhòngyào.", exampleMeaning: "Quality is important to us." },
  { hanzi: "价格", pinyin: "jiàgé", meaning: "price", example: "这个价格可以吗？", examplePinyin: "zhège jiàgé kěyǐ ma?", exampleMeaning: "Is this price okay?" },
  { hanzi: "报价", pinyin: "bàojià", meaning: "quotation; quote", example: "请发一份新的报价。", examplePinyin: "qǐng fā yí fèn xīn de bàojià.", exampleMeaning: "Please send a new quotation." },
  { hanzi: "订单", pinyin: "dìngdān", meaning: "order", example: "我们已经收到订单。", examplePinyin: "wǒmen yǐjīng shōudào dìngdān.", exampleMeaning: "We have already received the order." },
  { hanzi: "交货", pinyin: "jiāohuò", meaning: "to deliver goods", example: "什么时候可以交货？", examplePinyin: "shénme shíhou kěyǐ jiāohuò?", exampleMeaning: "When can you deliver the goods?" },
  { hanzi: "供应商", pinyin: "gōngyìngshāng", meaning: "supplier", example: "我们正在联系供应商。", examplePinyin: "wǒmen zhèngzài liánxì gōngyìngshāng.", exampleMeaning: "We are contacting the supplier." },
  { hanzi: "合同", pinyin: "hétong", meaning: "contract", example: "请看一下合同。", examplePinyin: "qǐng kàn yíxià hétong.", exampleMeaning: "Please take a look at the contract." },
  { hanzi: "付款", pinyin: "fùkuǎn", meaning: "to make a payment", example: "我们下周付款。", examplePinyin: "wǒmen xià zhōu fùkuǎn.", exampleMeaning: "We will make the payment next week." },
  { hanzi: "便宜", pinyin: "piányi", meaning: "inexpensive", example: "这个型号便宜一点。", examplePinyin: "zhège xínghào piányi yìdiǎn.", exampleMeaning: "This model is a little less expensive." },
  { hanzi: "欢迎", pinyin: "huānyíng", meaning: "to welcome", example: "欢迎来到我们公司。", examplePinyin: "huānyíng lái dào wǒmen gōngsī.", exampleMeaning: "Welcome to our company." },
  { hanzi: "感谢", pinyin: "gǎnxiè", meaning: "to thank; gratitude", example: "感谢您的帮助。", examplePinyin: "gǎnxiè nín de bāngzhù.", exampleMeaning: "Thank you for your help." },
  { hanzi: "建议", pinyin: "jiànyì", meaning: "suggestion; to suggest", example: "谢谢您的建议。", examplePinyin: "xièxie nín de jiànyì.", exampleMeaning: "Thank you for your suggestion." },
  { hanzi: "安排", pinyin: "ānpái", meaning: "to arrange", example: "我来安排会议。", examplePinyin: "wǒ lái ānpái huìyì.", exampleMeaning: "I will arrange the meeting." },
  { hanzi: "尽快", pinyin: "jǐnkuài", meaning: "as soon as possible", example: "我会尽快回复您。", examplePinyin: "wǒ huì jǐnkuài huífù nín.", exampleMeaning: "I will reply to you as soon as possible." },
  { hanzi: "提高", pinyin: "tígāo", meaning: "to improve; to raise", example: "我们想提高效率。", examplePinyin: "wǒmen xiǎng tígāo xiàolǜ.", exampleMeaning: "We want to improve efficiency." },
  { hanzi: "经验", pinyin: "jīngyàn", meaning: "experience", example: "她有很多工作经验。", examplePinyin: "tā yǒu hěn duō gōngzuò jīngyàn.", exampleMeaning: "She has a lot of work experience." },
];

function getLocalDayNumber(date: Date) {
  return Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000);
}

export default function WordOfTheDay() {
  const [dayNumber, setDayNumber] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [audioError, setAudioError] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const word = words[((dayNumber % words.length) + words.length) % words.length];
  const dateLabel = new Intl.DateTimeFormat("en", { month: "long", day: "numeric", timeZone: "UTC" }).format(new Date(dayNumber * 86_400_000));

  useEffect(() => {
    setDayNumber(getLocalDayNumber(new Date()));
  }, []);

  useEffect(() => () => {
    audioRef.current?.pause();
    window.speechSynthesis?.cancel();
  }, []);

  const playWord = () => {
    setAudioError("");
    audioRef.current?.pause();
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const voice = window.speechSynthesis.getVoices().find((item) => /^(zh-CN|zh-SG|zh-Hans|zh)$/i.test(item.lang));
      if (voice) {
        const utterance = new SpeechSynthesisUtterance(word.hanzi);
        utterance.lang = "zh-CN";
        utterance.rate = 0.8;
        utterance.voice = voice;
        utterance.onstart = () => setPlaying(true);
        utterance.onend = () => setPlaying(false);
        utterance.onerror = () => {
          setPlaying(false);
          setAudioError("Audio could not play. Try again or read the Pinyin aloud.");
        };
        window.speechSynthesis.speak(utterance);
        return;
      }
    }

    const audio = new Audio(`/api/pronunciation?text=${encodeURIComponent(word.hanzi)}`);
    audioRef.current = audio;
    audio.onplay = () => setPlaying(true);
    audio.onended = () => setPlaying(false);
    audio.onerror = () => {
      setPlaying(false);
      setAudioError("Audio could not load. Check your connection or read the Pinyin aloud.");
    };
    void audio.play().catch(() => {
      setPlaying(false);
      setAudioError("Audio could not play. Check your connection or read the Pinyin aloud.");
    });
  };

  return (
    <section className="phrase-card word-card" aria-labelledby="word-of-day-title">
      <div className="phrase-label"><span id="word-of-day-title">WORD OF THE DAY</span><span>{dateLabel.toUpperCase()}</span></div>
      <div className="word-of-day-main">
        <div>
          <p className="phrase-hanzi" lang="zh-Hans">{word.hanzi}</p>
          <p className="phrase-pinyin">{word.pinyin}</p>
          <p className="word-meaning">{word.meaning}</p>
        </div>
        <button className={`word-audio ${playing ? "word-audio-playing" : ""}`} onClick={playWord} aria-label={`Hear ${word.hanzi}, ${word.pinyin}`} title="Hear pronunciation">
          {playing ? "Playing…" : "Hear word"}
        </button>
      </div>
      <div className="word-example">
        <strong lang="zh-Hans">{word.example}</strong>
        <span>{word.examplePinyin}</span>
        <small>{word.exampleMeaning}</small>
      </div>
      {audioError && <p className="word-audio-error" role="status">{audioError}</p>}
    </section>
  );
}
