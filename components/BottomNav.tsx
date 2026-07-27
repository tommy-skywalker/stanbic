import React from 'react';
import { AppScreen } from '../types';

interface BottomNavProps {
  currentScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate }) => {
  const items: { screen: AppScreen; label: string; icon: React.ReactNode }[] = [
    {
      screen: AppScreen.DASHBOARD,
      label: 'Home',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      ),
    },
    {
      screen: AppScreen.ACTIVITY,
      label: 'Transactions',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 7h6m-6 4h4" />
      ),
    },
    {
      screen: AppScreen.INVESTMENT,
      label: 'Invest',
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />,
    },
    {
      screen: AppScreen.PROFILE,
      label: 'Profile',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      ),
    },
  ];

  return (
    <nav className="bg-white border-t border-gray-200 grid grid-cols-4">
      {items.map((item) => {
        const active = currentScreen === item.screen;
        return (
          <button
            key={item.screen}
            onClick={() => onNavigate(item.screen)}
            className={`py-2 flex flex-col items-center gap-0.5 ${
              active ? 'text-[#0033a0]' : 'text-gray-400'
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={active ? 2 : 1.7}>
              {item.icon}
            </svg>
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
