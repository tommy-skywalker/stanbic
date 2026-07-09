import React, { useState } from 'react';
import { UserProfile, Transaction } from '../types';
import { formatNaira, formatAmount } from '../utils';

interface TransferProps {
  user: UserProfile;
  transactions: Transaction[];
  onBack: () => void;
  onTransferComplete: (amount: number, recipient: string) => void;
}

const BENEFICIARIES = [
  { name: 'Aisha Bello', bank: 'GTBank', account: '0123456789' },
  { name: 'Emeka Obi', bank: 'Access Bank', account: '0987654321' },
  { name: 'Tunde Adeyemi', bank: 'Stanbic IBTC', account: '0044556677' },
];

const Transfer: React.FC<TransferProps> = ({ user, onBack, onTransferComplete }) => {
  const [step, setStep] = useState<'select' | 'amount'>('select');
  const [recipient, setRecipient] = useState<{ name: string; bank: string; account: string } | null>(null);
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);

  const amt = parseFloat(amount);

  const submit = () => {
    if (isNaN(amt) || amt <= 0) return setError('Enter a valid amount');
    if (amt > user.balance) return setError('Insufficient balance');
    setError('');
    setProcessing(true);
    setTimeout(() => onTransferComplete(amt, `Transfer to ${recipient?.name}`), 1400);
  };

  return (
    <div className="bg-slate-50 min-h-full">
      <div className="bg-gradient-to-b from-[#00246e] to-[#0033a0] text-white px-6 pt-10 pb-8 rounded-b-[2rem]">
        <div className="flex items-center justify-between">
          <button
            onClick={() => (step === 'amount' ? setStep('select') : onBack())}
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

      <div className="px-6 pt-6 pb-10">
        {step === 'select' ? (
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">
              Select Beneficiary
            </h3>
            <div className="space-y-2.5">
              {BENEFICIARIES.map((b) => (
                <button
                  key={b.account}
                  onClick={() => {
                    setRecipient(b);
                    setStep('amount');
                  }}
                  className="w-full flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-blue-200 transition-colors group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-full bg-blue-50 text-[#0033a0] flex items-center justify-center font-bold text-sm">
                      {b.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div className="text-left">
                      <h4 className="text-sm font-bold text-slate-800">{b.name}</h4>
                      <p className="text-[11px] text-slate-400 font-medium">
                        {b.bank} · {b.account}
                      </p>
                    </div>
                  </div>
                  <svg className="w-4 h-4 text-slate-300 group-hover:text-[#0033a0] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>

            <button className="w-full mt-4 border border-dashed border-slate-300 text-slate-500 font-bold py-4 rounded-2xl text-sm hover:border-[#0033a0] hover:text-[#0033a0] transition-colors flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              New Recipient
            </button>
          </div>
        ) : (
          <div className="animate-slide-up">
            {recipient && (
              <div className="flex items-center gap-3.5 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm mb-6">
                <div className="w-11 h-11 rounded-full bg-blue-50 text-[#0033a0] flex items-center justify-center font-bold text-sm">
                  {recipient.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">{recipient.name}</h4>
                  <p className="text-[11px] text-slate-400 font-medium">
                    {recipient.bank} · {recipient.account}
                  </p>
                </div>
              </div>
            )}

            <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">
              Amount
            </label>
            <div className="relative mb-2">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-400">₦</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setError('');
                }}
                placeholder="0.00"
                autoFocus
                className="w-full bg-white border border-slate-200 focus:border-[#0033a0] focus:ring-2 focus:ring-blue-100 rounded-2xl py-5 pl-12 pr-4 text-2xl font-bold outline-none transition-all text-slate-900 tabular-nums"
              />
            </div>
            {error && <p className="text-[11px] font-semibold text-rose-500 mb-2">{error}</p>}

            <div className="flex flex-wrap gap-2 mb-8">
              {[50000, 100000, 500000, 1000000].map((q) => (
                <button
                  key={q}
                  onClick={() => setAmount(String(q))}
                  className="px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-600 hover:border-[#0033a0] hover:text-[#0033a0] transition-colors tabular-nums"
                >
                  ₦{formatAmount(q, false)}
                </button>
              ))}
            </div>

            <button
              onClick={submit}
              disabled={processing}
              className="w-full bg-[#0033a0] hover:bg-[#002880] text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-900/10 transition-all active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {processing ? (
                <>
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Sending
                </>
              ) : (
                `Send ${amt > 0 && !isNaN(amt) ? formatNaira(amt, false) : 'Money'}`
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transfer;
