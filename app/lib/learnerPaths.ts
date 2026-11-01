import { courseLessons, courseUnits, type CourseLesson } from "./courseLessons";

export type LearnerPath = "kids" | "casual" | "business";

type PathLessonSeed = Omit<CourseLesson, "id" | "audience">;

export const learnerPathOptions: {
  id: LearnerPath;
  title: string;
  description: string;
  courseTitle: string;
  courseHeading: string;
  courseNote: string;
  welcomeCopy: string;
  weeklyTarget: string;
  weeklyGoalSeconds: number;
  duration: string;
  goals: { title: string; time: string }[];
  icon: string;
}[] = [
  {
    id: "kids",
    title: "Kids & families",
    description: "Playful, bite-sized practice to enjoy together with a grown-up.",
    courseTitle: "Mandarin for Kids",
    courseHeading: "Hello, colors, animals & more.",
    courseNote: "A playful first step into Mandarin. Learn together, repeat often, and celebrate every new word.",
    welcomeCopy: "Learn fun first words and phrases together, one little step at a time.",
    weeklyTarget: "1–2 hours",
    weeklyGoalSeconds: 2 * 60 * 60,
    duration: "5–10 min",
    goals: [
      { title: "Look at three new words", time: "2 min" },
      { title: "Say a phrase together", time: "3 min" },
      { title: "Pick the matching meaning", time: "2 min" },
    ],
    icon: "童",
  },
  {
    id: "casual",
    title: "Casual learner",
    description: "Useful Mandarin for everyday chats, food, travel, and daily life.",
    courseTitle: "Everyday Mandarin",
    courseHeading: "From nǐ hǎo to everyday chats.",
    courseNote: "A relaxed path through useful everyday conversations. Go at your own pace and practice what you can use today.",
    welcomeCopy: "Pick up useful Mandarin for everyday conversations, at your own pace.",
    weeklyTarget: "3–5 hours",
    weeklyGoalSeconds: 5 * 60 * 60,
    duration: "10–15 min",
    goals: [
      { title: "Learn three useful phrases", time: "5 min" },
      { title: "Practice saying them aloud", time: "5 min" },
      { title: "Try a quick review", time: "5 min" },
    ],
    icon: "日",
  },
  {
    id: "business",
    title: "Business learner",
    description: "Professional Mandarin for workplace and client conversations.",
    courseTitle: "Business Mandarin",
    courseHeading: "From hello to let’s work together.",
    courseNote: "A practical path from zero to everyday business communication. Progress at your own pace—fluency takes time, and every lesson counts.",
    welcomeCopy: "Build real-world confidence for the conversations that matter at work.",
    weeklyTarget: "7–10 hours",
    weeklyGoalSeconds: 10 * 60 * 60,
    duration: "15 min",
    goals: [
      { title: "Meet your first tones", time: "20 min" },
      { title: "Say hello & introduce yourself", time: "20 min" },
      { title: "Practice & review aloud", time: "20 min" },
    ],
    icon: "商",
  },
];

export const learnerPathById = Object.fromEntries(
  learnerPathOptions.map((option) => [option.id, option]),
) as Record<LearnerPath, (typeof learnerPathOptions)[number]>;

export function isLearnerPath(value: unknown): value is LearnerPath {
  return value === "kids" || value === "casual" || value === "business";
}

