
import React, { useState, useEffect } from 'react';
import CardNavigator from './CardNavigator';
import { useDailyContent } from '../hooks/useDailyContent';
import { saveChallengeCompletions, getChallengeCompletions, saveDailyChallengeAcceptance, getDailyChallengeAcceptance } from '../services/userDataService';

interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'سهل' | 'متوسط' | 'صعب';
  points: number;
  icon: string;
  category: 'فردي' | 'عائلي' | 'أصدقاء';
}

interface ChallengesProps {
  setActiveTab: (tab: string) => void;
}

const ALL_CHALLENGES: Challenge[] = [
  { id: 'silent_hour', title: 'ساعة صمت', description: 'جرب تقعد ساعة كاملة من غير ما تتكلم خالص إلا للضرورة القصوى.', difficulty: 'سهل', points: 10, icon: '🤫', category: 'فردي' },
  { id: 'three_compliments', title: 'جبر خواطر', description: 'قول كلمة حلوة حقيقية لـ 3 أشخاص مختلفين النهادرى.', difficulty: 'سهل', points: 15, icon: '🌸', category: 'فردي' },
  { id: 'no_complaining', title: 'يوم بلا شكوى', description: 'ممنوع تشتكي من الجو أو الزحمة لمدة يوم كامل.', difficulty: 'متوسط', points: 30, icon: '🚫', category: 'فردي' },
  { id: 'family_compliment', title: 'ثناء عائلي', description: 'امدح خصلة طيبة في واحد من أهلك قدام باقي العيلة.', difficulty: 'سهل', points: 20, icon: '🏠', category: 'عائلي' },
  { id: 'friends_cleanup', title: 'تطهير الجروب', description: 'لو حد بدأ يغتاب في جروب الأصحاب، غير الموضوع فوراً.', difficulty: 'متوسط', points: 25, icon: '👥', category: 'أصدقاء' },
  { id: 'dinner_no_phone', title: 'عشاء بلا آفات', description: 'اجلس مع أهلك ع العشاء بدون موبايل وبدون كلام عن حد غايب.', difficulty: 'صعب', points: 40, icon: '🍽️', category: 'عائلي' },
  { id: 'no_joking_insults', title: 'هزار راقي', description: 'ممنوع استخدام أي شتيمة أو لفظ خارج مع صحابك حتى لو "هزار" لمدة يوم.', difficulty: 'متوسط', points: 35, icon: '🤐', category: 'أصدقاء' },
  { id: 'praise_stranger', title: 'كلمة لغريب', description: 'ألقي السلام وقول كلمة طيبة لشخص متعرفوش (بائع، سائق، جار).', difficulty: 'سهل', points: 10, icon: '👋', category: 'فردي' },
  { id: 'no_gossip_all_day', title: 'يوم بلا غيبة', description: 'حاول تمر اليوم كله من غير ما تتكلم عن حد في غيابه.', difficulty: 'صعب', points: 50, icon: '🔒', category: 'فردي' },
  { id: 'quran_reading', title: 'ورد قرآن اللسان', description: 'اقرأ صفحة من القرآن ببطء وتدبر بدل ما تفتح السوشيال.', difficulty: 'سهل', points: 15, icon: '📖', category: 'فردي' },
  { id: 'forgive_someone', title: 'عفو وصفح', description: 'سامح حد زعلك وابعتله رسالة لطيفة أو ادعيله في سرك.', difficulty: 'صعب', points: 45, icon: '💚', category: 'فردي' },
  { id: 'family_dua', title: 'دعاء عائلي', description: 'اجمع أهلك وادعوا مع بعض دعاء قصير قبل النوم.', difficulty: 'سهل', points: 20, icon: '🤲', category: 'عائلي' },
  { id: 'positive_group', title: 'رسالة إيجابية', description: 'ابعت رسالة تشجيع أو دعاء في جروب الأصحاب بدل الميمز.', difficulty: 'سهل', points: 15, icon: '💬', category: 'أصدقاء' },
  { id: 'no_sarcasm', title: 'يوم بلا سخرية', description: 'ممنوع تعلق بسخرية على أي حد لا أونلاين ولا أوفلاين.', difficulty: 'متوسط', points: 30, icon: '🎭', category: 'فردي' },
  { id: 'dhikr_100', title: '100 استغفار', description: 'استغفر الله 100 مرة النهاردة كتطهير للسان.', difficulty: 'سهل', points: 10, icon: '📿', category: 'فردي' },
];

