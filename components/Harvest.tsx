
import React from 'react';
import CardNavigator from './CardNavigator';

const REPENTANCE_STEPS = [
  { title: "الإقلاع فوراً", desc: "توقف عن الكلام في اللحظة اللي تدرك فيها إنك بتغلط.", icon: "🚫", example: "اسكت فوراً وغير الموضوع حتى لو كلامك مخلصش." },
  { title: "الندم الحقيقي", desc: "استشعر في قلبك إنك مش راضي عن الذنب ده.", icon: "😔", example: "تخيل بشاعة الذنب واستغفر بقلب منكسر وصادق." },
  { title: "العزم على عدم العودة", desc: "قرر بصدق إنك مش هترجع للعادة دي تاني.", icon: "💪", example: "اعزم إنك لو اتحطيت في نفس الموقف تخرج من المجلس." },
  { title: "رد المظالم", desc: "لو الكلام جرح حد، لازم تطيّب خاطره أو تذكره بالخير.", icon: "💎", example: "اذكر ميزة واحدة حقيقية للشخص قدام اللي سمعوك." }
];

const DUAS = [
  { text: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ شَرِّ سَمْعِي، وَمِنْ شَرِّ بَصَرِي، وَمِنْ شَرِّ لِسَانِي، وَمِنْ شَرِّ قَلْبِي", source: "سنن النسائي والترمذي", benefit: "تعوّذ شامل من جوارح الإنسان التي قد تورد المهالك.", category: "وقاية شاملة" },
  { text: "اللَّهُمَّ اهْدِ قَلْبِي، وَسَدِّدْ لِسَانِي، وَاسْلُلْ سَخِيمَةَ صَدْرِي", source: "مسند أحمد والترمذي", benefit: "سؤال الله أن يوجه اللسان للحق ويطهر القلب من الحقد.", category: "توجيه اللسان" },
  { text: "اللَّهُمَّ كَمَا حَسَّنْتَ خَلْقِي فَحَسِّنْ خُلُقِي", source: "مسند أحمد وصححه الألباني", benefit: "دعاء جامع لطلب جمال الأخلاق.", category: "حسن الخلق" },
  { text: "اللَّهُمَّ طَهِّرْ قَلْبِي مِنَ النِّفَاقِ، وَعَمَلِي مِنَ الرِّيَاءِ، وَلِسَانِي مِنَ الْكَذِبِ", source: "دعاء مأثور", benefit: "طلب الطهارة لأخطر ثلاث جوارح.", category: "تزكية النفس" }
];

const STEPS = [
  { title: "1. الفرملة اللحظية", desc: "أول ما تحس إنك بدأت 'تهبد' أو تغتاب، اقطع الجملة فوراً.", tip: "استخدم قاعدة الـ 3 ثواني: اصمت، خد نفس، واسأل نفسك: هل الكلمة دي هتسعدني يوم القيامة؟", example: "بدل ما تكمل: 'فلان ده أصلاً بخيل..' اقطع كلامك وغير الموضوع.", icon: "🛑", color: "bg-red-100 text-red-600" },
  { title: "2. تطهير القلب", desc: "التوبة هي وجع في القلب على الذنب. استشعر إنك جرحت أخوك في غيابه.", tip: "عاقب نفسك بشيء تحبه لو رجعت للذنب، زي صدقة بسيطة.", example: "قول في سرك: 'يا رب أنا آسف، سامحني وطهر لساني'.", icon: "🤲", color: "bg-blue-100 text-blue-600" },
  { title: "3. كفارة المجلس", desc: "لو اغتبت حد قدام أشخاص، لازم تذكره بالخير قدام نفس الأشخاص.", tip: "نقي صفة واحدة حلوة في الشخص ده وقولها بصدق.", example: "فلان اللي اتكلمنا عليه من شوية عنده خصلة كريمة أوي.", icon: "🧼", color: "bg-amber-100 text-amber-600" },
  { title: "4. رد المظالم", desc: "لو الكلام وصل للشخص وأذاه، الأفضل تعتذر له بوضوح.", tip: "إذا اعتذرت، كن مقتضباً وصادقاً.", example: "يا فلان سامحني، لساني زل في حقك وأنا ندمان.", icon: "🤝", color: "bg-emerald-100 text-emerald-600" },
  { title: "5. سلاح الدعاء", desc: "لما تدعي للي ظلمته، إنت بتتحول من 'خصم' لـ 'داعي له'.", tip: "خلي لك ورد يومي: 'اللهم اغفر لكل من اغتبته'.", example: "يا رب ارزق فلان السعادة والبركة في أولاده.", icon: "🕊️", color: "bg-purple-100 text-purple-600" },
  { title: "6. صناعة الحصن", desc: "التوبة الحقيقية هي إنك تحط 'خطة دفاع' للمستقبل.", tip: "عود نفسك على 'صيام اللسان' ساعة يومياً.", example: "قرر إنك النهاردة مش هتعلق على أي بوست سلبي.", icon: "🏰", color: "bg-indigo-100 text-indigo-600" }
];

const Harvest: React.FC = () => {
  const cards = [
    // Card 1: Intro + Repentance pillars
    {
      title: 'أركان التوبة',
      icon: '🌿',
      content: (
        <div className="space-y-4 px-2 py-3">
          <div className="text-center mb-3">
            <h2 className="text-xl font-black text-emerald-800">رفيق اللسان 🌿</h2>
            <p className="text-slate-500 text-xs mt-1">منهج عملي لتطهير صحيفتك</p>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-emerald-50 p-4 rounded-2xl border border-amber-100">
            <h3 className="text-sm font-bold text-amber-900 mb-3 text-center">أركان التوبة من آفات اللسان</h3>
            <div className="grid grid-cols-2 gap-3">
              {REPENTANCE_STEPS.map((s, i) => (
                <div key={i} className="bg-white p-3 rounded-2xl text-center shadow-sm border border-white hover:border-amber-200 transition-all">
                  <span className="text-2xl block mb-1">{s.icon}</span>
                  <h4 className="font-bold text-xs text-slate-800 mb-0.5">{s.title}</h4>
                  <p className="text-[10px] text-slate-500 leading-tight">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    // Cards 2-7: Each repair step
    ...STEPS.map((step) => ({
      title: step.title,
      icon: step.icon,
      content: (
        <div className="px-2 py-3 space-y-4">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-3">
              <span className={`text-2xl p-2 rounded-2xl ${step.color}`}>{step.icon}</span>
              <h3 className="font-black text-lg text-slate-800">{step.title}</h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">{step.desc}</p>
            <div className="p-3 bg-slate-50 rounded-2xl border-r-4 border-slate-300 mb-3">
              <p className="font-bold text-xs text-slate-500 mb-1">📌 نصيحة رفيق اللسان:</p>
              <p className="text-xs text-slate-700 font-bold">{step.tip}</p>
            </div>
            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
              <p className="text-sm text-emerald-900 italic font-bold">"{step.example}"</p>
            </div>
          </div>
        </div>
      ),
    })),
    // Card 8: Duas
    {
      title: 'حصن اللسان',
      icon: '🤲',
      content: (
        <div className="space-y-3 px-2 py-3">
          <h3 className="text-lg font-bold text-indigo-900 text-center mb-2">حصن اللسان (أدعية الاستقامة)</h3>
          {DUAS.map((dua, i) => (
            <div key={i} className="bg-white p-4 rounded-2xl border border-indigo-50 shadow-sm text-center">
              <span className="text-[9px] font-black uppercase tracking-widest text-indigo-400 block mb-2">{dua.category}</span>
              <p className="text-base font-classic font-bold text-slate-800 leading-relaxed mb-2">"{dua.text}"</p>
              <p className="text-[10px] font-bold text-indigo-600/70 mb-0.5">{dua.benefit}</p>
              <p className="text-[9px] text-slate-400 italic">المصدر: {dua.source}</p>
            </div>
          ))}
        </div>
      ),
    },
    // Card 9: Final wisdom
    {
      title: 'خاتمة',
      icon: '💎',
      content: (
        <div className="py-6 px-3">
          <div className="bg-indigo-900 text-white p-6 rounded-2xl text-center shadow-xl">
            <p className="text-lg font-bold leading-relaxed italic">
              "اللسان بوابتك للجنة أو للنار.. اجعل مفتاح هذه البوابة هو 'ذكر الله' دائماً، فمن كان لسانه رطباً بالذكر لم يجد مكاناً للغيبة."
            </p>
          </div>
        </div>
      ),
    },
  ];

  return <CardNavigator cards={cards} accentColor="purple" />;
};

export default Harvest;