const kidsLessonSeeds: PathLessonSeed[] = [
  { unit: 1, number: 1, title: "Say hello!", focus: "Wave hello, say good morning, and say goodbye.", phrases: [
    { hanzi: "你好", pinyin: "nǐ hǎo", meaning: "Hello" },
    { hanzi: "早上好", pinyin: "zǎoshang hǎo", meaning: "Good morning" },
    { hanzi: "再见", pinyin: "zàijiàn", meaning: "Goodbye" },
  ] },
  { unit: 1, number: 2, title: "What is your name?", focus: "Practice sharing your name and asking a new friend theirs.", phrases: [
    { hanzi: "我叫……", pinyin: "wǒ jiào…", meaning: "My name is…" },
    { hanzi: "你叫什么名字？", pinyin: "nǐ jiào shénme míngzi?", meaning: "What is your name?" },
    { hanzi: "很高兴认识你", pinyin: "hěn gāoxìng rènshi nǐ", meaning: "Nice to meet you" },
  ] },
  { unit: 1, number: 3, title: "How are you feeling?", focus: "Use a few easy phrases to share how you feel.", phrases: [
    { hanzi: "我很好", pinyin: "wǒ hěn hǎo", meaning: "I am well" },
    { hanzi: "我很开心", pinyin: "wǒ hěn kāixīn", meaning: "I am happy" },
    { hanzi: "你呢？", pinyin: "nǐ ne?", meaning: "And you?" },
  ] },
  { unit: 2, number: 1, title: "My family", focus: "Name the people who make up a family.", phrases: [
    { hanzi: "妈妈", pinyin: "māma", meaning: "Mom" },
    { hanzi: "爸爸", pinyin: "bàba", meaning: "Dad" },
    { hanzi: "这是我家", pinyin: "zhè shì wǒ jiā", meaning: "This is my family" },
  ] },
  { unit: 2, number: 2, title: "Animal friends", focus: "Meet a couple of familiar animals and say which you like.", phrases: [
    { hanzi: "小猫", pinyin: "xiǎo māo", meaning: "Kitten" },
    { hanzi: "小狗", pinyin: "xiǎo gǒu", meaning: "Puppy" },
    { hanzi: "我喜欢小猫", pinyin: "wǒ xǐhuan xiǎo māo", meaning: "I like kittens" },
  ] },
  { unit: 2, number: 3, title: "Colors all around", focus: "Notice bright colors in the things around you.", phrases: [
    { hanzi: "红色", pinyin: "hóngsè", meaning: "Red" },
    { hanzi: "蓝色", pinyin: "lánsè", meaning: "Blue" },
    { hanzi: "这是黄色", pinyin: "zhè shì huángsè", meaning: "This is yellow" },
  ] },
  { unit: 3, number: 1, title: "A little snack", focus: "Name a tasty fruit and ask for a drink.", phrases: [
    { hanzi: "苹果", pinyin: "píngguǒ", meaning: "Apple" },
    { hanzi: "我想吃苹果", pinyin: "wǒ xiǎng chī píngguǒ", meaning: "I want to eat an apple" },
    { hanzi: "我想喝水", pinyin: "wǒ xiǎng hē shuǐ", meaning: "I want to drink water" },
  ] },
  { unit: 3, number: 2, title: "Let’s play!", focus: "Invite someone to play and choose a favorite game.", phrases: [
    { hanzi: "我们一起玩吧", pinyin: "wǒmen yìqǐ wán ba", meaning: "Let’s play together" },
    { hanzi: "你喜欢什么？", pinyin: "nǐ xǐhuan shénme?", meaning: "What do you like?" },
    { hanzi: "我喜欢画画", pinyin: "wǒ xǐhuan huàhuà", meaning: "I like drawing" },
  ] },
  { unit: 3, number: 3, title: "Count to three", focus: "Count together, then celebrate finishing your first mini-course.", phrases: [
    { hanzi: "一，二，三", pinyin: "yī, èr, sān", meaning: "One, two, three" },
    { hanzi: "我会说中文", pinyin: "wǒ huì shuō Zhōngwén", meaning: "I can speak Chinese" },
    { hanzi: "太棒了！", pinyin: "tài bàng le!", meaning: "Wonderful!" },
  ] },
];

