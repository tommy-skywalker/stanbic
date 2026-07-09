import React from 'react';
import { AppScreen } from '../types';

interface BottomNavProps {
  currentScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
}

const ITEMS: { screen: AppScreen; label: string; icon: React.ReactNode }[] = [
  { screen: AppScreen.DASHBOARD, label: 'Home', icon: <HomeIcon /> },
  { screen: AppScreen.ACTIVITY, label: 'Activity', icon: <ActivityIcon /> },
  { screen: AppScreen.INVESTMENT, label: 'Invest', icon: <InvestIcon /> },
  { screen: AppScreen.PROFILE, label: 'Profile', icon: <ProfileIcon /> },
];

const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate }) => (
  <div className="bg-white/95 backdrop-blur-md border-t border-slate-100 px-4 py-2.5 flex justify-around items-center shadow-[0_-8px_30px_rgba(0,0,0,0.04)]">
    {ITEMS.map((item) => {
      const active = currentScreen === item.screen;
      return (
        <button
          key={item.screen}
          onClick={() => onNavigate(item.screen)}
          className="flex flex-col items-center gap-1 px-4 py-1.5 transition-transform active:scale-95"
        >
          <div className={active ? 'text-[#0033a0]' : 'text-slate-400'}>{item.icon}</div>
          <span className={`text-[10px] font-bold ${active ? 'text-[#0033a0]' : 'text-slate-400'}`}>
            {item.label}
          </span>
          <div className={`h-1 w-1 rounded-full transition-all ${active ? 'bg-[#0033a0]' : 'bg-transparent'}`} />
        </button>
      );
    })}
  </div>
);

function HomeIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
}
function ActivityIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}
function InvestIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  );
}
function ProfileIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

export default BottomNav;
