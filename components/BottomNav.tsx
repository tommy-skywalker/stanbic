import React from 'react';
import { AppScreen } from '../types';

interface BottomNavProps {
  currentScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate }) => {
  return (
    <div className="bg-white border-t border-gray-100/80 px-6 py-4.5 flex justify-between items-center z-30 shadow-[0_-10px_35px_rgba(0,0,0,0.03)] rounded-t-[1.8rem]">
      <NavItem 
        isActive={currentScreen === AppScreen.DASHBOARD} 
        onClick={() => onNavigate(AppScreen.DASHBOARD)}
        icon={<HomeIcon />}
        label="Home"
      />
      <NavItem 
        isActive={currentScreen === AppScreen.ACTIVITY} 
        onClick={() => onNavigate(AppScreen.ACTIVITY)}
        icon={<ActivityIcon />}
        label="Activity"
      />
      <NavItem 
        isActive={currentScreen === AppScreen.INVESTMENT} 
        onClick={() => onNavigate(AppScreen.INVESTMENT)}
        icon={<InvestIcon />}
        label="Invest"
      />
      <NavItem 
        isActive={currentScreen === AppScreen.PROFILE} 
        onClick={() => onNavigate(AppScreen.PROFILE)}
        icon={<ProfileIcon />}
        label="Profile"
      />
    </div>
  );
};

const NavItem: React.FC<{ isActive: boolean; icon: React.ReactNode; label: string; onClick: () => void }> = ({ isActive, icon, label, onClick }) => (
  <button 
    onClick={onClick} 
    className={`flex flex-col items-center gap-1.5 px-4 py-2 rounded-2xl transition-all duration-300 ${isActive ? 'text-[#0033a0] scale-105' : 'text-gray-400 hover:text-blue-900/60'}`}
  >
    <div className={`transition-transform duration-300 ${isActive ? 'scale-110 text-[#0033a0]' : 'text-gray-400'}`}>
      {icon}
    </div>
    <span className={`text-[9px] font-black uppercase tracking-wider ${isActive ? 'text-[#0033a0]' : 'text-gray-400'}`}>
      {label}
    </span>
  </button>
);

const HomeIcon = () => (
  <svg className="w-5.5 h-5.5 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);
const ActivityIcon = () => (
  <svg className="w-5.5 h-5.5 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);
const InvestIcon = () => (
  <svg className="w-5.5 h-5.5 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.407 2.633 1M12 8V7m0 1v1m0 8c-1.11 0-2.08-.407-2.633-1M12 16v1m0-1v-1m-7 2a2 2 0 100 4h14a2 2 0 100-4H5z" />
  </svg>
);
const ProfileIcon = () => (
  <svg className="w-5.5 h-5.5 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

export default BottomNav;
