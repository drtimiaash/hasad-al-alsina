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

    useEffect(() => {
        // Check if already installed
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches
            || (window.navigator as any).standalone === true;

        if (isStandalone) {
            setIsInstalled(true);
            return;
        }

        const handler = (e: Event) => {
            console.log('✨ PWA Install Prompt fired!');
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            // Show banner immediately for testing
            setShowBanner(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        // Detect when app is installed
        window.addEventListener('appinstalled', () => {
            console.log('🎉 App installed successfully');
            setIsInstalled(true);
            setShowBanner(false);
        });

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;
        setInstalling(true);
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to install prompt: ${outcome}`);
        if (outcome === 'accepted') {
            setIsInstalled(true);
        }
        setShowBanner(false);
        setDeferredPrompt(null);
        setInstalling(false);
    };

    const handleDismiss = () => {
        setShowBanner(false);
        // Removed validation to allow it to reappear on refresh for testing
    };

    if (!showBanner || isInstalled) return null;

    return (
        <div className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300" dir="rtl">
            <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-emerald-100 animate-in slide-in-from-bottom-8 duration-500">
                {/* Icon */}
                <div className="flex justify-center mb-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-[22px] flex items-center justify-center shadow-xl shadow-emerald-200">
                        <span className="text-4xl">🕌</span>
                    </div>
                </div>

                {/* Text */}
                <div className="text-center mb-5">
                    <h3 className="text-lg font-black text-slate-800 mb-1">ثبّت التطبيق على جهازك!</h3>
                    <p className="text-slate-500 text-xs leading-relaxed">
                        أضف حصاد الألسنة لشاشتك الرئيسية عشان توصله بسرعة زي أي تطبيق عادي — بدون ما يحتاج مساحة كبيرة 📱
                    </p>
                </div>

                {/* Buttons */}
                <div className="space-y-2">
                    <button
                        onClick={handleInstall}
                        disabled={installing}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3.5 rounded-2xl shadow-xl transition-all active:scale-[0.98] disabled:opacity-60 text-sm flex items-center justify-center gap-2"
                    >
                        {installing ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                جاري التثبيت...
                            </>
                        ) : (
                            <>📲 تثبيت التطبيق</>
                        )}
                    </button>
                    <button
                        onClick={handleDismiss}
                        className="w-full bg-slate-50 text-slate-400 font-bold py-2.5 rounded-2xl hover:bg-slate-100 transition-all text-xs"
                    >
                        مش دلوقتي
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InstallPrompt;
