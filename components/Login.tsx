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
        setError('Invalid account number or PIN. Please try again.');
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#00246e] to-[#0033a0] flex flex-col items-center justify-center p-6 text-white relative overflow-hidden">
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-white/5 rounded-full" />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-white/5 rounded-full" />

      <div className="w-full max-w-sm relative z-10">
        <div className="text-center mb-10">
          <div className="inline-block p-2 rounded-2xl bg-white shadow-xl mb-5 overflow-hidden">
            <img src={STANBIC_LOGO} alt="Stanbic IBTC" className="w-16 h-auto" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Stanbic IBTC</h1>
          <p className="text-[10px] text-blue-200/70 uppercase font-semibold tracking-[0.25em] mt-1">
            A Member of Standard Bank Group
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-7 border border-white/10 shadow-2xl">
          <h2 className="text-base font-bold mb-6 text-center">Welcome Back</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-blue-200/70 block mb-1.5 ml-1">
                Account Number
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                placeholder="Enter account number"
                className="w-full bg-white/5 border border-white/20 rounded-xl py-3.5 px-4 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-300/50 focus:bg-white/10 transition-all placeholder:text-white/30"
                required
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-blue-200/70 block mb-1.5 ml-1">
                Secure PIN
              </label>
              <input
                type="password"
                inputMode="numeric"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter PIN"
                className="w-full bg-white/5 border border-white/20 rounded-xl py-3.5 px-4 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-300/50 focus:bg-white/10 transition-all placeholder:text-white/30 tracking-widest"
                required
              />
            </div>

            {error && (
              <div className="bg-rose-500/20 border border-rose-400/40 text-rose-100 text-[11px] font-semibold p-3 rounded-xl text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-[#0033a0] font-bold py-3.5 rounded-xl shadow-lg hover:bg-blue-50 transition-all active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2 !mt-6"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-[#0033a0]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                'Log In'
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/10 text-center">
            <button className="text-[10px] font-bold text-blue-200/70 uppercase tracking-widest hover:text-white transition-colors">
              Forgot Password?
            </button>
          </div>
        </div>

        <p className="mt-8 text-center text-[9px] text-white/40 uppercase font-semibold tracking-[0.2em]">
          Secured by Standard Bank Systems
        </p>
      </div>
    </div>
  );
};

export default Login;
