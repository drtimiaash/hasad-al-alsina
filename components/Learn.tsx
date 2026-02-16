
import React, { useState, useMemo, useEffect } from 'react';
import { TONGUE_SINS } from '../constants';
import CardNavigator from './CardNavigator';

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
      className={`p-2 rounded-xl transition-all flex items-center gap-1 text-[10px] font-bold ${copied ? 'bg-emerald-500 text-white shadow-lg' : 'bg-slate-100 text-slate-400 hover:bg-slate-200 shadow-sm'
        }`}
    >
      <span>{copied ? '✅ تم' : '📋 نسخ'}</span>
    </button>
  );
};

const SinCard: React.FC<{ sin: any; type: 'traditional' | 'digital' }> = ({ sin, type }) => {
  if (type === 'traditional') {
    return (
      <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl bg-emerald-50 p-3 rounded-2xl">{sin.icon}</span>
            <h3 className="text-xl font-black text-slate-800">{sin.title}</h3>
          </div>
          <CopyButton text={`${sin.title}:\n${sin.definition}\n\nمثال: ${sin.example}\n${sin.alternative}`} />
        </div>
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <p className="text-sm text-slate-700 leading-relaxed">{sin.definition}</p>
        </div>
        <div className="space-y-3">
          <div className="bg-rose-50 p-4 rounded-2xl border border-rose-100">
            <p className="text-sm text-slate-700 font-bold">❌ موقف حياتي: {sin.example}</p>
          </div>
          <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
            <p className="text-sm text-emerald-900 font-bold">✅ {sin.alternative}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-5 sm:p-6 rounded-2xl border border-blue-100 shadow-sm space-y-4">
      <div className="flex justify-between items-start">
        <span className="text-3xl bg-blue-50 p-3 rounded-2xl">{sin.icon}</span>
        <CopyButton text={`${sin.title}:\n${sin.desc}\n\nمثال: ${sin.example}\nالحل: ${sin.tip}`} />
      </div>
      <h4 className="text-lg font-black text-blue-900">{sin.title}</h4>
      <p className="text-sm text-slate-600 leading-relaxed">{sin.desc}</p>
      <div className="space-y-3">
        <div className="bg-rose-50 p-3 rounded-2xl border border-rose-100">
          <p className="text-xs text-rose-800 font-bold">مثال واقعي: {sin.example}</p>
        </div>
        <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-100">
          <p className="text-xs text-emerald-800 font-bold">💡 الحل: {sin.tip}</p>
        </div>
      </div>
    </div>
  );
};

const Learn: React.FC = () => {
  const hadithText = "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ";

  const digitalSins = [
    {
      title: "سموم التعليقات (الكومنتات السلبية)",
      desc: "كتابة كلمات تجرح الآخرين أو تسخر من مظهرهم عبر المنصات الاجتماعية؛ الكلمة المكتوبة لا تموت وأثرها باقٍ في صحيفتك.",
      example: "التعليق بعبارات ساخرة تحت صور الآخرين أو التقليل من شأن إنجازاتهم.",
      tip: "إذا لم يكن تعليقك جابراً للخواطر أو مضافاً لمعلومة نافعة، فالأولى تركه.",
      icon: "💬"
    },
    {
      title: "فتنة النشر (المشاركة غير المسؤولة)",
      desc: "نقل الإشاعات أو أخبار الفضائح بحجة أنها 'منقولة'. المشاركة تعني أنك وافقت وساهمت في الانتشار.",
      example: "نشر خبر غير موثق يمس سمعة شخص أو مؤسسة.",
      tip: "كن أنت النهاية للإشاعة؛ اجعل الخبر يتوقف عندك ولا ينتشر بسببك.",
      icon: "🔄"
    },
    {
      title: "الغيبة الرقمية (الرسائل الخاصة)",
      desc: "استخدام تطبيقات المراسلة للحديث عن الآخرين بسوء أو تداول صورهم (Screen Shots) للسخرية منها.",
      example: "إرسال صورة لحديث خاص بينك وبين شخص لآخرين بهدف الضحك عليه.",
      tip: "المجالس أمانات، والمراسلات الخاصة من أشد الأمانات حرمة.",
      icon: "📸"
    }
  ];

  const cards = [
    // Card 1: Hadith header
    {
      title: 'قاعدة النجاة',
      icon: '📜',
      content: (
        <div className="bg-emerald-800 text-white p-6 sm:p-8 rounded-2xl shadow-xl text-center">
          <span className="text-5xl mb-4 block">📜</span>
          <h2 className="text-base font-bold mb-3 text-emerald-100 uppercase tracking-widest">قاعدة النجاة النبوية</h2>
          <p className="text-xl sm:text-2xl font-classic font-bold leading-relaxed mb-3 italic px-2">"{hadithText}"</p>
          <p className="text-xs text-emerald-200 font-bold tracking-widest uppercase">متفق عليه</p>
        </div>
      ),
    },
    // Card 2+: Each traditional sin gets its own card
    ...TONGUE_SINS.map((sin) => ({
      title: sin.title,
      icon: sin.icon,
      content: <SinCard sin={sin} type="traditional" />,
    })),
    // Digital sins cards
    ...digitalSins.map((ds) => ({
      title: ds.title.split('(')[0].trim(),
      icon: ds.icon,
      content: <SinCard sin={ds} type="digital" />,
    })),
    // Silent School Level 1
    {
      title: 'صمت الكف',
      icon: '🏅',
      content: (
        <div className="bg-indigo-950 text-white p-5 sm:p-6 rounded-2xl space-y-4">
          <div className="text-center border-b border-indigo-800 pb-4">
            <span className="text-4xl block mb-2">🎓</span>
            <h3 className="text-xl font-black">مدرسة الصمت الحكيم</h3>
            <p className="text-indigo-300 text-xs mt-1 leading-relaxed">
              الصمت ليس مجرد سكوت، بل هو المساحة الآمنة اللي بنحمي فيها رصيدنا من الضياع
            </p>
          </div>
          <div className="bg-white/5 p-5 rounded-2xl border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl bg-amber-500/20 p-3 rounded-2xl">🏅</span>
              <h4 className="font-bold text-indigo-300 text-lg">المستوى الأول: صمت الكف</h4>
            </div>
            <p className="text-indigo-100 leading-relaxed text-sm">
              حجر الأساس؛ حيث تتعلم كبح <strong>شهوة الكلام</strong> التي تدفعك للرد الفوري أو المشاركة في مجالس اللغو لإثبات الذات.
            </p>
            <p className="text-amber-400 font-bold text-xs mt-3 bg-amber-400/10 px-3 py-2 rounded-xl border border-amber-400/20 inline-block">
              شعار المستوى: "سأهزم شهوة كلامي، لأحفظ سلامة ديني"
            </p>
          </div>
        </div>
      ),
    },
    // Silent School Level 2
    {
      title: 'صمت الحكمة',
      icon: '🥈',
      content: (
        <div className="bg-indigo-950 text-white p-5 sm:p-6 rounded-2xl space-y-4">
          <div className="bg-white/5 p-5 rounded-2xl border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl bg-emerald-500/20 p-3 rounded-2xl">🥈</span>
              <h4 className="font-bold text-indigo-300 text-lg">المستوى الثاني: صمت الحكمة</h4>
            </div>
            <p className="text-indigo-100 leading-relaxed text-sm">
              مستوى الرقي والترفع؛ حيث تتجاوز <strong>بريق الجدال</strong> والرغبة في الانتصار اللفظي. أنت هنا تصمت حكمةً، وتترفع عن سفاسف الأمور.
            </p>
            <p className="text-emerald-400 font-bold text-xs mt-3 bg-emerald-400/10 px-3 py-2 rounded-xl border border-emerald-400/20 inline-block">
              شعار المستوى: "صمتي حكمة، وترفعي عن الجدال عزة"
            </p>
          </div>
        </div>
      ),
    },
    // Silent School Level 3
    {
      title: 'صمت السكينة',
      icon: '🥇',
      content: (
        <div className="bg-indigo-950 text-white p-5 sm:p-6 rounded-2xl space-y-4">
          <div className="bg-white/5 p-5 rounded-2xl border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl bg-indigo-500/20 p-3 rounded-2xl">🥇</span>
              <h4 className="font-bold text-indigo-300 text-lg">المستوى الثالث: صمت السكينة</h4>
            </div>
            <p className="text-indigo-100 leading-relaxed text-sm">
              أرقى المراتب وأصفاها؛ حيث يصمت اللسان ليتذوق القلب <strong>لذة السكينة</strong> وأنس التفكر. تصبح الخلوة بالله أجمل من صخب المجالس.
            </p>
            <p className="text-indigo-400 font-bold text-xs mt-3 bg-indigo-400/10 px-3 py-2 rounded-xl border border-indigo-400/20 inline-block">
              شعار المستوى: "في سكوني أجد أنسي، وفي صمتي تشرق روحي"
            </p>
          </div>
        </div>
      ),
    },
    // Silence Shield
    {
      title: 'الصمت الوقائي',
      icon: '🛡️',
      content: (
        <div className="bg-indigo-950 text-white p-5 rounded-2xl space-y-3">
          <h4 className="text-lg font-black text-amber-400 text-center mb-3">خماسية الصمت الوقائي 🛡️</h4>
          {[
            { title: "صمت الغضب", desc: "عندما تغلي العروق، الصمت هو الماء الذي يطفئ نار الندم المستقبلي.", icon: "🔥" },
            { title: "صمت الشك", desc: "إذا لم تكن متيقناً من صحة الخبر، فالصمت هو الحصن.", icon: "❓" },
            { title: "صمت الغيبة", desc: "أول ما يُذكر اسم شخص بالسوء، أغلق لسانك فوراً.", icon: "👥" },
            { title: "صمت الجدال", desc: "إذا تحول النقاش لمبارزة كرامة، انسحب بصمت الحكماء.", icon: "⚔️" },
            { title: "صمت السفه", desc: "الرد على السفيه ينقص من قدرك، صمتك أبلغ رد.", icon: "🤫" }
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/5">
              <span className="text-2xl bg-indigo-800 p-2 rounded-xl shrink-0">{item.icon}</span>
              <div>
                <h5 className="font-bold text-indigo-100 text-sm">{item.title}</h5>
                <p className="text-xs text-indigo-300 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      ),
    },
    // Good Listening + Final Verse
    {
      title: 'حسن الاستماع',
      icon: '🎧',
      content: (
        <div className="space-y-4">
          <div className="bg-indigo-950 text-white p-5 rounded-2xl space-y-4">
            <h4 className="text-lg font-black text-emerald-400 text-center">نصف الصمت هو حسن الاستماع 🎧</h4>
            <p className="text-indigo-100 text-center text-sm italic">"خلق الله لك أذنين ولساناً واحداً، لتسمع ضعف ما تتكلم"</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { icon: '👂', text: 'أنصت بقلبك' },
                { icon: '👁️', text: 'تواصل بصرياً' },
                { icon: '🚫', text: 'لا تقاطع' },
              ].map((item, i) => (
                <div key={i} className="bg-indigo-900 p-3 rounded-2xl text-center border border-white/5">
                  <span className="text-xl block mb-1">{item.icon}</span>
                  <p className="text-[10px] font-bold text-indigo-200">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 p-6 rounded-2xl text-center border border-white/10">
            <p className="text-amber-300 font-classic font-bold text-xl italic leading-relaxed mb-3">
              "مَّا يَلْفِظُ مِن قَوْلٍ إِلَّا لَدَيْهِ رَقِيبٌ عَتِيدٌ"
            </p>
            <span className="text-xs text-indigo-400 font-black uppercase tracking-widest">— سورة ق، آية 18</span>
            <p className="mt-4 text-indigo-100 text-sm font-bold">
              لسانك هو ميزان عقلك ومفتاح آخرتك. صمتك ليس ضعفاً، بل تدريب يومي على الوقار والتقوى.
            </p>
          </div>
        </div>
      ),
    },
  ];

  return <CardNavigator cards={cards} accentColor="emerald" />;
};

export default Learn;
