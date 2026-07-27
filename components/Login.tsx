import React, { useState } from 'react';
import { STANBIC_LOGO } from '../types';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [account, setAccount] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTimeout(() => {
      if (account === '00028744480' && pin === '1304') {
        onLogin();
      } else {
        setError('The account number or PIN you entered is incorrect.');
        setLoading(false);
      }
    }, 900);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 w-full max-w-md mx-auto px-6 flex flex-col">
        <div className="pt-16 text-center">
          <img src={STANBIC_LOGO} alt="Stanbic IBTC" className="w-12 h-auto mx-auto" />
          <h1 className="text-xl font-bold text-gray-900 mt-3">Stanbic IBTC</h1>
          <p className="text-xs text-gray-500 mt-1">A member of Standard Bank Group</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 space-y-4">
          <div>
            <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Account number</label>
            <input
              type="text"
              inputMode="numeric"
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              placeholder="Enter your account number"
              className="w-full bg-white border border-gray-300 rounded-lg py-3 px-3.5 text-sm outline-none focus:border-[#0033a0] focus:ring-1 focus:ring-[#0033a0]"
              required
            />
          </div>

          <div>
            <label className="block text-[13px] font-medium text-gray-700 mb-1.5">PIN</label>
            <input
              type="password"
              inputMode="numeric"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter your PIN"
              className="w-full bg-white border border-gray-300 rounded-lg py-3 px-3.5 text-sm outline-none focus:border-[#0033a0] focus:ring-1 focus:ring-[#0033a0]"
              required
            />
          </div>

          {error && <p className="text-[13px] text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0033a0] text-white text-sm font-semibold py-3 rounded-lg active:bg-[#002880] disabled:opacity-60 flex items-center justify-center gap-2 !mt-6"
          >
            {loading ? (
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              'Sign in'
            )}
          </button>

          <button type="button" className="w-full text-center text-[13px] font-medium text-[#0033a0] py-1">
            Forgot PIN?
          </button>
        </form>

        <div className="mt-auto pb-8 pt-10 text-center">
          <p className="text-[11px] leading-relaxed text-gray-400">
            Stanbic IBTC Bank PLC is licensed by the Central Bank of Nigeria.
            <br />
            Deposits insured by the NDIC. · v1.0.4
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
