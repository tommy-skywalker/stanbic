import React from 'react';
import { UserProfile, Transaction } from '../types';
import { formatAmount } from '../utils';

interface TransferProps {
  user: UserProfile;
  transactions: Transaction[];
  onBack: () => void;
  onTransferComplete: (amount: number, recipient: string) => void;
}

const Transfer: React.FC<TransferProps> = ({ user, onBack }) => {
  return (
    <div className="bg-slate-50 min-h-full flex flex-col">
      <div className="bg-gradient-to-b from-[#00246e] to-[#0033a0] text-white px-6 pt-10 pb-8 rounded-b-[2rem]">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-sm font-bold uppercase tracking-widest">Send Money</span>
          <div className="w-10" />
        </div>

        <div className="mt-6">
          <p className="text-[11px] font-medium uppercase tracking-widest text-blue-200/70">Available Balance</p>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-sm font-semibold text-blue-200/80">NGN</span>
            <span className="text-3xl font-bold tracking-tight tabular-nums">{formatAmount(user.balance)}</span>
          </div>
        </div>
      </div>

      {/* Unavailable notice */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-16 text-center">
        <div className="w-20 h-20 rounded-3xl bg-amber-50 border border-amber-100 flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l2.5 2.5M12 21a9 9 0 100-18 9 9 0 000 18z" />
          </svg>
        </div>

        <h2 className="text-lg font-bold text-slate-900">Transfers Currently Unavailable</h2>
        <p className="text-sm text-slate-500 font-medium mt-2 max-w-xs leading-relaxed">
          Bank transfer is currently unavailable. Please try again during banking hours.
        </p>

        <div className="mt-6 inline-flex items-center gap-2 bg-white border border-slate-100 rounded-full px-4 py-2 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
            Banking Hours · Mon–Fri, 8:00 AM – 5:00 PM
          </span>
        </div>

        <button
          onClick={onBack}
          className="mt-10 w-full max-w-xs bg-[#0033a0] hover:bg-[#002880] text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-900/10 transition-all active:scale-[0.99]"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Transfer;
