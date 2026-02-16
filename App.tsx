
import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthPage from './components/AuthPage';
import Layout from './components/Layout';
import Intro from './components/Intro';
import Learn from './components/Learn';
import Accounting from './components/Accounting';
import Harvest from './components/Harvest';
import Challenges from './components/Challenges';

import Scripture from './components/Scripture';
import InstallPrompt from './components/InstallPrompt';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('intro');
  const [showReminder, setShowReminder] = useState(false);

  useEffect(() => {
    if (!user) return;
    const checkDailyReminder = () => {
      const today = new Date().toDateString();
      const lastReminder = localStorage.getItem('last_reminder_date');
      if (lastReminder !== today) {
        setShowReminder(true);
      }
    };
    const timer = setTimeout(checkDailyReminder, 1500);
    return () => clearTimeout(timer);
  }, [user]);

  const handleDismissReminder = () => {
    localStorage.setItem('last_reminder_date', new Date().toDateString());
    setShowReminder(false);
  };

  const handleGoToAccounting = () => {
    localStorage.setItem('last_reminder_date', new Date().toDateString());
    setActiveTab('account');
    setShowReminder(false);
  };

  // Show loading spinner
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">🕌</div>
          <div className="w-8 h-8 border-3 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  // Show auth page if not logged in
  if (!user) {
    return <AuthPage />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'intro': return <Intro setActiveTab={setActiveTab} />;
      case 'learn': return <Learn />;
      case 'scripture': return <Scripture />;
      case 'challenges': return <Challenges setActiveTab={setActiveTab} />;
      case 'harvest': return <Harvest />;
      case 'account': return <Accounting />;
      default: return <Intro setActiveTab={setActiveTab} />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      <InstallPrompt />
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {renderContent()}
      </div>

      {showReminder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-emerald-100 animate-in zoom-in-95 duration-300">
            <div className="text-center">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-4 animate-bounce">📅</div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">وقت المحاسبة يا بطل!</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                عدى يوم جديد.. تفتكر لسانك كان النهاردة عامل إيه؟
              </p>
              <div className="space-y-3">
                <button onClick={handleGoToAccounting} className="w-full bg-emerald-600 text-white font-bold py-3 rounded-2xl shadow-lg hover:bg-emerald-700 active:scale-95 transition-all">
                  يلا نحاسب نفسنا
                </button>
                <button onClick={handleDismissReminder} className="w-full bg-slate-100 text-slate-500 font-bold py-3 rounded-2xl hover:bg-slate-200 transition-all text-sm">
                  فكرني كمان شوية
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
