import React from 'react';
import CardNavigator from './CardNavigator';
import { useDailyContent } from '../hooks/useDailyContent';

interface IntroProps {
  setActiveTab: (tab: string) => void;
}

const Intro: React.FC<IntroProps> = ({ setActiveTab }) => {
  const { content: daily, isLoading } = useDailyContent();

  const ctaItems = [
    { icon: '📖', title: 'تعلّم', desc: 'اعرف آفات اللسان وبدائلها', tab: 'learn' },
    { icon: '📊', title: 'حاسب نفسك', desc: 'جرد يومي لكلامك', tab: 'account' },
    { icon: '🏆', title: 'تحديات', desc: 'تحديات عملية يومية', tab: 'challenges' },
    { icon: '🌿', title: 'رفيق اللسان', desc: 'منهج تطهير الصحيفة', tab: 'harvest' },
  ];

  const cards = [
    {
      title: 'مرحباً بك',
      icon: '🌿',
      content: (
        <div className="text-center space-y-5 py-4 px-3">
          <div className="relative">
            <div className="text-6xl sm:text-7xl mb-3 animate-pulse">🕌</div>
            <h1 className="text-2xl sm:text-3xl font-black text-emerald-800 leading-relaxed mb-2">
              حصاد الألسنة
            </h1>
            <p className="text-emerald-600 text-base font-bold">الوعي الإسلامي لتطهير اللسان</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-800 to-emerald-950 text-white rounded-2xl p-5 shadow-2xl mx-auto max-w-sm">
            <p className="text-xs text-emerald-300 mb-2 font-bold">﷽</p>
            <blockquote className="text-base sm:text-lg leading-relaxed font-bold">
              «مَا يَلْفِظُ مِن قَوْلٍ إِلَّا لَدَيْهِ رَقِيبٌ عَتِيدٌ»
            </blockquote>
            <cite className="text-emerald-300 text-xs mt-2 block">سورة ق - آية 18</cite>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm max-w-xs mx-auto leading-relaxed">
            كل كلمة بتخرج من لسانك بتتسجل.. اسحب أو دوس التالي 👈
          </p>
        </div>
      ),
    },
    // ─── Daily AI Card ─────────────────────────────────
    {
      title: 'وِرد اليوم',
      icon: '✨',
      content: (
        <div className="space-y-4 px-3 py-3">
          <div className="text-center mb-2">
            <div className="text-3xl mb-1">✨</div>
            <h2 className="text-xl font-black text-emerald-800">وِرد اليوم</h2>
            <p className="text-[10px] text-slate-400 font-bold">يتجدد يومياً عبر الذكاء الاصطناعي</p>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              <div className="loading-shimmer h-24 w-full"></div>
              <div className="loading-shimmer h-16 w-full"></div>
              <div className="loading-shimmer h-12 w-full"></div>
            </div>
          ) : daily ? (
            <>
              {/* Daily Verse */}
              <div className="bg-gradient-to-br from-emerald-800 to-emerald-950 text-white rounded-2xl p-4 shadow-xl">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">📖</span>
                  <span className="text-[10px] font-bold text-emerald-300">آية اليوم</span>
                </div>
                <p className="text-sm sm:text-base font-classic font-bold leading-[1.8] text-center mb-2">
                  "{daily.verse.text}"
                </p>
                <p className="text-[10px] text-emerald-400 text-center">— {daily.verse.source}</p>
                <div className="bg-white/10 rounded-xl p-3 mt-3">
                  <p className="text-xs text-emerald-100 leading-relaxed">💡 {daily.verse.reflection}</p>
                </div>
              </div>

              {/* Daily Tip */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
                <span className="text-2xl shrink-0">💡</span>
                <div>
                  <span className="text-[10px] font-black text-amber-600 block mb-1">نصيحة اليوم</span>
                  <p className="text-sm font-bold text-amber-900 leading-relaxed">{daily.tip}</p>
                </div>
              </div>

              {/* Daily Challenge preview — clickable! */}
              <button
                onClick={() => setActiveTab('challenges')}
                className="w-full text-right bg-indigo-50 border border-indigo-200 rounded-2xl p-4 flex items-start gap-3 hover:bg-indigo-100 transition-all active:scale-[0.98]"
              >
                <span className="text-2xl shrink-0">{daily.challenge.icon}</span>
                <div>
                  <span className="text-[10px] font-black text-indigo-600 block mb-1">تحدي اليوم — {daily.challenge.points} نقطة</span>
                  <p className="text-sm font-bold text-indigo-900">{daily.challenge.title}</p>
                  <p className="text-xs text-indigo-700 mt-1">{daily.challenge.description}</p>
                  <span className="text-[10px] text-indigo-500 mt-2 block font-bold">اضغط للذهاب للتحديات ←</span>
                </div>
              </button>
            </>
          ) : null}
        </div>
      ),
    },
    {
      title: 'الخطر غير المتخيل',
      icon: '⚡',
      content: (
        <div className="space-y-3 px-3 py-3">
          <h2 className="text-lg font-black text-center text-slate-800 mb-3">آفات اللسان — الخطر غير المتخيل</h2>
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { icon: '🔥', title: 'الغيبة', desc: 'أكل لحوم الأموات', color: 'bg-red-50 border-red-200', tab: 'learn' },
              { icon: '🐍', title: 'النميمة', desc: 'نار المشي بين الناس', color: 'bg-orange-50 border-orange-200', tab: 'learn' },
              { icon: '🎭', title: 'الكذب', desc: 'أساس كل شر', color: 'bg-yellow-50 border-yellow-200', tab: 'learn' },
              { icon: '💀', title: 'السب', desc: 'سلاح يدمر القلوب', color: 'bg-purple-50 border-purple-200', tab: 'learn' },
            ].map((item, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(item.tab)}
                className={`${item.color} border rounded-2xl p-3 text-center transition-transform hover:scale-105 active:scale-95 cursor-pointer`}
              >
                <div className="text-2xl sm:text-3xl mb-1">{item.icon}</div>
                <p className="font-black text-xs sm:text-sm text-slate-700">{item.title}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{item.desc}</p>
                <span className="text-[9px] text-slate-400 mt-1 block">اضغط لتعلّم المزيد</span>
              </button>
            ))}
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-center">
            <p className="text-amber-800 text-xs font-bold leading-relaxed">
              ⚠️ كلمة واحدة غلط ممكن تهوي بيك في النار سبعين خريفاً!
            </p>
          </div>
        </div>
      ),
    },
    {
      title: 'حديث الميزان',
      icon: '⚖️',
      content: (
        <div className="space-y-4 px-3 py-3">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-2xl p-5 shadow-2xl">
            <div className="text-3xl text-center mb-3">⚖️</div>
            <blockquote className="text-sm sm:text-base leading-loose text-center font-bold">
              «إن العبد ليتكلم بالكلمة من رضوان الله لا يُلقي لها بالاً يرفعه الله بها درجات، وإن العبد ليتكلم بالكلمة من سخط الله لا يُلقي لها بالاً يهوي بها في جهنم»
            </blockquote>
            <cite className="text-slate-400 text-xs mt-3 block text-center">رواه البخاري</cite>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center">
            <p className="text-emerald-800 font-bold text-xs leading-relaxed">
              🌱 الكلمة الطيبة صدقة.. واللسان النظيف طريقك للجنة بإذن الله
            </p>
          </div>
          <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200">
            <h3 className="font-black text-slate-700 text-xs mb-2 text-center">🎯 إحصائية مخيفة</h3>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-white rounded-xl p-2 shadow-sm">
                <div className="text-xl font-black text-red-500">70%</div>
                <div className="text-[10px] text-slate-500 mt-0.5">من ذنوبنا بسبب اللسان</div>
              </div>
              <div className="bg-white rounded-xl p-2 shadow-sm">
                <div className="text-xl font-black text-amber-500">16K</div>
                <div className="text-[10px] text-slate-500 mt-0.5">كلمة يومياً متوسط</div>
              </div>
              <div className="bg-white rounded-xl p-2 shadow-sm">
                <div className="text-xl font-black text-emerald-500">∞</div>
                <div className="text-[10px] text-slate-500 mt-0.5">ثواب الكلمة الطيبة</div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'ابدأ رحلتك',
      icon: '🚀',
      content: (
        <div className="text-center space-y-5 py-5 px-3">
          <div className="text-5xl">🚀</div>
          <h2 className="text-xl font-black text-emerald-800">جاهز تبدأ رحلة تطهير لسانك؟</h2>
          <p className="text-slate-500 text-xs leading-relaxed max-w-xs mx-auto">
            استكشف باقي الأقسام: اتعلم عن آفات اللسان، حاسب نفسك يومياً، وتحدَّ نفسك
          </p>
          <div className="space-y-2 max-w-xs mx-auto">
            {ctaItems.map((item, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(item.tab)}
                className="w-full flex items-center gap-3 bg-white rounded-2xl p-3 shadow-sm border border-slate-100 text-right transition-all hover:scale-[1.02] hover:border-emerald-300 hover:shadow-md active:scale-[0.98] cursor-pointer"
              >
                <span className="text-xl">{item.icon}</span>
                <div className="flex-1">
                  <p className="font-bold text-xs text-slate-800">{item.title}</p>
                  <p className="text-[10px] text-slate-400">{item.desc}</p>
                </div>
                <span className="text-slate-300 text-sm">←</span>
              </button>
            ))}
          </div>
          <p className="text-[10px] text-slate-400">👆 اضغط على أي قسم أو استخدم الأزرار في الأسفل</p>
        </div>
      ),
    },
  ];

  return <CardNavigator cards={cards} accentColor="emerald" />;
};

export default Intro;
