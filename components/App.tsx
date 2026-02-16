
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Intro from './components/Intro';
import Learn from './components/Learn';
import Accounting from './components/Accounting';
import Harvest from './components/Harvest';
import Challenges from './components/Challenges';
import Scripture from './components/Scripture';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('intro');
  const [showReminder, setShowReminder] = useState(false);

  useEffect(() => {
    const checkDailyReminder = () => {
      const today = new Date().toDateString();
      const lastReminder = localStorage.getItem('last_reminder_date');
      
      const savedEntries = localStorage.getItem('tongue_accounting');
      const hasDoneAccountingToday = savedEntries 
        ? JSON.parse(savedEntries).some((e: any) => e.date === new Date().toISOString().split('T')[0])
        : false;

      if (lastReminder !== today && !hasDoneAccountingToday) {
        setShowReminder(true);
      }
    };

    const timer = setTimeout(checkDailyReminder, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleDismissReminder = () => {
    localStorage.setItem('last_reminder_date', new Date().toDateString());
    setShowReminder(false);
  };

  const handleGoToAccounting = () => {
    localStorage.setItem('last_reminder_date', new Date().toDateString());
    setActiveTab('account');
    setShowReminder(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'intro':
        return <Intro />;
      case 'learn':
        return <Learn />;
      case 'scripture':
        return <Scripture />;
      case 'challenges':
        return <Challenges />;
      case 'harvest':
        return <Harvest />;
      case 'account':
        return <Accounting />;
      default:
        return <Intro />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {renderContent()}
      </div>

      {showReminder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-emerald-100 animate-in zoom-in-95 duration-300">
            <div className="text-center">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-4 animate-bounce">
                📅
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">وقت المحاسبة يا بطل!</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                عدى يوم جديد.. تفتكر لسانك كان النهاردة عامل إيه؟ خذ دقيقة من وقتك وراجع نفسك في جدول المحاسبة.
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={handleGoToAccounting}
                  className="w-full bg-emerald-600 text-white font-bold py-3 rounded-2xl shadow-lg hover:bg-emerald-700 active:scale-95 transition-all"
                >
                  يلا نحاسب نفسنا
                </button>
                <button
                  onClick={handleDismissReminder}
                  className="w-full bg-slate-100 text-slate-500 font-bold py-3 rounded-2xl hover:bg-slate-200 transition-all text-sm"
                >
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

export default App;
