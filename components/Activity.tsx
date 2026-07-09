import React, { useState } from 'react';
import { Transaction, UserProfile } from '../types';
import { formatAmount } from '../utils';

interface ActivityProps {
  transactions: Transaction[];
  user: UserProfile;
}

type Filter = 'all' | 'credit' | 'debit';

const Activity: React.FC<ActivityProps> = ({ transactions, user }) => {
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = transactions.filter((t) => filter === 'all' || t.type === filter);
  const moneyIn = transactions.filter((t) => t.type === 'credit').reduce((s, t) => s + t.amount, 0);
  const moneyOut = transactions.filter((t) => t.type === 'debit').reduce((s, t) => s + t.amount, 0);

  return (
    <div className="bg-slate-50 min-h-full">
      <div className="bg-gradient-to-b from-[#00246e] to-[#0033a0] text-white px-6 pt-10 pb-20 rounded-b-[2rem]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-blue-200/80">Account</p>
        <h1 className="text-2xl font-bold mt-1">Transactions</h1>

        <div className="grid grid-cols-2 gap-3 mt-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-blue-200/70">Money In</p>
            <p className="text-lg font-bold text-emerald-300 tabular-nums mt-1">+{formatAmount(moneyIn, false)}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-blue-200/70">Money Out</p>
            <p className="text-lg font-bold text-white tabular-nums mt-1">−{formatAmount(moneyOut, false)}</p>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-12 relative z-10">
        <div className="bg-white rounded-2xl p-1.5 shadow-lg shadow-slate-200/70 flex border border-slate-100">
          {(['all', 'credit', 'debit'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                filter === f ? 'bg-[#0033a0] text-white shadow-md' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {f === 'all' ? 'All' : f === 'credit' ? 'In' : 'Out'}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 pt-6 pb-10 space-y-2.5">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-300">
            <svg className="w-14 h-14 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-sm font-medium">No transactions</p>
          </div>
        ) : (
          filtered.map((tx) => {
            const credit = tx.type === 'credit';
            return (
              <div
                key={tx.id}
                className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      credit ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.2}>
                      {credit ? (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 11l5-5m0 0l5 5m-5-5v12" transform="rotate(45 12 12)" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 13l-5 5m0 0l-5-5m5 5V6" transform="rotate(45 12 12)" />
                      )}
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-slate-800 truncate">{tx.name}</h4>
                    <p className="text-[11px] text-slate-400 font-medium">{tx.date.replace(' . ', ' · ')}</p>
                  </div>
                </div>
                <div className="text-right shrink-0 pl-3">
                  <p className={`text-sm font-bold tabular-nums ${credit ? 'text-emerald-600' : 'text-slate-800'}`}>
                    {credit ? '+' : '−'}{formatAmount(tx.amount, false)}
                  </p>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Successful</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Activity;
