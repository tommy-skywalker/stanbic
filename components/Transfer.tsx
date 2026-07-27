import React from 'react';
import { UserProfile, Transaction } from '../types';

interface TransferProps {
  user: UserProfile;
  transactions: Transaction[];
  onBack: () => void;
  onTransferComplete: (amount: number, recipient: string) => void;
}

const Transfer: React.FC<TransferProps> = ({ onBack }) => {
  return (
    <div className="min-h-full">
      <header className="bg-white border-b border-gray-200 px-2 h-14 flex items-center gap-1">
        <button onClick={onBack} className="p-2 text-gray-600" aria-label="Back">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-base font-semibold text-gray-900">Transfer</h1>
      </header>

      <div className="px-4 py-4">
        <div className="bg-white border border-gray-200 rounded-xl px-6 py-10 text-center">
          <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l2.5 2.5M12 21a9 9 0 100-18 9 9 0 000 18z" />
            </svg>
          </div>
          <h2 className="text-[15px] font-semibold text-gray-900 mt-4">
            Bank transfer currently unavailable
          </h2>
          <p className="text-[13px] text-gray-500 mt-1.5 leading-relaxed">
            Please try again during banking hours
            <br />
            (Monday – Friday, 8:00 AM – 5:00 PM).
          </p>
          <button
            onClick={onBack}
            className="mt-6 w-full bg-[#0033a0] text-white text-sm font-semibold py-3 rounded-lg active:bg-[#002880]"
          >
            Back to home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Transfer;
