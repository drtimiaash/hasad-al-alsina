
import React, { useState } from 'react';

const SCRIPTURES = {
  verses: [
    {
      text: "يَا أَيُّهَا الَّذِينَ آمَنُوا اتَّقُوا اللَّهَ وَقُولُوا قَوْلًا سَدِيدًا * يُصْلِحْ لَكُمْ أَعْمَالَكُمْ وَيَغْفِرْ لَكُمْ ذُنُوبَكُمْ ۗ وَمَن يُطِعِ اللَّهَ وَرَسُولَهُ فَقَدْ فَازَ فَوْزًا عَظِيمًا",
      source: "سورة الأحزاب - آية 70-71",
      topic: "القول السديد وأثره في الصلاح"
    },
    {
      text: "يَا أَيُّهَا الَّذِينَ آمَنُوا لِمَ تَقُولُونَ مَا لَا تَفْعَلُونَ * كَبُرَ مقتًا عِندَ اللَّهِ أَن تَقُولُوا مَا لَا تَفْعَلُونَ",
      source: "سورة الصف - آية 2-3",
      topic: "الصدق بين القول والفعل"
    },
    {
      text: "وَلَا تَقْفُ مَا لَيْسَ لَكَ بِهِ عِلْمٌ ۚ إِنَّ السَّمْعَ وَالْبَصَرَ وَالْفُؤَادَ كُلُّ أُولَٰئِكَ كَانَ عَنْهُ مَسْئُولًا",
      source: "سورة الإسراء - آية 36",
      topic: "المسؤولية عن الجوارح"
    },
    {
      text: "وَقُل لِّعِبَادِي يَقُولُوا الَّتِي هِيَ أَحْسَنُ ۚ إِنَّ الشَّيْطَانَ يَنزَغُ بَيْنَهُمْ",
      source: "سورة الإسراء - آية 53",
      topic: "اختيار أحسن الأقوال"
    },
    {
      text: "مَّا يَلْفِظُ مِن قَوْلٍ إِلَّا لَدَيْهِ رَقِيبٌ عَتِيدٌ",
      source: "سورة ق - آية 18",
      topic: "دوام المراقبة الإلهية"
    },
    {
      text: "وَلَا يَغْتَب بَّعْضُكُم ببعضا ۚ أَيُحِبُّ أَحَدُكُمْ أَن يَأْكُلَ لَحْمَ أَخِيهِ مَيْتًا فَكَرِهْتُمُوهُ",
      source: "سورة الحجرات - آية 12",
      topic: "شناعة الغيبة"
    }
  ],
  hadiths: [
    {
      text: "الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ",
      source: "متفق عليه",
      topic: "تعريف المسلم الحق",
      icon: "🤝"
    },
    {
      text: "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خيرًا أَوْ لِيَصْمُتْ",
      source: "متفق عليه",
      topic: "دستور الصمت النبوي",
      icon: "🤐"
    },
    {
      text: "إِنَّ العَبْدَ لَيَتَكَلَّمُ بِالكَلِمَةِ مِنْ رِضْوَانِ اللَّهِ، لاَ يُلْقِي لَهَا بَالًا، يَرْفَعُهُ اللَّهُ بِهَا دَرَجَاتٍ، وَإِنَّ العَبْدَ لَيَتَكَلَّمُ بِالكَلِمَةِ مِنْ سَخَطِ اللَّهِ، لاَ يُلْقِي لَهَا بَالًا، يَهْوِي بِهَا فِي جَهَنَّمَ",
      source: "صحيح البخاري",
      topic: "خطورة الكلمة المستهان بها",
      icon: "🔥"
    },
    {
      text: "رَحِمَ اللَّهُ امْرَأً قَالَ خَيْرًا فَغَنِمَ، أَوْ سَكَتَ عَنْ سُوءٍ فَسَلِمَ",
      source: "رواه البيهقي",
      topic: "الغنيمة والسلامة",
      icon: "🎁"
    },
    {
      text: "إِذَا أَصْبَحَ ابْنُ آدَمَ فَإِنَّ الْأَعْضَاءَ كُلَّهَا تُكَفِّرُ اللِّسَانَ فَتَقُولُ: اتَّقِ اللَّهَ فِينَا فَإِنَّمَا نَحْنُ بِكَ فَإِنِ اسْتَقَمْتَ اسْتَقَمْنَا وَإِنِ اعْوَجَجْتَ اعْوَجَجْنَا",
      source: "سنن الترمذي",
      topic: "مناشدة الجوارح لللسان",
      icon: "🧍"
    },
    {
      text: "مَنْ يَضْمَنْ لِي ما بين لَحْيَيْهِ وما بين رِجْلَيْهِ أَضْمَنْ له الجَنَّةَ",
      source: "صحيح البخاري",
      topic: "ضمان الجنة بحفظ اللسان",
      icon: "🔑"
    },
    {
      text: "أَتَدْرُونَ مَا الْمُفْلِسُ؟.. إِنَّ الْمُفْلِسَ مِنْ أُمَّتِي يَأْتِي يَوْمَ الْقِيَامَةِ بِصَلَاةٍ وَصِيَامٍ وَزَكَاةٍ، وَيَأْتِي قَدْ شَتَمَ هَذَا، وَقَذَفَ هَذَا، وَأَكَلَ مَالَ هَذَا.. فَيُعْطَى هَذَا مِنْ حَسَنَاتِهِ.. حَتَّى تُفْنَى حَسَنَاتُهُ",
      source: "صحيح مسلم",
      topic: "المفلس الحقيقي يوم القيامة",
      icon: "📉"
    }
  ],
  stories: [
    {
      type: "seerah",
      title: "نصيحة النبي ﷺ لمعاذ بن جبل",
      content: "سأل معاذ النبي ﷺ: يا رسول الله، وإنا لمؤاخذون بما نتكلم به؟ فقال له ﷺ: 'ثكلتك أمك يا معاذ، وهل يكب الناس في النار على وجوههم إلا حصائد ألسنتهم؟'.",
      lesson: "التنبيه على أن اللسان هو السبب الرئيسي لدخول النار.",
      icon: "🐪"
    },
    {
      type: "seerah",
      title: "المرأة الصوامة القوامة (لكنها بذية)",
      content: "سئل النبي ﷺ عن امرأة تُذكر من كثرة صلاتها وصيامها وصدقتها، غير أنها تؤذي جيرانها بلسانها؟ فقال ﷺ: 'هي في النار'.",
      lesson: "العبادات البدنية لا تنفع إذا كان اللسان ينهش في حقوق الناس ويؤذيهم.",
      icon: "🔥"
    },
    {
      type: "seerah",
      title: "عائشة رضي الله عنها وكلمة 'قصيرة'",
      content: "قالت عائشة رضي الله عنها للنبي ﷺ عن صفية: 'حسبك من صفية كذا وكذا' (تقصد أنها قصيرة). فقال لها ﷺ: 'لقد قلتِ كلمةً لو مُزجت بماء البحر لمزجته!'.",
      lesson: "الكلمة التي نراها بسيطة قد تكون عند الله عظيمة ومهلكة.",
      icon: "🌊"
    },
    {
      type: "seerah",
      title: "بشرى الجنة لسلامة الصدر واللسان",
      content: "قال النبي ﷺ: 'يطلع عليكم الآن رجل من أهل الجنة'، فطلع رجل ينطف لحيته من وضوئه، وتكرر ذلك ثلاثة أيام. فتبعه عبد الله بن عمرو ليجد سره، فلم يجد كثرة صلاة ولا صيام، بل وجده 'لا يبيت وفي قلبه غش لأحد ولا يحسد أحداً'.",
      lesson: "سلامة الصدر وكف اللسان عن الأذى طريق ملكي ومختصر للجنة.",
      icon: "💎"
    },
    {
      type: "salaf",
      title: "عبد الله بن وهب ومجاهدة اللسان (المعاقبة بالصيام)",
      content: "قال الإمام عبد الله بن وهب: 'نذرتُ أني كلما اغتبتُ إنساناً أن أصوم يوماً، فأجهدني ذلك؛ فكنتُ أغتابُ وأصوم، فنويتُ أني كلما اغتبتُ إنساناً أن أتصدق بدرهم، فمن حبي للدراهم تركتُ الغيبة'.",
      lesson: "التدرج في معاقبة النفس حتى تصل لما يزجرها فعلاً؛ فالحرمان المالي كان أشد تأثيراً عليه من الصيام.",
      icon: "🥛"
    },
    {
      type: "salaf",
      title: "صمت منصور بن زاذان",
      content: "رُوي عن منصور بن زاذان أنه لم يتكلم بكلمة من أمر الدنيا منذ أربعين سنة! وكان يُرى كأنه قد فارق الدنيا لشدة انشغاله بالذكر ومحاسبة اللسان.",
      lesson: "الصمت الطويل يورث الحكمة ويفتح أبواب التفكر.",
      icon: "🤐"
    },
    {
      type: "salaf",
      title: "الحسن البصري وطبق الرطب",
      content: "بُلغ الحسن البصري أن رجلاً اغتابه، فأرسل إليه طبقاً من رطب وقال له: (بلغني أنك أهديت إليَّ حسناتك، فأردت أن أكافئك عليها!).",
      lesson: "الذكاء في الرد على الإساءة بالإحسان واستشعار قيمة الحسنات.",
      icon: "🌴"
    },
    {
      type: "salaf",
      title: "أبو بكر الصديق والحجر في الفم",
      content: "كان الصديق رضي الله عنه يضع حصاة صغيرة في فمه ليمنع نفسه من سرعة الكلام، وكان يمسك بلسانه ويقول: 'هذا الذي أوردني الموارد'.",
      lesson: "أعظم البشر بعد الأنبياء كان يخشى لسانة، فكيف بنا؟",
      icon: "🌑"
    },
    {
      type: "salaf",
      title: "الربيع بن خيثم ودفتر الكلام",
      content: "كان الربيع بن خيثم يضع دوماً ورقة وقلماً بجانبه، فكلما تكلم بكلمة كتبها، ثم يحاسب نفسه آخر النهار: هل أرضيت ربي بهذا الكلام؟",
      lesson: "المحاسبة الدقيقة والوعي بأن كل لفظ مكتوب في سجل أعمالك.",
      icon: "📓"
    }
  ],
  salaf_quotes: [
    {
      text: "لو كنتُ مغتاباً أحداً، لاغتبتُ والديَّ؛ لأنهما أحقُّ الناس بحسناتي",
      author: "عبد الله بن المبارك",
      icon: "💎"
    },
    {
      text: "يغسل أحدكم ثوبه من الأذى، ولا يغسل لسانه من الخنا؟!",
      author: "يحيى بن معاذ",
      icon: "🧼"
    },
    {
      text: "حبستُ لساني منذ أربعين سنة، لا أقول شيئاً إلا وأنا أعلم أنه لله رضاً",
      author: "الأوزاعي",
      icon: "🔒"
    },
    {
      text: "ما ندمت على سكوتي مرة، ولقد ندمت على الكلام مراراً",
      author: "عمر بن الخطاب",
      icon: "🤐"
    },
    {
      text: "من علم أن كلامه من عمله، قل كلامه إلا فيما يعنيه",
      author: "عمر بن عبد العزيز",
      icon: "⚖️"
    },
    {
      text: "إذا رأيت المؤمن صموتاً فادنُ منه، فإنه يلقي الحكمة",
      author: "الحسن البصري",
      icon: "💡"
    },
    {
      text: "الصمت عبادة من غير عناء، وزينة من غير حلي، وهيبة من غير سلطان",
      author: "أبو بكر الصديق",
      icon: "👑"
    },
    {
      text: "من كثر كلامه كثر سقطه، ومن كثر سقطه قل حياؤه، ومن قل حياؤه مات قلبه",
      author: "الفاروق عمر",
      icon: "🏔️"
    },
    {
      text: "اللسان سبع عقور، إن أطلقته أكلك",
      author: "علي بن أبي طالب",
      icon: "🦁"
    },
    {
      text: "اللسان كالميزان، فزنه قبل أن تخرجه",
      author: "مكحول الدمشقي",
      icon: "⚖️"
    }
  ]
};

