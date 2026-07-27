import React, { useState, useEffect, useRef } from 'react';
import { AppScreen, UserProfile, Transaction, ActiveInvestment } from './types';
import { maturityValue, nowLedgerStamp, ledgerStampForISO, startOfToday, parseISO } from './utils';
import { isSyncEnabled, fetchState, saveState, RemoteState } from './services/db';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import Transfer from './components/Transfer';
import Activity from './components/Activity';
import Investment from './components/Investment';
import BottomNav from './components/BottomNav';
import Login from './components/Login';

const FUND_NAME = 'Stanbic High-Yield Mutual Fund';

// Seed state as of late July 2026:
//  - 06 Jul and 10 Jul funds have MATURED and their values (interest included) were paid out.
//  - A new ₦5,000,000 plan started 10 Jul and pays out 10 Sep.
//  - Ledger reconciles to a ₦3,000,000 available balance.
const INITIAL_USER: UserProfile = {
  name: 'David Jaiye Sokeyo',
  accountNumber: '0002874480',
  accountType: 'Savings Account',
  balance: 3177345.0,
  investmentBalance: 19080000.0, // 5,000,000 + 5,580,000 + 8,500,000 active fund values
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
      status: 'matured',
      payoutDate: '2026-07-10',
    },
    {
      id: 'inv-sep-10',
      name: FUND_NAME,
      amount: 5000000,
      interestRate: 5.42,
      durationMonths: 2,
      startDate: '2026-07-10',
      maturityDate: '2026-09-10',
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

// Reconciles: 175,000 + 3,650,000 + 1,002,345 + 3,350,000 − 5,000,000 = 3,177,345
const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-sub-sep-10',
    name: 'Mutual Fund Subscription',
    type: 'debit',
    amount: 5000000,
    date: '10/07/26 . 11:45 AM',
    category: 'investment',
  },
  {
    id: 'tx-payout-jul-10',
    name: 'Investment Payout — High-Yield Fund',
    type: 'credit',
    amount: 3350000,
    date: '10/07/26 . 09:00 AM',
    category: 'payout',
  },
  {
    id: 'tx-deposit-djs',
    name: 'Transfer from David Jaiye Sokeyo',
    type: 'credit',
    amount: 1002345,
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
  auth: 'stanbic_v16_auth',
  user: 'stanbic_v16_user',
  tx: 'stanbic_v16_tx',
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

  // Cross-device sync bookkeeping (refs so they don't trigger re-renders).
  const syncReadyRef = useRef(false); // true once the initial remote load resolves
  const pendingRef = useRef(false); // true while a local change is waiting to be saved
  const lastSyncedRef = useRef(''); // JSON of the state last saved-to / applied-from remote

  useEffect(() => localStorage.setItem(STORAGE.user, JSON.stringify(user)), [user]);
  useEffect(() => localStorage.setItem(STORAGE.tx, JSON.stringify(transactions)), [transactions]);
  useEffect(() => localStorage.setItem(STORAGE.auth, String(isAuthenticated)), [isAuthenticated]);

  // Load shared state from Supabase on open, then poll for remote changes.
  useEffect(() => {
    if (!isSyncEnabled()) {
      syncReadyRef.current = true; // local-only mode
      return;
    }
    let cancelled = false;

    const apply = (remote: RemoteState) => {
      if (pendingRef.current) return; // don't overwrite an unsaved local change
      const json = JSON.stringify(remote.data);
      if (json === lastSyncedRef.current) return; // nothing new
      lastSyncedRef.current = json;
      setUser(remote.data.user);
      setTransactions(remote.data.transactions);
    };

    (async () => {
      try {
        const remote = await fetchState();
        if (cancelled) return;
        if (remote) {
          apply(remote);
        } else {
          const seed = { user, transactions };
          lastSyncedRef.current = JSON.stringify(seed);
          await saveState(seed);
        }
      } catch (e) {
        console.warn('Sync init failed, running local-only:', e);
      } finally {
        syncReadyRef.current = true;
      }
    })();

    const interval = setInterval(async () => {
      try {
        const remote = await fetchState();
        if (!cancelled && remote) apply(remote);
      } catch {
        /* ignore transient poll errors */
      }
    }, 3000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Push local changes to the shared record (debounced, last-write-wins).
  useEffect(() => {
    if (!isSyncEnabled() || !syncReadyRef.current) return;
    const state = { user, transactions };
    const json = JSON.stringify(state);
    if (json === lastSyncedRef.current) return;
    pendingRef.current = true;
    const t = setTimeout(async () => {
      try {
        await saveState(state);
        lastSyncedRef.current = json;
      } catch (e) {
        console.warn('Sync save failed:', e);
      } finally {
        pendingRef.current = false;
      }
    }, 400);
    return () => clearTimeout(t);
  }, [user, transactions]);

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
            transactions={transactions}
            onTransfer={() => setCurrentScreen(AppScreen.TRANSFER)}
            onViewActivity={() => setCurrentScreen(AppScreen.ACTIVITY)}
            onViewPortfolio={() => setCurrentScreen(AppScreen.INVESTMENT)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 font-sans flex flex-col">
      <div className="flex-1 w-full max-w-md mx-auto bg-[#f4f5f7] min-h-screen flex flex-col relative text-gray-900 sm:border-x sm:border-gray-300">
        <div className="flex-1 overflow-y-auto custom-scrollbar pb-20">{renderScreen()}</div>
        <div className="sticky bottom-0 w-full z-20">
          <BottomNav currentScreen={currentScreen} onNavigate={setCurrentScreen} />
        </div>
      </div>
    </div>
  );
};

export default App;