// ─── Quiz Question Pool (Expanded) ────────────────────────
const ALL_QUIZ_QUESTIONS = [
  { question: "ما هي كفارة الغيبة لمن تعذر عليه الوصول للمغتاب؟", options: ["الصيام", "الاستغفار له والدعاء له", "الصدقة"], correct: 1, explanation: "الدعاء بظهر الغيب يجزئ إن تعذر الاعتذار." },
  { question: "من هو المفلس الحقيقي؟", options: ["من لا مال له", "من يأتي بحسنات ويأتي وقد شتم وظلم", "من خسر تجارته"], correct: 1, explanation: "المفلس من تذهب حسناته لغيره بسبب أذية الناس." },
  { question: "ما معنى 'الغيبة' شرعاً؟", options: ["ذكرك أخاك بما يكره في غيبته", "نقل الكلام للإفساد", "قول الزور"], correct: 0, explanation: "ذكر الشخص بما يكره وإن كان فيه." },
  { question: "ما أشد أنواع آفات اللسان إثماً؟", options: ["اللغو", "الشرك بالله والقذف", "كثرة المزاح"], correct: 1, explanation: "الشرك والقذف من الموبقات." },
  { question: "أي السور ذكرت 'ويل لكل همزة لمزة'؟", options: ["الهمزة", "العصر", "الماعون"], correct: 0, explanation: "سورة الهمزة تتوعد من يغتاب ويلمز الناس." },
  { question: "ما هو حكم 'الغيبة الإلكترونية'؟", options: ["أهون من العادية", "محرمة ومضاعفة الانتشار", "ليست غيبة"], correct: 1, explanation: "هي محرمة وإثمها عظيم لسرعة انتشارها." },
  { question: "ماذا نفعل إذا وقعنا في مجلس فيه غيبة؟", options: ["نصمت فقط", "ننكر بلساننا أو ننسحب", "نغير الموضوع"], correct: 1, explanation: "يجب الإنكار أو الانسحاب." },
  { question: "من صفات المؤمن أنه ليس بـ..؟", options: ["طعان ولا لعان", "كثير النوم", "قليل الكلام"], correct: 0, explanation: "المؤمن ليس بطعان ولا لعان ولا فاحش ولا بذيء." },
  { question: "ما الفرق بين الغيبة والبهتان؟", options: ["لا فرق بينهما", "الغيبة: ذكر ما فيه، البهتان: ذكر ما ليس فيه", "البهتان أخف من الغيبة"], correct: 1, explanation: "البهتان أشد لأنه كذب على الشخص فوق الغيبة." },
  { question: "ما حكم الاستماع للغيبة؟", options: ["جائز إذا لم أشارك", "محرم كقائلها", "مكروه فقط"], correct: 1, explanation: "المستمع للغيبة شريك فيها ويأثم كقائلها." },
  { question: "من قال 'إذا تم العقل نقص الكلام'؟", options: ["عمر بن الخطاب", "علي بن أبي طالب", "الحسن البصري"], correct: 1, explanation: "قالها الإمام علي رضي الله عنه." },
  { question: "ما معنى النميمة؟", options: ["الكذب في القول", "نقل الكلام بين الناس للإفساد", "السخرية من الآخرين"], correct: 1, explanation: "النميمة هي نقل الكلام بين الناس على وجه الإفساد." },
  { question: "ما جزاء من يرد عن عرض أخيه المسلم؟", options: ["الثناء من الناس", "يرد الله عن وجهه النار", "لا شيء"], correct: 1, explanation: "من رد عن عرض أخيه رد الله عن وجهه النار يوم القيامة." },
  { question: "ماذا يضمن النبي ﷺ لمن حفظ لسانه وفرجه؟", options: ["المال", "الجنة", "الصحة"], correct: 1, explanation: "من يضمن لي ما بين لحييه وما بين رجليه أضمن له الجنة." },
  { question: "ما هي الكلمة الطيبة في الإسلام؟", options: ["المجاملة فقط", "صدقة", "واجب اجتماعي"], correct: 1, explanation: "الكلمة الطيبة صدقة كما أخبر النبي ﷺ." },
  { question: "من الذي كان يضع حصاة في فمه ليمنع نفسه من الكلام؟", options: ["عمر بن الخطاب", "أبو بكر الصديق", "علي بن أبي طالب"], correct: 1, explanation: "كان الصديق يفعل ذلك ويقول: هذا الذي أوردني الموارد." },
  { question: "ما معنى 'الهمز واللمز'؟", options: ["المدح والثناء", "الطعن بالقول والإشارة", "النصيحة"], correct: 1, explanation: "الهمز: الطعن بالفعل والإشارة، واللمز: الطعن بالقول." },
  { question: "كم مرة ذُكر اللسان في القرآن تحذيراً؟", options: ["مرة واحدة", "أكثر من 10 مرات", "3 مرات"], correct: 1, explanation: "ذُكر في آيات كثيرة تحذيراً وترغيباً في حفظه." },
];

