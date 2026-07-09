import React, { useState } from 'react';
import { UserProfile } from '../types';
import { formatAmount, formatDateLong, daysUntil } from '../utils';

interface DashboardProps {
  user: UserProfile;
  onTransfer: () => void;
  onViewActivity: () => void;
  onViewPortfolio: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onTransfer, onViewActivity, onViewPortfolio }) => {
  const [showBalance, setShowBalance] = useState(true);

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('');
  const maskedAccount = `•••• ${user.accountNumber.slice(-4)}`;

  const active = user.activeInvestments
    .filter((i) => i.status === 'active')
    .sort((a, b) => daysUntil(a.maturityDate) - daysUntil(b.maturityDate));
  const nextPayout = active[0];

  return (
    <div className="bg-slate-50 min-h-full">
      {/* Header + balance hero */}
      <div className="bg-gradient-to-b from-[#00246e] to-[#0033a0] px-6 pt-10 pb-20 rounded-b-[2rem] text-white relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-56 h-56 bg-white/5 rounded-full" />
        <div className="absolute top-20 -left-20 w-56 h-56 bg-white/5 rounded-full" />

        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center font-bold text-sm border border-white/10">
              {initials}
            </div>
            <div>
              <p className="text-[11px] text-blue-200/70 font-medium">Welcome back</p>
              <p className="text-sm font-bold leading-tight">{user.name.split(' ')[0]} {user.name.split(' ').slice(-1)}</p>
            </div>
          </div>
          <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors relative">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-amber-400 rounded-full ring-2 ring-[#0033a0]" />
          </button>
        </div>

        <div className="mt-8 relative z-10">
          <div className="flex items-center gap-2">
            <p className="text-[11px] font-medium uppercase tracking-widest text-blue-200/70">
              {user.accountType} · {maskedAccount}
            </p>
            <button onClick={() => setShowBalance((s) => !s)} className="text-blue-200/70 hover:text-white transition-colors">
              {showBalance ? <EyeIcon /> : <EyeOffIcon />}
            </button>
          </div>
          <div className="flex items-baseline gap-1.5 mt-1.5">
            <span className="text-base font-semibold text-blue-200/80">NGN</span>
            <span className="text-4xl font-bold tracking-tight tabular-nums">
              {showBalance ? formatAmount(user.balance) : '••••••••'}
            </span>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="px-6 -mt-12 relative z-10">
        <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/70 border border-slate-100 p-4 grid grid-cols-4 gap-1">
          <Action icon={<TransferIcon />} label="Transfer" onClick={onTransfer} primary />
          <Action icon={<InvestIcon />} label="Invest" onClick={onViewPortfolio} />
          <Action icon={<ActivityIcon />} label="History" onClick={onViewActivity} />
          <Action icon={<MoreIcon />} label="More" onClick={() => {}} />
        </div>
      </div>

      <div className="px-6 pt-6 space-y-5">
        {/* Investment summary */}
        <button
          onClick={onViewPortfolio}
          className="w-full text-left bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow group"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#0033a0]">
                Mutual Funds
              </p>
              <h3 className="text-sm font-bold text-slate-900 mt-0.5">Active Fund Value</h3>
            </div>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0033a0] flex items-center justify-center group-hover:bg-[#0033a0] group-hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xs font-bold text-slate-400">NGN</span>
            <span className="text-2xl font-bold text-slate-900 tabular-nums">
              {formatAmount(user.investmentBalance)}
            </span>
          </div>

          {nextPayout && (
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-amber-400 rounded-full" />
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                    Next payout
                  </p>
                  <p className="text-xs font-bold text-slate-700">{formatDateLong(nextPayout.maturityDate)}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-emerald-600 tabular-nums">
                  +{formatAmount(nextPayout.amount, false)}
                </p>
                <p className="text-[10px] font-medium text-slate-400">
                  in {Math.max(0, daysUntil(nextPayout.maturityDate))} days
                </p>
              </div>
            </div>
          )}
        </button>

        {/* Services */}
        <div>
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3 px-1">
            Manage Account
          </h2>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-50 overflow-hidden">
            <MenuRow icon={<ClockIcon />} title="Account Activity" subtitle="View all transactions" onClick={onViewActivity} tint="bg-blue-50 text-[#0033a0]" />
            <MenuRow icon={<ShieldIcon />} title="Card & Security" subtitle="Freeze card, set limits" onClick={() => {}} tint="bg-indigo-50 text-indigo-600" />
            <MenuRow icon={<StarIcon />} title="Upgrade Account" subtitle="Unlock premium benefits" onClick={() => {}} tint="bg-amber-50 text-amber-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

const Action: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void; primary?: boolean }> = ({
  icon,
  label,
  onClick,
  primary,
}) => (
  <button onClick={onClick} className="flex flex-col items-center gap-2 py-1 group">
    <div
      className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all active:scale-95 ${
        primary ? 'bg-[#0033a0] text-white shadow-md shadow-blue-900/20' : 'bg-slate-50 text-[#0033a0] group-hover:bg-slate-100'
      }`}
    >
      {icon}
    </div>
    <span className="text-[10px] font-bold text-slate-500">{label}</span>
  </button>
);

const MenuRow: React.FC<{
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onClick: () => void;
  tint: string;
}> = ({ icon, title, subtitle, onClick, tint }) => (
  <button onClick={onClick} className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors group">
    <div className="flex items-center gap-3.5">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tint}`}>{icon}</div>
      <div className="text-left">
        <h3 className="text-sm font-bold text-slate-800">{title}</h3>
        <p className="text-[11px] text-slate-400 font-medium">{subtitle}</p>
      </div>
    </div>
    <svg className="w-4 h-4 text-slate-300 group-hover:text-[#0033a0] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  </button>
);

const TransferIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
  </svg>
);
const InvestIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);
const ActivityIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const MoreIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);
const ClockIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const ShieldIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);
const StarIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);
const EyeIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);
const EyeOffIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);

export default Dashboard;
