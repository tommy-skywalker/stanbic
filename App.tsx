
import React, { useState, useEffect } from 'react';
import { AppScreen, UserProfile, Transaction, ActiveInvestment } from './types';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import Transfer from './components/Transfer';
import Activity from './components/Activity';
import Investment from './components/Investment';
import BottomNav from './components/BottomNav';
import ChatAssistant from './components/ChatAssistant';
import Login from './components/Login';

const INITIAL_USER: UserProfile = {
  name: 'David Jaiye Sokeyo',
  accountNumber: '0002874480',
  accountType: 'SAVINGS ACCOUNT',
  balance: 175000.00,
  investmentBalance: 21080000.00,
  activeInvestments: [
    {
      id: 'inv-july-10',
      amount: 3350000,
      startDate: '2026-05-10',
      maturityDate: '10 July 2026',
      interestRate: 5.42,
      durationMonths: 2,
      name: 'Stanbic Mutual High-Yield Fund'
    },
    {
      id: 'inv-july-6',
      amount: 3650000,
      startDate: '2026-05-06',
      maturityDate: '06 July 2026',
      interestRate: 5.42,
      durationMonths: 2,
      name: 'Stanbic Mutual High-Yield Fund'
    },
    {
      id: 'inv-aug-7',
      amount: 8500000,
      startDate: '2026-05-07',
      maturityDate: '07 August 2026',
      interestRate: 5.42,
      durationMonths: 3,
      name: 'Stanbic Mutual High-Yield Fund'
    },
    {
      id: 'inv-aug-3',
      amount: 5580000,
      startDate: '2026-05-03',
      maturityDate: '03 August 2026',
      interestRate: 5.42,
      durationMonths: 3,
      name: 'Stanbic Mutual High-Yield Fund'
    }
  ]
};

const INITIAL_TRANSACTIONS: Transaction[] = [
  { 
    id: 'tx-initial-balance-credit', 
    name: 'Account Credit: SYSTEM RESET', 
    type: 'credit', 
    amount: 175000, 
    date: '05/07/26 . 09:00 AM', 
  },
  { 
    id: 'tx-inv-1', 
    name: 'Stanbic Mutual funds Subscription', 
    type: 'debit', 
    amount: 3350000, 
    date: '10/05/26 . 10:30 AM', 
  },
  { 
    id: 'tx-inv-2', 
    name: 'Stanbic Mutual funds Subscription', 
    type: 'debit', 
    amount: 3650000, 
    date: '06/05/26 . 02:45 PM', 
  },
  { 
    id: 'tx-inv-3', 
    name: 'Stanbic Mutual funds Subscription', 
    type: 'debit', 
    amount: 8500000, 
    date: '07/05/26 . 01:15 PM', 
  },
  { 
    id: 'tx-inv-4', 
    name: 'Stanbic Mutual funds Subscription', 
    type: 'debit', 
    amount: 5580000, 
    date: '03/05/26 . 09:15 AM', 
  }
];

