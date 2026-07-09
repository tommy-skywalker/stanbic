import React from 'react';
import { UserProfile, STANBIC_LOGO } from '../types';

interface DashboardProps {
  user: UserProfile;
  onTransfer: () => void;
  onViewActivity: () => void;
  onViewPortfolio: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onTransfer, onViewActivity, onViewPortfolio }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className="bg-[#f4f6fa] min-h-screen flex flex-col font-sans pb-12">
      {/* Top Banner & Header (Stanbic Blue Theme) */}
      <div className="bg-[#0033a0] text-white pt-8 pb-16 px-6 rounded-b-[2.5rem] shadow-lg relative overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-blue-400/15 rounded-full blur-3xl"></div>

        {/* Header bar */}
        <div className="flex items-center justify-between mb-8 relative z-10">
          <button className="p-2 -ml-2 text-white/90 hover:text-white hover:bg-white/10 rounded-full transition-all">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-sm font-bold tracking-[0.2em] uppercase text-white/90">Account Details</span>
          <div className="flex items-center gap-2">
            <img src={STANBIC_LOGO} alt="Stanbic Logo" className="w-7 h-auto filter brightness-0 invert" />
          </div>
        </div>

        {/* Saved/Available Balance Violet Card (Identical to Inspiration Image) */}
        <div className="relative bg-gradient-to-r from-[#b336a3] via-[#852fba] to-[#511bb5] p-6 rounded-3xl shadow-2xl overflow-hidden border border-white/10 transition-transform hover:scale-[1.01] duration-300">
          {/* Wave background pattern lines inside the card */}
          <div className="absolute inset-0 opacity-15 pointer-events-none mix-blend-overlay">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0,50 Q25,70 50,50 T100,50 L100,100 L0,100 Z" fill="white" />
              <path d="M0,30 Q25,45 50,30 T100,30 L100,100 L0,100 Z" fill="none" stroke="white" strokeWidth="2" />
              <circle cx="85" cy="20" r="15" fill="none" stroke="white" strokeWidth="1" />
              <circle cx="85" cy="20" r="8" fill="white" />
            </svg>
          </div>

          <div className="flex justify-between items-start mb-6 relative z-10">
            <div>
              <span className="text-[10px] font-bold tracking-widest uppercase text-white/80">{user.accountType}</span>
              <p className="text-white font-extrabold text-xs tracking-wider mt-0.5">David Jaiye Sokeyo</p>
            </div>
            <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm tracking-wider">
              {user.accountNumber}
            </span>
          </div>

          <div className="mb-6 relative z-10">
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/70 block mb-1">Available Balance</span>
            <div className="flex items-baseline gap-1">
              <span className="text-base font-bold text-white/90">NGN</span>
              <span className="text-3xl font-black tracking-tight text-white">
                {formatCurrency(user.balance).replace('NGN', '').trim()}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between relative z-10">
            <div className="bg-white/15 px-3 py-1.5 rounded-full backdrop-blur-md flex items-center gap-1.5 text-[10px] font-bold text-green-300">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              + NGN 125,000 this week
            </div>
            <span className="text-[9px] font-extrabold text-white/50 uppercase tracking-widest">Active & Secured</span>
          </div>
        </div>
      </div>

      {/* Main Content Area overlapping the bottom curve */}
      <div className="px-6 -mt-8 relative z-10 space-y-6">
        
        {/* Stanbic Mutual Funds card - Styled to fit beautifully */}
        <button 
          onClick={onViewPortfolio}
          className="w-full text-left bg-white p-6 rounded-3xl shadow-[0_12px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_35px_rgba(0,0,0,0.06)] border border-gray-100/80 transition-all active:scale-[0.99] group relative overflow-hidden"
        >
          {/* Subtle gradient banner top border */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 to-[#0033a0]"></div>
          
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-[10px] font-extrabold text-blue-600/80 uppercase tracking-wider block">Stanbic Mutual Funds</span>
              <h3 className="text-base font-black text-gray-800 mt-0.5">Total Wealth Value</h3>
            </div>
            <div className="bg-blue-50 p-2.5 rounded-2xl group-hover:bg-[#0033a0] group-hover:text-white transition-all duration-300">
              <svg className="w-5 h-5 text-[#0033a0] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-xs font-bold text-gray-400">NGN</span>
              <span className="text-2xl font-black tracking-tight text-[#0033a0]">
                {formatCurrency(user.investmentBalance).replace('NGN', '').trim()}
              </span>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
              <p className="text-[10px] text-gray-400 flex items-center gap-1.5 font-bold uppercase tracking-wider">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                {user.activeInvestments.length} Active Mutual Funds
              </p>
              <span className="text-[10px] font-bold uppercase text-blue-600 group-hover:translate-x-1 transition-transform">View All →</span>
            </div>
          </div>
        </button>

        {/* Quick Actions (Inspiration Design: White circle, thin border, dark blue text) */}
        <div className="bg-white rounded-3xl p-5 shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-gray-100 flex justify-around items-center">
          <QuickActionButton icon="bill" label="Bills" />
          <QuickActionButton icon="transfer" label="Transfer" onClick={onTransfer} active />
          <QuickActionButton icon="airtime" label="Airtime" />
        </div>

        {/* Manage Account Section - Unified Clean Container like Inspiration */}
        <div className="space-y-3">
          <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 px-1">Manage Account</h2>
          <div className="bg-white rounded-3xl shadow-[0_12px_35px_rgba(0,0,0,0.03)] border border-gray-100/80 overflow-hidden divide-y divide-gray-100">
            <MenuButton 
              icon={<ClockIcon />} 
              title="Account Activity" 
              description="View all related account activity" 
              color="bg-[#0033a0]/10 text-[#0033a0]" 
              onClick={onViewActivity}
            />
            <MenuButton 
              icon={<FreezeIcon />} 
              title="Freeze Account" 
              description="Temporarily disable access to your account" 
              color="bg-sky-50 text-sky-500" 
              onClick={() => {}}
            />
            <MenuButton 
              icon={<LimitIcon />} 
              title="Set Transaction Limit" 
              description="Set a limit to how much you can withdraw" 
              color="bg-indigo-50 text-indigo-600" 
              onClick={() => {}}
            />
            <MenuButton 
              icon={<UpgradeIcon />} 
              title="Upgrade Account" 
              description="Upgrade your account to enjoy more benefits" 
              color="bg-purple-50 text-purple-600" 
              onClick={() => {}}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const QuickActionButton: React.FC<{ icon: string; label: string; onClick?: () => void; active?: boolean }> = ({ icon, label, onClick, active }) => {
  const icons = {
    bill: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
    transfer: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />,
    airtime: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
  };

  return (
    <button onClick={onClick} className="flex flex-col items-center gap-2.5 transition-transform active:scale-95 group">
      <div className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all ${active ? 'bg-white border-[#0033a0] text-[#0033a0] shadow-md scale-105' : 'bg-white border-gray-100 text-gray-400 group-hover:border-gray-300'}`}>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {icons[icon as keyof typeof icons]}
        </svg>
      </div>
      <span className={`text-[10px] font-extrabold uppercase tracking-widest ${active ? 'text-[#0033a0]' : 'text-gray-400'}`}>{label}</span>
    </button>
  );
};

const MenuButton: React.FC<{ icon: React.ReactNode; title: string; description: string; color: string; onClick: () => void }> = ({ icon, title, description, color, onClick }) => (
  <button onClick={onClick} className="w-full flex items-center justify-between p-4.5 hover:bg-gray-50/80 transition-colors group">
    <div className="flex items-center gap-4">
      <div className={`${color} w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm font-bold`}>
        {icon}
      </div>
      <div className="text-left">
        <h3 className="text-sm font-black text-gray-800 group-hover:text-[#0033a0] transition-colors">{title}</h3>
        <p className="text-[11px] text-gray-400 font-medium">{description}</p>
      </div>
    </div>
    <div className="w-6.5 h-6.5 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center group-hover:bg-[#0033a0]/10 group-hover:text-[#0033a0] transition-all">
      <svg className="w-3.5 h-3.5 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </div>
  </button>
);

const ClockIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
);
const FreezeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707.707M12 9a3 3 0 100 6 3 3 0 000-6z"/></svg>
);
const LimitIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></svg>
);
const UpgradeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 11l7-7 7 7M5 19l7-7 7 7"/></svg>
);

export default Dashboard;
