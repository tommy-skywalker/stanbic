import React from 'react';
import { STANBIC_LOGO } from '../types';

// Opening splash screen. Shown on its own while the app is under maintenance.
const Splash: React.FC = () => (
  <div className="min-h-screen bg-white flex flex-col">
    <div className="flex-1 w-full max-w-md mx-auto px-6 flex flex-col items-center justify-center">
      <img src={STANBIC_LOGO} alt="Stanbic IBTC" className="w-16 h-auto" />
      <h1 className="text-xl font-bold text-gray-900 mt-4">Stanbic IBTC</h1>
      <p className="text-xs text-gray-500 mt-1">A member of Standard Bank Group</p>

      <svg
        className="animate-spin h-5 w-5 text-[#0033a0] mt-10"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    </div>

    <div className="pb-8 px-6 text-center">
      <p className="text-[11px] leading-relaxed text-gray-400">
        Stanbic IBTC Bank PLC is licensed by the Central Bank of Nigeria.
        <br />
        Deposits insured by the NDIC. · v1.0.4
      </p>
    </div>
  </div>
);

export default Splash;
