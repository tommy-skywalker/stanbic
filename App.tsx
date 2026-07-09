import React, { useState, useEffect } from 'react';
import { AppScreen, UserProfile, Transaction, ActiveInvestment } from './types';
import { maturityValue, nowLedgerStamp, ledgerStampForISO, startOfToday, parseISO } from './utils';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import Transfer from './components/Transfer';
import Activity from './components/Activity';
import Investment from './components/Investment';
import BottomNav from './components/BottomNav';
import Login from './components/Login';

const FUND_NAME = 'Stanbic High-Yield Mutual Fund';

// Seed state as of 09 July 2026:
//  - The 06 Jul fund has already MATURED and its ₦3,650,000 (interest included) is paid out.
//  - The remaining funds are active and pay out on their due dates.
const INITIAL_USER: UserProfile = {
  name: 'David Jaiye Sokeyo',
  accountNumber: '0002874480',
  accountType: 'Savings Account',
  balance: 4825000.0, // 175,000 opening + 3,650,000 matured payout + 1,000,000 deposit
  investmentBalance: 17430000.0, // sum of the three active fund values
  activeInvestments: [
    {
      id: 'inv-jul-06',
      name: FUND_NAME,
      amount: 3650000,
      interestRate: 5.42,
      durationMonths: 2,
      startDate: '2026-05-06',
      maturityDate: '2026-07-06',
      status: 'matured',
      payoutDate: '2026-07-06',
    },
    {
      id: 'inv-jul-10',
      name: FUND_NAME,
      amount: 3350000,
      interestRate: 5.42,
      durationMonths: 2,
      startDate: '2026-05-10',
      maturityDate: '2026-07-10',
      status: 'active',
    },
    {
      id: 'inv-aug-03',
      name: FUND_NAME,
      amount: 5580000,
      interestRate: 5.42,
      durationMonths: 3,
      startDate: '2026-05-03',
      maturityDate: '2026-08-03',
      status: 'active',
    },
    {
      id: 'inv-aug-07',
      name: FUND_NAME,
      amount: 8500000,
      interestRate: 5.42,
      durationMonths: 3,
      startDate: '2026-05-07',
      maturityDate: '2026-08-07',
      status: 'active',
    },
  ],
};

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-deposit-djs',
    name: 'Transfer from David Jaiye Sokeyo',
    type: 'credit',
    amount: 1000000,
    date: '09/07/26 . 10:00 AM',
    category: 'transfer',
  },
  {
    id: 'tx-payout-jul-06',
    name: 'Investment Payout — High-Yield Fund',
    type: 'credit',
    amount: 3650000,
    date: '06/07/26 . 09:00 AM',
    category: 'payout',
  },
  {
    id: 'tx-opening-credit',
    name: 'Account Opening Credit',
    type: 'credit',
    amount: 175000,
    date: '05/07/26 . 09:00 AM',
    category: 'system',
  },
  {
    id: 'tx-sub-jul-10',
    name: 'Mutual Fund Subscription',
    type: 'debit',
    amount: 3350000,
    date: '10/05/26 . 10:30 AM',
    category: 'investment',
  },
  {
    id: 'tx-sub-aug-07',
    name: 'Mutual Fund Subscription',
    type: 'debit',
    amount: 8500000,
    date: '07/05/26 . 01:15 PM',
    category: 'investment',
  },
  {
    id: 'tx-sub-jul-06',
    name: 'Mutual Fund Subscription',
    type: 'debit',
    amount: 3650000,
    date: '06/05/26 . 02:45 PM',
    category: 'investment',
  },
  {
    id: 'tx-sub-aug-03',
    name: 'Mutual Fund Subscription',
    type: 'debit',
    amount: 5580000,
    date: '03/05/26 . 09:15 AM',
    category: 'investment',
  },
];

// Bumped storage version so the new data model loads cleanly.
const STORAGE = {
  auth: 'stanbic_v13_auth',
  user: 'stanbic_v13_user',
  tx: 'stanbic_v13_tx',
};

