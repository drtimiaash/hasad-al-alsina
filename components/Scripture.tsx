
import React, { useState } from 'react';
import CardNavigator from './CardNavigator';

const CopyButton: React.FC<{ text: string }> = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy} className={`p-1.5 rounded-xl transition-all flex items-center gap-1 text-[10px] font-bold ${copied ? 'bg-emerald-500 text-white shadow-lg' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
      <span>{copied ? '✅ تم' : '📋 نسخ'}</span>
    </button>
  );
};

const VERSES = [
  { text: "يَا أَيُّهَا الَّذِينَ آمَنُوا اتَّقُوا اللَّهَ وَقُولُوا قَوْلًا سَدِيدًا * يُصْلِحْ لَكُمْ أَعْمَالَكُمْ وَيَغْفِرْ لَكُمْ ذُنُوبَكُمْ", source: "سورة الأحزاب", topic: "القول السديد", hint: "الكلمة لما تطلع دغري وصادقة، ربنا بيصلح حالك." },
  { text: "وَقُولُوا لِلنَّاسِ حُسْنًا", source: "سورة البقرة", topic: "الكلمة الحلوة", hint: "أمر مباشر إن كلامك مع كل البشر يكون فيه لطف وذوق." },
  { text: "مَّا يَلْفِظُ مِن قَوْلٍ إِلَّا لَدَيْهِ رَقِيبٌ عَتِيدٌ", source: "سورة ق", topic: "المراقبة", hint: "مفيش ولا كلمة بتهرب، كل حرف مسجل عليك." },
  { text: "وَلَا يَغْتَب بَّعْضُكُم بَّعْضًا ۚ أَيُحِبُّ أَحَدُكُمْ أَن يَأْكُلَ لَحْمَ أَخِيهِ مَيْتًا فَكَرِهْتُمُوهُ", source: "سورة الحجرات", topic: "بشاعة الغيبة", hint: "تشبيه يخليك تقرف من الغيبة." },
  { text: "وَلَا تَقْفُ مَا لَيْسَ لَكَ بِهِ عِلْمٌ ۚ إِنَّ السَّمْعَ وَالْبَصَرَ وَالْفُؤَادَ كُلُّ أُولَٰئِكَ كَانَ عَنْهُ مَسْئُولًا", source: "سورة الإسراء", topic: "التثبت", hint: "متحكيش حاجة إنت مش متأكد منها." },
  { text: "وَقُل لِّعِبَادِي يَقُولُوا الَّتِي هِيَ أَحْسَنُ ۚ إِنَّ الشَّيْطَانَ يَنزَغُ بَيْنَهُمْ", source: "سورة الإسراء", topic: "قطع طريق الشيطان", hint: "الشيطان بيستنى أي كلمة وحشة عشان يوقع بين الناس." },
  { text: "وَيْلٌ لِّكُلِّ هُمَزَةٍ لُّمَزَةٍ", source: "سورة الهمزة", topic: "عيب الناس", hint: "تهديد شديد لكل واحد بيحب يتريق على الناس." },
  { text: "يَا أَيُّهَا الَّذِينَ آمَنُوا لَا يَسْخَرْ قَوْمٌ مِّن قَوْمٍ عَسَىٰ أَن يَكُونُوا خَيْرًا مِّنْهُمْ", source: "سورة الحجرات", topic: "السخرية", hint: "محدش يتريق على حد، جايز يكون عند ربنا أحسن منك." },
  { text: "لَّا خَيْرَ فِي كَثِيرٍ مِّن نَّجْواهُمْ إِلَّا مَنْ أَمَرَ بِصَدَقَةٍ أَوْ مَعْرُوفٍ أَوْ إِصْلَاحٍ بَيْنَ النَّاسِ", source: "سورة النساء", topic: "الكلام النافع", hint: "أغلب كلامنا ملوش لازمة، الخير الحقيقي هو اللي فيه نصيحة." },
  { text: "أَلَمْ تَرَ كَيْفَ ضَرَبَ اللَّهُ مَثَلًا كَلِمَةً طَيِّبَةً كَشَجَرَةٍ طَيِّبَةٍ أَصْلُهَا ثَابِتٌ وَفَرْعُهَا فِي السَّمَاءِ", source: "سورة إبراهيم", topic: "الكلمة الطيبة", hint: "الكلمة الحلوة زي الشجرة، بتمسك في الأرض وتطلع ثمر." }
];

const HADITHS = [
  { text: "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ", source: "متفق عليه", topic: "قاعدة الصمت", hint: "لو عايز تثبت إن إيمانك حقيقي، يا تقول حاجة تنفع يا تسكت." },
  { text: "مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ", source: "متفق عليه", topic: "المسلم الصح", hint: "أحسن واحد فينا هو اللي لسانه مبيأذيش حد." },
  { text: "ثكلتك أمك يا معاذ، وهل يكب الناس في النار على وجوههم إلا حصائد ألسنتهم؟", source: "الترمذي", topic: "حصاد اللسان", hint: "اللسان هو أكتر حاجة ممكن تودي الواحد في النار." },
  { text: "إِنَّ الْعَبْدَ لَيَتَكَلَّمُ بِالْكَلِمَةِ مِنْ رِضْوَانِ اللَّهِ لاَ يُلْقِي لَهَا بَالاً يَرْفَعُهُ اللَّهُ بِهَا دَرَجَاتٍ", source: "البخاري", topic: "الكلمة اللي بترفعك", hint: "كلمة طيبة بسيطة تفتحلك أبواب الجنة." },
  { text: "أَتَدْرُونَ مَا الْمُفْلِسُ؟.. مَنْ يَأْتِي يَوْمَ الْقِيَامَةِ بِصَلَاةٍ وَصِيَامٍ.. وَيَأْتِي قَدْ شَتَمَ هَذَا، وَقَذَفَ هَذَا", source: "مسلم", topic: "المفلس", hint: "المفلس بجد هو اللي يتعب في العبادة ويوزع حسناته على اللي شتمهم." },
  { text: "لَقَدْ قُلْتِ كَلِمَةً لَوْ مُزِجَتْ بِمَاءِ الْبَحْرِ لَمَزَجَتْهُ", source: "أبو داود", topic: "قبح الغيبة", hint: "كلمة وحشة واحدة قبحها يغير طعم ولون البحر كله." },
  { text: "مَنْ يَضْمَنْ لِي مَا بَيْنَ لَحْيَيْهِ وَمَا بَيْنَ رِجْلَيْهِ أَضْمَنْ لَهُ الْجَنَّةَ", source: "متفق عليه", topic: "ضمان الجنة", hint: "لو ملكت لسانك، الرسول ﷺ بيضمن لك الجنة." },
  { text: "الْكَلِمَةُ الطَّيِّبَةُ صَدَقَةٌ", source: "متفق عليه", topic: "الصدقة السهلة", hint: "الكلمة الحلوة بتتحسبلك صدقة بالظبط." },
  { text: "مَنْ صَمَتَ نَجَا", source: "الترمذي", topic: "النجاة", hint: "اللي بيعرف يسكت في الوقت الصح هو اللي بيعدي." },
  { text: "مَنْ رَدَّ عَنْ عِرْضِ أَخِيهِ رَدَّ اللَّهُ عَنْ وَجْهِهِ النَّارَ يَوْمَ الْقِيَامَةِ", source: "الترمذي", topic: "الدفاع عن الناس", hint: "لما تدافع عن حد بيتغتاب، ربنا هيبعد عنك النار." }
];

const STORIES = [
  { title: "نصيحة النبي ﷺ لمعاذ", content: "فأخذ بلسانه قال: «كف عليك هذا»، فقلت: يا نبي الله، وإنا لمؤاخذون بما نتكلم به؟ فقال: «وهل يكب الناس في النار على وجوههم إلا حصائد ألسنتهم؟».", lesson: "لسانك ده هو اللي ممكن يوديك الجنة أو يرميك في النار." },
  { title: "المرأة الصوامة القوامة", content: "قيل للنبي ﷺ: إن فلانة تصوم النهار وتؤذي جيرانها بلسانها؟ فقال: «لا خير فيها، هي في النار». وأخرى تصلي المكتوبة ولا تؤذي أحداً فقال: «هي في الجنة».", lesson: "العبادة الحقيقية هي إنك متأذيش حد بكلمة." },
  { title: "عائشة وكلمة قصيرة", content: "قالت عائشة عن صفية: كذا وكذا - تعني قصيرة - فقال النبي ﷺ: «لقد قلتِ كلمة لو مُزجت بماء البحر لمزجته».", lesson: "ماتستهونش بأي كلمة تريقة حتى لو هزار." },
  { title: "أبو بكر والحصاة", content: "كان أبو بكر الصديق يضع حصاة في فيه يمنع بها نفسه عن الكلام ويقول: «هذا الذي أوردني الموارد».", lesson: "لو كان الصديق خايف من لسانه، إحنا المفروض نعمل إيه؟" },
  { title: "الحسن البصري وطبق الرطب", content: "بلغه أن رجلاً اغتابه، فأرسل إليه طبقاً من رطب وقال: «بلغني أنك أهديت إلي حسناتك، فأردت أن أكافئك عليها».", lesson: "اللي بيغتابك ده بيبعتلك هدية حسنات غالية." },
  { title: "الربيع بن خيثم وورقته", content: "كان يكتب كل كلمة يقولها ويحاسب نفسه آخر النهار. كان كلامه قليلاً جداً حتى إن الورقة تظل بيضاء أياماً.", lesson: "لو كل واحد شاف كلامه مكتوب قدام عينيه، هيسكت أكتر بكتير." }
];

const SALAF_QUOTES = [
  { text: "احذر لسانك أن يقول فتبتلى.. إن البلاء موكل بالمنطق", author: "الإمام الشافعي" },
  { text: "من لانت كلمته، وجبت محبته", author: "علي بن أبي طالب" },
  { text: "اللسان سبع عقور، إن أطلقته أكلك", author: "علي بن أبي طالب" },
  { text: "من كثر كلامه كثر سقطه، ومن كثر سقطه قل حياؤه", author: "عمر بن الخطاب" },
  { text: "الصمت عبادة من غير عناء، وزينة من غير حلي", author: "أبو بكر الصديق" },
  { text: "الصمت زين للعالم وستر للجاهل", author: "لقمان الحكيم" },
  { text: "والله ما على وجه الأرض شيء أحوج إلى طول سجن من لسان", author: "عبد الله بن مسعود" },
  { text: "إذا تم العقل نقص الكلام", author: "علي بن أبي طالب" },
  { text: "لا يستقيم إيمان عبد حتى يستقيم قلبه، ولا يستقيم قلبه حتى يستقيم لسانه", author: "أنس بن مالك" }
];

const Scripture: React.FC = () => {
  const verseCards = VERSES.map((v, i) => ({
    title: v.topic,
    icon: '📖',
    content: (
      <div key={i} className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm text-center space-y-3 mx-1 my-2">
        <div className="flex justify-between items-start">
          <span className="text-[9px] bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-black">{v.topic}</span>
          <CopyButton text={`${v.text} [${v.source}]`} />
        </div>
        <p className="text-lg font-classic font-bold text-slate-800 leading-[1.8] px-2">"{v.text}"</p>
        <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-100">
          <p className="text-emerald-900 text-xs font-bold italic">💡 {v.hint}</p>
        </div>
        <span className="text-[10px] text-slate-400 font-bold block">{v.source}</span>
      </div>
    ),
  }));

  const hadithCards = HADITHS.map((h, i) => ({
    title: h.topic,
    icon: '🕌',
    content: (
      <div key={i} className="bg-white p-5 rounded-2xl border border-amber-50 shadow-sm text-center space-y-3 mx-1 my-2">
        <div className="flex justify-between items-center">
          <span className="text-[9px] font-black text-amber-600 bg-amber-50 px-3 py-1 rounded-full">{h.topic}</span>
          <CopyButton text={`قال ﷺ: "${h.text}" [${h.source}]`} />
        </div>
        <p className="text-base font-classic font-bold text-slate-700 italic leading-relaxed">"{h.text}"</p>
        <div className="bg-amber-50 p-3 rounded-2xl">
          <p className="text-amber-900 text-xs font-bold italic">💡 {h.hint}</p>
        </div>
        <p className="text-[10px] text-slate-400 font-bold">{h.source}</p>
      </div>
    ),
  }));

  const storyCards = STORIES.map((s, i) => ({
    title: s.title,
    icon: '📜',
    content: (
      <div key={i} className="bg-white p-5 rounded-2xl border border-purple-100 shadow-sm space-y-3 mx-1 my-2">
        <div className="flex justify-between items-start">
          <h4 className="font-black text-slate-800 text-base">{s.title}</h4>
          <CopyButton text={`${s.title}\n\n${s.content}\n\nالعبرة: ${s.lesson}`} />
        </div>
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <p className="text-slate-700 text-sm leading-[1.8] font-classic italic">"{s.content}"</p>
        </div>
        <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
          <p className="text-xs font-bold text-emerald-800">العبرة: {s.lesson}</p>
        </div>
      </div>
    ),
  }));

  const quoteCards: { title: string; icon: string; content: React.ReactNode }[] = [];
  // Group quotes, ~3 per card
  for (let i = 0; i < SALAF_QUOTES.length; i += 3) {
    const chunk = SALAF_QUOTES.slice(i, i + 3);
    quoteCards.push({
      title: `درر الحكماء (${Math.floor(i / 3) + 1})`,
      icon: '💎',
      content: (
        <div className="space-y-3 mx-1 my-2">
          {chunk.map((q, j) => (
            <div key={j} className="bg-white p-4 rounded-2xl border border-indigo-100 text-center shadow-sm">
              <div className="flex justify-end mb-2">
                <CopyButton text={`قال ${q.author}: "${q.text}"`} />
              </div>
              <p className="text-base font-classic font-bold text-indigo-900 leading-relaxed italic mb-2">"{q.text}"</p>
              <p className="text-[11px] font-black text-slate-500 border-t border-indigo-100 pt-2">— {q.author}</p>
            </div>
          ))}
        </div>
      ),
    });
  }

  const allCards = [
    // Title card
    {
      title: 'نور الوحي',
      icon: '🌟',
      content: (
        <div className="text-center py-6 px-3 space-y-4">
          <h2 className="text-2xl font-black text-emerald-800">نور الوحي والتراث 🌟</h2>
          <p className="text-slate-500 text-sm">موسوعة لتربية اللسان من الكتاب والسنة والأثر</p>
          <div className="grid grid-cols-2 gap-2 max-w-xs mx-auto text-xs">
            <div className="bg-emerald-50 p-3 rounded-2xl text-center"><span className="text-lg block mb-1">📖</span><span className="font-bold text-emerald-700">{VERSES.length} آية</span></div>
            <div className="bg-amber-50 p-3 rounded-2xl text-center"><span className="text-lg block mb-1">🕌</span><span className="font-bold text-amber-700">{HADITHS.length} حديث</span></div>
            <div className="bg-purple-50 p-3 rounded-2xl text-center"><span className="text-lg block mb-1">📜</span><span className="font-bold text-purple-700">{STORIES.length} قصة</span></div>
            <div className="bg-indigo-50 p-3 rounded-2xl text-center"><span className="text-lg block mb-1">💎</span><span className="font-bold text-indigo-700">{SALAF_QUOTES.length} درة</span></div>
          </div>
        </div>
      ),
    },
    ...verseCards,
    ...hadithCards,
    ...storyCards,
    ...quoteCards,
    // Final dua
    {
      title: 'الختام',
      icon: '🤲',
      content: (
        <div className="py-6 px-3">
          <div className="bg-emerald-900 text-white p-6 rounded-2xl text-center shadow-xl">
            <p className="text-base font-classic font-bold italic leading-relaxed">
              "اللهم طهّر ألسنتنا من الكذب، وقلوبنا من النفاق، واجعل منطقنا ذكراً وصمتنا تفكراً"
            </p>
            <span className="text-xs font-black text-emerald-400 mt-3 block">— آمين يا رب العالمين</span>
          </div>
        </div>
      ),
    },
  ];

  return <CardNavigator cards={allCards} accentColor="emerald" />;
};

export default Scripture;