const CopyButton: React.FC<{ text: string }> = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button 
      onClick={handleCopy}
      className={`p-2 rounded-xl transition-all flex items-center gap-1 text-[10px] font-bold ${
        copied ? 'bg-emerald-500 text-white shadow-lg' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
      }`}
    >
      <span>{copied ? '✅ تم النسخ' : '📋 نسخ'}</span>
    </button>
  );
};

const Scripture: React.FC = () => {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="space-y-16 pb-24 animate-in fade-in duration-700">
      <div className="text-center relative py-12">
        <div className="absolute inset-0 bg-emerald-50 rounded-full blur-3xl opacity-50 -z-10"></div>
        <h2 className="text-4xl font-black text-emerald-800 tracking-tight">نور الوحي والتراث 📖</h2>
        <p className="text-slate-500 text-sm mt-3 font-medium">منهج رباني ونبوي في ضبط اللسان وتزكية الجوارح</p>
      </div>

      <div className="sticky top-20 z-40 bg-white/80 backdrop-blur-md p-3 rounded-full shadow-lg border border-emerald-50 flex justify-center gap-2 overflow-x-auto scrollbar-hide max-w-2xl mx-auto">
        <button onClick={() => scrollToSection('quran')} className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-xs font-black whitespace-nowrap hover:bg-emerald-100">📖 آيات</button>
        <button onClick={() => scrollToSection('hadith')} className="px-4 py-2 bg-amber-50 text-amber-700 rounded-full text-xs font-black whitespace-nowrap hover:bg-amber-100">📜 أحاديث</button>
        <button onClick={() => scrollToSection('salaf-quotes')} className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-xs font-black whitespace-nowrap hover:bg-indigo-100">💎 درر</button>
        <button onClick={() => scrollToSection('salaf-stories')} className="px-4 py-2 bg-purple-50 text-purple-700 rounded-full text-xs font-black whitespace-nowrap hover:bg-purple-100">📚 قصص</button>
      </div>

      <section id="quran" className="space-y-8 scroll-mt-32">
        <div className="flex items-center gap-3 border-r-4 border-emerald-600 pr-4">
          <span className="text-3xl">🕌</span>
          <h3 className="text-2xl font-black text-emerald-900">من آيات الذكر الحكيم</h3>
        </div>
        <div className="grid gap-8">
          {SCRIPTURES.verses.map((v, i) => (
            <div key={i} className="bg-white p-10 rounded-[3rem] border border-emerald-100 shadow-sm relative overflow-hidden group hover:shadow-2xl transition-all duration-500 text-center">
              <div className="flex justify-between items-start mb-6">
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-4 py-1.5 rounded-full font-black uppercase tracking-widest">{v.topic}</span>
                <CopyButton text={`${v.text} [${v.source}]`} />
              </div>
              <p className="text-2xl md:text-3xl text-slate-800 font-classic font-bold leading-[1.8] mb-8 px-4">
                 {v.text} 
              </p>
              <div className="text-center pt-4 border-t border-emerald-50">
                <span className="text-[11px] text-slate-400 font-bold bg-slate-50 px-4 py-1.5 rounded-xl">{v.source}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="hadith" className="space-y-8 scroll-mt-32">
        <div className="flex items-center gap-3 border-r-4 border-amber-600 pr-4">
          <span className="text-3xl">📜</span>
          <h3 className="text-2xl font-black text-amber-900">من مشكاة النبوة</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {SCRIPTURES.hadiths.map((h, i) => (
            <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-amber-50 shadow-sm hover:border-amber-200 transition-all group flex flex-col justify-between hover:shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    <span className="text-2xl">{h.icon}</span>
                    <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-3 py-1 rounded-full">{h.topic}</span>
                </div>
                <CopyButton text={`قال رسول الله ﷺ: "${h.text}" [${h.source}]`} />
              </div>
              <p className="text-xl md:text-2xl font-classic font-bold text-slate-700 leading-relaxed mb-6 text-center italic">"{h.text}"</p>
              <p className="text-[10px] text-slate-400 italic font-bold text-left border-t border-slate-50 pt-4">المصدر: {h.source}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="salaf-quotes" className="space-y-8 scroll-mt-32">
        <div className="flex items-center gap-3 border-r-4 border-indigo-600 pr-4">
          <span className="text-3xl">💎</span>
          <h3 className="text-2xl font-black text-indigo-900">درر الحكماء</h3>
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          {SCRIPTURES.salaf_quotes.map((q, i) => (
            <div key={i} className="bg-indigo-50/40 p-8 rounded-[2.5rem] border border-indigo-100 flex flex-col justify-between hover:bg-indigo-50 hover:border-indigo-300 transition-all hover:scale-[1.03] shadow-sm relative group">
              <div className="absolute top-4 right-4 text-4xl opacity-5 group-hover:scale-125 transition-transform">{q.icon}</div>
              <div className="flex justify-end mb-4 relative z-10">
                <CopyButton text={`قال ${q.author}: "${q.text}"`} />
              </div>
              <p className="text-xl font-classic font-bold text-indigo-900 mb-6 leading-relaxed italic text-center relative z-10">"{q.text}"</p>
              <p className="text-[12px] font-black text-slate-500 text-left border-t border-indigo-100 pt-3 relative z-10">— {q.author}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="salaf-stories" className="space-y-8 scroll-mt-32">
        <div className="flex items-center gap-3 border-r-4 border-purple-500 pr-4">
          <span className="text-3xl">📚</span>
          <h3 className="text-2xl font-black text-purple-900">قصص من التراث</h3>
        </div>
        <div className="grid gap-8">
          {SCRIPTURES.stories.map((s, i) => (
            <div key={i} className="bg-white p-8 md:p-12 rounded-[3.5rem] shadow-sm border border-purple-100 group hover:shadow-xl transition-all duration-300 relative overflow-hidden">
              <div className={`absolute top-0 right-0 w-2 h-full opacity-30 ${s.type === 'seerah' ? 'bg-emerald-500' : 'bg-purple-500'}`}></div>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                  <span className={`text-3xl p-3 rounded-2xl ${s.type === 'seerah' ? 'bg-emerald-50 text-emerald-600' : 'bg-purple-50 text-purple-600'}`}>{s.icon}</span>
                  <div>
                    <h4 className="font-black text-slate-800 text-2xl">{s.title}</h4>
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${s.type === 'seerah' ? 'bg-emerald-100 text-emerald-700' : 'bg-purple-100 text-purple-700'}`}>
                        {s.type === 'seerah' ? 'من السيرة' : 'من قصص السلف'}
                    </span>
                  </div>
                </div>
                <CopyButton text={`${s.title}\n\n${s.content}\n\nالعبرة: ${s.lesson}`} />
              </div>
              <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 mb-8">
                <p className="text-slate-700 text-lg md:text-xl leading-[2] font-classic italic">
                    "{s.content}"
                </p>
              </div>
              <div className="bg-white p-5 rounded-[1.5rem] border-2 border-dashed border-slate-100 flex items-center gap-4">
                <span className="text-3xl">💡</span>
                <div>
                    <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase tracking-tighter">العبرة المستفادة:</span>
                    <p className="text-base font-bold text-slate-800 leading-relaxed">{s.lesson}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="bg-emerald-900 text-white p-12 rounded-[4rem] text-center shadow-2xl border-b-8 border-emerald-950">
          <span className="text-5xl mb-6 block">🕌</span>
          <p className="text-emerald-100 font-classic font-bold text-2xl md:text-3xl leading-relaxed italic mb-4">
            "اللهم طهّر ألسنتنا من الكذب، وقلوبنا من النفاق"
          </p>
          <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">آمين</span>
      </div>
    </div>
  );
};

export default Scripture;
