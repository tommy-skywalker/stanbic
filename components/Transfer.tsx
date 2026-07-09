import React, { useState } from 'react';
import { UserProfile, Transaction } from '../types';

interface TransferProps {
  user: UserProfile;
  transactions: Transaction[];
  onBack: () => void;
  onTransferComplete: (amount: number) => void;
}

const Transfer: React.FC<TransferProps> = ({ user, transactions, onBack, onTransferComplete }) => {
  const [step, setStep] = useState<'options' | 'input'>('options');
  const [amount, setAmount] = useState('');

  const handleTransfer = () => {
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0 || amt > user.balance) {
      alert("Invalid amount or insufficient balance");
      return;
    }
    onTransferComplete(amt);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className="bg-[#0033a0] min-h-screen flex flex-col font-sans text-white relative overflow-hidden">
      {/* Background glowing effects */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 -right-32 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl"></div>

      {/* Top Section matching rightmost screen of Inspiration */}
      <div className="p-6 pt-8 relative z-10">
        <div className="flex justify-between items-center mb-6">
          <button onClick={onBack} className="p-2 -ml-2 text-white/90 hover:text-white hover:bg-white/10 rounded-full transition-all active:scale-95">
            <svg className="w-6 h-6 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="bg-white/15 p-2.5 rounded-full backdrop-blur-md">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
        </div>

        <h2 className="text-xl font-black tracking-wide">Funds Transfer</h2>
        <p className="text-xs text-white/60 mt-1">How would you like to transfer Money?</p>

        {/* Big Buttons inside Top Blue Block */}
        <div className="space-y-3 mt-6">
          <TransferOption title="Send to Beneficiary" onClick={() => setStep('input')} />
          <TransferOption title="Send to Account Number" onClick={() => setStep('input')} />
        </div>
      </div>

      {/* Overlapping White Body with rounded top corner card occupying rest of screen */}
      <div className="flex-1 bg-white text-gray-800 rounded-t-[2.5rem] mt-4 p-6 shadow-inner-2xl relative z-10 flex flex-col">
        {step === 'options' ? (
          <div className="flex-1 flex flex-col">
            {/* Header / Pills of recent transfers */}
            <div className="flex justify-between items-center mb-4">
              <span className="text-[11px] font-black uppercase tracking-[0.15em] text-gray-400">Recent Transfers</span>
              <span className="text-xs font-bold text-[#0033a0] cursor-pointer hover:underline">See All</span>
            </div>
            
            {/* List of Recent Transfers */}
            <div className="space-y-3.5 flex-1 overflow-y-auto max-h-[320px] pr-1 custom-scrollbar">
              {transactions.slice(0, 5).map(tx => (
                <div key={tx.id} className="flex items-center justify-between p-2.5 hover:bg-gray-50 rounded-2xl transition-all cursor-pointer border border-transparent hover:border-gray-100">
                  <div className="flex items-center gap-3.5">
                    {/* Circle icon with user avatar representation */}
                    <div className="w-10.5 h-10.5 rounded-full bg-blue-50 text-[#0033a0] flex items-center justify-center font-black text-xs relative overflow-hidden">
                      {tx.name.charAt(0).toUpperCase()}
                      <div className="absolute inset-0 bg-blue-600/5"></div>
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-gray-800 tracking-wide">{tx.name}</h4>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
                        {tx.bank ? `${tx.bank} • ` : 'Stanbic • '}{tx.date.split(' . ')[0]}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-right">
                    <span className={`text-xs font-black ${tx.type === 'debit' ? 'text-gray-800' : 'text-emerald-600'}`}>
                      {tx.type === 'debit' ? '-' : '+'}{formatCurrency(tx.amount).replace('NGN', '').trim()}
                    </span>
                    <div className="w-5 h-5 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center border border-emerald-200">
                      <svg className="w-3.5 h-3.5 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="animate-slide-up flex-1 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider">Enter Amount</h3>
                <button 
                  onClick={() => setStep('options')} 
                  className="text-xs font-bold text-gray-400 hover:text-gray-600"
                >
                  Back
                </button>
              </div>

              {/* Amount input block */}
              <div className="relative mb-6">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl font-black text-gray-400">₦</span>
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-[#0033a0] rounded-2xl py-5 pl-12 pr-4 text-2xl font-black outline-none transition-all text-gray-800"
                />
              </div>

              {/* Balance card */}
              <div className="bg-blue-50/50 border border-blue-50/80 rounded-2xl p-4.5 mb-8 flex justify-between items-center">
                <span className="text-xs font-bold text-gray-500">Available Balance:</span>
                <span className="text-sm font-black text-[#0033a0]">{formatCurrency(user.balance)}</span>
              </div>
            </div>

            <div className="space-y-3">
              <button 
                onClick={handleTransfer}
                className="w-full bg-[#0033a0] hover:bg-[#002880] text-white font-black py-4.5 rounded-2xl shadow-xl transition-all active:scale-[0.98]"
              >
                Continue
              </button>
              <button 
                onClick={() => setStep('options')}
                className="w-full text-gray-400 font-extrabold py-2 text-xs uppercase tracking-widest hover:text-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const TransferOption: React.FC<{ title: string; onClick: () => void }> = ({ title, onClick }) => (
  <button onClick={onClick} className="w-full flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl transition-all group active:scale-[0.99]">
    <span className="text-sm font-bold tracking-wide">{title}</span>
    <div className="w-7 h-7 bg-white/10 text-white rounded-full flex items-center justify-center group-hover:bg-white group-hover:text-[#0033a0] transition-all">
      <svg className="w-4 h-4 stroke-[2.5] group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </div>
  </button>
);

export default Transfer;
