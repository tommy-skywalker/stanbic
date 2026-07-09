import React from 'react';
import { UserProfile } from '../types';

interface ProfileProps {
  user: UserProfile;
  onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onLogout }) => {
  const initials = user.name.split(' ').map((n) => n[0]).slice(0, 2).join('');

  return (
    <div className="bg-slate-50 min-h-full">
      <div className="bg-gradient-to-b from-[#00246e] to-[#0033a0] text-white px-6 pt-10 pb-20 rounded-b-[2rem]">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold uppercase tracking-widest">Profile</span>
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 text-xs font-bold text-rose-300 bg-rose-500/15 hover:bg-rose-500/25 px-3 py-1.5 rounded-full transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Log Out
          </button>
        </div>

        <div className="flex flex-col items-center text-center mt-4">
          <div className="w-20 h-20 rounded-full bg-white text-[#0033a0] text-2xl font-bold flex items-center justify-center border-4 border-white/20 shadow-xl">
            {initials}
          </div>
          <h2 className="text-lg font-bold mt-3">{user.name}</h2>
          <p className="text-[11px] text-blue-200/70 font-semibold uppercase tracking-widest mt-0.5">
            {user.accountType} · {user.accountNumber}
          </p>
        </div>
      </div>

      <div className="px-6 -mt-12 relative z-10 space-y-5">
        <div>
          <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3 px-1">General</h3>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-50 overflow-hidden">
            <Item icon={<UserIcon />} title="Personal Details" />
            <Item icon={<BankIcon />} title="Linked Accounts" />
            <Item icon={<GiftIcon />} title="Refer a Friend" />
            <Item icon={<HelpIcon />} title="Help & Support" />
          </div>
        </div>

        <div>
          <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3 px-1">Security</h3>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-50 overflow-hidden">
            <Item icon={<LockIcon />} title="Change Password" />
            <Item icon={<FingerIcon />} title="Biometric Login" toggle />
            <Item icon={<DocIcon />} title="View BVN" />
          </div>
        </div>

        <p className="text-center text-[10px] font-semibold uppercase tracking-widest text-slate-300 pt-2">
          Stanbic IBTC · v1.0.0 MVP
        </p>
      </div>
    </div>
  );
};

const Item: React.FC<{ icon: React.ReactNode; title: string; toggle?: boolean }> = ({ icon, title, toggle }) => (
  <div className="flex items-center justify-between px-4 py-3.5 hover:bg-slate-50 transition-colors cursor-pointer group">
    <div className="flex items-center gap-3.5">
      <div className="w-9 h-9 rounded-xl bg-slate-50 text-[#0033a0] flex items-center justify-center">{icon}</div>
      <span className="text-sm font-bold text-slate-700 group-hover:text-[#0033a0] transition-colors">{title}</span>
    </div>
    {toggle ? (
      <div className="w-11 h-6 bg-[#0033a0] rounded-full p-0.5 flex items-center justify-end">
        <div className="w-5 h-5 bg-white rounded-full shadow" />
      </div>
    ) : (
      <svg className="w-4 h-4 text-slate-300 group-hover:text-[#0033a0] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    )}
  </div>
);

const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);
const BankIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11m16-11v11M8 14v3m4-3v3m4-3v3" />
  </svg>
);
const GiftIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12v7a1 1 0 001 1h12a1 1 0 001-1v-7M5 12H4a1 1 0 01-1-1V9a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-1 1h-1M12 8v12M12 8a2.5 2.5 0 10-2.5-2.5A2.5 2.5 0 0012 8zm0 0a2.5 2.5 0 112.5-2.5A2.5 2.5 0 0112 8z" />
  </svg>
);
const HelpIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const LockIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);
const FingerIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 11.5V14m0-2.5a5 5 0 0110 0V14m-10 0v.5a5 5 0 0010 0V14M12 7v.01M12 11v3" />
  </svg>
);
const DocIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

export default Profile;