const casualLessonSeeds: PathLessonSeed[] = [
  { unit: 1, number: 1, title: "Everyday greetings", focus: "Greet someone and choose a phrase that fits the time of day.", phrases: [
    { hanzi: "你好", pinyin: "nǐ hǎo", meaning: "Hello" },
    { hanzi: "早上好", pinyin: "zǎoshang hǎo", meaning: "Good morning" },
    { hanzi: "再见", pinyin: "zàijiàn", meaning: "Goodbye" },
  ] },
  { unit: 1, number: 2, title: "Introduce yourself", focus: "Share your name and ask someone else what they are called.", phrases: [
    { hanzi: "我叫……", pinyin: "wǒ jiào…", meaning: "My name is…" },
    { hanzi: "你叫什么名字？", pinyin: "nǐ jiào shénme míngzi?", meaning: "What is your name?" },
    { hanzi: "很高兴认识你", pinyin: "hěn gāoxìng rènshi nǐ", meaning: "Nice to meet you" },
  ] },
  { unit: 1, number: 3, title: "How’s it going?", focus: "Ask how someone is and give a simple answer.", phrases: [
    { hanzi: "你好吗？", pinyin: "nǐ hǎo ma?", meaning: "How are you?" },
    { hanzi: "我很好", pinyin: "wǒ hěn hǎo", meaning: "I’m doing well" },
    { hanzi: "还不错", pinyin: "hái búcuò", meaning: "Not bad" },
  ] },
  { unit: 2, number: 1, title: "Order a drink", focus: "Ask for a drink and say what you would like.", phrases: [
    { hanzi: "我想喝咖啡", pinyin: "wǒ xiǎng hē kāfēi", meaning: "I’d like to drink coffee" },
    { hanzi: "请给我一杯茶", pinyin: "qǐng gěi wǒ yì bēi chá", meaning: "Please give me a cup of tea" },
    { hanzi: "谢谢", pinyin: "xièxie", meaning: "Thank you" },
  ] },
  { unit: 2, number: 2, title: "At a restaurant", focus: "Find a table, order a favorite dish, and ask for the bill.", phrases: [
    { hanzi: "请给我菜单", pinyin: "qǐng gěi wǒ càidān", meaning: "Please give me the menu" },
    { hanzi: "这个很好吃", pinyin: "zhège hěn hǎochī", meaning: "This is delicious" },
    { hanzi: "请买单", pinyin: "qǐng mǎidān", meaning: "The bill, please" },
  ] },
  { unit: 2, number: 3, title: "Shopping for something", focus: "Ask about the price and say whether you like something.", phrases: [
    { hanzi: "这个多少钱？", pinyin: "zhège duōshao qián?", meaning: "How much is this?" },
    { hanzi: "太贵了", pinyin: "tài guì le", meaning: "It’s too expensive" },
    { hanzi: "我喜欢这个", pinyin: "wǒ xǐhuan zhège", meaning: "I like this one" },
  ] },
  { unit: 3, number: 1, title: "Find your way", focus: "Ask where a place is and understand a simple direction.", phrases: [
    { hanzi: "洗手间在哪里？", pinyin: "xǐshǒujiān zài nǎlǐ?", meaning: "Where is the restroom?" },
    { hanzi: "在那边", pinyin: "zài nàbiān", meaning: "It’s over there" },
    { hanzi: "请往左走", pinyin: "qǐng wǎng zuǒ zǒu", meaning: "Please go left" },
  ] },
  { unit: 3, number: 2, title: "Getting around", focus: "Ask for a taxi and tell the driver where you are going.", phrases: [
    { hanzi: "请帮我叫一辆出租车", pinyin: "qǐng bāng wǒ jiào yí liàng chūzūchē", meaning: "Please call a taxi for me" },
    { hanzi: "去火车站", pinyin: "qù huǒchēzhàn", meaning: "Go to the train station" },
    { hanzi: "请在这里停", pinyin: "qǐng zài zhèlǐ tíng", meaning: "Please stop here" },
  ] },
  { unit: 3, number: 3, title: "Make a simple plan", focus: "Suggest meeting up, agree on a time, and say see you soon.", phrases: [
    { hanzi: "你有时间吗？", pinyin: "nǐ yǒu shíjiān ma?", meaning: "Are you free?" },
    { hanzi: "我们明天见吧", pinyin: "wǒmen míngtiān jiàn ba", meaning: "Let’s meet tomorrow" },
    { hanzi: "到时候见", pinyin: "dào shíhou jiàn", meaning: "See you then" },
  ] },
];

function buildPathLessons(path: LearnerPath, seeds: PathLessonSeed[]): CourseLesson[] {
  return seeds.map((lesson) => ({
    ...lesson,
    audience: path,
    id: `${path}-unit-${String(lesson.unit).padStart(2, "0")}-lesson-${String(lesson.number).padStart(2, "0")}`,
  }));
}

function buildUnits(
  lessons: CourseLesson[],
  definitions: { title: string; detail: string; color: string }[],
) {
  return definitions.map((unit, index) => {
    const number = index + 1;
    return {
      number: String(number).padStart(2, "0"),
      ...unit,
      lessons: lessons.filter((lesson) => lesson.unit === number).length,
    };
  });
}

const kidsLessons = buildPathLessons("kids", kidsLessonSeeds);
const casualLessons = buildPathLessons("casual", casualLessonSeeds);

export const courseCatalogs: Record<LearnerPath, { lessons: CourseLesson[]; units: ReturnType<typeof buildUnits> }> = {
  kids: {
    lessons: kidsLessons,
    units: buildUnits(kidsLessons, [
      { title: "Hello & feelings", detail: "Greetings, names & emotions", color: "coral" },
      { title: "My little world", detail: "Family, animals & colors", color: "blue" },
      { title: "Eat, play & explore", detail: "Food, fun & first numbers", color: "yellow" },
    ]),
  },
  casual: {
    lessons: casualLessons,
    units: buildUnits(casualLessons, [
      { title: "Meet & greet", detail: "Greetings, names & small talk", color: "coral" },
      { title: "Food & outings", detail: "Drinks, meals & shopping", color: "blue" },
      { title: "Out and about", detail: "Directions, rides & plans", color: "yellow" },
    ]),
  },
  business: { lessons: courseLessons, units: courseUnits },
};

export function getCourseLessonCount(lessons: CourseLesson[], completedLessonIds: string[]) {
  const completed = new Set(completedLessonIds);
  return lessons.filter((lesson) => completed.has(lesson.id)).length;
}