// ─── Date-based seeded shuffle ─────────────────────────────
function getDaySeed(): number {
  const today = new Date();
  return today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
}

function getWeekSeed(): number {
  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 1);
  const weekNumber = Math.ceil(((today.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7);
  return today.getFullYear() * 100 + weekNumber;
}

function seededShuffle<T>(array: T[], seed: number): T[] {
  const shuffled = [...array];
  let s = seed;
  for (let i = shuffled.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const j = s % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function getDailyQuizzes() {
  const seed = getDaySeed();
  const shuffled = seededShuffle(ALL_QUIZ_QUESTIONS, seed);
  return {
    daily: shuffled.slice(0, 3),
    weekly: seededShuffle(ALL_QUIZ_QUESTIONS, getWeekSeed()).slice(3, 8),
    monthly: seededShuffle(ALL_QUIZ_QUESTIONS, Math.floor(seed / 100)).slice(5, 10),
  };
}

function getDailyChallenges(): Challenge[] {
  const seed = getDaySeed();
  const shuffled = seededShuffle(ALL_CHALLENGES, seed);
  return shuffled.slice(0, 7); // Show 7 challenges per day
}

const Challenges: React.FC<ChallengesProps> = ({ setActiveTab }) => {
  const [completed, setCompleted] = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<'الكل' | 'فردي' | 'عائلي' | 'أصدقاء'>('الكل');
  const [quizType, setQuizType] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [quizState, setQuizState] = useState<'idle' | 'playing' | 'finished'>('idle');
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [dailyChallengeAccepted, setDailyChallengeAccepted] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const QUIZZES = getDailyQuizzes();
  const todayChallenges = getDailyChallenges();

  useEffect(() => {
    const loadData = async () => {
      // Load from Supabase
      const completions = await getChallengeCompletions(today);
      if (completions.length > 0) {
        setCompleted(completions);
      } else {
        // Fallback to localStorage
        const savedData = localStorage.getItem('completed_challenges_data');
        if (savedData) {
          const parsed = JSON.parse(savedData);
          if (parsed.date === today) setCompleted(parsed.challenges);
        }
      }

      // Check daily challenge acceptance from Supabase
      const accepted = await getDailyChallengeAcceptance(today);
      if (accepted) {
        setDailyChallengeAccepted(true);
      } else {
        const savedAccepted = localStorage.getItem('daily_challenge_accepted');
        if (savedAccepted === today) setDailyChallengeAccepted(true);
      }
    };
    loadData();
  }, [today]);

  const toggleChallenge = (id: string) => {
    const newCompleted = completed.includes(id) ? completed.filter(c => c !== id) : [...completed, id];
    setCompleted(newCompleted);
    // Save to Supabase + localStorage fallback
    saveChallengeCompletions(today, newCompleted);
    localStorage.setItem('completed_challenges_data', JSON.stringify({ date: today, challenges: newCompleted }));
  };

  const acceptDailyChallenge = () => {
    saveDailyChallengeAcceptance(today);
    localStorage.setItem('daily_challenge_accepted', today);
    setDailyChallengeAccepted(true);
  };

  const startQuiz = (type: 'daily' | 'weekly' | 'monthly') => {
    setQuizType(type);
    setQuizIndex(0);
    setQuizScore(0);
    setQuizState('playing');
    setSelectedOption(null);
  };

  const handleOptionSelect = (idx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    if (idx === QUIZZES[quizType][quizIndex].correct) setQuizScore(prev => prev + 1);
  };

  const nextQuestion = () => {
    if (quizIndex < QUIZZES[quizType].length - 1) {
      setQuizIndex(prev => prev + 1);
      setSelectedOption(null);
    } else {
      setQuizState('finished');
    }
  };

  const filteredChallenges = todayChallenges.filter(ch => categoryFilter === 'الكل' || ch.category === categoryFilter);

  const totalPoints = todayChallenges
    .filter(ch => completed.includes(ch.id))
    .reduce((sum, ch) => sum + ch.points, 0);

  const { content: daily, isLoading: dailyLoading } = useDailyContent();

  const difficultyColor = (d: string) => {
    if (d === 'سهل') return 'bg-emerald-100 text-emerald-700';
    if (d === 'متوسط') return 'bg-amber-100 text-amber-700';
    return 'bg-rose-100 text-rose-700';
  };

  const cards = [
    // Card 0: Daily AI Challenge
    {
      title: 'تحدي اليوم ✨',
      icon: '🤖',
      content: (
        <div className="space-y-4 px-2 py-3">
          <div className="text-center mb-2">
            <div className="text-3xl mb-1">🤖✨</div>
            <h2 className="text-xl font-black text-amber-800">تحدي اليوم من الذكاء الاصطناعي</h2>
            <p className="text-[10px] text-slate-400 font-bold">يتجدد يومياً تلقائياً — {new Date().toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
          </div>

          {dailyLoading ? (
            <div className="space-y-3">
              <div className="loading-shimmer h-28 w-full"></div>
              <div className="loading-shimmer h-12 w-full"></div>
            </div>
          ) : daily ? (
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-2xl p-5 shadow-xl">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-4xl">{daily.challenge.icon}</span>
                  <div>
                    <h3 className="text-lg font-black">{daily.challenge.title}</h3>
                    <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">{daily.challenge.points} نقطة</span>
                  </div>
                </div>
                <p className="text-sm leading-relaxed opacity-90">{daily.challenge.description}</p>
                <div className="mt-4 bg-white/10 rounded-xl p-3">
                  <p className="text-xs italic">💡 {daily.tip}</p>
                </div>
              </div>

              <button
                onClick={acceptDailyChallenge}
                disabled={dailyChallengeAccepted}
                className={`w-full py-3.5 rounded-2xl font-black text-sm shadow-lg transition-all active:scale-95 ${dailyChallengeAccepted
                  ? 'bg-emerald-100 text-emerald-600 border-2 border-emerald-300'
                  : 'bg-amber-600 text-white hover:bg-amber-700'
                  }`}
              >
                {dailyChallengeAccepted ? '✅ قبلت التحدي — بالتوفيق!' : '🔥 قبلت التحدي!'}
              </button>
            </div>
          ) : (
            <div className="bg-slate-100 rounded-2xl p-5 text-center">
              <p className="text-slate-500 text-sm">لم يتم تحميل التحدي اليومي</p>
            </div>
          )}
        </div>
      ),
    },
    // Card 1: Daily Challenges
    {
      title: 'تحديات اليوم',
      icon: '🏆',
      content: (
        <div className="space-y-4 px-2 py-3">
          <div className="text-center mb-2">
            <h2 className="text-xl font-black text-emerald-800">تحديات اليوم 🏆</h2>
            <p className="text-slate-500 text-xs mt-1">تتجدد يومياً — {new Date().toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
          </div>

          {/* Points counter */}
          <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 text-white rounded-2xl p-4 flex items-center justify-between shadow-lg">
            <div>
              <p className="text-[10px] font-bold text-emerald-200">نقاط اليوم</p>
              <p className="text-3xl font-black">{totalPoints}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-emerald-200">مكتملة</p>
              <p className="text-xl font-black">{completed.length} / {todayChallenges.length}</p>
            </div>
            <div className="text-4xl">🏅</div>
          </div>

          <div className="flex justify-center gap-2 overflow-x-auto scrollbar-hide py-1">
            {['الكل', 'فردي', 'عائلي', 'أصدقاء'].map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat as any)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 ${categoryFilter === cat ? 'bg-emerald-600 text-white shadow-md' : 'bg-white text-slate-500 border border-slate-100 hover:border-slate-300'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filteredChallenges.map((ch) => (
              <button
                key={ch.id}
                onClick={() => toggleChallenge(ch.id)}
                className={`w-full p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3 text-right active:scale-[0.98] ${completed.includes(ch.id) ? 'bg-emerald-50 border-emerald-500' : 'bg-white border-slate-100 shadow-sm hover:border-slate-300'
                  }`}
              >
                <span className="text-2xl">{ch.icon}</span>
                <div className="flex-1 min-w-0">
                  <h3 className={`font-black text-sm ${completed.includes(ch.id) ? 'text-emerald-700 line-through' : 'text-slate-800'}`}>{ch.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2">{ch.description}</p>
                  <div className="flex gap-1.5 mt-1">
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">{ch.category}</span>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${difficultyColor(ch.difficulty)}`}>{ch.difficulty}</span>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">{ch.points} نقطة</span>
                  </div>
                </div>
                {completed.includes(ch.id) ? (
                  <span className="text-xl text-emerald-500">✅</span>
                ) : (
                  <div className="w-6 h-6 rounded-full border-2 border-slate-200 shrink-0"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      ),
    },
    // Card 2: Quiz section
    {
      title: 'مسابقة اليوم',
      icon: '🎯',
      content: (
        <div className="px-2 py-3">
          <div className="bg-indigo-950 text-white p-5 rounded-2xl shadow-2xl">
            {quizState === 'idle' ? (
              <div className="text-center space-y-4">
                <h3 className="text-lg font-black">مسابقات اليوم 🎯</h3>
                <p className="text-indigo-300 text-xs">أسئلة جديدة كل يوم — اختبر معلوماتك!</p>
                <p className="text-[10px] text-indigo-500">{new Date().toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                <div className="grid grid-cols-3 gap-3">
                  <button onClick={() => startQuiz('daily')} className="p-4 bg-indigo-900/50 border border-indigo-700 rounded-2xl hover:bg-indigo-800 transition-all active:scale-95">
                    <span className="text-2xl block mb-1">🌞</span>
                    <span className="font-bold text-xs">يومية</span>
                    <span className="text-[9px] block text-indigo-400">{QUIZZES.daily.length} سؤال</span>
                    <span className="text-[8px] block text-amber-400 mt-0.5">تتجدد يومياً</span>
                  </button>
                  <button onClick={() => startQuiz('weekly')} className="p-4 bg-indigo-900/50 border border-indigo-700 rounded-2xl hover:bg-indigo-800 transition-all active:scale-95">
                    <span className="text-2xl block mb-1">📅</span>
                    <span className="font-bold text-xs">أسبوعية</span>
                    <span className="text-[9px] block text-indigo-400">{QUIZZES.weekly.length} سؤال</span>
                    <span className="text-[8px] block text-amber-400 mt-0.5">تتجدد أسبوعياً</span>
                  </button>
                  <button onClick={() => startQuiz('monthly')} className="p-4 bg-indigo-900/50 border border-indigo-700 rounded-2xl hover:bg-indigo-800 transition-all active:scale-95">
                    <span className="text-2xl block mb-1">🏆</span>
                    <span className="font-bold text-xs">شهرية</span>
                    <span className="text-[9px] block text-indigo-400">{QUIZZES.monthly.length} سؤال</span>
                    <span className="text-[8px] block text-amber-400 mt-0.5">تتجدد شهرياً</span>
                  </button>
                </div>
              </div>
            ) : quizState === 'playing' ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs text-indigo-300 mb-2">
                  <span>سؤال {quizIndex + 1} من {QUIZZES[quizType].length}</span>
                  <span>النتيجة: {quizScore}</span>
                </div>
                <h3 className="text-lg font-black text-center">{QUIZZES[quizType][quizIndex].question}</h3>
                <div className="space-y-2">
                  {QUIZZES[quizType][quizIndex].options.map((opt, i) => (
                    <button
                      key={i}
                      disabled={selectedOption !== null}
                      onClick={() => handleOptionSelect(i)}
                      className={`w-full p-4 rounded-2xl border-2 text-right font-bold text-sm transition-all active:scale-[0.98] ${selectedOption !== null
                        ? (i === QUIZZES[quizType][quizIndex].correct ? 'bg-emerald-600 border-emerald-400' : (i === selectedOption ? 'bg-rose-600 border-rose-400' : 'opacity-40'))
                        : 'bg-indigo-900/40 border-indigo-700 hover:bg-indigo-800'
                        }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                {selectedOption !== null && (
                  <div className="space-y-2">
                    <div className={`p-3 rounded-xl text-xs text-center font-bold ${selectedOption === QUIZZES[quizType][quizIndex].correct ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
                      {selectedOption === QUIZZES[quizType][quizIndex].correct ? '✅ إجابة صحيحة!' : '❌ إجابة خاطئة'}
                    </div>
                    <p className="text-xs text-indigo-300 text-center">{QUIZZES[quizType][quizIndex].explanation}</p>
                    <button onClick={nextQuestion} className="w-full bg-white text-indigo-950 font-black py-3 rounded-2xl shadow-xl text-sm active:scale-95 transition-all">
                      {quizIndex < QUIZZES[quizType].length - 1 ? 'السؤال التالي ➡️' : 'عرض النتيجة 🏁'}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-4 space-y-4">
                <div className="text-5xl mb-2">
                  {quizScore === QUIZZES[quizType].length ? '🏆' : quizScore > 0 ? '👏' : '📚'}
                </div>
                <h3 className="text-2xl font-black">
                  {quizScore === QUIZZES[quizType].length ? 'ماشاء الله! كلها صح!' : 'انتهى التحدي!'}
                </h3>
                <div className="text-lg">نتيجتك: <span className="text-emerald-400 font-black">{quizScore}</span> من {QUIZZES[quizType].length}</div>
                <div className="flex gap-2">
                  <button onClick={() => startQuiz(quizType)} className="flex-1 bg-indigo-700 text-white px-4 py-3 rounded-2xl font-bold text-sm active:scale-95 transition-all">
                    أعد المحاولة 🔄
                  </button>
                  <button onClick={() => setQuizState('idle')} className="flex-1 bg-white text-indigo-950 px-4 py-3 rounded-2xl font-black text-sm active:scale-95 transition-all">
                    رجوع للمسابقات
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ),
    },
  ];

  return <CardNavigator cards={cards} accentColor="amber" enableAutoAdvance={false} />;
};

export default Challenges;
