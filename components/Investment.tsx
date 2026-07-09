import React, { useState, useMemo } from 'react';
import { UserProfile, ActiveInvestment } from '../types';
import {
  formatNaira,
  formatAmount,
  formatDateLong,
  formatDateShort,
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
  const [tab, setTab] = useState<'portfolio' | 'new'>('portfolio');
  const [capital, setCapital] = useState('');
  const [months, setMonths] = useState(2);
  const [signed, setSigned] = useState(false);
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

  const activeTotal = active.reduce((s, i) => s + i.amount, 0);
  const paidOutTotal = matured.reduce((s, i) => s + i.amount, 0);
  const nextPayout = active[0];

  const amt = parseFloat(capital);
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
    }, 1600);
  };

  return (
    <div className="min-h-full bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#00246e] to-[#0033a0] text-white px-6 pt-10 pb-24 rounded-b-[2rem]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-blue-200/80">
          Investments
        </p>
        <h1 className="text-2xl font-bold mt-1">Portfolio</h1>

        <div className="mt-6">
          <p className="text-[11px] font-medium uppercase tracking-widest text-blue-200/70">
            Active Fund Value
          </p>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-sm font-semibold text-blue-200/80">NGN</span>
            <span className="text-4xl font-bold tracking-tight tabular-nums">
              {formatAmount(activeTotal)}
            </span>
          </div>
        </div>

        {nextPayout && (
          <div className="mt-5 bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 flex items-center justify-between border border-white/10">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-blue-200/70">
                Next Payout
              </p>
              <p className="text-sm font-semibold mt-0.5">{formatDateLong(nextPayout.maturityDate)}</p>
            </div>
            <div className="text-right">
              <p className="text-base font-bold text-amber-300 tabular-nums">
                +{formatAmount(nextPayout.amount, false)}
              </p>
              <p className="text-[10px] font-medium text-blue-200/70">
                in {Math.max(0, daysUntil(nextPayout.maturityDate))} days
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="px-6 -mt-14 relative z-10">
        <div className="bg-white rounded-2xl p-1.5 shadow-lg shadow-slate-200/70 flex border border-slate-100">
          {(['portfolio', 'new'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                tab === t ? 'bg-[#0033a0] text-white shadow-md' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {t === 'portfolio' ? 'My Portfolio' : 'New Investment'}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 pt-6 pb-10">
        {tab === 'portfolio' ? (
          <div className="space-y-5">
            {/* Summary strip */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                  Active Funds
                </p>
                <p className="text-lg font-bold text-[#0033a0] mt-1 tabular-nums">{active.length}</p>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                  Paid Out
                </p>
                <p className="text-lg font-bold text-emerald-600 mt-1 tabular-nums">
                  {formatAmount(paidOutTotal, false)}
                </p>
              </div>
            </div>

            {active.length > 0 && (
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 pt-1">
                Upcoming Payouts
              </p>
            )}
            {active.map((inv) => (
              <ActiveCard key={inv.id} inv={inv} />
            ))}

            {matured.length > 0 && (
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 pt-2">
                Completed
              </p>
            )}
            {matured.map((inv) => (
              <MaturedCard key={inv.id} inv={inv} />
            ))}

            {active.length === 0 && matured.length === 0 && (
              <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-10 text-center">
                <p className="text-sm font-medium text-slate-400">No investments yet</p>
                <button
                  onClick={() => setTab('new')}
                  className="mt-3 text-[#0033a0] font-bold text-xs uppercase tracking-wider"
                >
                  Start Investing →
                </button>
              </div>
            )}
          </div>
        ) : (
          <NewInvestmentForm
            capital={capital}
            setCapital={setCapital}
            months={months}
            setMonths={setMonths}
            signed={signed}
            setSigned={setSigned}
            validAmount={validAmount}
            balance={user.balance}
            projectedPayout={projectedPayout}
            projectedInterest={projectedInterest}
            projectedMaturity={projectedMaturity}
            onSubmit={() => setShowConfirm(true)}
          />
        )}
      </div>

      {/* Confirmation sheet */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => !processing && setShowConfirm(false)}
          />
          <div className="relative bg-white rounded-t-[2rem] w-full max-w-md p-6 pb-8 animate-slide-up">
            <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-6" />
            <h3 className="text-lg font-bold text-slate-900 mb-1">Confirm Investment</h3>
            <p className="text-xs text-slate-400 mb-6">Review the details before you subscribe.</p>
            <div className="space-y-3 mb-6">
              <Row label="Capital" value={formatNaira(amt)} />
              <Row label="Duration" value={`${months} months`} />
              <Row label="Rate" value={`${RATE}% / month`} />
              <Row label="Interest earned" value={`+${formatNaira(projectedInterest)}`} accent />
              <div className="border-t border-slate-100 pt-3">
                <Row label="Payout at maturity" value={formatNaira(projectedPayout)} bold />
                <Row label="Payout date" value={projectedMaturity} />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                disabled={processing}
                onClick={() => setShowConfirm(false)}
                className="flex-1 border border-slate-200 text-slate-500 font-bold py-3.5 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                disabled={processing}
                onClick={finalize}
                className="flex-1 bg-[#0033a0] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-900/20 hover:bg-[#002880] transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {processing ? (
                  <>
                    <Spinner /> Processing
                  </>
                ) : (
                  'Confirm'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-8 bg-[#0033a0]/95 backdrop-blur-md">
          <div className="text-center text-white animate-slide-up">
            <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-2">Subscription Active</h3>
            <p className="text-blue-200 text-sm max-w-xs mx-auto mb-8">
              Your investment is live and will pay out on {projectedMaturity}.
            </p>
            <button
              onClick={() => {
                setSuccess(false);
                setCapital('');
                setSigned(false);
                setMonths(2);
                setTab('portfolio');
              }}
              className="bg-white text-[#0033a0] font-bold px-10 py-3.5 rounded-xl shadow-xl active:scale-95 transition-transform"
            >
              View Portfolio
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const ActiveCard: React.FC<{ inv: ActiveInvestment }> = ({ inv }) => {
  const days = Math.max(0, daysUntil(inv.maturityDate));
  const progress = Math.round(termProgress(inv.startDate, inv.maturityDate) * 100);
  const soon = days <= 7;

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h4 className="text-sm font-bold text-slate-900 leading-tight">{inv.name}</h4>
          <p className="text-[11px] text-slate-400 font-medium mt-0.5">{inv.interestRate}% monthly · {inv.durationMonths} months</p>
        </div>
        <span
          className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
            soon ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-[#0033a0]'
          }`}
        >
          {soon ? 'Due Soon' : 'Active'}
        </span>
      </div>

      <div className="flex items-end justify-between mb-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
            Payout Value
          </p>
          <p className="text-xl font-bold text-slate-900 tabular-nums mt-0.5">{formatNaira(inv.amount, false)}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Matures</p>
          <p className="text-sm font-bold text-[#0033a0] mt-0.5">{formatDateShort(inv.maturityDate)}</p>
        </div>
      </div>

      {/* Timeline / progress */}
      <div className="mb-2">
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#0033a0] to-blue-500 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <div className="flex items-center justify-between text-[10px] font-medium text-slate-400">
        <span>{formatDateShort(inv.startDate)}</span>
        <span className={`font-bold ${soon ? 'text-amber-600' : 'text-slate-500'}`}>
          Pays out in {days} {days === 1 ? 'day' : 'days'}
        </span>
      </div>
    </div>
  );
};

const MaturedCard: React.FC<{ inv: ActiveInvestment }> = ({ inv }) => (
  <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-sm relative overflow-hidden">
    <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
    <div className="flex items-start justify-between mb-3">
      <div>
        <h4 className="text-sm font-bold text-slate-900 leading-tight">{inv.name}</h4>
        <p className="text-[11px] text-slate-400 font-medium mt-0.5">
          {formatDateShort(inv.startDate)} → {formatDateShort(inv.maturityDate)}
        </p>
      </div>
      <span className="text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 flex items-center gap-1">
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        Paid Out
      </span>
    </div>
    <div className="flex items-end justify-between">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Amount Credited</p>
        <p className="text-xl font-bold text-emerald-600 tabular-nums mt-0.5">
          +{formatNaira(inv.amount, false)}
        </p>
      </div>
      <p className="text-[11px] font-medium text-slate-400">
        on <span className="font-bold text-slate-600">{formatDateLong(inv.payoutDate || inv.maturityDate)}</span>
      </p>
    </div>
  </div>
);

interface FormProps {
  capital: string;
  setCapital: (v: string) => void;
  months: number;
  setMonths: (v: number) => void;
  signed: boolean;
  setSigned: (v: boolean) => void;
  validAmount: boolean;
  balance: number;
  projectedPayout: number;
  projectedInterest: number;
  projectedMaturity: string;
  onSubmit: () => void;
}

const NewInvestmentForm: React.FC<FormProps> = ({
  capital,
  setCapital,
  months,
  setMonths,
  signed,
  setSigned,
  validAmount,
  balance,
  projectedPayout,
  projectedInterest,
  projectedMaturity,
  onSubmit,
}) => {
  const amt = parseFloat(capital);
  const tooLow = capital !== '' && amt < MIN_CAPITAL;
  const tooHigh = !isNaN(amt) && amt > balance;

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">High-Yield Fund</h3>
            <p className="text-[11px] text-slate-400 font-medium">Fixed rate · Low risk</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-[#0033a0]">{RATE}%</p>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">per month</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">
            Capital Allocation
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">₦</span>
            <input
              type="number"
              value={capital}
              onChange={(e) => setCapital(e.target.value)}
              placeholder="Minimum 3,000,000"
              className="w-full bg-white border border-slate-200 focus:border-[#0033a0] focus:ring-2 focus:ring-blue-100 rounded-xl py-3.5 pl-9 pr-4 text-sm font-bold outline-none transition-all tabular-nums"
            />
          </div>
          {tooLow && (
            <p className="text-[11px] font-semibold text-rose-500 mt-1.5">Minimum investment is ₦3,000,000</p>
          )}
          {tooHigh && (
            <p className="text-[11px] font-semibold text-rose-500 mt-1.5">Exceeds available balance</p>
          )}
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">
            Duration
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[2, 3, 6, 12].map((m) => (
              <button
                key={m}
                onClick={() => setMonths(m)}
                className={`py-3 rounded-xl text-xs font-bold transition-all border ${
                  months === m
                    ? 'bg-[#0033a0] text-white border-[#0033a0] shadow-md'
                    : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                }`}
              >
                {m}mo
              </button>
            ))}
          </div>
        </div>

        {validAmount && (
          <div className="bg-[#0033a0] rounded-2xl p-5 text-white animate-slide-up">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-blue-200/70 mb-4">
              Projected Returns
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-medium text-blue-200/70 uppercase">Interest</p>
                <p className="text-lg font-bold text-amber-300 tabular-nums">
                  +{formatAmount(projectedInterest, false)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-medium text-blue-200/70 uppercase">Payout Value</p>
                <p className="text-lg font-bold tabular-nums">{formatAmount(projectedPayout, false)}</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-[10px] font-medium text-blue-200/70 uppercase">Payout Date</span>
              <span className="text-sm font-bold">{projectedMaturity}</span>
            </div>
          </div>
        )}

        <button
          onClick={() => setSigned(!signed)}
          className={`w-full border rounded-xl p-4 flex items-center gap-3 transition-all ${
            signed ? 'border-emerald-200 bg-emerald-50' : 'border-dashed border-slate-200 bg-white'
          }`}
        >
          <div
            className={`w-5 h-5 rounded-md flex items-center justify-center ${
              signed ? 'bg-emerald-500 text-white' : 'border-2 border-slate-300'
            }`}
          >
            {signed && (
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
          <span className={`text-xs font-bold ${signed ? 'text-emerald-700' : 'text-slate-500'}`}>
            I authorise this subscription (digital signature)
          </span>
        </button>

        <button
          onClick={onSubmit}
          disabled={!validAmount || !signed}
          className="w-full bg-[#0033a0] hover:bg-[#002880] disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-900/10 transition-all active:scale-[0.99]"
        >
          Continue to Confirm
        </button>
      </div>
    </div>
  );
};

const Row: React.FC<{ label: string; value: string; bold?: boolean; accent?: boolean }> = ({
  label,
  value,
  bold,
  accent,
}) => (
  <div className="flex justify-between items-center py-1">
    <span className="text-xs font-medium text-slate-400">{label}</span>
    <span
      className={`text-sm tabular-nums ${
        accent ? 'font-bold text-emerald-600' : bold ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'
      }`}
    >
      {value}
    </span>
  </div>
);

const Spinner = () => (
  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
);

export default Investment;
