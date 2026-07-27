import React, { useState } from 'react';
import { Transaction, UserProfile } from '../types';
import { formatAmount } from '../utils';

interface ActivityProps {
  transactions: Transaction[];
  user: UserProfile;
}

type Filter = 'all' | 'credit' | 'debit';

const FILTERS: [Filter, string][] = [
  ['all', 'All'],
  ['credit', 'Money in'],
  ['debit', 'Money out'],
];

const Activity: React.FC<ActivityProps> = ({ transactions }) => {
  const [filter, setFilter] = useState<Filter>('all');
  const filtered = transactions.filter((t) => filter === 'all' || t.type === filter);

  return (
    <div className="min-h-full">
      <header className="bg-white border-b border-gray-200 px-4 h-14 flex items-center">
        <h1 className="text-base font-semibold text-gray-900">Transactions</h1>
      </header>

      <div className="px-4 py-4 space-y-3">
        <div className="flex gap-2">
          {FILTERS.map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-3.5 py-1.5 rounded-full border text-xs font-medium ${
                filter === key
                  ? 'bg-[#0033a0] border-[#0033a0] text-white'
                  : 'bg-white border-gray-300 text-gray-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">
            <p className="text-sm text-gray-500">No transactions to show.</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100 overflow-hidden">
            {filtered.map((tx) => {
              const credit = tx.type === 'credit';
              return (
                <div key={tx.id} className="px-4 py-3 flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                      credit ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      {credit ? (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      )}
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-medium text-gray-900 truncate">{tx.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{tx.date.replace(' . ', ' · ')}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p
                      className={`text-[13px] font-semibold tabular-nums ${
                        credit ? 'text-green-600' : 'text-gray-900'
                      }`}
                    >
                      {credit ? '+' : '−'}₦{formatAmount(tx.amount, false)}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5">Successful</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Activity;
