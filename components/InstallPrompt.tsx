import React, { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
    prompt(): Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const InstallPrompt: React.FC = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showBanner, setShowBanner] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);
    const [installing, setInstalling] = useState(false);
    const [isIOS, setIsIOS] = useState(false);

    useEffect(() => {
        // 1. Check if already installed
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches
            || (window.navigator as any).standalone === true;

        if (isStandalone) {
            setIsInstalled(true);
            return;
        }

        // 2. Detect iOS
        const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
        setIsIOS(ios);

        // 3. Listen for the install prompt (Android/Desktop Chrome)
        const handler = (e: Event) => {
            console.log('✨ PWA Install Prompt fired!');
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
        };
        window.addEventListener('beforeinstallprompt', handler);

        // 4. Force show banner after 2 seconds regardless of event
        // This ensures users see it even on iOS or if event fired early
        const timer = setTimeout(() => {
            setShowBanner(true);
        }, 2000);

        // 5. Detect when app is installed
        window.addEventListener('appinstalled', () => {
            console.log('🎉 App installed successfully');
            setIsInstalled(true);
            setShowBanner(false);
        });

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
            clearTimeout(timer);
        };
    }, []);

    const handleInstall = async () => {
        if (deferredPrompt) {
            // Android/Chrome: Trigger native prompt
            setInstalling(true);
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`User response to install prompt: ${outcome}`);
            if (outcome === 'accepted') {
                setIsInstalled(true);
            }
            setDeferredPrompt(null);
            setInstalling(false);
            setShowBanner(false); // Close after choice
        } else {
            // Fallback (iOS or no event): Show instructions
            // For now, on this button click, we just toggle a "Help" state or show an alert
            // But to keep it simple and beautiful, we'll just expand the UI to show instructions
            // For this specific iteration, let's just alert or show a simple message if no prompt
            if (isIOS) {
                alert("لتثبيت التطبيق على الآيفون:\n1. اضغط على زر المشاركة (Share) ⬆️\n2. اختر 'إضافة إلى الصفحة الرئيسية' (Add to Home Screen) ➕");
            } else {
                alert("لتثبيت التطبيق:\nاضغط على قائمة المتصفح (⋮) واختر 'تثبيت التطبيق' أو 'Add to Home Screen'.");
            }
            setShowBanner(false); // Dismiss after showing instructions
        }
    };

    const handleDismiss = () => {
        setShowBanner(false);
    };

    if (!showBanner || isInstalled) return null;

    return (
        <div className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-500" dir="rtl">
            <div className="bg-white w-full max-w-sm rounded-[2rem] p-6 shadow-2xl border-2 border-emerald-500/20 animate-in slide-in-from-bottom-8 duration-700">
                {/* Icon */}
                <div className="flex justify-center -mt-16 mb-4">
                    <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-emerald-500/30 ring-4 ring-white transform hover:scale-105 transition-transform duration-500">
                        <span className="text-5xl drop-shadow-md">🕌</span>
                    </div>
                </div>

                {/* Text */}
                <div className="text-center mb-6">
                    <h3 className="text-xl font-black text-slate-800 mb-2">حصاد الألسنة</h3>
                    <p className="text-slate-500 text-sm font-medium leading-relaxed">
                        ثبّت التطبيق دلوقتي عشان يشتغل معاك
                        <span className="text-emerald-600 font-bold mx-1">بدون نت</span>
                        ويجي لك تذكيرات يومية! 📱
                    </p>
                </div>

                {/* Features */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="bg-slate-50 rounded-2xl p-3 text-center border border-slate-100">
                        <span className="text-xl block mb-1">⚡</span>
                        <span className="text-[10px] font-black text-slate-600">سريع جداً</span>
                    </div>
                    <div className="bg-slate-50 rounded-2xl p-3 text-center border border-slate-100">
                        <span className="text-xl block mb-1">📴</span>
                        <span className="text-[10px] font-black text-slate-600">بدون نت</span>
                    </div>
                    <div className="bg-slate-50 rounded-2xl p-3 text-center border border-slate-100">
                        <span className="text-xl block mb-1">🔔</span>
                        <span className="text-[10px] font-black text-slate-600">تذكيرات</span>
                    </div>
                </div>

                {/* Buttons */}
                <div className="space-y-3">
                    <button
                        onClick={handleInstall}
                        disabled={installing}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-emerald-200 transition-all active:scale-[0.98] disabled:opacity-60 text-base flex items-center justify-center gap-2 group"
                    >
                        {installing ? (
                            <>
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                جاري التثبيت...
                            </>
                        ) : (
                            <>
                                <span>📲 تثبيت التطبيق</span>
                                <span className="group-hover:-translate-x-1 transition-transform">←</span>
                            </>
                        )}
                    </button>
                    <button
                        onClick={handleDismiss}
                        className="w-full bg-white text-slate-400 font-bold py-3 rounded-2xl hover:bg-slate-50 transition-all text-sm border border-slate-100"
                    >
                        تذكير لاحقاً
                    </button>
                </div>

                {deferredPrompt ? null : (
                    <p className="text-center text-[10px] text-slate-300 mt-4">
                        {isIOS ? 'اضغط على زر المشاركة ثم "إضافة للشاشة الرئيسية"' : 'اضغط للتثبيت اليدوي'}
                    </p>
                )}
            </div>
        </div>
    );
};

export default InstallPrompt;
