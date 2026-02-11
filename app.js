/* ============================================================
   Ramadan Q&A — app.js
   Single-namespace, modular vanilla JS game engine.
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Constants ---------- */
  var QUESTIONS_PER_GAME = 10;
  var PER_QUESTION_SECONDS = 20;
  var LEADERBOARD_LIMIT = 50;

  /* ---------- i18n Dictionary ---------- */
  var I18N = {
    appTitle: { ar: 'أسئلة رمضان', en: 'Ramadan Q&A' },
    appSubtitle: { ar: 'اختبر معلوماتك', en: 'Test your knowledge' },
    yourName: { ar: 'اسمك', en: 'Your Name' },
    namePlaceholder: { ar: 'أدخل اسمك...', en: 'Enter your name...' },
    nameError: { ar: 'الاسم يجب أن يكون بين 3 و 16 حرفاً', en: 'Name must be 3–16 characters' },
    language: { ar: 'اللغة', en: 'Language' },
    difficulty: { ar: 'المستوى', en: 'Difficulty' },
    easy: { ar: 'سهل', en: 'Easy' },
    medium: { ar: 'متوسط', en: 'Medium' },
    hard: { ar: 'صعب', en: 'Hard' },
    mixed: { ar: 'مختلط', en: 'Mixed' },
    timerMode: { ar: 'نوع المؤقت', en: 'Timer Mode' },
    totalTimer: { ar: 'مؤقت إجمالي', en: 'Total Timer' },
    perQuestion: { ar: 'لكل سؤال', en: 'Per Question' },
    startQuiz: { ar: 'ابدأ الاختبار', en: 'Start Quiz' },
    viewLeaderboard: { ar: 'لوحة المتصدرين', en: 'View Leaderboard' },
    next: { ar: 'التالي', en: 'Next' },
    correct: { ar: 'صحيح!', en: 'Correct!' },
    incorrect: { ar: 'خطأ!', en: 'Incorrect!' },
    timeUp: { ar: 'انتهى الوقت!', en: "Time's up!" },
    quizComplete: { ar: 'انتهى الاختبار!', en: 'Quiz Complete!' },
    correctLabel: { ar: 'صحيح', en: 'Correct' },
    timeLabel: { ar: 'الوقت', en: 'Time' },
    accuracyLabel: { ar: 'الدقة', en: 'Accuracy' },
    rankText: { ar: 'ترتيبك #{rank}', en: 'You placed #{rank}' },
    playAgain: { ar: 'العب مجدداً', en: 'Play Again' },
    reviewAnswers: { ar: 'مراجعة الإجابات', en: 'Review Answers' },
    yourAnswer: { ar: 'إجابتك', en: 'Your answer' },
    correctAnswer: { ar: 'الإجابة الصحيحة', en: 'Correct answer' },
    explanation: { ar: 'التوضيح', en: 'Explanation' },
    noAnswer: { ar: 'لم تجب', en: 'No answer' },
    leaderboard: { ar: 'لوحة المتصدرين', en: 'Leaderboard' },
    all: { ar: 'الكل', en: 'All' },
    total: { ar: 'إجمالي', en: 'Total' },
    perQ: { ar: 'لكل سؤال', en: 'Per Q' },
    resetLeaderboard: { ar: 'إعادة تعيين', en: 'Reset Leaderboard' },
    resetConfirmTitle: { ar: 'إعادة تعيين؟', en: 'Reset Leaderboard?' },
    resetConfirmBody: { ar: 'سيتم حذف جميع النتائج المحفوظة. لا يمكن التراجع عن هذا الإجراء.', en: 'This will delete all saved scores. This action cannot be undone.' },
    cancel: { ar: 'إلغاء', en: 'Cancel' },
    reset: { ar: 'إعادة تعيين', en: 'Reset' },
    emptyLeaderboard: { ar: 'لا توجد نتائج بعد. العب لتسجيل نتيجتك!', en: 'No scores yet. Play a game to get on the board!' },
    closeGame: { ar: 'إغلاق', en: 'Close' },
    filterDifficulty: { ar: 'المستوى', en: 'Difficulty' },
    filterTimer: { ar: 'المؤقت', en: 'Timer' },
    finishQuiz: { ar: 'إنهاء', en: 'Finish' },
    category_fasting: { ar: 'الصيام', en: 'Fasting' },
    category_quran: { ar: 'القرآن', en: 'Quran' },
    category_history: { ar: 'التاريخ', en: 'History' },
    category_culture: { ar: 'الثقافة', en: 'Culture' },
    category_general: { ar: 'معلومات عامة', en: 'General' },
    category_charity: { ar: 'الزكاة والصدقة', en: 'Charity' },
    category_prayer: { ar: 'الصلاة', en: 'Prayer' },
    category_etiquette: { ar: 'آداب', en: 'Etiquette' },
    hint: { ar: 'تلميح', en: 'Hint' },
    showHint: { ar: 'إظهار التلميح', en: 'Show Hint' },
    hideHint: { ar: 'إخفاء التلميح', en: 'Hide Hint' }
  };

  /* ---------- Questions Bank (60+) ---------- */
  var QUESTIONS = [
    // ── Fasting (1) ──
    { id: 'q1', category: 'fasting', difficulty: 1, question: { ar: 'ما هو الشهر الذي يصوم فيه المسلمون؟', en: 'In which month do Muslims fast?' }, options: [{ ar: 'رمضان', en: 'Ramadan' }, { ar: 'شعبان', en: 'Shaban' }, { ar: 'محرم', en: 'Muharram' }, { ar: 'ذو الحجة', en: 'Dhul Hijjah' }], correctIndex: 0, explanation: { ar: 'رمضان هو الشهر التاسع في التقويم الهجري ويصوم فيه المسلمون من الفجر حتى المغرب.', en: 'Ramadan is the ninth month of the Islamic calendar; Muslims fast from dawn to sunset.' } },
    { id: 'q2', category: 'fasting', difficulty: 1, question: { ar: 'ماذا تسمى وجبة ما قبل الفجر في رمضان؟', en: 'What is the pre-dawn meal in Ramadan called?' }, options: [{ ar: 'السحور', en: 'Suhoor' }, { ar: 'الإفطار', en: 'Iftar' }, { ar: 'الغداء', en: 'Lunch' }, { ar: 'العشاء', en: 'Dinner' }], correctIndex: 0, explanation: { ar: 'السحور هو الوجبة التي يتناولها المسلم قبل الفجر استعداداً للصيام.', en: 'Suhoor is the meal eaten before dawn to prepare for the day of fasting.' } },
    { id: 'q3', category: 'fasting', difficulty: 1, question: { ar: 'ماذا تسمى وجبة كسر الصيام عند غروب الشمس؟', en: 'What is the meal to break the fast at sunset called?' }, options: [{ ar: 'الإفطار', en: 'Iftar' }, { ar: 'السحور', en: 'Suhoor' }, { ar: 'الوليمة', en: 'Feast' }, { ar: 'القرقيعان', en: 'Gergean' }], correctIndex: 0, explanation: { ar: 'الإفطار هو الوجبة التي يتناولها الصائم عند غروب الشمس لكسر صيامه.', en: 'Iftar is the meal eaten at sunset to break the fast.' } },
    { id: 'q4', category: 'fasting', difficulty: 2, question: { ar: 'ما هو الطعام الذي يُستحب كسر الصيام به؟', en: 'What food is recommended to break the fast with?' }, options: [{ ar: 'التمر', en: 'Dates' }, { ar: 'الأرز', en: 'Rice' }, { ar: 'الخبز', en: 'Bread' }, { ar: 'اللحم', en: 'Meat' }], correctIndex: 0, explanation: { ar: 'يُستحب كسر الصيام بالتمر والماء اقتداءً بالنبي محمد ﷺ.', en: 'It is recommended to break the fast with dates and water, following the practice of Prophet Muhammad (peace be upon him).' } },
    { id: 'q5', category: 'fasting', difficulty: 2, question: { ar: 'ما هي النية في الصيام؟', en: 'What is the role of intention (niyyah) in fasting?' }, options: [{ ar: 'شرط لصحة الصيام', en: 'A condition for valid fasting' }, { ar: 'مستحب فقط', en: 'Only recommended' }, { ar: 'غير مطلوب', en: 'Not required' }, { ar: 'فقط في رمضان', en: 'Only in Ramadan' }], correctIndex: 0, explanation: { ar: 'النية شرط أساسي لصحة الصيام ويجب أن تكون قبل الفجر.', en: 'Intention (niyyah) is an essential condition for the validity of fasting, and it must be made before dawn.' } },
    { id: 'q6', category: 'fasting', difficulty: 3, question: { ar: 'ما حكم من أفطر ناسياً في رمضان؟', en: 'What is the ruling if someone eats forgetfully while fasting?' }, options: [{ ar: 'يكمل صيامه ولا شيء عليه', en: 'Continues fasting with no penalty' }, { ar: 'يجب عليه القضاء', en: 'Must make up the day' }, { ar: 'يجب عليه الكفارة', en: 'Must pay expiation' }, { ar: 'يبطل صيامه', en: 'The fast is invalidated' }], correctIndex: 0, explanation: { ar: 'من أكل أو شرب ناسياً فصيامه صحيح، لأن الله أطعمه وسقاه.', en: 'If someone eats or drinks out of forgetfulness, the fast is still valid, as it is considered sustenance from God.' } },
    { id: 'q7', category: 'fasting', difficulty: 2, question: { ar: 'كم عدد أيام شهر رمضان عادة؟', en: 'How many days is Ramadan usually?' }, options: [{ ar: '29 أو 30 يوماً', en: '29 or 30 days' }, { ar: '28 يوماً', en: '28 days' }, { ar: '31 يوماً', en: '31 days' }, { ar: '27 يوماً', en: '27 days' }], correctIndex: 0, explanation: { ar: 'شهر رمضان يكون 29 أو 30 يوماً حسب رؤية الهلال.', en: 'Ramadan lasts 29 or 30 days depending on the sighting of the crescent moon.' } },

    // ── Quran (2) ──
    { id: 'q8', category: 'quran', difficulty: 1, question: { ar: 'في أي شهر نزل القرآن الكريم؟', en: 'In which month was the Quran revealed?' }, options: [{ ar: 'رمضان', en: 'Ramadan' }, { ar: 'رجب', en: 'Rajab' }, { ar: 'شوال', en: 'Shawwal' }, { ar: 'صفر', en: 'Safar' }], correctIndex: 0, explanation: { ar: 'نزل القرآن في شهر رمضان في ليلة القدر.', en: 'The Quran was revealed in the month of Ramadan during Laylat al-Qadr (the Night of Power).' } },
    { id: 'q9', category: 'quran', difficulty: 2, question: { ar: 'ما اسم الليلة المباركة التي نزل فيها القرآن؟', en: 'What is the blessed night on which the Quran was revealed?' }, options: [{ ar: 'ليلة القدر', en: 'Laylat al-Qadr' }, { ar: 'ليلة النصف', en: 'Mid-Shaban night' }, { ar: 'ليلة الإسراء', en: 'Isra night' }, { ar: 'ليلة البراءة', en: 'Night of Baraat' }], correctIndex: 0, explanation: { ar: 'ليلة القدر هي الليلة التي أُنزل فيها القرآن وهي خير من ألف شهر.', en: 'Laylat al-Qadr is the night the Quran was revealed, better than a thousand months.' } },
    { id: 'q10', category: 'quran', difficulty: 2, question: { ar: 'في أي سورة ذُكر فرض الصيام؟', en: 'In which Surah is the obligation of fasting mentioned?' }, options: [{ ar: 'البقرة', en: 'Al-Baqarah' }, { ar: 'آل عمران', en: 'Aal Imran' }, { ar: 'النساء', en: 'An-Nisa' }, { ar: 'المائدة', en: 'Al-Maidah' }], correctIndex: 0, explanation: { ar: 'ذُكر فرض الصيام في سورة البقرة الآية 183.', en: 'The obligation of fasting is mentioned in Surah Al-Baqarah, verse 183.' } },
    { id: 'q11', category: 'quran', difficulty: 3, question: { ar: 'ما هو عدد أجزاء القرآن الكريم؟', en: 'How many parts (Juz) does the Quran have?' }, options: [{ ar: '30', en: '30' }, { ar: '28', en: '28' }, { ar: '25', en: '25' }, { ar: '114', en: '114' }], correctIndex: 0, explanation: { ar: 'يتكون القرآن من 30 جزءاً، ويحرص كثير من المسلمين على ختمه خلال رمضان.', en: 'The Quran consists of 30 Juz (parts). Many Muslims aim to complete reading it during Ramadan.' } },
    { id: 'q12', category: 'quran', difficulty: 1, question: { ar: 'ما هو عدد سور القرآن الكريم؟', en: 'How many Surahs are in the Quran?' }, options: [{ ar: '114', en: '114' }, { ar: '100', en: '100' }, { ar: '120', en: '120' }, { ar: '130', en: '130' }], correctIndex: 0, explanation: { ar: 'القرآن الكريم يتكون من 114 سورة.', en: 'The Quran consists of 114 Surahs (chapters).' } },
    { id: 'q13', category: 'quran', difficulty: 3, question: { ar: 'ليلة القدر خير من كم شهر كما ذُكر في القرآن؟', en: 'Laylat al-Qadr is better than how many months according to the Quran?' }, options: [{ ar: 'ألف شهر', en: 'A thousand months' }, { ar: 'مئة شهر', en: 'A hundred months' }, { ar: 'خمسمائة شهر', en: 'Five hundred months' }, { ar: 'عشرة أشهر', en: 'Ten months' }], correctIndex: 0, explanation: { ar: 'قال تعالى: "ليلة القدر خير من ألف شهر" (سورة القدر: 3).', en: '"The Night of Power is better than a thousand months." (Surah Al-Qadr: 3)' } },

    // ── History (3) ──
    { id: 'q14', category: 'history', difficulty: 2, question: { ar: 'في أي سنة هجرية فُرض صيام رمضان؟', en: 'In which Hijri year was fasting in Ramadan made obligatory?' }, options: [{ ar: 'السنة الثانية', en: '2nd year' }, { ar: 'السنة الأولى', en: '1st year' }, { ar: 'السنة الخامسة', en: '5th year' }, { ar: 'السنة العاشرة', en: '10th year' }], correctIndex: 0, explanation: { ar: 'فُرض صيام رمضان في السنة الثانية من الهجرة.', en: 'Fasting in Ramadan was made obligatory in the 2nd year of Hijrah.' } },
    { id: 'q15', category: 'history', difficulty: 3, question: { ar: 'ما المعركة الكبرى التي وقعت في رمضان في السنة الثانية للهجرة؟', en: 'What major battle took place in Ramadan in the 2nd year of Hijrah?' }, options: [{ ar: 'غزوة بدر', en: 'Battle of Badr' }, { ar: 'غزوة أحد', en: 'Battle of Uhud' }, { ar: 'غزوة الخندق', en: 'Battle of the Trench' }, { ar: 'فتح مكة', en: 'Conquest of Mecca' }], correctIndex: 0, explanation: { ar: 'وقعت غزوة بدر في 17 رمضان من السنة الثانية للهجرة.', en: 'The Battle of Badr took place on the 17th of Ramadan in the 2nd year of Hijrah.' } },
    { id: 'q16', category: 'history', difficulty: 3, question: { ar: 'في أي شهر تم فتح مكة؟', en: 'In which month did the Conquest of Mecca occur?' }, options: [{ ar: 'رمضان', en: 'Ramadan' }, { ar: 'شوال', en: 'Shawwal' }, { ar: 'ذو الحجة', en: 'Dhul Hijjah' }, { ar: 'محرم', en: 'Muharram' }], correctIndex: 0, explanation: { ar: 'تم فتح مكة في شهر رمضان في السنة الثامنة للهجرة.', en: 'The Conquest of Mecca took place in Ramadan in the 8th year of Hijrah.' } },
    { id: 'q17', category: 'history', difficulty: 2, question: { ar: 'ما هو التقويم الذي يُحدد فيه شهر رمضان؟', en: 'Which calendar determines the month of Ramadan?' }, options: [{ ar: 'التقويم الهجري (القمري)', en: 'Hijri (lunar) calendar' }, { ar: 'التقويم الميلادي', en: 'Gregorian calendar' }, { ar: 'التقويم الشمسي', en: 'Solar calendar' }, { ar: 'التقويم الصيني', en: 'Chinese calendar' }], correctIndex: 0, explanation: { ar: 'يعتمد تحديد رمضان على التقويم الهجري القمري.', en: 'Ramadan is determined by the Hijri (Islamic lunar) calendar.' } },
    { id: 'q18', category: 'history', difficulty: 1, question: { ar: 'ما هو ترتيب شهر رمضان في التقويم الهجري؟', en: 'What is the position of Ramadan in the Hijri calendar?' }, options: [{ ar: 'التاسع', en: '9th' }, { ar: 'العاشر', en: '10th' }, { ar: 'الثامن', en: '8th' }, { ar: 'الثاني عشر', en: '12th' }], correctIndex: 0, explanation: { ar: 'رمضان هو الشهر التاسع في التقويم الهجري.', en: 'Ramadan is the 9th month in the Hijri calendar.' } },
    { id: 'q19', category: 'history', difficulty: 2, question: { ar: 'كيف يتم تحديد بداية شهر رمضان؟', en: 'How is the beginning of Ramadan determined?' }, options: [{ ar: 'برؤية هلال رمضان', en: 'By sighting the crescent moon' }, { ar: 'بتاريخ ثابت', en: 'By a fixed date' }, { ar: 'بحساب فلكي فقط', en: 'By astronomical calculation only' }, { ar: 'باجتماع العلماء', en: 'By a scholars meeting' }], correctIndex: 0, explanation: { ar: 'تُحدد بداية رمضان برؤية الهلال، وقد يُستعان بالحسابات الفلكية.', en: 'Ramadan begins with the sighting of the crescent moon, sometimes aided by astronomical calculations.' } },

    // ── Prayer (4) ──
    { id: 'q20', category: 'prayer', difficulty: 1, question: { ar: 'ما اسم الصلاة الخاصة التي تُصلى في ليالي رمضان؟', en: 'What is the special prayer performed during Ramadan nights?' }, options: [{ ar: 'صلاة التراويح', en: 'Taraweeh prayer' }, { ar: 'صلاة الضحى', en: 'Duha prayer' }, { ar: 'صلاة الاستسقاء', en: 'Rain prayer' }, { ar: 'صلاة الكسوف', en: 'Eclipse prayer' }], correctIndex: 0, explanation: { ar: 'صلاة التراويح هي صلاة خاصة تُصلى جماعةً في ليالي رمضان بعد صلاة العشاء.', en: 'Taraweeh is a special congregational prayer performed every night in Ramadan after the Isha prayer.' } },
    { id: 'q21', category: 'prayer', difficulty: 2, question: { ar: 'ما هو الاعتكاف؟', en: 'What is Itikaf?' }, options: [{ ar: 'البقاء في المسجد للعبادة في العشر الأواخر', en: 'Staying in the mosque for worship in the last 10 days' }, { ar: 'صلاة خاصة', en: 'A special prayer' }, { ar: 'نوع من الصدقة', en: 'A type of charity' }, { ar: 'قراءة القرآن كاملاً', en: 'Reading the entire Quran' }], correctIndex: 0, explanation: { ar: 'الاعتكاف هو البقاء في المسجد للتفرغ للعبادة، وعادةً يكون في العشر الأواخر من رمضان.', en: 'Itikaf is the practice of staying in the mosque devoted to worship, usually in the last ten days of Ramadan.' } },
    { id: 'q22', category: 'prayer', difficulty: 3, question: { ar: 'في أي ليالٍ من رمضان تُلتمس ليلة القدر؟', en: 'In which nights of Ramadan is Laylat al-Qadr sought?' }, options: [{ ar: 'الليالي الوترية من العشر الأواخر', en: 'Odd nights of the last 10 days' }, { ar: 'أول ليلة', en: 'First night' }, { ar: 'ليلة 15', en: 'Night 15' }, { ar: 'كل ليلة', en: 'Every night' }], correctIndex: 0, explanation: { ar: 'تُلتمس ليلة القدر في الليالي الوترية من العشر الأواخر (21، 23، 25، 27، 29).', en: 'Laylat al-Qadr is sought on the odd nights of the last ten days (21st, 23rd, 25th, 27th, 29th).' } },
    { id: 'q23', category: 'prayer', difficulty: 1, question: { ar: 'كم عدد الصلوات المفروضة في اليوم؟', en: 'How many obligatory prayers are there each day?' }, options: [{ ar: 'خمس صلوات', en: 'Five prayers' }, { ar: 'ثلاث صلوات', en: 'Three prayers' }, { ar: 'سبع صلوات', en: 'Seven prayers' }, { ar: 'صلاتان', en: 'Two prayers' }], correctIndex: 0, explanation: { ar: 'الصلوات المفروضة خمس: الفجر والظهر والعصر والمغرب والعشاء.', en: 'The five daily obligatory prayers are: Fajr, Dhuhr, Asr, Maghrib, and Isha.' } },

    // ── Charity (5) ──
    { id: 'q24', category: 'charity', difficulty: 1, question: { ar: 'ما اسم الصدقة الواجبة في نهاية رمضان؟', en: 'What is the obligatory charity at the end of Ramadan called?' }, options: [{ ar: 'زكاة الفطر', en: 'Zakat al-Fitr' }, { ar: 'الزكاة السنوية', en: 'Annual Zakat' }, { ar: 'الصدقة الجارية', en: 'Ongoing charity' }, { ar: 'الكفارة', en: 'Kaffarah' }], correctIndex: 0, explanation: { ar: 'زكاة الفطر صدقة واجبة تُخرج قبل صلاة العيد لتطهير الصائم.', en: 'Zakat al-Fitr is an obligatory charity given before Eid prayer to purify the fasting person.' } },
    { id: 'q25', category: 'charity', difficulty: 2, question: { ar: 'متى يجب إخراج زكاة الفطر؟', en: 'When must Zakat al-Fitr be given?' }, options: [{ ar: 'قبل صلاة عيد الفطر', en: 'Before the Eid al-Fitr prayer' }, { ar: 'في أي وقت', en: 'Any time' }, { ar: 'بعد رمضان بشهر', en: 'A month after Ramadan' }, { ar: 'في منتصف رمضان', en: 'In the middle of Ramadan' }], correctIndex: 0, explanation: { ar: 'يجب إخراج زكاة الفطر قبل صلاة العيد حتى يستفيد منها المحتاجون في يوم العيد.', en: 'Zakat al-Fitr must be given before the Eid prayer so those in need can benefit on the day of Eid.' } },
    { id: 'q26', category: 'charity', difficulty: 2, question: { ar: 'لماذا يُستحب الإكثار من الصدقة في رمضان؟', en: 'Why is giving more charity recommended in Ramadan?' }, options: [{ ar: 'لأن الأجر يتضاعف', en: 'Because rewards are multiplied' }, { ar: 'لأنه واجب', en: 'Because it is obligatory' }, { ar: 'لأنه تقليد فقط', en: 'Because it is just tradition' }, { ar: 'لا يوجد سبب محدد', en: 'No specific reason' }], correctIndex: 0, explanation: { ar: 'كان النبي ﷺ أجود الناس في رمضان، والأعمال الصالحة فيه مضاعفة الأجر.', en: 'The Prophet (PBUH) was the most generous in Ramadan, and good deeds carry multiplied rewards during this month.' } },
    { id: 'q27', category: 'charity', difficulty: 3, question: { ar: 'ما الفرق بين زكاة الفطر والزكاة السنوية؟', en: 'What is the difference between Zakat al-Fitr and annual Zakat?' }, options: [{ ar: 'زكاة الفطر على الأفراد والزكاة على المال', en: 'Fitr is per person; Zakat is on wealth' }, { ar: 'لا فرق بينهما', en: 'No difference' }, { ar: 'زكاة الفطر أكبر مبلغاً', en: 'Fitr is a larger amount' }, { ar: 'الزكاة السنوية في رمضان فقط', en: 'Annual Zakat is only in Ramadan' }], correctIndex: 0, explanation: { ar: 'زكاة الفطر تُخرج عن كل فرد في الأسرة، بينما الزكاة السنوية تُحسب على المال والممتلكات.', en: 'Zakat al-Fitr is given per household member, while annual Zakat is calculated on wealth and assets.' } },

    // ── Culture (6) ──
    { id: 'q28', category: 'culture', difficulty: 1, question: { ar: 'ما اسم العيد الذي يأتي بعد رمضان مباشرة؟', en: 'What is the celebration immediately after Ramadan called?' }, options: [{ ar: 'عيد الفطر', en: 'Eid al-Fitr' }, { ar: 'عيد الأضحى', en: 'Eid al-Adha' }, { ar: 'المولد النبوي', en: 'Mawlid' }, { ar: 'رأس السنة الهجرية', en: 'Islamic New Year' }], correctIndex: 0, explanation: { ar: 'عيد الفطر يأتي في أول يوم من شهر شوال بعد انتهاء رمضان.', en: 'Eid al-Fitr falls on the first day of Shawwal, immediately after Ramadan ends.' } },
    { id: 'q29', category: 'culture', difficulty: 1, question: { ar: 'ما هو التحية الشائعة في رمضان؟', en: 'What is the common Ramadan greeting?' }, options: [{ ar: 'رمضان كريم', en: 'Ramadan Kareem' }, { ar: 'عيد مبارك', en: 'Eid Mubarak' }, { ar: 'مبروك', en: 'Congratulations' }, { ar: 'الحمد لله', en: 'Alhamdulillah' }], correctIndex: 0, explanation: { ar: '"رمضان كريم" هي التحية الأكثر شيوعاً لتهنئة المسلمين بقدوم رمضان.', en: '"Ramadan Kareem" (Generous Ramadan) is the most common greeting to congratulate Muslims on the arrival of Ramadan.' } },
    { id: 'q30', category: 'culture', difficulty: 2, question: { ar: 'ما هو المسحراتي؟', en: 'What is a Musaharati?' }, options: [{ ar: 'شخص يوقظ الناس للسحور', en: 'A person who wakes people for Suhoor' }, { ar: 'طباخ الإفطار', en: 'An Iftar cook' }, { ar: 'إمام المسجد', en: 'The mosque imam' }, { ar: 'بائع الحلويات', en: 'A sweets vendor' }], correctIndex: 0, explanation: { ar: 'المسحراتي هو شخص يمر في الشوارع قبل الفجر لإيقاظ الناس لتناول السحور، وهو تقليد عريق.', en: 'The Musaharati is a person who walks through streets before dawn to wake people for Suhoor — a time-honored tradition.' } },
    { id: 'q31', category: 'culture', difficulty: 2, question: { ar: 'ما هو الفانوس المرتبط برمضان؟', en: 'What is the lantern (Fanous) associated with Ramadan?' }, options: [{ ar: 'فانوس رمضان التقليدي في مصر', en: 'Traditional Ramadan lantern from Egypt' }, { ar: 'نوع من الطعام', en: 'A type of food' }, { ar: 'آلة موسيقية', en: 'A musical instrument' }, { ar: 'كتاب ديني', en: 'A religious book' }], correctIndex: 0, explanation: { ar: 'فانوس رمضان تقليد مصري أصبح رمزاً لشهر رمضان في كثير من البلدان العربية.', en: 'The Ramadan Fanous (lantern) is an Egyptian tradition that has become a symbol of Ramadan across many Arab countries.' } },
    { id: 'q32', category: 'culture', difficulty: 1, question: { ar: 'هل يختلف طول يوم الصيام حسب البلد؟', en: 'Does the length of the fasting day vary by country?' }, options: [{ ar: 'نعم، حسب موقع البلد الجغرافي', en: 'Yes, based on geographic location' }, { ar: 'لا، هو نفسه في كل مكان', en: 'No, it is the same everywhere' }, { ar: 'فقط في نصف الكرة الشمالي', en: 'Only in the Northern Hemisphere' }, { ar: 'فقط في الدول العربية', en: 'Only in Arab countries' }], correctIndex: 0, explanation: { ar: 'يختلف طول يوم الصيام حسب الموقع الجغرافي وخطوط العرض، فقد يكون أطول في الدول الشمالية.', en: 'Fasting hours vary depending on geographic location and latitude; they can be longer in northern countries.' } },
    { id: 'q33', category: 'culture', difficulty: 3, question: { ar: 'ما هو القرقيعان؟', en: 'What is Gergean (Garangao)?' }, options: [{ ar: 'تقليد خليجي يوزع فيه الحلوى على الأطفال', en: 'A Gulf tradition of distributing sweets to children' }, { ar: 'نوع من الصلاة', en: 'A type of prayer' }, { ar: 'وجبة إفطار خاصة', en: 'A special Iftar meal' }, { ar: 'زينة رمضان', en: 'Ramadan decoration' }], correctIndex: 0, explanation: { ar: 'القرقيعان تقليد خليجي يتجول فيه الأطفال ليلاً في منتصف رمضان لجمع الحلوى والمكسرات.', en: 'Gergean is a Gulf tradition where children go door to door in the middle of Ramadan to collect sweets and nuts.' } },

    // ── Etiquette (7) ──
    { id: 'q34', category: 'etiquette', difficulty: 1, question: { ar: 'ما هي أهم آداب الصيام؟', en: 'What is an important etiquette of fasting?' }, options: [{ ar: 'الابتعاد عن الكلام السيئ والغيبة', en: 'Avoiding bad speech and gossip' }, { ar: 'النوم طوال النهار', en: 'Sleeping all day' }, { ar: 'عدم الكلام مطلقاً', en: 'Not speaking at all' }, { ar: 'تجنب الناس', en: 'Avoiding people' }], correctIndex: 0, explanation: { ar: 'من أهم آداب الصيام ترك الكلام السيئ والغيبة والنميمة والتحلي بالأخلاق الحسنة.', en: 'An essential etiquette of fasting is refraining from bad speech, gossip, and maintaining good character.' } },
    { id: 'q35', category: 'etiquette', difficulty: 2, question: { ar: 'ماذا يقول المسلم عند الإفطار؟', en: 'What does a Muslim say when breaking the fast?' }, options: [{ ar: 'ذهب الظمأ وابتلت العروق وثبت الأجر إن شاء الله', en: 'The thirst is gone, the veins are moistened, and the reward is confirmed if Allah wills' }, { ar: 'الحمد لله فقط', en: 'Only Alhamdulillah' }, { ar: 'لا يوجد دعاء محدد', en: 'There is no specific supplication' }, { ar: 'بسم الله فقط', en: 'Only Bismillah' }], correctIndex: 0, explanation: { ar: 'هذا الدعاء المأثور يُقال عند الإفطار، وبسم الله والحمد لله أيضاً من الأذكار المستحبة.', en: 'This is a prophetic supplication said at Iftar. Saying Bismillah and Alhamdulillah are also recommended.' } },
    { id: 'q36', category: 'etiquette', difficulty: 2, question: { ar: 'ما هو حكم تذوق الطعام أثناء الصيام؟', en: 'What is the ruling on tasting food while fasting?' }, options: [{ ar: 'جائز بشرط عدم البلع', en: 'Permissible as long as nothing is swallowed' }, { ar: 'محرم تماماً', en: 'Completely forbidden' }, { ar: 'مكروه دائماً', en: 'Always disliked' }, { ar: 'يبطل الصيام', en: 'Invalidates the fast' }], correctIndex: 0, explanation: { ar: 'يجوز تذوق الطعام للحاجة بشرط عدم ابتلاع شيء منه.', en: 'Tasting food is permissible when needed, as long as nothing is swallowed.' } },
    { id: 'q37', category: 'etiquette', difficulty: 1, question: { ar: 'هل يُستحب تعجيل الإفطار أو تأخيره؟', en: 'Is it recommended to hasten or delay breaking the fast?' }, options: [{ ar: 'تعجيل الإفطار', en: 'Hasten breaking the fast' }, { ar: 'تأخير الإفطار', en: 'Delay breaking the fast' }, { ar: 'لا فرق', en: 'No difference' }, { ar: 'الانتظار ساعة بعد الأذان', en: 'Wait an hour after the call to prayer' }], correctIndex: 0, explanation: { ar: 'يُستحب تعجيل الإفطار بمجرد التأكد من غروب الشمس.', en: 'It is recommended to break the fast as soon as sunset is confirmed.' } },

    // ── General (8) ──
    { id: 'q38', category: 'general', difficulty: 1, question: { ar: 'الصيام هو أحد أركان الإسلام. كم عدد أركان الإسلام؟', en: 'Fasting is one of the pillars of Islam. How many pillars are there?' }, options: [{ ar: 'خمسة', en: 'Five' }, { ar: 'أربعة', en: 'Four' }, { ar: 'ستة', en: 'Six' }, { ar: 'ثلاثة', en: 'Three' }], correctIndex: 0, explanation: { ar: 'أركان الإسلام خمسة: الشهادتان، الصلاة، الزكاة، صيام رمضان، والحج.', en: 'The five pillars of Islam are: Shahada, Salah, Zakat, fasting in Ramadan, and Hajj.' } },
    { id: 'q39', category: 'general', difficulty: 2, question: { ar: 'ما هي الكفارة عند عدم القدرة على صيام رمضان لعذر دائم؟', en: 'What is the expiation for those permanently unable to fast?' }, options: [{ ar: 'إطعام مسكين عن كل يوم', en: 'Feeding a needy person for each day' }, { ar: 'لا شيء عليه', en: 'Nothing is required' }, { ar: 'صيام شهرين متتابعين', en: 'Fasting two consecutive months' }, { ar: 'دفع مبلغ مالي للمسجد', en: 'Paying a sum to the mosque' }], correctIndex: 0, explanation: { ar: 'من لم يستطع الصيام لعذر دائم كالمرض المزمن يُطعم مسكيناً عن كل يوم.', en: 'Those permanently unable to fast (e.g., chronic illness) must feed a needy person for each missed day.' } },
    { id: 'q40', category: 'general', difficulty: 1, question: { ar: 'ما هو الشهر الذي يسبق رمضان مباشرة؟', en: 'What month immediately precedes Ramadan?' }, options: [{ ar: 'شعبان', en: 'Shaban' }, { ar: 'رجب', en: 'Rajab' }, { ar: 'جمادى الآخرة', en: 'Jumada al-Thani' }, { ar: 'شوال', en: 'Shawwal' }], correctIndex: 0, explanation: { ar: 'شعبان هو الشهر الثامن ويسبق رمضان مباشرة في التقويم الهجري.', en: 'Shaban is the 8th month and comes directly before Ramadan in the Hijri calendar.' } },
    { id: 'q41', category: 'general', difficulty: 2, question: { ar: 'ما هو الشهر الذي يأتي بعد رمضان مباشرة؟', en: 'Which month comes right after Ramadan?' }, options: [{ ar: 'شوال', en: 'Shawwal' }, { ar: 'ذو القعدة', en: 'Dhul Qadah' }, { ar: 'شعبان', en: 'Shaban' }, { ar: 'محرم', en: 'Muharram' }], correctIndex: 0, explanation: { ar: 'شوال هو الشهر العاشر ويأتي بعد رمضان، وأول يوم منه هو عيد الفطر.', en: 'Shawwal is the 10th month and follows Ramadan; its first day is Eid al-Fitr.' } },
    { id: 'q42', category: 'general', difficulty: 2, question: { ar: 'هل يُستحب صيام ستة أيام من شوال بعد رمضان؟', en: 'Is it recommended to fast six days of Shawwal after Ramadan?' }, options: [{ ar: 'نعم، يُستحب', en: 'Yes, it is recommended' }, { ar: 'لا', en: 'No' }, { ar: 'واجب', en: 'It is obligatory' }, { ar: 'فقط للرجال', en: 'Only for men' }], correctIndex: 0, explanation: { ar: 'يُستحب صيام ستة أيام من شوال لحديث "من صام رمضان ثم أتبعه ستاً من شوال كان كصيام الدهر".', en: 'Fasting six days of Shawwal is recommended based on the hadith that it is equivalent to fasting the entire year.' } },
    { id: 'q43', category: 'general', difficulty: 3, question: { ar: 'ما هو حكم الصيام لمن يعيش في بلد لا تغرب فيه الشمس لأسابيع؟', en: 'What is the ruling for fasting in a country where the sun does not set for weeks?' }, options: [{ ar: 'يتبع أقرب بلد معتدل في مواقيته', en: 'Follow the schedule of the nearest moderate country' }, { ar: 'يصوم 24 ساعة', en: 'Fast 24 hours' }, { ar: 'لا يصوم', en: 'Does not fast' }, { ar: 'يصوم 12 ساعة فقط', en: 'Fasts only 12 hours' }], correctIndex: 0, explanation: { ar: 'يتبع مواقيت أقرب بلد تتميز فيه ساعات الليل والنهار بشكل طبيعي.', en: 'They follow the prayer and fasting times of the nearest country with a normal day-night cycle.' } },
    { id: 'q44', category: 'general', difficulty: 1, question: { ar: 'هل يجوز للمسافر أن يفطر في رمضان؟', en: 'Is a traveler allowed to break the fast in Ramadan?' }, options: [{ ar: 'نعم، مع قضاء الأيام لاحقاً', en: 'Yes, with making up the days later' }, { ar: 'لا', en: 'No' }, { ar: 'فقط إذا كان السفر طويلاً جداً', en: 'Only if the travel is very long' }, { ar: 'فقط بالطائرة', en: 'Only by plane' }], correctIndex: 0, explanation: { ar: 'يُرخص للمسافر الإفطار في رمضان على أن يقضي الأيام التي أفطرها لاحقاً.', en: 'Travelers are permitted to break the fast during Ramadan but must make up the missed days later.' } },

    // ── More questions for variety (9+) ──
    { id: 'q45', category: 'fasting', difficulty: 3, question: { ar: 'ما هي مبطلات الصيام؟', en: 'What invalidates the fast?' }, options: [{ ar: 'الأكل والشرب عمداً', en: 'Eating and drinking intentionally' }, { ar: 'النوم الطويل', en: 'Sleeping too long' }, { ar: 'الاستحمام', en: 'Bathing' }, { ar: 'استخدام العطر', en: 'Wearing perfume' }], correctIndex: 0, explanation: { ar: 'من مبطلات الصيام: الأكل والشرب عمداً، أما الاستحمام والنوم والعطر فلا تبطل الصيام.', en: 'Intentional eating and drinking invalidate the fast. Bathing, sleeping, and wearing perfume do not.' } },
    { id: 'q46', category: 'quran', difficulty: 2, question: { ar: 'ما المقصود بختم القرآن في رمضان؟', en: 'What does "completing the Quran" in Ramadan mean?' }, options: [{ ar: 'قراءة القرآن كاملاً من البداية للنهاية', en: 'Reading the entire Quran from start to finish' }, { ar: 'حفظ القرآن', en: 'Memorizing the Quran' }, { ar: 'كتابة القرآن', en: 'Writing the Quran' }, { ar: 'ترجمة القرآن', en: 'Translating the Quran' }], correctIndex: 0, explanation: { ar: 'ختم القرآن يعني إتمام قراءته كاملاً، ويحرص كثير من المسلمين على ختمه مرة أو أكثر في رمضان.', en: 'Completing the Quran means reading it from cover to cover. Many Muslims aim to finish it at least once during Ramadan.' } },
    { id: 'q47', category: 'history', difficulty: 3, question: { ar: 'من هو الصحابي المعروف بلقب "سيف الله المسلول"؟', en: 'Which companion is known as "The Drawn Sword of Allah"?' }, options: [{ ar: 'خالد بن الوليد', en: 'Khalid ibn al-Walid' }, { ar: 'علي بن أبي طالب', en: 'Ali ibn Abi Talib' }, { ar: 'عمر بن الخطاب', en: 'Umar ibn al-Khattab' }, { ar: 'أبو بكر الصديق', en: 'Abu Bakr al-Siddiq' }], correctIndex: 0, explanation: { ar: 'خالد بن الوليد رضي الله عنه لُقب بسيف الله المسلول، وقاد معارك مهمة في رمضان.', en: 'Khalid ibn al-Walid was titled "The Drawn Sword of Allah" and led important battles during Ramadan.' } },
    { id: 'q48', category: 'culture', difficulty: 2, question: { ar: 'ما هي عادة "مائدة الرحمن" في رمضان؟', en: 'What is the tradition of "Rahman Tables" in Ramadan?' }, options: [{ ar: 'موائد طعام مجانية للإفطار في الشوارع', en: 'Free Iftar meals set up in streets' }, { ar: 'مسابقة طبخ', en: 'A cooking competition' }, { ar: 'سوق رمضاني', en: 'A Ramadan market' }, { ar: 'حفلة عائلية', en: 'A family party' }], correctIndex: 0, explanation: { ar: 'مائدة الرحمن هي تقليد شائع في عدة دول عربية حيث تُقام موائد إفطار مجانية للصائمين.', en: 'Rahman Tables are a common tradition in many Arab countries where free Iftar meals are set up for fasters.' } },
    { id: 'q49', category: 'etiquette', difficulty: 3, question: { ar: 'ما حكم استخدام السواك أثناء الصيام؟', en: 'What is the ruling on using a Miswak (tooth stick) while fasting?' }, options: [{ ar: 'جائز ولا يبطل الصيام', en: 'Permissible and does not break the fast' }, { ar: 'محرم', en: 'Forbidden' }, { ar: 'مكروه', en: 'Disliked' }, { ar: 'يبطل الصيام', en: 'Breaks the fast' }], correctIndex: 0, explanation: { ar: 'استخدام السواك جائز أثناء الصيام بل هو مستحب عند بعض العلماء.', en: 'Using a Miswak while fasting is permissible and even recommended by some scholars.' } },
    { id: 'q50', category: 'general', difficulty: 1, question: { ar: 'ما معنى كلمة "رمضان"؟', en: 'What does the word "Ramadan" mean?' }, options: [{ ar: 'مشتقة من "الرمض" وهو شدة الحر', en: 'Derived from "ramad" meaning intense heat' }, { ar: 'مشتقة من "الرحمة"', en: 'Derived from "mercy"' }, { ar: 'مشتقة من "الرمل"', en: 'Derived from "sand"' }, { ar: 'ليس لها معنى محدد', en: 'It has no specific meaning' }], correctIndex: 0, explanation: { ar: 'كلمة "رمضان" مشتقة من "الرمض" وهو شدة الحر، حيث جاء الشهر أول مرة في فصل الحر.', en: 'The word "Ramadan" comes from "ramad," meaning scorching heat, as the month first occurred during a hot season.' } },
    { id: 'q51', category: 'prayer', difficulty: 2, question: { ar: 'كم ركعة في صلاة التراويح عادة؟', en: 'How many units (rakat) are in Taraweeh prayer typically?' }, options: [{ ar: '8 أو 20 ركعة (حسب المذهب)', en: '8 or 20 (varies by school of thought)' }, { ar: '4 ركعات فقط', en: 'Only 4' }, { ar: '12 ركعة', en: '12' }, { ar: '2 ركعتان', en: '2' }], correctIndex: 0, explanation: { ar: 'تُصلى التراويح 8 أو 20 ركعة حسب المذهب والتقليد، وكلاهما صحيح.', en: 'Taraweeh is performed in 8 or 20 rakat depending on the school of thought; both are valid.' } },
    { id: 'q52', category: 'fasting', difficulty: 1, question: { ar: 'من الذين يُعفون من صيام رمضان؟', en: 'Who is exempt from fasting in Ramadan?' }, options: [{ ar: 'المرضى والمسافرون والحوامل والأطفال', en: 'The sick, travelers, pregnant women, and children' }, { ar: 'لا أحد معفى', en: 'No one is exempt' }, { ar: 'كبار السن فقط', en: 'Only the elderly' }, { ar: 'النساء فقط', en: 'Only women' }], correctIndex: 0, explanation: { ar: 'يُعفى من الصيام المرضى والمسافرون والحوامل والمرضعات والأطفال وكبار السن العاجزون.', en: 'The sick, travelers, pregnant and nursing women, children, and elderly who are unable are exempt from fasting.' } },
    { id: 'q53', category: 'charity', difficulty: 1, question: { ar: 'ما هو إطعام الصائم؟', en: 'What is "feeding a fasting person"?' }, options: [{ ar: 'تقديم وجبة إفطار لصائم', en: 'Providing an Iftar meal to someone fasting' }, { ar: 'طبخ لنفسك', en: 'Cooking for yourself' }, { ar: 'الأكل في المطعم', en: 'Eating at a restaurant' }, { ar: 'شراء الطعام فقط', en: 'Just buying food' }], correctIndex: 0, explanation: { ar: 'إطعام الصائم سنة مستحبة، ومن فطّر صائماً كان له مثل أجره.', en: 'Feeding a fasting person is a recommended practice; whoever feeds a fasting person receives a reward equal to theirs.' } },
    { id: 'q54', category: 'quran', difficulty: 1, question: { ar: 'ما هي أول كلمة نزلت من القرآن الكريم؟', en: 'What is the first word revealed in the Quran?' }, options: [{ ar: 'اقرأ', en: 'Iqra (Read)' }, { ar: 'قل', en: 'Qul (Say)' }, { ar: 'بسم', en: 'Bism (In the name)' }, { ar: 'الحمد', en: 'Al-Hamd (Praise)' }], correctIndex: 0, explanation: { ar: 'أول كلمة نزلت هي "اقرأ" من سورة العلق.', en: 'The first word revealed was "Iqra" (Read) from Surah Al-Alaq.' } },
    { id: 'q55', category: 'general', difficulty: 3, question: { ar: 'ما هو صيام الوصال الذي نهى عنه النبي ﷺ؟', en: 'What is "continuous fasting" (Wisal) that the Prophet prohibited?' }, options: [{ ar: 'الصيام دون إفطار لأكثر من يوم', en: 'Fasting without breaking for more than one day' }, { ar: 'الصيام كل يوم', en: 'Fasting every day' }, { ar: 'الصيام بدون سحور', en: 'Fasting without Suhoor' }, { ar: 'الصيام في السفر', en: 'Fasting while traveling' }], correctIndex: 0, explanation: { ar: 'صيام الوصال هو مواصلة الصيام دون إفطار بين الأيام وقد نهى عنه النبي ﷺ رحمةً بالأمة.', en: 'Wisal is fasting continuously without breaking between days. The Prophet prohibited it out of mercy for the community.' } },
    { id: 'q56', category: 'culture', difficulty: 1, question: { ar: 'ما هو المشروب التقليدي في رمضان في كثير من البلدان العربية؟', en: 'What is the traditional Ramadan drink in many Arab countries?' }, options: [{ ar: 'قمر الدين (عصير المشمش)', en: 'Qamar al-Din (apricot juice)' }, { ar: 'القهوة', en: 'Coffee' }, { ar: 'الشاي الأخضر', en: 'Green tea' }, { ar: 'العصير البرتقالي', en: 'Orange juice' }], correctIndex: 0, explanation: { ar: 'قمر الدين مشروب مشمش تقليدي يُحضر خصيصاً في رمضان في عدة دول عربية.', en: 'Qamar al-Din is a traditional apricot drink specially prepared during Ramadan in many Arab countries.' } },
    { id: 'q57', category: 'etiquette', difficulty: 2, question: { ar: 'ما حكم بلع الريق أثناء الصيام؟', en: 'What is the ruling on swallowing saliva while fasting?' }, options: [{ ar: 'جائز ولا يؤثر على الصيام', en: 'Permissible and does not affect the fast' }, { ar: 'يبطل الصيام', en: 'Invalidates the fast' }, { ar: 'مكروه', en: 'Disliked' }, { ar: 'يجب تجنبه', en: 'Must be avoided' }], correctIndex: 0, explanation: { ar: 'بلع الريق العادي لا يؤثر على صحة الصيام باتفاق العلماء.', en: 'Swallowing normal saliva does not affect the validity of the fast according to scholarly consensus.' } },
    { id: 'q58', category: 'history', difficulty: 2, question: { ar: 'أين ظهرت أول مدفع للإفطار في رمضان؟', en: 'Where did the tradition of the Ramadan Iftar cannon originate?' }, options: [{ ar: 'مصر (القاهرة)', en: 'Egypt (Cairo)' }, { ar: 'السعودية (مكة)', en: 'Saudi Arabia (Mecca)' }, { ar: 'تركيا (إسطنبول)', en: 'Turkey (Istanbul)' }, { ar: 'المغرب (فاس)', en: 'Morocco (Fez)' }], correctIndex: 0, explanation: { ar: 'يُقال إن تقليد مدفع الإفطار بدأ في مصر في عهد المماليك كإشارة لموعد الإفطار.', en: 'The Iftar cannon tradition is said to have started in Egypt during the Mamluk era to signal the time to break the fast.' } },
    { id: 'q59', category: 'prayer', difficulty: 3, question: { ar: 'ما هو القيام في العشر الأواخر من رمضان؟', en: 'What is Qiyam in the last ten nights of Ramadan?' }, options: [{ ar: 'إحياء الليل بالصلاة والعبادة', en: 'Spending the night in prayer and worship' }, { ar: 'النوم مبكراً', en: 'Sleeping early' }, { ar: 'قراءة كتاب واحد', en: 'Reading one book' }, { ar: 'الصيام المتواصل', en: 'Continuous fasting' }], correctIndex: 0, explanation: { ar: 'القيام يعني إحياء الليل بالصلاة والدعاء والعبادة، ويُستحب خاصة في العشر الأواخر طلباً لليلة القدر.', en: 'Qiyam means spending the night in prayer and worship. It is especially encouraged in the last ten nights seeking Laylat al-Qadr.' } },
    { id: 'q60', category: 'general', difficulty: 2, question: { ar: 'كم عدد المسلمين تقريباً الذين يصومون رمضان حول العالم؟', en: 'Approximately how many Muslims fast Ramadan worldwide?' }, options: [{ ar: 'أكثر من 1.8 مليار', en: 'Over 1.8 billion' }, { ar: 'حوالي 500 مليون', en: 'About 500 million' }, { ar: 'حوالي 100 مليون', en: 'About 100 million' }, { ar: 'حوالي 3 مليار', en: 'About 3 billion' }], correctIndex: 0, explanation: { ar: 'يبلغ عدد المسلمين حول العالم أكثر من 1.8 مليار، ويصوم معظمهم شهر رمضان.', en: 'There are over 1.8 billion Muslims worldwide, and most observe the fast during Ramadan.' } },
    { id: 'q61', category: 'fasting', difficulty: 2, question: { ar: 'هل الحقنة الطبية (الإبرة) تفطر الصائم؟', en: 'Does a medical injection break the fast?' }, options: [{ ar: 'الإبر غير المغذية لا تفطر', en: 'Non-nutritional injections do not break the fast' }, { ar: 'كل الإبر تفطر', en: 'All injections break the fast' }, { ar: 'لا إبرة تفطر', en: 'No injection breaks the fast' }, { ar: 'فقط إبر الأنسولين', en: 'Only insulin injections' }], correctIndex: 0, explanation: { ar: 'الإبر العلاجية غير المغذية لا تفطر الصائم عند جمهور العلماء المعاصرين.', en: 'Non-nutritional medical injections do not break the fast according to the majority of contemporary scholars.' } },
    { id: 'q62', category: 'culture', difficulty: 3, question: { ar: 'ما هو "الإمساكية" في رمضان؟', en: 'What is an "Imsakiyyah" in Ramadan?' }, options: [{ ar: 'جدول بمواقيت الإمساك والإفطار', en: 'A schedule of fasting and Iftar times' }, { ar: 'نوع من الحلوى', en: 'A type of sweet' }, { ar: 'دعاء خاص', en: 'A special supplication' }, { ar: 'زينة رمضانية', en: 'Ramadan decoration' }], correctIndex: 0, explanation: { ar: 'الإمساكية هي جدول يومي يحتوي على مواقيت الصلاة والإمساك والإفطار خلال شهر رمضان.', en: 'An Imsakiyyah is a daily timetable showing prayer, Suhoor, and Iftar times throughout Ramadan.' } },
    { id: 'q63', category: 'general', difficulty: 3, question: { ar: 'ما هي صلاة الوتر وما علاقتها برمضان؟', en: 'What is Witr prayer and how does it relate to Ramadan?' }, options: [{ ar: 'صلاة ختامية بعد التراويح بعدد فردي من الركعات', en: 'A closing prayer after Taraweeh with an odd number of rakat' }, { ar: 'صلاة الصبح', en: 'Morning prayer' }, { ar: 'صلاة العيد', en: 'Eid prayer' }, { ar: 'صلاة الاستخارة', en: 'Istikhara prayer' }], correctIndex: 0, explanation: { ar: 'صلاة الوتر هي صلاة بعدد فردي من الركعات تُصلى بعد العشاء، وتكتسب أهمية خاصة في رمضان بعد التراويح.', en: 'Witr is an odd-numbered prayer performed after Isha, gaining special importance in Ramadan after Taraweeh.' } }
  ];

  /* ---------- Utility Helpers ---------- */
  function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0;
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }

  function sanitize(str) {
    var el = document.createElement('div');
    el.textContent = str;
    return el.innerHTML;
  }

  function formatTime(ms) {
    var totalSec = Math.floor(ms / 1000);
    var min = Math.floor(totalSec / 60);
    var sec = totalSec % 60;
    var centisec = Math.floor((ms % 1000) / 10);
    return String(min).padStart(2, '0') + ':' + String(sec).padStart(2, '0') + '.' + String(centisec).padStart(2, '0');
  }

  function formatTimeShort(ms) {
    var totalSec = Math.floor(ms / 1000);
    var min = Math.floor(totalSec / 60);
    var sec = totalSec % 60;
    return String(min).padStart(2, '0') + ':' + String(sec).padStart(2, '0');
  }

  function shuffleArray(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  function t(key) {
    var entry = I18N[key];
    if (!entry) return key;
    return entry[state.lang] || entry.en || key;
  }

  function getHintText(q) {
    if (!q || !q.explanation) return '';
    var l = state.lang;
    var full = q.explanation[l] || q.explanation.en || '';
    if (!full) return '';
    // Split on common sentence terminators for Arabic & English
    var parts = full.split(/[.!؟?]/);
    var first = parts[0] ? parts[0].trim() : full.trim();
    if (!first) return full.trim();
    if (first.length < full.trim().length) {
      return first + '...';
    }
    return first;
  }

  function $(sel) { return document.querySelector(sel); }
  function $$(sel) { return document.querySelectorAll(sel); }

  /* ---------- Storage ---------- */
  var Storage = {
    _get: function (key) {
      try { return JSON.parse(localStorage.getItem(key)); } catch (e) { return null; }
    },
    _set: function (key, val) {
      try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* silently fail */ }
    },
    getLeaderboard: function () {
      return this._get('ramadan_quiz_leaderboard') || [];
    },
    setLeaderboard: function (data) {
      this._set('ramadan_quiz_leaderboard', data);
    },
    clearLeaderboard: function () {
      try { localStorage.removeItem('ramadan_quiz_leaderboard'); } catch (e) { /* ok */ }
    },
    getSound: function () {
      var v = this._get('ramadan_quiz_sound');
      return v === null ? false : v;
    },
    setSound: function (val) { this._set('ramadan_quiz_sound', val); },
    getDark: function () {
      var v = this._get('ramadan_quiz_dark');
      return v === null ? false : v;
    },
    setDark: function (val) { this._set('ramadan_quiz_dark', val); }
  };

  /* ---------- Sound (Web Audio API) ---------- */
  var Sound = {
    ctx: null,
    _enabled: false,
    init: function () {
      this._enabled = Storage.getSound();
    },
    _getCtx: function () {
      if (!this.ctx) {
        try {
          this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) { return null; }
      }
      return this.ctx;
    },
    toggle: function () {
      this._enabled = !this._enabled;
      Storage.setSound(this._enabled);
      return this._enabled;
    },
    isOn: function () { return this._enabled; },
    _play: function (freq, type, duration, vol) {
      if (!this._enabled) return;
      var ctx = this._getCtx();
      if (!ctx) return;
      try {
        if (ctx.state === 'suspended') ctx.resume();
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        osc.type = type || 'sine';
        osc.frequency.value = freq || 440;
        gain.gain.value = vol || 0.12;
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (duration || 0.2));
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + (duration || 0.2));
      } catch (e) { /* fail silently */ }
    },
    correct: function () {
      this._play(523, 'sine', 0.15, 0.1);
      var self = this;
      setTimeout(function () { self._play(659, 'sine', 0.15, 0.1); }, 100);
      setTimeout(function () { self._play(784, 'sine', 0.2, 0.1); }, 200);
    },
    wrong: function () {
      this._play(330, 'square', 0.25, 0.08);
      var self = this;
      setTimeout(function () { self._play(277, 'square', 0.3, 0.08); }, 150);
    },
    tick: function () {
      this._play(880, 'sine', 0.05, 0.06);
    },
    complete: function () {
      var notes = [523, 659, 784, 1047];
      var self = this;
      notes.forEach(function (n, i) {
        setTimeout(function () { self._play(n, 'sine', 0.2, 0.1); }, i * 120);
      });
    },
    click: function () {
      this._play(600, 'sine', 0.06, 0.05);
    }
  };

  /* ---------- Application State ---------- */
  var state = {
    lang: 'en',
    playerName: '',
    difficultyMode: 'mixed',
    timerMode: 'total',
    sessionId: null,
    submitted: false,
    currentScreen: 'start',
    // Quiz state
    questions: [],
    currentIndex: 0,
    answers: [], // { selectedIndex: number|null, correct: boolean, timeMs: number }
    quizStartTime: 0,
    quizElapsedMs: 0,
    questionStartTime: 0,
    timerInterval: null,
    questionTimerInterval: null,
    locked: false,
    // Leaderboard nav source
    lbSource: 'start', // 'start' | 'results'
    // New entry id for highlight
    lastEntryId: null
  };

  /* ---------- Question Preparation ---------- */
  function prepareQuestions() {
    var pool = QUESTIONS.slice();

    if (state.difficultyMode !== 'mixed') {
      var diffMap = { easy: 1, medium: 2, hard: 3 };
      var d = diffMap[state.difficultyMode];
      pool = pool.filter(function (q) { return q.difficulty === d; });
    }

    pool = shuffleArray(pool);
    var selected = pool.slice(0, QUESTIONS_PER_GAME);

    // Shuffle options for each question, adjusting correctIndex
    return selected.map(function (q) {
      var indices = [0, 1, 2, 3];
      var shuffled = shuffleArray(indices);
      var newOptions = shuffled.map(function (i) { return q.options[i]; });
      var newCorrectIndex = shuffled.indexOf(q.correctIndex);
      return {
        id: q.id,
        category: q.category,
        difficulty: q.difficulty,
        question: q.question,
        options: newOptions,
        correctIndex: newCorrectIndex,
        explanation: q.explanation
      };
    });
  }

  /* ---------- Leaderboard Logic ---------- */
  function addToLeaderboard(entry) {
    var lb = Storage.getLeaderboard();
    lb.push(entry);
    lb.sort(function (a, b) {
      if (b.correct !== a.correct) return b.correct - a.correct;
      if (a.timeMs !== b.timeMs) return a.timeMs - b.timeMs;
      return new Date(b.playedAtISO) - new Date(a.playedAtISO);
    });
    if (lb.length > LEADERBOARD_LIMIT) lb = lb.slice(0, LEADERBOARD_LIMIT);
    Storage.setLeaderboard(lb);
    return lb;
  }

  function getRank(lb, entryId) {
    for (var i = 0; i < lb.length; i++) {
      if (lb[i].id === entryId) return i + 1;
    }
    return null;
  }

  /* ---------- Dark Mode ---------- */
  function applyDark(isDark) {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    updateSoundAndDarkIcons();
  }

  /* ---------- Language / RTL ---------- */
  function applyLang(lang) {
    state.lang = lang;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    translateUI();
  }

  function translateUI() {
    var l = state.lang;

    // Start screen
    $('#start-title').textContent = t('appTitle');
    $('#start-subtitle').textContent = t('appSubtitle');
    $('#label-name').textContent = t('yourName');
    $('#input-name').placeholder = t('namePlaceholder');
    $('#label-lang').textContent = t('language');
    $('#label-difficulty').textContent = t('difficulty');
    $('#diff-easy').textContent = t('easy');
    $('#diff-medium').textContent = t('medium');
    $('#diff-hard').textContent = t('hard');
    $('#diff-mixed').textContent = t('mixed');
    $('#label-timer').textContent = t('timerMode');
    $('#timer-total').textContent = t('totalTimer');
    $('#timer-per').textContent = t('perQuestion');
    $('#btn-start').textContent = t('startQuiz');
    $('#btn-leaderboard-start').textContent = t('viewLeaderboard');

    // Quiz
    var langBtns = $$('.btn-lang-toggle');
    langBtns.forEach(function (b) { b.textContent = l === 'ar' ? 'EN' : 'ع'; });

    // Results
    $('#results-title').textContent = t('quizComplete');
    $('#stat-correct-label').textContent = t('correctLabel');
    $('#stat-time-label').textContent = t('timeLabel');
    $('#stat-accuracy-label').textContent = t('accuracyLabel');
    $('#btn-play-again').textContent = t('playAgain');
    $('#btn-leaderboard-results').textContent = t('viewLeaderboard');
    $('#review-title').textContent = t('reviewAnswers');

    // Hint
    var hintBtn = $('#btn-hint');
    if (hintBtn) hintBtn.textContent = t('showHint');

    // Leaderboard
    $('#lb-title').textContent = t('leaderboard');
    $('#lb-filter-diff-label').textContent = t('filterDifficulty');
    $('#lb-filter-timer-label').textContent = t('filterTimer');
    $('#btn-reset-lb').textContent = t('resetLeaderboard');
    $('#modal-reset-title').textContent = t('resetConfirmTitle');
    $('#modal-reset-body').textContent = t('resetConfirmBody');
    $('#btn-modal-cancel').textContent = t('cancel');
    $('#btn-modal-confirm').textContent = t('reset');

    // Filter options
    var diffSelect = $('#lb-filter-diff');
    diffSelect.options[0].textContent = t('all');
    diffSelect.options[1].textContent = t('easy');
    diffSelect.options[2].textContent = t('medium');
    diffSelect.options[3].textContent = t('hard');
    diffSelect.options[4].textContent = t('mixed');

    var timerSelect = $('#lb-filter-timer');
    timerSelect.options[0].textContent = t('all');
    timerSelect.options[1].textContent = t('total');
    timerSelect.options[2].textContent = t('perQ');

    // Feedback next button if visible
    $('#btn-next').textContent = state.currentIndex >= state.questions.length - 1 ? t('finishQuiz') : t('next');
  }

  function updateSoundAndDarkIcons() {
    var soundOn = Sound.isOn();
    var darkOn = document.documentElement.getAttribute('data-theme') === 'dark';

    $$('.sound-icon').forEach(function (el) {
      el.textContent = soundOn ? el.dataset.on : el.dataset.off;
    });
    $$('.dark-icon').forEach(function (el) {
      el.textContent = darkOn ? el.dataset.on : el.dataset.off;
    });
  }

  /* ---------- Screen Navigation ---------- */
  function showScreen(name) {
    $$('.screen').forEach(function (s) { s.classList.remove('active'); });
    $('#screen-' + name).classList.add('active');
    state.currentScreen = name;
    window.scrollTo(0, 0);
  }

  /* ---------- Close Game ---------- */
  function closeGame() {
    try {
      if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'CLOSE_GAME' }));
      }
    } catch (e) { /* ignore */ }
  }

  /* ---------- Timer ---------- */
  function startTotalTimer() {
    state.quizStartTime = performance.now();
    state.timerInterval = setInterval(function () {
      state.quizElapsedMs = performance.now() - state.quizStartTime;
      renderTimerText();
    }, 100);
  }

  function stopTotalTimer() {
    if (state.timerInterval) {
      clearInterval(state.timerInterval);
      state.timerInterval = null;
    }
    state.quizElapsedMs = performance.now() - state.quizStartTime;
  }

  function startQuestionTimer() {
    state.questionStartTime = performance.now();
    var totalMs = PER_QUESTION_SECONDS * 1000;

    state.questionTimerInterval = setInterval(function () {
      if (state.locked) return;
      var elapsed = performance.now() - state.questionStartTime;
      var remaining = Math.max(0, totalMs - elapsed);
      var pct = (remaining / totalMs) * 100;
      var bar = $('#timer-bar');
      bar.style.width = pct + '%';
      bar.classList.remove('warning', 'danger');
      if (pct < 20) bar.classList.add('danger');
      else if (pct < 50) bar.classList.add('warning');

      var sec = Math.ceil(remaining / 1000);
      $('#quiz-timer-text').textContent = String(sec).padStart(2, '0') + 's';

      if (sec <= 5 && sec > 0) Sound.tick();

      if (remaining <= 0) {
        clearInterval(state.questionTimerInterval);
        state.questionTimerInterval = null;
        handleTimeout();
      }
    }, 100);
  }

  function stopQuestionTimer() {
    if (state.questionTimerInterval) {
      clearInterval(state.questionTimerInterval);
      state.questionTimerInterval = null;
    }
  }

  function renderTimerText() {
    if (state.timerMode === 'total') {
      $('#quiz-timer-text').textContent = formatTimeShort(state.quizElapsedMs);
      var totalQ = state.questions.length;
      var answeredCount = state.answers.length;
      var pct = totalQ > 0 ? ((answeredCount / totalQ) * 100) : 0;
      if (state.locked && state.currentIndex < totalQ) {
        // Mid-question: show partial
      }
      $('#timer-bar').style.width = pct + '%';
      $('#timer-bar').classList.remove('warning', 'danger');
    }
  }

  function handleTimeout() {
    state.locked = true;
    var q = state.questions[state.currentIndex];
    var elapsed = performance.now() - state.questionStartTime;

    state.answers.push({
      selectedIndex: null,
      correct: false,
      timeMs: elapsed
    });

    Sound.wrong();
    showAnswerFeedback(null, q.correctIndex, false, true);
    lockOptions(null, q.correctIndex);
    updateProgressDots();
  }

  /* ---------- Rendering ---------- */
  function renderQuestion() {
    var idx = state.currentIndex;
    var q = state.questions[idx];
    var l = state.lang;

    state.locked = false;

    // Counter
    $('#quiz-counter').textContent = (idx + 1) + '/' + state.questions.length;

    // Category & difficulty
    var catKey = 'category_' + q.category;
    $('#quiz-category').textContent = t(catKey);
    var diffLabels = { 1: t('easy'), 2: t('medium'), 3: t('hard') };
    $('#quiz-difficulty').textContent = diffLabels[q.difficulty] || '';

    // Question text
    $('#quiz-question').textContent = q.question[l] || q.question.en;

    // Options
    var container = $('#quiz-options');
    container.innerHTML = '';
    var keys = ['A', 'B', 'C', 'D'];
    q.options.forEach(function (opt, i) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'option-btn';
      btn.setAttribute('role', 'radio');
      btn.setAttribute('aria-checked', 'false');
      btn.setAttribute('aria-label', keys[i] + ': ' + (opt[l] || opt.en));
      btn.innerHTML =
        '<span class="option-key">' + keys[i] + '</span>' +
        '<span class="option-text">' + sanitize(opt[l] || opt.en) + '</span>';
      btn.dataset.index = i;
      btn.addEventListener('click', function () { handleAnswer(i); });
      container.appendChild(btn);
    });

    // Hide feedback
    $('#feedback-panel').hidden = true;

    // Reset hint
    var hintEl = $('#hint-text');
    var hintBtnEl = $('#btn-hint');
    if (hintEl && hintBtnEl) {
      hintEl.textContent = '';
      hintEl.hidden = true;
      hintBtnEl.textContent = t('showHint');
    }

    // Timer bar
    if (state.timerMode === 'total') {
      renderTimerText();
    } else {
      startQuestionTimer();
    }

    // Next button text
    $('#btn-next').textContent = idx >= state.questions.length - 1 ? t('finishQuiz') : t('next');

    updateProgressDots();
  }

  function updateProgressDots() {
    var container = $('#progress-dots');
    container.innerHTML = '';
    for (var i = 0; i < state.questions.length; i++) {
      var dot = document.createElement('span');
      dot.className = 'progress-dot';
      dot.setAttribute('aria-hidden', 'true');
      if (i === state.currentIndex && state.answers.length <= i) {
        dot.classList.add('current');
      } else if (state.answers[i]) {
        dot.classList.add(state.answers[i].correct ? 'answered-correct' : 'answered-wrong');
      }
      container.appendChild(dot);
    }
  }

  function handleAnswer(selectedIdx) {
    if (state.locked) return;
    state.locked = true;

    var q = state.questions[state.currentIndex];
    var isCorrect = selectedIdx === q.correctIndex;
    var elapsed;

    if (state.timerMode === 'perQuestion') {
      stopQuestionTimer();
      elapsed = performance.now() - state.questionStartTime;
    } else {
      elapsed = performance.now() - (state.answers.length === 0 ? state.quizStartTime : state.questionStartTime);
    }

    state.answers.push({
      selectedIndex: selectedIdx,
      correct: isCorrect,
      timeMs: elapsed
    });

    if (isCorrect) Sound.correct();
    else Sound.wrong();

    lockOptions(selectedIdx, q.correctIndex);
    showAnswerFeedback(selectedIdx, q.correctIndex, isCorrect, false);
    updateProgressDots();
  }

  function lockOptions(selectedIdx, correctIdx) {
    var btns = $$('.option-btn');
    btns.forEach(function (btn, i) {
      btn.classList.add('locked');
      if (i === correctIdx) btn.classList.add('correct');
      if (selectedIdx !== null && i === selectedIdx && i !== correctIdx) btn.classList.add('wrong');
    });
  }

  function showAnswerFeedback(selectedIdx, correctIdx, isCorrect, isTimeout) {
    var panel = $('#feedback-panel');
    panel.hidden = false;

    var icon = $('#feedback-icon');
    var text = $('#feedback-text');
    var expl = $('#feedback-explanation');
    var q = state.questions[state.currentIndex];

    if (isTimeout) {
      icon.textContent = '\u23F0';
      text.textContent = t('timeUp');
      text.className = 'feedback-text wrong';
    } else if (isCorrect) {
      icon.textContent = '\u2705';
      text.textContent = t('correct');
      text.className = 'feedback-text correct';
    } else {
      icon.textContent = '\u274C';
      text.textContent = t('incorrect');
      text.className = 'feedback-text wrong';
    }

    expl.textContent = q.explanation[state.lang] || q.explanation.en;

    // Scroll feedback into view
    panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function goNext() {
    state.currentIndex++;
    if (state.currentIndex >= state.questions.length) {
      finishQuiz();
    } else {
      state.questionStartTime = performance.now();
      renderQuestion();
      // Scroll to top of quiz body
      $('.quiz-body').scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function finishQuiz() {
    if (state.submitted) return;
    state.submitted = true;

    if (state.timerMode === 'total') {
      stopTotalTimer();
    }

    var correctCount = state.answers.filter(function (a) { return a.correct; }).length;
    var totalTime;
    if (state.timerMode === 'total') {
      totalTime = state.quizElapsedMs;
    } else {
      totalTime = state.answers.reduce(function (sum, a) { return sum + a.timeMs; }, 0);
    }
    var accuracy = Math.round((correctCount / state.questions.length) * 100);

    var entry = {
      id: uuid(),
      name: state.playerName,
      lang: state.lang,
      correct: correctCount,
      totalQuestions: state.questions.length,
      timeMs: Math.round(totalTime),
      accuracy: accuracy,
      difficultyMode: state.difficultyMode,
      timerMode: state.timerMode,
      playedAtISO: new Date().toISOString()
    };

    var lb = addToLeaderboard(entry);
    var rank = getRank(lb, entry.id);
    state.lastEntryId = entry.id;

    Sound.complete();
    showResults(correctCount, totalTime, accuracy, rank);
  }

  function showResults(correctCount, totalTimeMs, accuracy, rank) {
    showScreen('results');

    $('#stat-correct').textContent = correctCount + '/' + state.questions.length;
    $('#stat-time').textContent = formatTime(totalTimeMs);
    $('#stat-accuracy').textContent = accuracy + '%';

    var rankStr = t('rankText').replace('#{rank}', rank !== null ? '#' + rank : '—');
    $('#results-rank').textContent = rankStr;

    renderReviewList();
  }

  function renderReviewList() {
    var container = $('#review-list');
    container.innerHTML = '';

    state.questions.forEach(function (q, i) {
      var answer = state.answers[i];
      var isCorrect = answer && answer.correct;
      var l = state.lang;
      var keys = ['A', 'B', 'C', 'D'];

      var item = document.createElement('div');
      item.className = 'review-item';

      var header = document.createElement('div');
      header.className = 'review-item-header';
      header.setAttribute('tabindex', '0');
      header.setAttribute('role', 'button');
      header.setAttribute('aria-expanded', 'false');

      var num = document.createElement('span');
      num.className = 'review-q-num ' + (isCorrect ? 'correct' : 'wrong');
      num.textContent = (i + 1);

      var title = document.createElement('span');
      title.className = 'review-q-title';
      title.textContent = q.question[l] || q.question.en;

      var chevron = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      chevron.setAttribute('width', '20');
      chevron.setAttribute('height', '20');
      chevron.setAttribute('viewBox', '0 0 24 24');
      chevron.setAttribute('fill', 'none');
      chevron.setAttribute('stroke', 'currentColor');
      chevron.setAttribute('stroke-width', '2');
      chevron.setAttribute('stroke-linecap', 'round');
      chevron.classList.add('review-chevron');
      var polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
      polyline.setAttribute('points', '6 9 12 15 18 9');
      chevron.appendChild(polyline);

      header.appendChild(num);
      header.appendChild(title);
      header.appendChild(chevron);

      var body = document.createElement('div');
      body.className = 'review-item-body';

      // User answer
      var userAns = document.createElement('p');
      userAns.className = 'review-answer ' + (isCorrect ? 'user-correct' : 'user-wrong');
      if (answer && answer.selectedIndex !== null) {
        var userOpt = q.options[answer.selectedIndex];
        userAns.innerHTML = '<strong>' + t('yourAnswer') + ':</strong> ' +
          keys[answer.selectedIndex] + '. ' + sanitize(userOpt[l] || userOpt.en);
      } else {
        userAns.innerHTML = '<strong>' + t('yourAnswer') + ':</strong> ' + t('noAnswer');
      }
      body.appendChild(userAns);

      // Correct answer
      var correctAns = document.createElement('p');
      correctAns.className = 'review-answer user-correct';
      var correctOpt = q.options[q.correctIndex];
      correctAns.innerHTML = '<strong>' + t('correctAnswer') + ':</strong> ' +
        keys[q.correctIndex] + '. ' + sanitize(correctOpt[l] || correctOpt.en);
      body.appendChild(correctAns);

      // Explanation
      var expl = document.createElement('div');
      expl.className = 'review-explanation';
      expl.textContent = q.explanation[l] || q.explanation.en;
      body.appendChild(expl);

      item.appendChild(header);
      item.appendChild(body);

      function toggleItem() {
        var open = item.classList.toggle('open');
        header.setAttribute('aria-expanded', open ? 'true' : 'false');
      }
      header.addEventListener('click', toggleItem);
      header.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleItem();
        }
      });

      container.appendChild(item);
    });
  }

  /* ---------- Leaderboard Rendering ---------- */
  function renderLeaderboard() {
    var lb = Storage.getLeaderboard();
    var diffFilter = $('#lb-filter-diff').value;
    var timerFilter = $('#lb-filter-timer').value;

    if (diffFilter !== 'all') {
      lb = lb.filter(function (e) { return e.difficultyMode === diffFilter; });
    }
    if (timerFilter !== 'all') {
      lb = lb.filter(function (e) { return e.timerMode === timerFilter; });
    }

    var container = $('#lb-list');
    container.innerHTML = '';

    if (lb.length === 0) {
      container.innerHTML = '<p class="lb-empty">' + t('emptyLeaderboard') + '</p>';
      return;
    }

    lb.forEach(function (entry, i) {
      var card = document.createElement('div');
      card.className = 'lb-card';
      if (entry.id === state.lastEntryId) card.classList.add('highlight');

      var rankEl = document.createElement('span');
      rankEl.className = 'lb-rank';
      if (i === 0) rankEl.classList.add('lb-rank-1');
      else if (i === 1) rankEl.classList.add('lb-rank-2');
      else if (i === 2) rankEl.classList.add('lb-rank-3');
      rankEl.textContent = (i + 1);

      var info = document.createElement('div');
      info.className = 'lb-info';

      var name = document.createElement('div');
      name.className = 'lb-name';
      name.textContent = sanitize(entry.name);

      var detail = document.createElement('div');
      detail.className = 'lb-detail';
      var diffText = t(entry.difficultyMode) || entry.difficultyMode;
      var timerText = entry.timerMode === 'total' ? t('total') : t('perQ');
      detail.textContent = diffText + ' \u00B7 ' + timerText + ' \u00B7 ' + formatTimeShort(entry.timeMs);

      info.appendChild(name);
      info.appendChild(detail);

      var score = document.createElement('span');
      score.className = 'lb-score';
      score.textContent = entry.correct + '/' + entry.totalQuestions;

      card.appendChild(rankEl);
      card.appendChild(info);
      card.appendChild(score);
      container.appendChild(card);
    });
  }

  /* ---------- Anti-cheat: History API ---------- */
  function pushQuizState() {
    try { history.pushState({ quiz: true }, ''); } catch (e) { /* ok */ }
  }

  function onPopState(e) {
    if (state.currentScreen === 'quiz') {
      // Stay on quiz: re-push
      pushQuizState();
    }
  }

  /* ---------- Start Quiz ---------- */
  function startQuiz() {
    var nameInput = $('#input-name');
    var name = nameInput.value.trim();

    // Sanitize: strip HTML tags
    name = name.replace(/<[^>]*>/g, '');

    if (name.length < 3 || name.length > 16) {
      nameInput.classList.add('invalid');
      $('#name-error').textContent = t('nameError');
      return;
    }

    nameInput.classList.remove('invalid');
    $('#name-error').textContent = '';

    state.playerName = name;
    state.sessionId = uuid();
    state.submitted = false;
    state.currentIndex = 0;
    state.answers = [];
    state.locked = false;
    state.quizElapsedMs = 0;
    state.lastEntryId = null;

    state.questions = prepareQuestions();

    // If not enough questions in pool, fill from all
    if (state.questions.length < QUESTIONS_PER_GAME) {
      var extra = prepareQuestionsAll();
      state.questions = state.questions.concat(extra).slice(0, QUESTIONS_PER_GAME);
    }

    showScreen('quiz');
    pushQuizState();

    state.questionStartTime = performance.now();

    if (state.timerMode === 'total') {
      startTotalTimer();
    }

    renderQuestion();
  }

  function prepareQuestionsAll() {
    var pool = shuffleArray(QUESTIONS);
    return pool.slice(0, QUESTIONS_PER_GAME).map(function (q) {
      var indices = shuffleArray([0, 1, 2, 3]);
      var newOptions = indices.map(function (i) { return q.options[i]; });
      var newCorrectIndex = indices.indexOf(q.correctIndex);
      return {
        id: q.id, category: q.category, difficulty: q.difficulty,
        question: q.question, options: newOptions,
        correctIndex: newCorrectIndex, explanation: q.explanation
      };
    });
  }

  /* ---------- Event Binding ---------- */
  function bindEvents() {
    // Close buttons
    $('#btn-close').addEventListener('click', closeGame);
    $('#btn-close-quiz').addEventListener('click', closeGame);
    $('#btn-close-results').addEventListener('click', closeGame);

    // Sound toggles
    $$('[id^="btn-sound"]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        Sound.toggle();
        updateSoundAndDarkIcons();
        Sound.click();
      });
    });

    // Dark toggle
    $('#btn-dark-start').addEventListener('click', function () {
      var isDark = document.documentElement.getAttribute('data-theme') !== 'dark';
      applyDark(isDark);
      Storage.setDark(isDark);
    });

    // Language toggles on start screen
    $$('[data-lang]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        $$('[data-lang]').forEach(function (b) {
          b.classList.remove('active');
          b.setAttribute('aria-checked', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-checked', 'true');
        applyLang(btn.dataset.lang);
      });
    });

    // In-game / results / leaderboard language toggles
    $$('.btn-lang-toggle').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var newLang = state.lang === 'ar' ? 'en' : 'ar';
        applyLang(newLang);
        // Re-render current screen content
        if (state.currentScreen === 'quiz' && !state.locked) {
          renderQuestion();
        } else if (state.currentScreen === 'quiz' && state.locked) {
          // Re-render question & feedback in new language
          var idx = state.currentIndex;
          var q = state.questions[idx];
          var l = state.lang;
          $('#quiz-question').textContent = q.question[l] || q.question.en;
          var btns = $$('.option-btn');
          var keys = ['A', 'B', 'C', 'D'];
          btns.forEach(function (b, i) {
            var opt = q.options[i];
            b.querySelector('.option-text').textContent = opt[l] || opt.en;
            b.setAttribute('aria-label', keys[i] + ': ' + (opt[l] || opt.en));
          });
          $('#feedback-explanation').textContent = q.explanation[l] || q.explanation.en;
          var answer = state.answers[idx];
          if (answer) {
            if (answer.selectedIndex === null) {
              $('#feedback-text').textContent = t('timeUp');
            } else if (answer.correct) {
              $('#feedback-text').textContent = t('correct');
            } else {
              $('#feedback-text').textContent = t('incorrect');
            }
          }
        } else if (state.currentScreen === 'results') {
          renderReviewList();
        } else if (state.currentScreen === 'leaderboard') {
          renderLeaderboard();
        }
      });
    });

    // Difficulty toggles
    $$('[data-diff]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        $$('[data-diff]').forEach(function (b) {
          b.classList.remove('active');
          b.setAttribute('aria-checked', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-checked', 'true');
        state.difficultyMode = btn.dataset.diff;
      });
    });

    // Timer mode toggles
    $$('[data-timer]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        $$('[data-timer]').forEach(function (b) {
          b.classList.remove('active');
          b.setAttribute('aria-checked', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-checked', 'true');
        state.timerMode = btn.dataset.timer;
      });
    });

    // Form submit
    $('#setup-form').addEventListener('submit', function (e) {
      e.preventDefault();
      startQuiz();
    });

    // Leaderboard buttons
    $('#btn-leaderboard-start').addEventListener('click', function () {
      state.lbSource = 'start';
      showScreen('leaderboard');
      renderLeaderboard();
    });

    $('#btn-leaderboard-results').addEventListener('click', function () {
      state.lbSource = 'results';
      showScreen('leaderboard');
      renderLeaderboard();
    });

    // Back from leaderboard
    $('#btn-back-lb').addEventListener('click', function () {
      showScreen(state.lbSource === 'results' ? 'results' : 'start');
    });

    // Leaderboard filters
    $('#lb-filter-diff').addEventListener('change', renderLeaderboard);
    $('#lb-filter-timer').addEventListener('change', renderLeaderboard);

    // Reset leaderboard
    $('#btn-reset-lb').addEventListener('click', function () {
      $('#modal-reset').hidden = false;
    });
    $('#btn-modal-cancel').addEventListener('click', function () {
      $('#modal-reset').hidden = true;
    });
    $('#btn-modal-confirm').addEventListener('click', function () {
      Storage.clearLeaderboard();
      $('#modal-reset').hidden = true;
      renderLeaderboard();
    });

    // Next button
    $('#btn-next').addEventListener('click', goNext);

    // Play again
    $('#btn-play-again').addEventListener('click', function () {
      showScreen('start');
    });

    // Hint toggle
    var hintBtn = $('#btn-hint');
    if (hintBtn) {
      hintBtn.addEventListener('click', function () {
        if (!state.questions.length) return;
        var q = state.questions[state.currentIndex];
        var hintEl = $('#hint-text');
        if (!hintEl) return;
        var isVisible = !hintEl.hidden && hintEl.textContent;
        if (!isVisible) {
          var hint = getHintText(q);
          if (!hint) return;
          hintEl.textContent = t('hint') + ': ' + hint;
          hintEl.hidden = false;
          hintBtn.textContent = t('hideHint');
        } else {
          hintEl.textContent = '';
          hintEl.hidden = true;
          hintBtn.textContent = t('showHint');
        }
      });
    }

    // History popstate (anti-cheat)
    window.addEventListener('popstate', onPopState);

    // Keyboard support
    document.addEventListener('keydown', function (e) {
      if (state.currentScreen !== 'quiz') return;

      if (!state.locked) {
        if (e.key >= '1' && e.key <= '4') {
          var idx = parseInt(e.key, 10) - 1;
          var btns = $$('.option-btn');
          if (btns[idx]) {
            handleAnswer(idx);
          }
        }
      } else {
        if (e.key === 'Enter') {
          goNext();
        }
      }
    });
  }

  /* ---------- Initialize ---------- */
  function init() {
    Sound.init();
    applyDark(Storage.getDark());
    applyLang('en');
    updateSoundAndDarkIcons();
    bindEvents();

    // Set initial input name focus
    setTimeout(function () {
      try { $('#input-name').focus(); } catch (e) { /* ok */ }
    }, 300);
  }

  // Boot
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose namespace
  window.RamadanQuizApp = {
    version: '1.0.0',
    state: state,
    QUESTIONS_PER_GAME: QUESTIONS_PER_GAME,
    PER_QUESTION_SECONDS: PER_QUESTION_SECONDS
  };

})();