const loadJSON = <T,>(key: string, fallback: T): T => {
  const saved = localStorage.getItem(key);
  if (!saved) return fallback;
  try {
    const parsed = JSON.parse(saved);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    () => localStorage.getItem(STORAGE.auth) === 'true',
  );
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(AppScreen.DASHBOARD);
  const [user, setUser] = useState<UserProfile>(() => loadJSON(STORAGE.user, INITIAL_USER));
  const [transactions, setTransactions] = useState<Transaction[]>(() =>
    loadJSON(STORAGE.tx, INITIAL_TRANSACTIONS),
  );

  useEffect(() => localStorage.setItem(STORAGE.user, JSON.stringify(user)), [user]);
  useEffect(() => localStorage.setItem(STORAGE.tx, JSON.stringify(transactions)), [transactions]);
  useEffect(() => localStorage.setItem(STORAGE.auth, String(isAuthenticated)), [isAuthenticated]);

  // Maturity engine: any active fund whose maturity date has arrived is paid out
  // (its full value credited to the available balance) exactly once.
  useEffect(() => {
    const today = startOfToday();
    const due = user.activeInvestments.filter(
      (inv) => inv.status === 'active' && parseISO(inv.maturityDate) <= today,
    );
    if (due.length === 0) return;

    const credited = due.reduce((sum, inv) => sum + inv.amount, 0);

    setUser((prev) => ({
      ...prev,
      balance: prev.balance + credited,
      investmentBalance: prev.investmentBalance - credited,
      activeInvestments: prev.activeInvestments.map((inv) =>
        due.find((d) => d.id === inv.id)
          ? { ...inv, status: 'matured', payoutDate: inv.maturityDate }
          : inv,
      ),
    }));

    setTransactions((prev) => [
      ...due.map((inv) => ({
        id: `tx-payout-${inv.id}`,
        name: 'Investment Payout — High-Yield Fund',
        type: 'credit' as const,
        amount: inv.amount,
        date: ledgerStampForISO(inv.maturityDate),
        category: 'payout' as const,
      })),
      ...prev,
    ]);
  }, [user.activeInvestments]);

  const handleInvestmentComplete = (capital: number, months: number, rate: number) => {
    const now = new Date();
    const maturity = new Date(now.getFullYear(), now.getMonth() + months, now.getDate());
    const toISO = (d: Date) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

    // Stored value is the full maturity payout (principal + interest).
    const payout = maturityValue(capital, rate, months);

    const newInvestment: ActiveInvestment = {
      id: `inv-${now.getTime()}`,
      name: FUND_NAME,
      amount: payout,
      interestRate: rate,
      durationMonths: months,
      startDate: toISO(now),
      maturityDate: toISO(maturity),
      status: 'active',
    };

    setUser((prev) => ({
      ...prev,
      balance: prev.balance - capital,
      investmentBalance: prev.investmentBalance + payout,
      activeInvestments: [newInvestment, ...prev.activeInvestments],
    }));

    setTransactions((prev) => [
      {
        id: `tx-sub-${now.getTime()}`,
        name: 'Mutual Fund Subscription',
        type: 'debit',
        amount: capital,
        date: nowLedgerStamp(),
        category: 'investment',
      },
      ...prev,
    ]);
  };

  const handleTransferComplete = (amount: number, recipient: string) => {
    setTransactions((prev) => [
      {
        id: `tx-out-${Date.now()}`,
        name: recipient || 'Funds Transfer',
        type: 'debit',
        amount,
        date: nowLedgerStamp(),
        category: 'transfer',
      },
      ...prev,
    ]);
    setUser((prev) => ({ ...prev, balance: prev.balance - amount }));
    setCurrentScreen(AppScreen.DASHBOARD);
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
      case AppScreen.PROFILE:
        return <Profile user={user} onLogout={handleLogout} />;
      case AppScreen.TRANSFER:
        return (
          <Transfer
            user={user}
            transactions={transactions}
            onBack={() => setCurrentScreen(AppScreen.DASHBOARD)}
            onTransferComplete={handleTransferComplete}
          />
        );
      case AppScreen.ACTIVITY:
        return <Activity transactions={transactions} user={user} />;
      case AppScreen.INVESTMENT:
        return <Investment user={user} onInvestmentComplete={handleInvestmentComplete} />;
      case AppScreen.DASHBOARD:
      default:
        return (
          <Dashboard
            user={user}
            onTransfer={() => setCurrentScreen(AppScreen.TRANSFER)}
            onViewActivity={() => setCurrentScreen(AppScreen.ACTIVITY)}
            onViewPortfolio={() => setCurrentScreen(AppScreen.INVESTMENT)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans flex flex-col">
      <div className="flex-1 w-full max-w-md mx-auto bg-slate-50 min-h-screen flex flex-col relative text-slate-900 shadow-2xl shadow-slate-300/50">
        <div className="flex-1 overflow-y-auto custom-scrollbar pb-24">{renderScreen()}</div>
        <div className="sticky bottom-0 w-full z-20">
          <BottomNav currentScreen={currentScreen} onNavigate={setCurrentScreen} />
        </div>
      </div>
    </div>
  );
};

export default App;
