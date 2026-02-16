import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const AuthPage: React.FC = () => {
    const { signUp, signIn } = useAuth();
    const [mode, setMode] = useState<'login' | 'signup'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        if (mode === 'signup') {
            if (!displayName.trim()) {
                setError('اكتب اسمك الأول');
                setLoading(false);
                return;
            }
            if (password.length < 6) {
                setError('كلمة السر لازم تكون 6 حروف على الأقل');
                setLoading(false);
                return;
            }
            const { error: err } = await signUp(email, password, displayName);
            if (err) {
                setError(translateError(err));
            } else {
                setSuccess('تم إنشاء الحساب بنجاح! تفقد إيميلك للتأكيد أو ادخل مباشرة.');
            }
        } else {
            const { error: err } = await signIn(email, password);
            if (err) {
                setError(translateError(err));
            }
        }
        setLoading(false);
    };

    const translateError = (err: string) => {
        if (err.includes('Invalid login')) return 'الإيميل أو كلمة السر غلط';
        if (err.includes('already registered')) return 'الإيميل ده مسجل قبل كده، جرب تسجل دخول';
        if (err.includes('valid email')) return 'اكتب إيميل صحيح';
        if (err.includes('Password')) return 'كلمة السر ضعيفة، حاول تانى';
        return err;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-900 flex items-center justify-center p-4" dir="rtl">
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-10 right-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 left-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"></div>
            </div>

            <div className="relative w-full max-w-md">
                {/* Logo section */}
                <div className="text-center mb-8">
                    <div className="text-6xl mb-3">🕌</div>
                    <h1 className="text-3xl font-black text-white mb-1">حصاد الألسنة</h1>
                    <p className="text-emerald-300 text-sm font-bold">الوعي الإسلامي لتطهير اللسان</p>
                </div>

                {/* Form card */}
                <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/20">
                    {/* Tabs */}
                    <div className="flex bg-slate-100 rounded-2xl p-1 mb-6">
                        <button
                            onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
                            className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${mode === 'login' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500'}`}
                        >
                            تسجيل دخول
                        </button>
                        <button
                            onClick={() => { setMode('signup'); setError(''); setSuccess(''); }}
                            className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${mode === 'signup' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500'}`}
                        >
                            حساب جديد
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {mode === 'signup' && (
                            <div>
                                <label className="block text-xs font-bold text-slate-600 mb-1.5">الاسم</label>
                                <input
                                    type="text"
                                    value={displayName}
                                    onChange={e => setDisplayName(e.target.value)}
                                    placeholder="مثلاً: أحمد"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400 text-sm transition-all"
                                    required
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1.5">البريد الإلكتروني</label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="example@email.com"
                                dir="ltr"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400 text-sm transition-all text-left"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1.5">كلمة السر</label>
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder={mode === 'signup' ? '6 حروف على الأقل' : '••••••••'}
                                dir="ltr"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400 text-sm transition-all text-left"
                                required
                                minLength={6}
                            />
                        </div>

                        {error && (
                            <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-2xl text-xs font-bold text-center animate-in slide-in-from-top-2 duration-200">
                                ❌ {error}
                            </div>
                        )}

                        {success && (
                            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-2xl text-xs font-bold text-center animate-in slide-in-from-top-2 duration-200">
                                ✅ {success}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-emerald-600 text-white font-black py-3.5 rounded-2xl shadow-xl hover:bg-emerald-700 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-wait text-sm"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                    جاري التحميل...
                                </span>
                            ) : mode === 'login' ? 'دخول' : 'إنشاء حساب'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-[10px] text-slate-400">
                            بيانات محاسبتك وتقدمك هتكون محفوظة وتقدر تفتحها من أي جهاز 🔐
                        </p>
                    </div>
                </div>

                {/* Bottom tagline */}
                <p className="text-center text-emerald-400/50 text-[10px] mt-6 font-bold">
                    «مَا يَلْفِظُ مِن قَوْلٍ إِلَّا لَدَيْهِ رَقِيبٌ عَتِيدٌ» — سورة ق
                </p>
            </div>
        </div>
    );
};

export default AuthPage;
