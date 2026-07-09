
import React from 'react';
import { Transaction } from '../types';

interface ActivityProps {
  transactions: Transaction[];
}

const Activity: React.FC<ActivityProps> = ({ transactions }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(value);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-[#0033a0] font-bold text-xl uppercase tracking-wider">Transaction Activity</h1>
        <div className="bg-blue-50 text-[#0033a0] p-2 rounded-lg">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
        </div>
      </div>

      <div className="space-y-4">
        {transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            <p className="text-sm font-medium">No transactions found</p>
          </div>
        ) : (
          transactions.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-50 border border-gray-100">
                  <span className="font-bold text-[#0033a0] text-sm">{tx.name.charAt(0)}</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-800 line-clamp-1">{tx.name}</h4>
                  <div className="flex items-center gap-2">
                    <p className="text-[10px] text-gray-400 font-medium uppercase">{tx.date}</p>
                    {tx.bank && (
                      <>
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <p className="text-[10px] text-[#0033a0] font-bold uppercase">{tx.bank}</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-bold ${tx.type === 'debit' ? 'text-red-500' : 'text-green-500'}`}>
                  {tx.type === 'debit' ? '-' : '+'}{formatCurrency(tx.amount)}
                </p>
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter mt-1">Successful</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Activity;
