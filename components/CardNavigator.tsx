
import React, { useState, useRef, useCallback, useEffect, forwardRef, useImperativeHandle } from 'react';

export interface CardNavigatorHandle {
    goToCard: (index: number) => void;
    currentIndex: number;
}

interface CardNavigatorProps {
    cards: {
        title: string;
        icon: string;
        content: React.ReactNode;
    }[];
    accentColor?: string;
    autoAdvanceDelay?: number;
    enableAutoAdvance?: boolean;
    onCardChange?: (index: number) => void;
}

const CardNavigator = forwardRef<CardNavigatorHandle, CardNavigatorProps>(({
    cards,
    accentColor = 'emerald',
    autoAdvanceDelay = 15000,
    enableAutoAdvance = true,
    onCardChange,
}, ref) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState<'next' | 'prev' | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const [autoPlaying, setAutoPlaying] = useState(enableAutoAdvance);

    const touchStartX = useRef(0);
    const touchStartY = useRef(0);
    const touchEndX = useRef(0);
    const touchEndY = useRef(0);
    const isSwiping = useRef(false);
    const autoAdvanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    // ─── Navigation ────────────────────────────────────────
    const goTo = useCallback((index: number, dir: 'next' | 'prev') => {
        if (isAnimating || index < 0 || index >= cards.length) return;
        setIsAnimating(true);
        setDirection(dir);
        window.scrollTo({ top: 0, behavior: 'smooth' });

        setTimeout(() => {
            setCurrentIndex(index);
            setDirection(null);
            onCardChange?.(index);
            setTimeout(() => setIsAnimating(false), 80);
        }, 250);
    }, [isAnimating, cards.length, onCardChange]);

    const goNext = useCallback(() => {
        if (currentIndex < cards.length - 1) {
            goTo(currentIndex + 1, 'next');
        } else if (autoPlaying) {
            goTo(0, 'next');
        }
    }, [currentIndex, cards.length, goTo, autoPlaying]);

    const goPrev = useCallback(() => {
        if (currentIndex > 0) goTo(currentIndex - 1, 'prev');
    }, [currentIndex, goTo]);

    // ─── Imperative API ────────────────────────────────────
    useImperativeHandle(ref, () => ({
        goToCard: (index: number) => {
            if (index >= 0 && index < cards.length && index !== currentIndex) {
                goTo(index, index > currentIndex ? 'next' : 'prev');
            }
        },
        currentIndex,
    }), [goTo, cards.length, currentIndex]);

    // ─── Auto-advance ──────────────────────────────────────
    const resetAutoTimer = useCallback(() => {
        if (autoAdvanceTimer.current) {
            clearTimeout(autoAdvanceTimer.current);
            autoAdvanceTimer.current = null;
        }
        if (autoPlaying && enableAutoAdvance && autoAdvanceDelay > 0) {
            autoAdvanceTimer.current = setTimeout(() => goNext(), autoAdvanceDelay);
        }
    }, [autoPlaying, enableAutoAdvance, autoAdvanceDelay, goNext]);

    useEffect(() => {
        resetAutoTimer();
        return () => { if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current); };
    }, [currentIndex, autoPlaying, resetAutoTimer]);

    const handleUserInteraction = useCallback(() => {
        if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
        if (autoPlaying && enableAutoAdvance && autoAdvanceDelay > 0) {
            autoAdvanceTimer.current = setTimeout(() => goNext(), autoAdvanceDelay);
        }
    }, [autoPlaying, enableAutoAdvance, autoAdvanceDelay, goNext]);

    // ─── Touch/Swipe ───────────────────────────────────────
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
        touchStartY.current = e.touches[0].clientY;
        touchEndX.current = e.touches[0].clientX;
        touchEndY.current = e.touches[0].clientY;
        isSwiping.current = false;
        handleUserInteraction();
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        touchEndX.current = e.touches[0].clientX;
        touchEndY.current = e.touches[0].clientY;
        const dx = Math.abs(touchEndX.current - touchStartX.current);
        const dy = Math.abs(touchEndY.current - touchStartY.current);
        if (dx > 15 && dx > dy * 1.5) isSwiping.current = true;
    };

    const handleTouchEnd = () => {
        if (!isSwiping.current) return;
        const diffX = touchStartX.current - touchEndX.current;
        if (diffX > 80) goNext();
        else if (diffX < -80) goPrev();
        isSwiping.current = false;
    };

    // ─── Keyboard ──────────────────────────────────────────
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            handleUserInteraction();
            if (e.key === 'ArrowLeft') goNext();
            if (e.key === 'ArrowRight') goPrev();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [goNext, goPrev, handleUserInteraction]);

    const card = cards[currentIndex];

    const colorMap: Record<string, { bg: string; text: string; border: string; dot: string; btnBg: string; btnHover: string }> = {
        emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500', btnBg: 'bg-emerald-600', btnHover: 'hover:bg-emerald-700' },
        amber: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500', btnBg: 'bg-amber-600', btnHover: 'hover:bg-amber-700' },
        indigo: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', dot: 'bg-indigo-500', btnBg: 'bg-indigo-600', btnHover: 'hover:bg-indigo-700' },
        purple: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', dot: 'bg-purple-500', btnBg: 'bg-purple-600', btnHover: 'hover:bg-purple-700' },
        rose: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', dot: 'bg-rose-500', btnBg: 'bg-rose-600', btnHover: 'hover:bg-rose-700' },
        blue: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500', btnBg: 'bg-blue-600', btnHover: 'hover:bg-blue-700' },
    };
    const colors = colorMap[accentColor] || colorMap.emerald;

    return (
        <div className="flex flex-col" onClick={handleUserInteraction}>
            {/* Sticky Header */}
            <div className={`sticky top-16 sm:top-20 z-30 flex items-center justify-between px-3 sm:px-4 py-2.5 ${colors.bg} rounded-2xl mb-2 border ${colors.border} shadow-sm backdrop-blur-md bg-opacity-95`}>
                <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xl sm:text-2xl shrink-0">{card.icon}</span>
                    <h3 className={`font-bold text-xs sm:text-sm truncate ${colors.text}`}>{card.title}</h3>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    {enableAutoAdvance && (
                        <button
                            onClick={(e) => { e.stopPropagation(); setAutoPlaying(p => !p); }}
                            className={`text-xs px-2 py-1 rounded-full transition-all ${autoPlaying ? `${colors.dot} text-white` : 'bg-slate-200 text-slate-500'}`}
                            title={autoPlaying ? 'إيقاف التنقل التلقائي' : 'تشغيل التنقل التلقائي'}
                        >
                            {autoPlaying ? '⏸' : '▶'}
                        </button>
                    )}
                    <span className={`text-[10px] sm:text-xs font-black ${colors.text} bg-white/80 px-2 sm:px-3 py-1 rounded-full`}>
                        {currentIndex + 1} / {cards.length}
                    </span>
                </div>
            </div>

            {/* Progress bar */}
            <div className="w-full h-1 bg-slate-100 rounded-full mb-3 overflow-hidden">
                <div
                    className={`h-full ${colors.dot} rounded-full transition-all duration-500 ease-out`}
                    style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
                />
            </div>

            {/* Card content */}
            <div
                className="overflow-x-hidden rounded-2xl min-h-[40vh]"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                <div
                    className={`card-content transition-all duration-300 ease-out ${direction === 'next' ? 'animate-slide-out-left' :
                            direction === 'prev' ? 'animate-slide-out-right' :
                                'animate-slide-in'
                        }`}
                >
                    {card.content}
                </div>
            </div>

            {/* Navigation bar */}
            <div className="flex items-center justify-between px-1 sm:px-2 pt-4 pb-2 gap-1 sm:gap-2 mt-2">
                <button
                    onClick={() => { goPrev(); handleUserInteraction(); }}
                    disabled={currentIndex === 0}
                    className={`flex items-center gap-1 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all active:scale-95 shadow-lg ${currentIndex === 0
                            ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                            : `${colors.btnBg} text-white ${colors.btnHover}`
                        }`}
                >
                    <span>→</span>
                    <span className="hidden sm:inline">السابق</span>
                </button>

                <div className="flex items-center gap-1 flex-wrap justify-center max-w-[55%] sm:max-w-[60%]">
                    {cards.length <= 12 ? (
                        cards.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => { goTo(i, i > currentIndex ? 'next' : 'prev'); handleUserInteraction(); }}
                                className={`rounded-full transition-all duration-300 ${i === currentIndex
                                        ? `w-5 sm:w-6 h-2 sm:h-2.5 ${colors.dot}`
                                        : 'w-2 sm:w-2.5 h-2 sm:h-2.5 bg-slate-200 hover:bg-slate-300'
                                    }`}
                            />
                        ))
                    ) : (
                        <span className={`text-[10px] font-bold ${colors.text}`}>
                            {currentIndex + 1} من {cards.length}
                        </span>
                    )}
                </div>

                <button
                    onClick={() => { goNext(); handleUserInteraction(); }}
                    disabled={currentIndex === cards.length - 1 && !autoPlaying}
                    className={`flex items-center gap-1 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all active:scale-95 shadow-lg ${currentIndex === cards.length - 1 && !autoPlaying
                            ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                            : `${colors.btnBg} text-white ${colors.btnHover}`
                        }`}
                >
                    <span className="hidden sm:inline">التالي</span>
                    <span>←</span>
                </button>
            </div>
        </div>
    );
});

CardNavigator.displayName = 'CardNavigator';

export default CardNavigator;