const App: React.FC = () => {
  // Bumped to v11 to ensure a clean slate and exact data representation on first load
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('stanbic_v11_auth') === 'true';
  });
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(AppScreen.DASHBOARD);
  
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('stanbic_v11_user_data');
    console.log("Loading user from localStorage:", saved);
    
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && 'activeInvestments' in parsed) {
          return parsed;
        }
      } catch (e) {
        console.error("Storage error:", e);
      }
    }
    
    // Default state with the correct July 5 numbers
    return {
        ...INITIAL_USER,
      };
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('stanbic_v11_transactions_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        console.error("Storage error:", e);
      }
    }
    return INITIAL_TRANSACTIONS;
  });

  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    console.log("Saving user to localStorage:", user);
    localStorage.setItem('stanbic_v11_user_data', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    console.log("Saving transactions to localStorage:", transactions);
    localStorage.setItem('stanbic_v11_transactions_data', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('stanbic_v11_auth', isAuthenticated.toString());
  }, [isAuthenticated]);




  useEffect(() => {
    const today = new Date();
    
    const maturedInvestments = user.activeInvestments.filter(inv => {
      const parts = inv.maturityDate.split(' ');
      const day = parseInt(parts[0]);
      const monthStr = parts[1];
      const year = parseInt(parts[2]);
      const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      const month = months.indexOf(monthStr);
      const maturityDate = new Date(year, month, day);
      return maturityDate <= today;
    });

    if (maturedInvestments.length > 0) {
      let balanceIncrease = 0;
      maturedInvestments.forEach(inv => {
        balanceIncrease += inv.amount;
      });

      // Check if we need to re-invest the March one
      const marchInvestment = maturedInvestments.find(inv => inv.id === 'pre-2');

      setUser(prev => {
        const updatedInvestments = prev.activeInvestments.filter(inv => !maturedInvestments.find(m => m.id === inv.id));
        
        let newBalance = prev.balance + balanceIncrease;
        let newInvestmentBalance = prev.investmentBalance - balanceIncrease;

        if (marchInvestment) {
          newBalance -= marchInvestment.amount;
          newInvestmentBalance += marchInvestment.amount;
          
          const now = new Date();
          const maturityDate = new Date();
          maturityDate.setMonth(maturityDate.getMonth() + 2);
          
          const maturityDateStr = maturityDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
          const startDateStr = now.toISOString().split('T')[0];
          
          const newInvestment: ActiveInvestment = {
            id: `inv-${Date.now()}`,
            amount: marchInvestment.amount,
            startDate: startDateStr,
            maturityDate: maturityDateStr,
            interestRate: 5.42,
            durationMonths: 2,
            name: 'Stanbic Mutual High-Yield Fund'
          };
          updatedInvestments.push(newInvestment);
        }

        return {
          ...prev,
          balance: newBalance,
          investmentBalance: newInvestmentBalance,
          activeInvestments: updatedInvestments
        };
      });

      // Log transactions for payouts
      const now = new Date();
      const txDateStr = `${now.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' })} . ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}`;
      
      const newTxs: Transaction[] = maturedInvestments.map(inv => ({
        id: `tx-payout-${inv.id}-${Date.now()}`,
        name: `Investment Payout: ${inv.name}`,
        type: 'credit',
        amount: inv.amount,
        date: txDateStr,
      }));
      setTransactions(prev => [...newTxs, ...prev]);
    }
  }, [user.activeInvestments]);

  const handleInvestmentComplete = (amount: number, months: number) => {
    const now = new Date();
    const maturityDate = new Date();
    maturityDate.setMonth(maturityDate.getMonth() + months);
    
    const maturityDateStr = maturityDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
    const startDateStr = now.toISOString().split('T')[0];
    const txDateStr = `${now.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' })} . ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}`;

    const newInvestment: ActiveInvestment = {
      id: `inv-${Date.now()}`,
      amount: amount,
      startDate: startDateStr,
      maturityDate: maturityDateStr,
      interestRate: 5.42,
      durationMonths: months,
      name: 'Stanbic Mutual High-Yield Fund'
    };

    setUser(prev => ({
      ...prev,
      balance: prev.balance - amount,
      investmentBalance: prev.investmentBalance + amount,
      activeInvestments: [newInvestment, ...prev.activeInvestments]
    }));
    
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      name: 'Stanbic Mutual funds Subscription',
      type: 'debit',
      amount: amount,
      date: txDateStr,
    };
    setTransactions(prev => [newTx, ...prev]);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentScreen(AppScreen.DASHBOARD);
  };

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case AppScreen.DASHBOARD:
        return <Dashboard 
          user={user} 
          onTransfer={() => setCurrentScreen(AppScreen.TRANSFER)} 
          onViewActivity={() => setCurrentScreen(AppScreen.ACTIVITY)}
          onViewPortfolio={() => setCurrentScreen(AppScreen.INVESTMENT)}
        />;
      case AppScreen.PROFILE:
        return <Profile user={user} />;
      case AppScreen.TRANSFER:
        return <Transfer 
          user={user} 
          transactions={transactions} 
          onBack={() => setCurrentScreen(AppScreen.DASHBOARD)}
          onTransferComplete={(amount) => {
            const now = new Date();
            const txDateStr = `${now.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' })} . ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}`;
            const newTx: Transaction = {
              id: `tx-out-${Date.now()}`,
              name: 'Transfer Out',
              type: 'debit',
              amount: amount,
              date: txDateStr,
            };
            setTransactions(prev => [newTx, ...prev]);
            setUser(prev => ({ ...prev, balance: prev.balance - amount }));
            setCurrentScreen(AppScreen.DASHBOARD);
          }}
        />;
      case AppScreen.ACTIVITY:
        return <Activity transactions={transactions} />;
      case AppScreen.INVESTMENT:
        return <Investment user={user} onInvestmentComplete={handleInvestmentComplete} />;
      default:
        return <Dashboard 
          user={user} 
          onTransfer={() => setCurrentScreen(AppScreen.TRANSFER)} 
          onViewActivity={() => setCurrentScreen(AppScreen.ACTIVITY)}
          onViewPortfolio={() => setCurrentScreen(AppScreen.INVESTMENT)}
        />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      <div className="flex-1 w-full max-w-2xl mx-auto bg-white shadow-xl min-h-screen flex flex-col relative text-gray-900">
        <div className="flex-1 overflow-y-auto custom-scrollbar pb-24">
          {renderScreen()}
        </div>

        <button 
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="fixed bottom-24 right-6 lg:right-[calc(50%-320px)] bg-[#0033a0] hover:bg-[#002880] text-white p-4 rounded-full shadow-lg transition-transform active:scale-95 z-50"
          aria-label="Toggle Assistant"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>

        {isChatOpen && <ChatAssistant onClose={() => setIsChatOpen(false)} user={user} />}

        <div className="sticky bottom-0 w-full z-10">
          <BottomNav 
            currentScreen={currentScreen} 
            onNavigate={setCurrentScreen} 
          />
        </div>
      </div>
    </div>
  );
};

export default App;
