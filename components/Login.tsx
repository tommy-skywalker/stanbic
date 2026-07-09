
import React, { useState } from 'react';
import { STANBIC_LOGO } from '../types';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Specific credentials validation logic remains internal
    setTimeout(() => {
      if (username === '00028744480' && password === '1304') {
        onLogin();
      } else {
        setError('Invalid account number or password. Please try again.');
        setIsLoading(false);
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#0033a0] flex flex-col items-center justify-center p-6 text-white relative overflow-hidden">
      {/* Decorative Circles */}
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl"></div>

      <div className="w-full max-w-sm z-10">
        {/* Logo Section */}
        <div className="text-center mb-12">
          <div className="inline-block p-1 rounded-3xl bg-white backdrop-blur-md mb-6 shadow-2xl border border-white/20 overflow-hidden">
            <img src={STANBIC_LOGO} alt="Stanbic IBTC Logo" className="w-20 h-auto" />
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tighter mb-1">Stanbic IBTC</h1>
          <p className="text-[10px] text-blue-200 uppercase font-bold tracking-[0.2em] opacity-80">A member of Standard Bank Group</p>
        </div>

        {/* Login Form */}
        <div className="bg-white/10 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/10 shadow-2xl">
          <h2 className="text-lg font-bold mb-8 text-center">Welcome Back</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-blue-200 block ml-1">Account Number</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter Account Number"
                className="w-full bg-white/5 border border-white/20 rounded-2xl py-4 px-6 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white/10 transition-all placeholder:text-white/30"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-blue-200 block ml-1">Secure PIN</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Secure PIN"
                className="w-full bg-white/5 border border-white/20 rounded-2xl py-4 px-6 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white/10 transition-all placeholder:text-white/30 tracking-widest"
                required
              />
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-200 text-[10px] font-bold p-3 rounded-xl text-center animate-pulse">
                {error}
              </div>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-white text-[#0033a0] font-black py-4 rounded-2xl shadow-xl hover:bg-blue-50 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-[#0033a0]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : 'Log In'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 flex flex-col items-center gap-4">
             <button className="text-[10px] font-bold text-blue-200 uppercase hover:text-white transition-colors">Forgot Password?</button>
          </div>
        </div>

        <p className="mt-10 text-center text-[9px] text-white/40 uppercase font-bold tracking-widest">
          Secured by Standard Bank Systems
        </p>
      </div>
    </div>
  );
};

export default Login;
