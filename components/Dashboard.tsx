import React, { useState } from 'react';
import { UserProfile, Transaction, STANBIC_LOGO } from '../types';
import { formatAmount, formatDateLong, daysUntil } from '../utils';

interface DashboardProps {
  user: UserProfile;
  transactions: Transaction[];
  onTransfer: () => void;
  onViewActivity: () => void;
  onViewPortfolio: () => void;
}

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

const Dashboard: React.FC<DashboardProps> = ({
  user,
  transactions,
  onTransfer,
  onViewActivity,
  onViewPortfolio,
}) => {
  const [showBalance, setShowBalance] = useState(true);
  const [copied, setCopied] = useState(false);

  const firstName = user.name.split(' ')[0];
  const active = user.activeInvestments
    .filter((i) => i.status === 'active')
    .sort((a, b) => daysUntil(a.maturityDate) - daysUntil(b.maturityDate));
  const nextPayout = active[0];
  const recent = transactions.slice(0, 3);

  const copyAccount = () => {
    navigator.clipboard?.writeText(user.accountNumber).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="min-h-full">
      {/* App bar */}
      <header className="bg-white border-b border-gray-200 px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={STANBIC_LOGO} alt="" className="h-6 w-auto" />
          <span className="text-[15px] font-semibold text-gray-900">Stanbic IBTC</span>
        </div>
        <button className="relative p-2 -mr-2 text-gray-500" aria-label="Notifications">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
        </button>
      </header>

      <div className="px-4 py-4 space-y-4">
        <p className="text-sm text-gray-600">
          {greeting()}, <span className="font-semibold text-gray-900">{firstName}</span>
        </p>

        {/* Balance card */}
        <div className="bg-[#0033a0] rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <span className="text-xs text-blue-100">Available balance</span>
            <button onClick={() => setShowBalance((s) => !s)} className="text-blue-100 p-1 -m-1" aria-label="Toggle balance">
              {showBalance ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              )}
            </button>
          </div>
          <p className="text-[26px] font-semibold tabular-nums leading-tight mt-1">
            {showBalance ? `₦${formatAmount(user.balance)}` : '₦ ••••••'}
          </p>
          <div className="mt-3 pt-3 border-t border-white/15 flex items-center justify-between text-xs">
            <span className="text-blue-100">{user.accountType}</span>
            <button onClick={copyAccount} className="flex items-center gap-1.5 font-medium">
              {user.accountNumber}
              {copied ? (
                <span className="text-blue-200">Copied</span>
              ) : (
                <svg className="w-3.5 h-3.5 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-4 gap-2">
          <QuickAction label="Transfer" onClick={onTransfer} icon={
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          } />
          <QuickAction label="Invest" onClick={onViewPortfolio} icon={
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          } />
          <QuickAction label="Airtime" onClick={() => {}} icon={
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          } />
          <QuickAction label="Pay bills" onClick={() => {}} icon={
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
          } />
        </div>

        {/* Investments summary */}
        <section className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900">Investments</h2>
            <button onClick={onViewPortfolio} className="text-xs font-medium text-[#0033a0]">
              View all
            </button>
          </div>
          <div className="px-4 py-3">
            <p className="text-xs text-gray-500">Total value</p>
            <p className="text-lg font-semibold text-gray-900 tabular-nums">₦{formatAmount(user.investmentBalance)}</p>
            {nextPayout && (
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="text-gray-500">Next payout · {formatDateLong(nextPayout.maturityDate)}</span>
                <span className="font-semibold text-green-600 tabular-nums">
                  +₦{formatAmount(nextPayout.amount, false)}
                </span>
              </div>
            )}
          </div>
        </section>

        {/* Recent transactions */}
        <section className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900">Recent transactions</h2>
            <button onClick={onViewActivity} className="text-xs font-medium text-[#0033a0]">
              See all
            </button>
          </div>
          <div className="divide-y divide-gray-100">
            {recent.map((tx) => (
              <div key={tx.id} className="px-4 py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[13px] font-medium text-gray-900 truncate">{tx.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{tx.date.replace(' . ', ' · ')}</p>
                </div>
                <span
                  className={`text-[13px] font-semibold tabular-nums shrink-0 ${
                    tx.type === 'credit' ? 'text-green-600' : 'text-gray-900'
                  }`}
                >
                  {tx.type === 'credit' ? '+' : '−'}₦{formatAmount(tx.amount, false)}
                </span>
              </div>
            ))}
          </div>
        </section>

        <p className="text-[11px] leading-relaxed text-gray-400 text-center px-4 pt-1 pb-2">
          Stanbic IBTC Bank PLC is licensed by the Central Bank of Nigeria. Deposits insured by the NDIC.
        </p>
      </div>
    </div>
  );
};

const QuickAction: React.FC<{ label: string; onClick: () => void; icon: React.ReactNode }> = ({
  label,
  onClick,
  icon,
}) => (
  <button
    onClick={onClick}
    className="bg-white border border-gray-200 rounded-xl py-3 flex flex-col items-center gap-1.5 active:bg-gray-50"
  >
    <svg className="w-5 h-5 text-[#0033a0]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
      {icon}
    </svg>
    <span className="text-[11px] font-medium text-gray-700">{label}</span>
  </button>
);

export default Dashboard;
