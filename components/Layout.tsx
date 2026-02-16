
import React from 'react';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const { user, signOut } = useAuth();

  const tabs = [
    { id: 'intro', label: 'البداية', icon: '🏠' },
    { id: 'learn', label: 'تعريفات', icon: '📚' },
    { id: 'scripture', label: 'نصوص', icon: '📖' },
    { id: 'challenges', label: 'تحديات', icon: '🏆' },
    { id: 'harvest', label: 'رفيق', icon: '🌿' },
    { id: 'account', label: 'المحاسبة', icon: '📅' },
  ];

  const displayName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || '';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 bg-emerald-800 text-white shadow-xl z-50 border-b-4 border-emerald-950/20 h-16 sm:h-20 transition-all">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 h-full flex justify-between items-center">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-2xl sm:text-3xl drop-shadow-md">🌿</span>
            <h1 className="text-lg sm:text-2xl md:text-3xl font-classic font-bold leading-none tracking-wide text-emerald-50 py-1">حصاد الألسنة</h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            {displayName && (
              <span className="text-[10px] sm:text-xs bg-emerald-700/50 px-2 sm:px-3 py-1 rounded-full font-bold hidden sm:inline-block">
                أهلاً {displayName} 👋
              </span>
            )}
            <button
              onClick={() => signOut()}
              className="text-[10px] sm:text-xs bg-emerald-900/60 hover:bg-rose-600 px-2 sm:px-3 py-1.5 rounded-xl font-bold transition-all active:scale-95"
              title="تسجيل خروج"
            >
              خروج 🚪
            </button>
          </div>
        </div>
      </header>

      {/* Main content — Scrollable Document Flow */}
      <main className="max-w-4xl w-full mx-auto px-2 sm:px-3 md:px-4 pt-20 pb-24 sm:pb-28 min-h-screen">
        {children}
      </main>

      {/* Fixed Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bottom-nav-safe bg-white border-t border-slate-200 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-50">
        <div className="max-w-4xl mx-auto flex justify-between px-1 py-1.5 sm:py-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex flex-col items-center p-1.5 sm:p-2 min-w-0 flex-1 rounded-xl transition-colors ${activeTab === tab.id ? 'text-emerald-700 bg-emerald-50' : 'text-slate-500'
                }`}
            >
              <span className="text-lg sm:text-xl">{tab.icon}</span>
              <span className="text-[8px] sm:text-[9px] mt-0.5 font-semibold truncate w-full text-center">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Layout;
