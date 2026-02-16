
import React, { useState, useEffect, useRef } from 'react';
import { TONGUE_SINS } from '../constants';
import CardNavigator, { CardNavigatorHandle } from './CardNavigator';
import { saveAccountingEntry, getAccountingEntries, AccountingEntryData } from '../services/userDataService';

const Accounting: React.FC = () => {
  const navigatorRef = useRef<CardNavigatorHandle>(null);
  const [entries, setEntries] = useState<AccountingEntryData[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [saving, setSaving] = useState(false);

  const initialSins = TONGUE_SINS.reduce((acc, sin) => ({ ...acc, [sin.id]: false }), {} as Record<string, boolean>);
  const today = new Date().toISOString().split('T')[0];

  const [currentEntry, setCurrentEntry] = useState<AccountingEntryData>({
    date: today,
    sins: initialSins,
    note: '',
    score: 0,
  });

  useEffect(() => {
    const loadData = async () => {
      const data = await getAccountingEntries(30);
      setEntries(data);
      const todayEntry = data.find(e => e.date === today);
      if (todayEntry) setCurrentEntry(todayEntry);
    };
    loadData();
  }, [today]);

  const successCount = Object.values(currentEntry.sins).filter(v => v).length;
  const totalCount = TONGUE_SINS.length;
  const stabilityScore = Math.round((successCount / totalCount) * 100);

  const saveEntry = async () => {
    setSaving(true);
    const entryToSave: AccountingEntryData = { ...currentEntry, score: stabilityScore };
    const ok = await saveAccountingEntry(entryToSave);

    const existingIndex = entries.findIndex(e => e.date === currentEntry.date);
    let newEntries;
    if (existingIndex > -1) {
      newEntries = [...entries];
      newEntries[existingIndex] = entryToSave;
    } else {
      newEntries = [entryToSave, ...entries].slice(0, 30);
    }
    setEntries(newEntries);

    if (!ok) {
      const localEntries = JSON.parse(localStorage.getItem('tongue_accounting') || '[]');
      const idx = localEntries.findIndex((e: any) => e.date === currentEntry.date);
      if (idx > -1) localEntries[idx] = entryToSave;
      else localEntries.unshift(entryToSave);
      localStorage.setItem('tongue_accounting', JSON.stringify(localEntries.slice(0, 30)));
    }

    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
    setTimeout(() => navigatorRef.current?.goToCard(0), 500);
    setSaving(false);
  };

  const toggleSin = (id: string) => {
    setCurrentEntry(prev => ({ ...prev, sins: { ...prev.sins, [id]: !prev.sins[id] } }));
  };

  const getBucketStatus = (score: number) => {
    if (score === 100) return { text: "وعاء سليم ومحفوظ", color: "text-emerald-400", bg: "bg-emerald-500", label: "أمان تـام" };
    if (score > 75) return { text: "وعاء طيب (خروق بسيطة)", color: "text-emerald-300", bg: "bg-emerald-400", label: "رصيد آمن" };
    if (score > 40) return { text: "وعاء ينضح (حسناتك تتسرب!)", color: "text-amber-400", bg: "bg-amber-500", label: "إنذار إفلاس" };
    return { text: "وعاء مخروم (إفلاس وشيك!)", color: "text-rose-500", bg: "bg-rose-500", label: "خطر محقق" };
  };

  const status = getBucketStatus(stabilityScore);

  // ─── Analytics Helpers ───────────────────────────────────
  const yesterdayDate = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const yesterdayEntry = entries.find(e => e.date === yesterdayDate);
  const yesterdayScore = yesterdayEntry?.score ?? null;

  const last7 = entries.filter(e => {
    const d = new Date(e.date);
    const now = new Date();
    const diff = (now.getTime() - d.getTime()) / 86400000;
    return diff <= 7;
  }).sort((a, b) => a.date.localeCompare(b.date));

  const last30 = entries.filter(e => {
    const d = new Date(e.date);
    const now = new Date();
    const diff = (now.getTime() - d.getTime()) / 86400000;
    return diff <= 30;
  });

  const avg7 = last7.length > 0 ? Math.round(last7.reduce((s, e) => s + (e.score || 0), 0) / last7.length) : 0;
  const avg30 = last30.length > 0 ? Math.round(last30.reduce((s, e) => s + (e.score || 0), 0) / last30.length) : 0;

  const streak = (() => {
    let count = 0;
    const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));
    for (let i = 0; i < sorted.length; i++) {
      const expected = new Date(Date.now() - i * 86400000).toISOString().split('T')[0];
      if (sorted[i]?.date === expected) count++;
      else break;
    }
    return count;
  })();

  const scoreDiff = yesterdayScore !== null ? stabilityScore - yesterdayScore : null;

  const cards = [
    // Card 0: Meter + Comparison Dashboard
    {
      title: 'ميزان الإفلاس',
      icon: '⚖️',
      content: (
        <div className="space-y-4 px-2 py-3">
          <div className="text-center mb-2">
            <h2 className="text-xl font-black text-emerald-900">محاسبة النفس ⚖️</h2>
            <p className="text-slate-500 text-xs italic">"حاسبوا أنفسكم قبل أن تحاسبوا"</p>
            <p className="text-[10px] text-slate-400 mt-1">{new Date().toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>

          {/* Bucket visual */}
          <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-2xl">
            <div className="flex flex-col items-center gap-3">
              <h3 className="text-base font-black text-rose-400 flex items-center gap-2">
                <span className="animate-pulse">🛑</span> ميزان الإفلاس والتسريب
              </h3>
              <p className={`font-black text-sm ${status.color}`}>الحالة: {status.text}</p>

              <div className="relative w-32 h-44 shrink-0">
                <div className="absolute inset-0 border-[5px] border-slate-700 rounded-b-[3.5rem] rounded-t-2xl bg-slate-800/80 shadow-[inset_0_0_50px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col justify-end">
                  <div className={`w-full transition-all duration-[2000ms] ease-in-out relative ${status.bg}`} style={{ height: `${stabilityScore}%` }}>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-white/10"></div>
                    <div className="absolute top-0 left-0 w-full h-3 bg-white/30 -translate-y-2 animate-pulse"></div>
                  </div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]">{stabilityScore}%</span>
                    <span className="text-[9px] font-black opacity-80 bg-black/40 px-2 py-0.5 rounded-full mt-1">{status.label}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ─── Yesterday vs Today ─────────────────────────── */}
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
            <h4 className="font-black text-xs text-slate-700 mb-3 text-center">📊 مقارنة: امبارح ↔ النهاردة</h4>
            {yesterdayScore !== null ? (
              <div className="flex items-center justify-center gap-4">
                <div className="text-center">
                  <p className="text-[10px] text-slate-400 font-bold mb-1">امبارح</p>
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-black ${getBucketStatus(yesterdayScore).bg} text-white`}>
                    {yesterdayScore}%
                  </div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-black ${(scoreDiff || 0) > 0 ? 'text-emerald-500' : (scoreDiff || 0) < 0 ? 'text-rose-500' : 'text-slate-400'}`}>
                    {(scoreDiff || 0) > 0 ? `↑ +${scoreDiff}` : (scoreDiff || 0) < 0 ? `↓ ${scoreDiff}` : '= 0'}
                  </div>
                  <p className="text-[9px] text-slate-400 mt-0.5">
                    {(scoreDiff || 0) > 0 ? 'تحسن ماشاء الله!' : (scoreDiff || 0) < 0 ? 'محتاج مجاهدة أكتر' : 'ثبات'}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-slate-400 font-bold mb-1">النهاردة</p>
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-black ${status.bg} text-white`}>
                    {stabilityScore}%
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-center text-xs text-slate-400">🆕 أول يوم ليك — ابدأ النهاردة وهنقارن بكرة!</p>
            )}
          </div>

          {/* ─── Stats Grid ─────────────────────────────────── */}
          <div className="grid grid-cols-4 gap-2">
            <div className="bg-emerald-50 rounded-2xl p-2.5 text-center border border-emerald-100">
              <div className="text-lg font-black text-emerald-600">{successCount}</div>
              <div className="text-[9px] text-slate-500 font-bold">سَلِم</div>
            </div>
            <div className="bg-rose-50 rounded-2xl p-2.5 text-center border border-rose-100">
              <div className="text-lg font-black text-rose-500">{totalCount - successCount}</div>
              <div className="text-[9px] text-slate-500 font-bold">خُروم</div>
            </div>
            <div className="bg-amber-50 rounded-2xl p-2.5 text-center border border-amber-100">
              <div className="text-lg font-black text-amber-600">{streak}</div>
              <div className="text-[9px] text-slate-500 font-bold">🔥 يوم متتالي</div>
            </div>
            <div className="bg-indigo-50 rounded-2xl p-2.5 text-center border border-indigo-100">
              <div className="text-lg font-black text-indigo-600">{entries.length}</div>
              <div className="text-[9px] text-slate-500 font-bold">إجمالي أيام</div>
            </div>
          </div>

          {/* ─── 7-Day Chart ────────────────────────────────── */}
          {last7.length > 0 && (
            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-black text-xs text-slate-700">📈 آخر ٧ أيام</h4>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${avg7 >= 70 ? 'bg-emerald-100 text-emerald-700' : avg7 >= 40 ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>
                  متوسط: {avg7}%
                </span>
              </div>
              <div className="flex items-end justify-center gap-1.5">
                {last7.map((entry, i) => {
                  const s = entry.score || 0;
                  const st = getBucketStatus(s);
                  const isToday = entry.date === today;
                  return (
                    <div key={i} className={`flex flex-col items-center gap-1 ${isToday ? 'scale-110' : ''}`}>
                      <span className="text-[9px] font-bold text-slate-500">{s}%</span>
                      <div className={`w-7 bg-slate-100 rounded-full overflow-hidden ${isToday ? 'ring-2 ring-emerald-400' : ''}`} style={{ height: '65px' }}>
                        <div className={`w-full ${st.bg} rounded-full transition-all duration-500`} style={{ height: `${Math.max(s, 5)}%`, marginTop: `${100 - Math.max(s, 5)}%` }} />
                      </div>
                      <span className={`text-[8px] ${isToday ? 'font-black text-emerald-600' : 'text-slate-400'}`}>
                        {isToday ? 'اليوم' : new Date(entry.date).toLocaleDateString('ar-EG', { weekday: 'short' })}
                      </span>
                    </div>
                  );
                })}
              </div>
              {/* Trend arrow */}
              {last7.length >= 2 && (
                <div className="text-center mt-2">
                  {(() => {
                    const first = last7[0]?.score || 0;
                    const last = last7[last7.length - 1]?.score || 0;
                    const diff = last - first;
                    if (diff > 10) return <span className="text-xs font-bold text-emerald-600">📈 اتجاه تصاعدي — ماشاء الله!</span>;
                    if (diff < -10) return <span className="text-xs font-bold text-rose-500">📉 اتجاه تنازلي — جاهد أكتر!</span>;
                    return <span className="text-xs font-bold text-slate-400">➡️ مستوى ثابت</span>;
                  })()}
                </div>
              )}
            </div>
          )}

          {/* ─── Monthly Overview ───────────────────────────── */}
          {last30.length >= 3 && (
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-4 border border-indigo-100 shadow-sm">
              <h4 className="font-black text-xs text-indigo-700 mb-3 text-center">🗓️ نظرة شهرية</h4>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white rounded-xl p-3 text-center shadow-sm">
                  <div className="text-xl font-black text-indigo-600">{avg30}%</div>
                  <div className="text-[9px] text-slate-500 font-bold">متوسط الشهر</div>
                </div>
                <div className="bg-white rounded-xl p-3 text-center shadow-sm">
                  <div className="text-xl font-black text-emerald-600">{last30.length > 0 ? Math.max(...last30.map(e => e.score || 0)) : 0}%</div>
                  <div className="text-[9px] text-slate-500 font-bold">أعلى يوم 🏆</div>
                </div>
                <div className="bg-white rounded-xl p-3 text-center shadow-sm">
                  <div className="text-xl font-black text-rose-500">{last30.length > 0 ? Math.min(...last30.map(e => e.score || 0)) : 0}%</div>
                  <div className="text-[9px] text-slate-500 font-bold">أقل يوم</div>
                </div>
              </div>
              <div className="mt-3 text-center">
                <p className="text-[10px] text-indigo-600 font-bold">
                  {avg30 >= 70 ? '🌟 أداء ممتاز — لسانك طاهر الحمد لله!' :
                    avg30 >= 40 ? '💪 أداء جيد — واصل المجاهدة!' :
                      '🔑 فيه فرصة كبيرة للتحسن — لا تيأس!'}
                </p>
              </div>
              {/* Monthly progress: how many days completed */}
              <div className="mt-2 bg-white rounded-xl p-2">
                <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                  <span>أيام المحاسبة هذا الشهر</span>
                  <span className="font-bold">{last30.length} / 30</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: `${(last30.length / 30) * 100}%` }} />
                </div>
              </div>
            </div>
          )}

          <button onClick={() => navigatorRef.current?.goToCard(1)} className="w-full bg-emerald-700 text-white py-3.5 rounded-2xl font-black text-sm shadow-xl hover:bg-emerald-800 transition-all active:scale-95">
            {entries.find(e => e.date === today) ? 'عدّل جرد النهاردة ✏️' : 'ابدأ جرد اليوم 📋'}
          </button>
        </div>
      ),
    },
    // Card 1: Checklist
    {
      title: 'جرد الرصيد',
      icon: '📋',
      content: (
        <div className="space-y-3 px-2 py-3">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h3 className="text-base font-black text-slate-800">قائمة جرد الرصيد اليومي</h3>
              <p className="text-slate-400 text-[10px] font-bold mt-0.5">علّم على اللي سِلمت منه النهاردة</p>
            </div>
            <div className="text-left">
              <span className="text-2xl font-black text-emerald-600">{successCount}</span>
              <span className="text-slate-300 text-sm font-bold"> / {totalCount}</span>
            </div>
          </div>

          {TONGUE_SINS.map((sin) => (
            <button key={sin.id} onClick={() => toggleSin(sin.id)}
              className={`group relative w-full flex items-center justify-between p-3 sm:p-4 rounded-2xl border-2 transition-all duration-300 transform active:scale-[0.98] text-right ${currentEntry.sins[sin.id] ? 'border-emerald-500 bg-emerald-50 shadow-md' : 'border-slate-100 bg-white hover:border-slate-300'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all ${currentEntry.sins[sin.id] ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400'}`}>{sin.icon}</div>
                <div className="text-right">
                  <span className={`font-black block text-sm ${currentEntry.sins[sin.id] ? 'text-emerald-900' : 'text-slate-700'}`}>{sin.title}</span>
                  <span className={`text-[10px] font-bold ${currentEntry.sins[sin.id] ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {currentEntry.sins[sin.id] ? '✅ لسانك طاهر' : '⚠️ هل سَرّبت هنا؟'}
                  </span>
                </div>
              </div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all text-xs ${currentEntry.sins[sin.id] ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-slate-50 border-slate-200'}`}>
                {currentEntry.sins[sin.id] ? '✓' : ''}
              </div>
            </button>
          ))}

          <div className="flex gap-2 mt-2">
            <button onClick={() => navigatorRef.current?.goToCard(0)} className="flex-1 bg-slate-100 text-slate-600 py-2.5 rounded-xl font-bold text-xs hover:bg-slate-200 transition-all active:scale-95">⚖️ شوف الميزان</button>
            <button onClick={() => navigatorRef.current?.goToCard(2)} className="flex-1 bg-emerald-600 text-white py-2.5 rounded-xl font-bold text-xs hover:bg-emerald-700 transition-all active:scale-95">احفظ المحاسبة 💾</button>
          </div>
        </div>
      ),
    },
    // Card 2: Save
    {
      title: 'الحفظ',
      icon: '💾',
      content: (
        <div className="space-y-4 px-2 py-3">
          <div className="bg-slate-900 text-white p-4 rounded-2xl text-center">
            <div className="text-4xl mb-2">{stabilityScore >= 75 ? '🎉' : stabilityScore >= 40 ? '💪' : '😔'}</div>
            <p className="text-2xl font-black">{stabilityScore}%</p>
            <p className={`text-sm font-bold ${status.color}`}>{status.text}</p>
            <p className="text-[10px] text-slate-400 mt-1">سلمت من {successCount} من أصل {totalCount} آفة</p>
            {scoreDiff !== null && (
              <p className={`text-xs mt-2 font-bold ${scoreDiff > 0 ? 'text-emerald-400' : scoreDiff < 0 ? 'text-rose-400' : 'text-slate-400'}`}>
                {scoreDiff > 0 ? `↑ تحسن +${scoreDiff}% عن امبارح` : scoreDiff < 0 ? `↓ تراجع ${scoreDiff}% عن امبارح` : '= نفس مستوى امبارح'}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-black text-slate-700 mb-2">خاطرة اليوم:</label>
            <textarea value={currentEntry.note} onChange={(e) => setCurrentEntry(prev => ({ ...prev, note: e.target.value }))}
              placeholder="مثلاً: 'النهاردة كان صعب بس قفلت خُرم الغيبة.. الحمد لله'"
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400 transition-all min-h-[80px] text-sm" />
          </div>

          <button onClick={saveEntry} disabled={saving}
            className="w-full bg-emerald-800 text-white py-4 rounded-2xl font-black text-base shadow-2xl hover:bg-emerald-900 transition-all active:scale-95 disabled:opacity-50">
            {saving ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                جاري الحفظ...
              </span>
            ) : 'حفظ المحاسبة وسد الخروم 🛡️'}
          </button>

          <button onClick={() => navigatorRef.current?.goToCard(1)} className="w-full bg-slate-100 text-slate-500 py-3 rounded-2xl font-bold text-xs hover:bg-slate-200 transition-all">← رجوع للقائمة</button>
          <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-2xl text-center">
            <p className="text-[10px] text-emerald-600 font-bold">☁️ بياناتك محفوظة في السحابة وتقدر تفتحها من أي جهاز</p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      <CardNavigator ref={navigatorRef} cards={cards} accentColor="rose" enableAutoAdvance={false} />
      {showToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] animate-in slide-in-from-top-4 fade-in duration-300">
          <div className="bg-emerald-700 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3">
            <span className="text-xl">✅</span>
            <div>
              <p className="font-bold text-sm">تم الحفظ بنجاح!</p>
              <p className="text-[10px] text-emerald-200">الكلمة الطيبة تبني.. والسيئة تهدم</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Accounting;
