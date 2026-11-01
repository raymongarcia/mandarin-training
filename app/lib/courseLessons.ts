export type LessonPhrase = {
  hanzi: string;
  pinyin: string;
  meaning: string;
};

export type CourseLesson = {
  id: string;
  unit: number;
  number: number;
  title: string;
  focus: string;
  phrases: LessonPhrase[];
};

type LessonSeed = Omit<CourseLesson, "id">;

const lessonSeeds: LessonSeed[] = [
  { unit: 1, number: 1, title: "Your first Mandarin sounds", focus: "Greetings, introductions, Pinyin and tones.", phrases: [] },
  { unit: 1, number: 2, title: "Meeting someone new", focus: "Greet a new colleague, introduce yourself and make a good first impression.", phrases: [
    { hanzi: "您好", pinyin: "nín hǎo", meaning: "Hello (polite)" },
    { hanzi: "我叫…", pinyin: "wǒ jiào…", meaning: "My name is…" },
    { hanzi: "很高兴认识您", pinyin: "hěn gāo xìng rèn shi nín", meaning: "Pleased to meet you" },
  ] },
  { unit: 1, number: 3, title: "Where are you from?", focus: "Share where you are from and ask a new contact about their home.", phrases: [
    { hanzi: "您是哪国人？", pinyin: "nín shì nǎ guó rén?", meaning: "What country are you from?" },
    { hanzi: "我是菲律宾人", pinyin: "wǒ shì Fēilǜbīn rén", meaning: "I am Filipino" },
    { hanzi: "我来自马尼拉", pinyin: "wǒ lái zì Mǎnílā", meaning: "I am from Manila" },
  ] },
  { unit: 1, number: 4, title: "What do you do?", focus: "Introduce your role and ask about someone else's work.", phrases: [
    { hanzi: "您做什么工作？", pinyin: "nín zuò shénme gōngzuò?", meaning: "What work do you do?" },
    { hanzi: "我是经理", pinyin: "wǒ shì jīnglǐ", meaning: "I am a manager" },
    { hanzi: "我在公司工作", pinyin: "wǒ zài gōngsī gōngzuò", meaning: "I work at a company" },
  ] },
  { unit: 1, number: 5, title: "Names and business cards", focus: "Ask for a name and exchange contact details politely.", phrases: [
    { hanzi: "您贵姓？", pinyin: "nín guì xìng?", meaning: "May I ask your surname?" },
    { hanzi: "这是我的名片", pinyin: "zhè shì wǒ de míngpiàn", meaning: "This is my business card" },
    { hanzi: "请多关照", pinyin: "qǐng duō guānzhào", meaning: "I look forward to working with you" },
  ] },
  { unit: 1, number: 6, title: "Your first conversation", focus: "Bring greetings, introductions and polite phrases together.", phrases: [
    { hanzi: "您好，很高兴认识您", pinyin: "nín hǎo, hěn gāo xìng rèn shi nín", meaning: "Hello, pleased to meet you" },
    { hanzi: "我在一家贸易公司工作", pinyin: "wǒ zài yì jiā màoyì gōngsī gōngzuò", meaning: "I work at a trading company" },
    { hanzi: "这是我的名片", pinyin: "zhè shì wǒ de míngpiàn", meaning: "This is my business card" },
  ] },
  { unit: 2, number: 1, title: "Numbers at work", focus: "Recognize common numbers and share a phone number.", phrases: [
    { hanzi: "零，一，二，三", pinyin: "líng, yī, èr, sān", meaning: "Zero, one, two, three" },
    { hanzi: "我的电话号码是…", pinyin: "wǒ de diànhuà hàomǎ shì…", meaning: "My phone number is…" },
    { hanzi: "请再说一遍", pinyin: "qǐng zài shuō yí biàn", meaning: "Please say that one more time" },
  ] },
  { unit: 2, number: 2, title: "Counting people and things", focus: "Use simple measure words to talk about people and items.", phrases: [
    { hanzi: "一个人", pinyin: "yí ge rén", meaning: "One person" },
    { hanzi: "两位同事", pinyin: "liǎng wèi tóngshì", meaning: "Two colleagues" },
    { hanzi: "三份文件", pinyin: "sān fèn wénjiàn", meaning: "Three documents" },
  ] },
  { unit: 2, number: 3, title: "Days and dates", focus: "Say the day and ask when an appointment is.", phrases: [
    { hanzi: "今天星期几？", pinyin: "jīntiān xīngqī jǐ?", meaning: "What day is it today?" },
    { hanzi: "星期三", pinyin: "xīngqī sān", meaning: "Wednesday" },
    { hanzi: "今天是十月五号", pinyin: "jīntiān shì shí yuè wǔ hào", meaning: "Today is October fifth" },
  ] },
  { unit: 2, number: 4, title: "Telling the time", focus: "Ask the time and agree on a meeting hour.", phrases: [
    { hanzi: "现在几点？", pinyin: "xiànzài jǐ diǎn?", meaning: "What time is it now?" },
    { hanzi: "上午九点", pinyin: "shàngwǔ jiǔ diǎn", meaning: "Nine in the morning" },
    { hanzi: "我们十点见", pinyin: "wǒmen shí diǎn jiàn", meaning: "Let's meet at ten" },
  ] },
  { unit: 2, number: 5, title: "A typical workday", focus: "Describe a simple work routine and ask about someone else's.", phrases: [
    { hanzi: "我早上八点上班", pinyin: "wǒ zǎoshang bā diǎn shàngbān", meaning: "I start work at eight in the morning" },
    { hanzi: "我中午休息", pinyin: "wǒ zhōngwǔ xiūxi", meaning: "I take a break at noon" },
    { hanzi: "您几点下班？", pinyin: "nín jǐ diǎn xiàbān?", meaning: "What time do you finish work?" },
  ] },
  { unit: 2, number: 6, title: "Around the office", focus: "Find common rooms and ask where a colleague is.", phrases: [
    { hanzi: "会议室在哪里？", pinyin: "huìyìshì zài nǎlǐ?", meaning: "Where is the meeting room?" },
    { hanzi: "办公室在楼上", pinyin: "bàngōngshì zài lóushàng", meaning: "The office is upstairs" },
    { hanzi: "请跟我来", pinyin: "qǐng gēn wǒ lái", meaning: "Please come with me" },
  ] },
  { unit: 2, number: 7, title: "Getting around town", focus: "Ask for directions and understand a simple route.", phrases: [
    { hanzi: "地铁站怎么走？", pinyin: "dìtiězhàn zěnme zǒu?", meaning: "How do I get to the subway station?" },
    { hanzi: "一直往前走", pinyin: "yìzhí wǎng qián zǒu", meaning: "Go straight ahead" },
    { hanzi: "在路口右转", pinyin: "zài lùkǒu yòu zhuǎn", meaning: "Turn right at the intersection" },
  ] },
  { unit: 2, number: 8, title: "Making a plan", focus: "Suggest a time and confirm a simple plan.", phrases: [
    { hanzi: "您有时间吗？", pinyin: "nín yǒu shíjiān ma?", meaning: "Do you have time?" },
    { hanzi: "我们一起吃午饭吧", pinyin: "wǒmen yìqǐ chī wǔfàn ba", meaning: "Let's have lunch together" },
    { hanzi: "好，明天见", pinyin: "hǎo, míngtiān jiàn", meaning: "Sure, see you tomorrow" },
  ] },
  { unit: 3, number: 1, title: "Scheduling a meeting", focus: "Suggest a meeting time and check whether it works.", phrases: [
    { hanzi: "我们安排一个会议", pinyin: "wǒmen ānpái yí ge huìyì", meaning: "Let's schedule a meeting" },
    { hanzi: "周四上午可以吗？", pinyin: "zhōusì shàngwǔ kěyǐ ma?", meaning: "Does Thursday morning work?" },
    { hanzi: "这个时间很合适", pinyin: "zhège shíjiān hěn héshì", meaning: "This time works well" },
  ] },
  { unit: 3, number: 2, title: "Starting a meeting", focus: "Open a meeting, welcome everyone and introduce the agenda.", phrases: [
    { hanzi: "大家好，欢迎参加会议", pinyin: "dàjiā hǎo, huānyíng cānjiā huìyì", meaning: "Hello everyone, welcome to the meeting" },
    { hanzi: "今天我们讨论三个问题", pinyin: "jīntiān wǒmen tǎolùn sān ge wèntí", meaning: "Today we'll discuss three topics" },
    { hanzi: "我们开始吧", pinyin: "wǒmen kāishǐ ba", meaning: "Let's get started" },
  ] },
  { unit: 3, number: 3, title: "Sharing your opinion", focus: "State an opinion and give a simple reason.", phrases: [
    { hanzi: "我认为这个想法很好", pinyin: "wǒ rènwéi zhège xiǎngfǎ hěn hǎo", meaning: "I think this is a good idea" },
    { hanzi: "因为它很实用", pinyin: "yīnwèi tā hěn shíyòng", meaning: "Because it is practical" },
    { hanzi: "您怎么看？", pinyin: "nín zěnme kàn?", meaning: "What do you think?" },
  ] },
  { unit: 3, number: 4, title: "Agreeing and disagreeing politely", focus: "Respond diplomatically and offer another perspective.", phrases: [
    { hanzi: "我同意您的看法", pinyin: "wǒ tóngyì nín de kànfǎ", meaning: "I agree with your view" },
    { hanzi: "我理解您的意思", pinyin: "wǒ lǐjiě nín de yìsi", meaning: "I understand what you mean" },
    { hanzi: "我们也可以考虑这个方案", pinyin: "wǒmen yě kěyǐ kǎolǜ zhège fāng'àn", meaning: "We could also consider this option" },
  ] },
  { unit: 3, number: 5, title: "Explaining a project", focus: "Describe a project, its purpose and the team involved.", phrases: [
    { hanzi: "这个项目很重要", pinyin: "zhège xiàngmù hěn zhòngyào", meaning: "This project is important" },
    { hanzi: "我们的目标是提高效率", pinyin: "wǒmen de mùbiāo shì tígāo xiàolǜ", meaning: "Our goal is to improve efficiency" },
    { hanzi: "团队正在准备", pinyin: "tuánduì zhèngzài zhǔnbèi", meaning: "The team is preparing" },
  ] },
  { unit: 3, number: 6, title: "Sharing a progress update", focus: "Say what is done, what is in progress and where help is needed.", phrases: [
    { hanzi: "目前进展顺利", pinyin: "mùqián jìnzhǎn shùnlì", meaning: "Things are going smoothly so far" },
    { hanzi: "这部分已经完成", pinyin: "zhè bùfen yǐjīng wánchéng", meaning: "This part is already finished" },
    { hanzi: "我们还需要一些时间", pinyin: "wǒmen hái xūyào yìxiē shíjiān", meaning: "We still need some time" },
  ] },
  { unit: 3, number: 7, title: "Talking about deadlines", focus: "Confirm a deadline and communicate a possible delay.", phrases: [
    { hanzi: "截止日期是星期五", pinyin: "jiézhǐ rìqī shì xīngqīwǔ", meaning: "The deadline is Friday" },
    { hanzi: "我们会按时完成", pinyin: "wǒmen huì ànshí wánchéng", meaning: "We will finish on time" },
    { hanzi: "可能需要延期一天", pinyin: "kěnéng xūyào yánqī yì tiān", meaning: "We may need a one-day extension" },
  ] },
  { unit: 3, number: 8, title: "Wrapping up and following up", focus: "Summarize an agreement and confirm the next step.", phrases: [
    { hanzi: "我来总结一下", pinyin: "wǒ lái zǒngjié yíxià", meaning: "Let me summarize" },
    { hanzi: "我们下周再联系", pinyin: "wǒmen xià zhōu zài liánxì", meaning: "Let's reconnect next week" },
    { hanzi: "谢谢大家的时间", pinyin: "xièxie dàjiā de shíjiān", meaning: "Thank you everyone for your time" },
  ] },
  { unit: 4, number: 1, title: "Welcoming a client", focus: "Welcome a visitor and offer help when they arrive.", phrases: [
    { hanzi: "欢迎来到我们公司", pinyin: "huānyíng lái dào wǒmen gōngsī", meaning: "Welcome to our company" },
    { hanzi: "路上辛苦了", pinyin: "lùshang xīnkǔ le", meaning: "You must be tired from the trip" },
    { hanzi: "请坐，喝点茶吧", pinyin: "qǐng zuò, hē diǎn chá ba", meaning: "Please sit and have some tea" },
  ] },
  { unit: 4, number: 2, title: "Understanding client needs", focus: "Ask what a client needs and listen for their priorities.", phrases: [
    { hanzi: "您需要什么帮助？", pinyin: "nín xūyào shénme bāngzhù?", meaning: "What help do you need?" },
    { hanzi: "您最关心什么？", pinyin: "nín zuì guānxīn shénme?", meaning: "What matters most to you?" },
    { hanzi: "我明白您的需求", pinyin: "wǒ míngbai nín de xūqiú", meaning: "I understand your needs" },
  ] },
  { unit: 4, number: 3, title: "Introducing your company", focus: "Give a short overview of your company and its experience.", phrases: [
    { hanzi: "我们是一家科技公司", pinyin: "wǒmen shì yì jiā kējì gōngsī", meaning: "We are a technology company" },
    { hanzi: "我们有十年的经验", pinyin: "wǒmen yǒu shí nián de jīngyàn", meaning: "We have ten years of experience" },
    { hanzi: "我们的团队在马尼拉", pinyin: "wǒmen de tuánduì zài Mǎnílā", meaning: "Our team is in Manila" },
  ] },
  { unit: 4, number: 4, title: "Presenting a service", focus: "Explain what a service includes and how it can help.", phrases: [
    { hanzi: "我们提供技术支持", pinyin: "wǒmen tígōng jìshù zhīchí", meaning: "We provide technical support" },
    { hanzi: "这个服务很灵活", pinyin: "zhège fúwù hěn línghuó", meaning: "This service is flexible" },
    { hanzi: "我们可以为您定制", pinyin: "wǒmen kěyǐ wèi nín dìngzhì", meaning: "We can customize it for you" },
  ] },
  { unit: 4, number: 5, title: "Discussing goals and priorities", focus: "Ask about business goals and identify the most urgent priority.", phrases: [
    { hanzi: "您的主要目标是什么？", pinyin: "nín de zhǔyào mùbiāo shì shénme?", meaning: "What is your main goal?" },
    { hanzi: "我们希望降低成本", pinyin: "wǒmen xīwàng jiàngdī chéngběn", meaning: "We hope to reduce costs" },
    { hanzi: "质量是我们的首要任务", pinyin: "zhìliàng shì wǒmen de shǒuyào rènwu", meaning: "Quality is our top priority" },
  ] },
  { unit: 4, number: 6, title: "Talking through a proposal", focus: "Present a proposal, explain its value and invite questions.", phrases: [
    { hanzi: "这是我们的方案", pinyin: "zhè shì wǒmen de fāng'àn", meaning: "This is our proposal" },
    { hanzi: "它可以节省时间", pinyin: "tā kěyǐ jiéshěng shíjiān", meaning: "It can save time" },
    { hanzi: "您有什么问题吗？", pinyin: "nín yǒu shénme wèntí ma?", meaning: "Do you have any questions?" },
  ] },
  { unit: 4, number: 7, title: "Clarifying requirements", focus: "Confirm details and ask for clarification when something is unclear.", phrases: [
    { hanzi: "请问您需要多少？", pinyin: "qǐngwèn nín xūyào duōshao?", meaning: "May I ask how much you need?" },
    { hanzi: "您可以再解释一下吗？", pinyin: "nín kěyǐ zài jiěshì yíxià ma?", meaning: "Could you explain that again?" },
    { hanzi: "我确认一下细节", pinyin: "wǒ quèrèn yíxià xìjié", meaning: "Let me confirm the details" },
  ] },
  { unit: 4, number: 8, title: "Hosting a business meal", focus: "Make a polite invitation and talk about food preferences.", phrases: [
    { hanzi: "您喜欢吃什么？", pinyin: "nín xǐhuan chī shénme?", meaning: "What do you like to eat?" },
    { hanzi: "这家餐厅很有名", pinyin: "zhè jiā cāntīng hěn yǒumíng", meaning: "This restaurant is well known" },
    { hanzi: "请尝尝这个菜", pinyin: "qǐng chángchang zhège cài", meaning: "Please try this dish" },
  ] },
  { unit: 4, number: 9, title: "Building a business relationship", focus: "Express appreciation and show interest in working together.", phrases: [
    { hanzi: "感谢您的信任", pinyin: "gǎnxiè nín de xìnrèn", meaning: "Thank you for your trust" },
    { hanzi: "我们很重视这次合作", pinyin: "wǒmen hěn zhòngshì zhè cì hézuò", meaning: "We value this collaboration" },
    { hanzi: "希望以后有更多合作", pinyin: "xīwàng yǐhòu yǒu gèng duō hézuò", meaning: "I hope we can work together more in the future" },
  ] },
  { unit: 4, number: 10, title: "Following up with a client", focus: "Thank a client, recap the conversation and arrange a follow-up.", phrases: [
    { hanzi: "感谢今天的会面", pinyin: "gǎnxiè jīntiān de huìmiàn", meaning: "Thank you for meeting today" },
    { hanzi: "我会发邮件给您", pinyin: "wǒ huì fā yóujiàn gěi nín", meaning: "I will send you an email" },
    { hanzi: "下周我们再讨论", pinyin: "xià zhōu wǒmen zài tǎolùn", meaning: "Let's discuss it again next week" },
  ] },
  { unit: 5, number: 1, title: "Identifying a product", focus: "Ask about a product, its specifications and available models.", phrases: [
    { hanzi: "您需要哪种产品？", pinyin: "nín xūyào nǎ zhǒng chǎnpǐn?", meaning: "Which kind of product do you need?" },
    { hanzi: "这个型号很受欢迎", pinyin: "zhège xínghào hěn shòu huānyíng", meaning: "This model is very popular" },
    { hanzi: "请看产品目录", pinyin: "qǐng kàn chǎnpǐn mùlù", meaning: "Please look at the product catalog" },
  ] },
  { unit: 5, number: 2, title: "Requesting a quotation", focus: "Ask for a quotation and confirm which details it should include.", phrases: [
    { hanzi: "请给我们一份报价", pinyin: "qǐng gěi wǒmen yí fèn bàojià", meaning: "Please give us a quotation" },
    { hanzi: "价格包括运费吗？", pinyin: "jiàgé bāokuò yùnfèi ma?", meaning: "Does the price include shipping?" },
    { hanzi: "报价什么时候有效？", pinyin: "bàojià shénme shíhou yǒuxiào?", meaning: "How long is the quotation valid?" },
  ] },
  { unit: 5, number: 3, title: "Discussing order quantities", focus: "Confirm order quantities and ask about a minimum order.", phrases: [
    { hanzi: "我们想订购五百件", pinyin: "wǒmen xiǎng dìnggòu wǔbǎi jiàn", meaning: "We would like to order 500 pieces" },
    { hanzi: "最小订单是多少？", pinyin: "zuìxiǎo dìngdān shì duōshao?", meaning: "What is the minimum order?" },
    { hanzi: "数量可以增加吗？", pinyin: "shùliàng kěyǐ zēngjiā ma?", meaning: "Can the quantity be increased?" },
  ] },
  { unit: 5, number: 4, title: "Negotiating a price", focus: "Discuss a target price and ask whether there is room to negotiate.", phrases: [
    { hanzi: "这个价格有点高", pinyin: "zhège jiàgé yǒudiǎn gāo", meaning: "This price is a little high" },
    { hanzi: "可以再便宜一点吗？", pinyin: "kěyǐ zài piányi yìdiǎn ma?", meaning: "Could it be a little cheaper?" },
    { hanzi: "这是我们的目标价格", pinyin: "zhè shì wǒmen de mùbiāo jiàgé", meaning: "This is our target price" },
  ] },
  { unit: 5, number: 5, title: "Asking about a discount", focus: "Ask about volume discounts and agree on revised pricing.", phrases: [
    { hanzi: "大量订购有折扣吗？", pinyin: "dàliàng dìnggòu yǒu zhékòu ma?", meaning: "Is there a discount for a large order?" },
    { hanzi: "我们可以给您优惠", pinyin: "wǒmen kěyǐ gěi nín yōuhuì", meaning: "We can offer you a better price" },
    { hanzi: "请发一份新的报价", pinyin: "qǐng fā yí fèn xīn de bàojià", meaning: "Please send a new quotation" },
  ] },
  { unit: 5, number: 6, title: "Confirming delivery dates", focus: "Ask when an order will ship and confirm the delivery address.", phrases: [
    { hanzi: "什么时候可以发货？", pinyin: "shénme shíhou kěyǐ fāhuò?", meaning: "When can you ship the order?" },
    { hanzi: "交货日期是下个月", pinyin: "jiāohuò rìqī shì xià ge yuè", meaning: "The delivery date is next month" },
    { hanzi: "请确认收货地址", pinyin: "qǐng quèrèn shōuhuò dìzhǐ", meaning: "Please confirm the delivery address" },
  ] },
  { unit: 5, number: 7, title: "Checking quality", focus: "Discuss a sample and ask how quality is inspected.", phrases: [
    { hanzi: "我们需要先看样品", pinyin: "wǒmen xūyào xiān kàn yàngpǐn", meaning: "We need to see a sample first" },
    { hanzi: "质量检查什么时候进行？", pinyin: "zhìliàng jiǎnchá shénme shíhou jìnxíng?", meaning: "When will the quality inspection take place?" },
    { hanzi: "请提供检验报告", pinyin: "qǐng tígōng jiǎnyàn bàogào", meaning: "Please provide the inspection report" },
  ] },
  { unit: 5, number: 8, title: "Agreeing on payment terms", focus: "Ask about payment methods and confirm the agreed terms.", phrases: [
    { hanzi: "付款方式是什么？", pinyin: "fùkuǎn fāngshì shì shénme?", meaning: "What is the payment method?" },
    { hanzi: "我们可以分期付款", pinyin: "wǒmen kěyǐ fēnqī fùkuǎn", meaning: "We can pay in installments" },
    { hanzi: "请把合同发给我", pinyin: "qǐng bǎ hétong fā gěi wǒ", meaning: "Please send me the contract" },
  ] },
  { unit: 6, number: 1, title: "Practice: a networking introduction", focus: "Use greetings, a job title and a business-card exchange in a networking scene.", phrases: [
    { hanzi: "您好，我叫 Alex", pinyin: "nín hǎo, wǒ jiào Alex", meaning: "Hello, my name is Alex" },
    { hanzi: "我是一名工程师", pinyin: "wǒ shì yì míng gōngchéngshī", meaning: "I am an engineer" },
    { hanzi: "这是我的名片", pinyin: "zhè shì wǒ de míngpiàn", meaning: "This is my business card" },
  ] },
  { unit: 6, number: 2, title: "Practice: a day at the office", focus: "Combine office directions, meeting times and routine phrases.", phrases: [
    { hanzi: "会议室在楼上", pinyin: "huìyìshì zài lóushàng", meaning: "The meeting room is upstairs" },
    { hanzi: "我们九点开始", pinyin: "wǒmen jiǔ diǎn kāishǐ", meaning: "We start at nine" },
    { hanzi: "请跟我来", pinyin: "qǐng gēn wǒ lái", meaning: "Please come with me" },
  ] },
  { unit: 6, number: 3, title: "Practice: a team meeting", focus: "Schedule a meeting, share a view and summarize the next step.", phrases: [
    { hanzi: "我认为这个想法很好", pinyin: "wǒ rènwéi zhège xiǎngfǎ hěn hǎo", meaning: "I think this is a good idea" },
    { hanzi: "目前进展顺利", pinyin: "mùqián jìnzhǎn shùnlì", meaning: "Things are going smoothly so far" },
    { hanzi: "我们下周再联系", pinyin: "wǒmen xià zhōu zài liánxì", meaning: "Let's reconnect next week" },
  ] },
  { unit: 6, number: 4, title: "Practice: a client presentation", focus: "Welcome a client, explain your service and check their goals.", phrases: [
    { hanzi: "欢迎来到我们公司", pinyin: "huānyíng lái dào wǒmen gōngsī", meaning: "Welcome to our company" },
    { hanzi: "我们提供技术支持", pinyin: "wǒmen tígōng jìshù zhīchí", meaning: "We provide technical support" },
    { hanzi: "您的主要目标是什么？", pinyin: "nín de zhǔyào mùbiāo shì shénme?", meaning: "What is your main goal?" },
  ] },
  { unit: 6, number: 5, title: "Practice: a supplier negotiation", focus: "Discuss quantity, price and delivery with a supplier.", phrases: [
    { hanzi: "我们想订购五百件", pinyin: "wǒmen xiǎng dìnggòu wǔbǎi jiàn", meaning: "We would like to order 500 pieces" },
    { hanzi: "可以再便宜一点吗？", pinyin: "kěyǐ zài piányi yìdiǎn ma?", meaning: "Could it be a little cheaper?" },
    { hanzi: "交货日期是下个月", pinyin: "jiāohuò rìqī shì xià ge yuè", meaning: "The delivery date is next month" },
  ] },
  { unit: 6, number: 6, title: "Final review: ready for work", focus: "Review essential phrases and choose the right response in workplace situations.", phrases: [
    { hanzi: "请再说一遍", pinyin: "qǐng zài shuō yí biàn", meaning: "Please say that one more time" },
    { hanzi: "我明白您的意思", pinyin: "wǒ míngbai nín de yìsi", meaning: "I understand what you mean" },
    { hanzi: "感谢您的信任", pinyin: "gǎnxiè nín de xìnrèn", meaning: "Thank you for your trust" },
  ] },
];

export const courseLessons: CourseLesson[] = lessonSeeds.map((lesson) => ({
  ...lesson,
  id: `unit-${String(lesson.unit).padStart(2, "0")}-lesson-${String(lesson.number).padStart(2, "0")}`,
}));

export const courseUnits = [
  { number: "01", title: "Your first conversations", detail: "Greetings, introductions & tones", color: "coral" },
  { number: "02", title: "Everyday work talk", detail: "Numbers, time & daily routines", color: "blue" },
  { number: "03", title: "Meetings & collaboration", detail: "Opinions, plans & follow-ups", color: "yellow" },
  { number: "04", title: "Clients & partnerships", detail: "Build trust and talk business", color: "lavender" },
  { number: "05", title: "Suppliers & negotiation", detail: "Orders, pricing & delivery", color: "green" },
  { number: "06", title: "Put it into practice", detail: "Real-world conversations & review", color: "peach" },
].map((unit) => ({
  ...unit,
  lessons: courseLessons.filter((lesson) => lesson.unit === Number(unit.number)).length,
}));
