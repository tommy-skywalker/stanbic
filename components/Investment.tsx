import React, { useState, useMemo } from 'react';
import { UserProfile, ActiveInvestment } from '../types';
import {
  formatNaira,
  formatAmount,
  formatDateShort,
  formatDateLong,
  daysUntil,
  termProgress,
  maturityValue,
  totalInterest,
} from '../utils';

interface InvestmentProps {
  user: UserProfile;
  onInvestmentComplete: (capital: number, months: number, rate: number) => void;
}

const RATE = 5.42; // monthly %
const MIN_CAPITAL = 3000000;

const Investment: React.FC<InvestmentProps> = ({ user, onInvestmentComplete }) => {
  const [tab, setTab] = useState<'plans' | 'new'>('plans');
  const [capital, setCapital] = useState('');
  const [months, setMonths] = useState(2);
  const [agreed, setAgreed] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const active = useMemo(
    () =>
      user.activeInvestments
        .filter((i) => i.status === 'active')
        .sort((a, b) => daysUntil(a.maturityDate) - daysUntil(b.maturityDate)),
    [user.activeInvestments],
  );
  const matured = useMemo(
    () => user.activeInvestments.filter((i) => i.status === 'matured'),
    [user.activeInvestments],
  );

  const amt = parseFloat(capital);
  const tooLow = capital !== '' && !isNaN(amt) && amt < MIN_CAPITAL;
  const tooHigh = !isNaN(amt) && amt > user.balance;
  const validAmount = !isNaN(amt) && amt >= MIN_CAPITAL && amt <= user.balance;
  const projectedPayout = validAmount ? maturityValue(amt, RATE, months) : 0;
  const projectedInterest = validAmount ? totalInterest(amt, RATE, months) : 0;
  const projectedMaturity = useMemo(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + months);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  }, [months]);

  const finalize = () => {
    setProcessing(true);
    setTimeout(() => {
      onInvestmentComplete(amt, months, RATE);
      setProcessing(false);
      setShowConfirm(false);
      setSuccess(true);
    }, 1200);
  };

  return (
    <div className="min-h-full">
      <header className="bg-white border-b border-gray-200 px-4 h-14 flex items-center">
        <h1 className="text-base font-semibold text-gray-900">Investments</h1>
      </header>

      <div className="px-4 py-4 space-y-4">
        {/* Summary */}
        <div className="bg-[#0033a0] rounded-xl p-4 text-white">
          <p className="text-xs text-blue-100">Total investment value</p>
          <p className="text-[24px] font-semibold tabular-nums leading-tight mt-1">
            ₦{formatAmount(user.investmentBalance)}
          </p>
          <div className="mt-3 pt-3 border-t border-white/15 flex items-center justify-between text-xs">
            <span className="text-blue-100">{active.length} active plans</span>
            <span className="text-blue-100">{RATE}% monthly</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 -mx-4 px-4">
          {(
            [
              ['plans', 'My plans'],
              ['new', 'New plan'],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex-1 pb-2.5 pt-1 text-sm font-medium border-b-2 -mb-px ${
                tab === key ? 'text-[#0033a0] border-[#0033a0]' : 'text-gray-500 border-transparent'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === 'plans' ? (
          <div className="space-y-4">
            {active.length > 0 && (
              <section>
                <h2 className="text-xs font-medium text-gray-500 mb-2">Active plans</h2>
                <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100 overflow-hidden">
                  {active.map((inv) => (
                    <ActiveRow key={inv.id} inv={inv} />
                  ))}
                </div>
              </section>
            )}

            {matured.length > 0 && (
              <section>
                <h2 className="text-xs font-medium text-gray-500 mb-2">Completed</h2>
                <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100 overflow-hidden">
                  {matured.map((inv) => (
                    <div key={inv.id} className="px-4 py-3 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[13px] font-medium text-gray-900 truncate">{inv.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Paid out {formatDateLong(inv.payoutDate || inv.maturityDate)}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[13px] font-semibold text-green-600 tabular-nums">
                          +₦{formatAmount(inv.amount, false)}
                        </p>
                        <p className="text-[11px] text-gray-400">Completed</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {active.length === 0 && matured.length === 0 && (
              <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
                <p className="text-sm text-gray-500">You have no investment plans yet.</p>
                <button onClick={() => setTab('new')} className="mt-2 text-sm font-medium text-[#0033a0]">
                  Open a plan
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <p className="text-[13px] font-medium text-gray-900">Stanbic High-Yield Mutual Fund</p>
              <p className="text-xs text-gray-500 mt-1">
                {RATE}% monthly · 60-day minimum term · Minimum ₦3,000,000
              </p>
            </div>

            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Amount (₦)</label>
              <input
                type="number"
                value={capital}
                onChange={(e) => setCapital(e.target.value)}
                placeholder="Minimum 3,000,000"
                className="w-full bg-white border border-gray-300 rounded-lg py-2.5 px-3.5 text-sm outline-none focus:border-[#0033a0] focus:ring-1 focus:ring-[#0033a0] tabular-nums"
              />
              {tooLow && <p className="text-xs text-red-600 mt-1.5">The minimum investment is ₦3,000,000.</p>}
              {tooHigh && <p className="text-xs text-red-600 mt-1.5">Amount exceeds your available balance.</p>}
            </div>

            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Duration</label>
              <div className="flex gap-2">
                {[2, 3, 6, 12].map((m) => (
                  <button
                    key={m}
                    onClick={() => setMonths(m)}
                    className={`px-3.5 py-1.5 rounded-full border text-xs font-medium ${
                      months === m
                        ? 'bg-[#0033a0] border-[#0033a0] text-white'
                        : 'bg-white border-gray-300 text-gray-700'
                    }`}
                  >
                    {m} months
                  </button>
                ))}
              </div>
            </div>

            {validAmount && (
              <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-2">
                <Row label="Interest earned" value={`+₦${formatAmount(projectedInterest, false)}`} accent />
                <Row label="Payout value" value={`₦${formatAmount(projectedPayout, false)}`} />
                <Row label="Payout date" value={projectedMaturity} />
              </div>
            )}

            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-[#0033a0]"
              />
              <span className="text-[13px] text-gray-600 leading-snug">
                I authorise this investment and accept the terms and conditions.
              </span>
            </label>

            <button
              onClick={() => setShowConfirm(true)}
              disabled={!validAmount || !agreed}
              className="w-full bg-[#0033a0] disabled:bg-gray-300 text-white text-sm font-semibold py-3 rounded-lg active:bg-[#002880]"
            >
              Continue
            </button>
          </div>
        )}
      </div>

      {/* Confirm */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-6">
          <div className="bg-white rounded-xl w-full max-w-sm p-5">
            <h3 className="text-base font-semibold text-gray-900">Confirm investment</h3>
            <div className="mt-4 space-y-2.5">
              <Row label="Amount" value={formatNaira(amt)} />
              <Row label="Duration" value={`${months} months`} />
              <Row label="Rate" value={`${RATE}% monthly`} />
              <Row label="Interest" value={`+${formatNaira(projectedInterest, false)}`} accent />
              <Row label="Payout value" value={formatNaira(projectedPayout, false)} strong />
              <Row label="Payout date" value={projectedMaturity} />
            </div>
            <div className="mt-5 flex gap-2.5">
              <button
                disabled={processing}
                onClick={() => setShowConfirm(false)}
                className="flex-1 border border-gray-300 text-gray-700 text-sm font-semibold py-2.5 rounded-lg disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                disabled={processing}
                onClick={finalize}
                className="flex-1 bg-[#0033a0] text-white text-sm font-semibold py-2.5 rounded-lg disabled:opacity-70"
              >
                {processing ? 'Processing…' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-6">
          <div className="bg-white rounded-xl w-full max-w-sm p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-gray-900 mt-3">Investment successful</h3>
            <p className="text-[13px] text-gray-500 mt-1.5 leading-relaxed">
              Your plan is active and will pay out ₦{formatAmount(projectedPayout, false)} on {projectedMaturity}.
            </p>
            <button
              onClick={() => {
                setSuccess(false);
                setCapital('');
                setAgreed(false);
                setMonths(2);
                setTab('plans');
              }}
              className="mt-5 w-full bg-[#0033a0] text-white text-sm font-semibold py-2.5 rounded-lg"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const ActiveRow: React.FC<{ inv: ActiveInvestment }> = ({ inv }) => {
  const days = Math.max(0, daysUntil(inv.maturityDate));
  const progress = Math.round(termProgress(inv.startDate, inv.maturityDate) * 100);
  return (
    <div className="px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[13px] font-medium text-gray-900 truncate">{inv.name}</p>
        <p className="text-[13px] font-semibold text-gray-900 tabular-nums shrink-0">
          ₦{formatAmount(inv.amount, false)}
        </p>
      </div>
      <div className="flex items-center justify-between text-xs text-gray-500 mt-0.5">
        <span>
          Matures {formatDateShort(inv.maturityDate)}
        </span>
        <span>{days} {days === 1 ? 'day' : 'days'} left</span>
      </div>
      <div className="mt-2 h-1 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-[#0033a0] rounded-full" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
};

const Row: React.FC<{ label: string; value: string; accent?: boolean; strong?: boolean }> = ({
  label,
  value,
  accent,
  strong,
}) => (
  <div className="flex items-center justify-between text-[13px]">
    <span className="text-gray-500">{label}</span>
    <span
      className={`tabular-nums ${
        accent ? 'font-semibold text-green-600' : strong ? 'font-semibold text-gray-900' : 'font-medium text-gray-900'
      }`}
    >
      {value}
    </span>
  </div>
);

export default Investment;
