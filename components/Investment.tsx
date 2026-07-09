
import React, { useState } from 'react';
import { UserProfile, ActiveInvestment, STANBIC_LOGO } from '../types';

interface InvestmentProps {
  user: UserProfile;
  onInvestmentComplete: (amount: number, months: number) => void;
}

const Investment: React.FC<InvestmentProps> = ({ user, onInvestmentComplete }) => {
  const [view, setView] = useState<'portfolio' | 'market'>('portfolio');
  const [investAmount, setInvestAmount] = useState('');
  const [months, setMonths] = useState(2);
  const [signature, setSignature] = useState<File | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const monthlyInterestRateMultiplier = 0.0542; // 5.42%

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(value);
  };

  const handleSignatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSignature(e.target.files[0]);
    }
  };

  const calculateTotalInterest = () => {
    const amt = parseFloat(investAmount);
    if (isNaN(amt)) return 0;
    return amt * monthlyInterestRateMultiplier * months;
  };

  const handleExecute = () => {
    setShowConfirmation(true);
  };

  const handleFinalize = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const amt = parseFloat(investAmount);
      onInvestmentComplete(amt, months);
      setIsProcessing(false);
      setIsSuccess(true);
      setShowConfirmation(false);
    }, 2000);
  };

  const getMaturityDateLabel = (m: number) => {
    const d = new Date();
    d.setMonth(d.getMonth() + m);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="bg-[#0033a0] min-h-full flex flex-col relative">
      {/* Tab Header */}
      <div className="p-8 pt-12 text-white">
        <div className="flex flex-col items-center mb-8">
           <img src={STANBIC_LOGO} alt="Logo" className="w-12 h-auto mb-2" />
           <h2 className="text-2xl font-black uppercase tracking-tighter">Mutual funds</h2>
        </div>
        
        <div className="flex bg-white/10 rounded-2xl p-1 mb-8">
          <button 
            onClick={() => setView('portfolio')}
            className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${view === 'portfolio' ? 'bg-white text-[#0033a0] shadow-lg' : 'text-white/60 hover:text-white'}`}
          >
            My Portfolio
          </button>
          <button 
            onClick={() => setView('market')}
            className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${view === 'market' ? 'bg-white text-[#0033a0] shadow-lg' : 'text-white/60 hover:text-white'}`}
          >
            Market
          </button>
        </div>

        {view === 'portfolio' ? (
          <div className="animate-fade-in">
             <div className="bg-[#002366] rounded-3xl p-6 border border-white/10 mb-8">
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1 text-center">Total Wealth Value</p>
                <h3 className="text-3xl font-black text-center mb-6">{formatCurrency(user.investmentBalance)}</h3>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                   <div>
                     <p className="text-[9px] font-bold text-white/40 uppercase">Monthly Earnings</p>
                     <p className="text-sm font-bold text-green-400">+{formatCurrency(user.investmentBalance * monthlyInterestRateMultiplier)}</p>
                   </div>
                   <div className="text-right">
                     <p className="text-[9px] font-bold text-white/40 uppercase">Active Slots</p>
                     <p className="text-sm font-bold text-blue-300">{user.activeInvestments.length} Investments</p>
                   </div>
                </div>
             </div>

             <h4 className="text-xs font-bold text-white/60 uppercase tracking-widest mb-4">Active Investments</h4>
             <div className="space-y-6">
                {user.activeInvestments.length === 0 ? (
                  <div className="bg-white/5 border border-dashed border-white/20 rounded-2xl p-10 text-center">
                    <p className="text-sm font-medium text-white/40">No active investments found</p>
                    <button 
                      onClick={() => setView('market')}
                      className="mt-4 text-[#eaaa00] font-bold text-xs uppercase"
                    >
                      Browse Mutual Funds →
                    </button>
                  </div>
                ) : (
                  user.activeInvestments.map((inv) => {
                    const monthlyGain = inv.amount * (inv.interestRate / 100);
                    const totalGain = monthlyGain * inv.durationMonths;
                    
                    return (
                      <div key={inv.id} className="bg-white rounded-[2rem] p-6 shadow-xl border border-gray-100 overflow-hidden relative">
                        <div className="flex justify-between items-start mb-6">
                          <div>
                            <h5 className="text-sm font-bold text-[#0033a0]">{inv.name}</h5>
                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Starts: {inv.startDate}</p>
                          </div>
                          <div className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-[9px] font-black tracking-widest border border-green-100">
                            ACTIVE
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6 mb-6">
                          <div>
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Principal</p>
                            <p className="text-xl font-black text-gray-800 tracking-tight">{formatCurrency(inv.amount)}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Maturity Date</p>
                            <p className="text-xs font-bold text-[#0033a0]">{inv.maturityDate}</p>
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-2xl p-4 flex flex-col gap-3">
                           <div className="flex justify-between items-center">
                             <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">Estimated Monthly Earning</p>
                             <p className="text-xs font-black text-green-600">+{formatCurrency(monthlyGain)}</p>
                           </div>
                           <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                             <p className="text-[10px] font-bold text-[#0033a0] uppercase tracking-tighter">Total Projected Earning</p>
                             <p className="text-sm font-black text-[#0033a0]">{formatCurrency(totalGain)}</p>
                           </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                           <div className="flex items-center gap-1.5">
                              <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                              </span>
                              <span className="text-[9px] font-bold text-gray-400 uppercase">Return Rate: {inv.interestRate}% Monthly</span>
                           </div>
                           <button className="text-[10px] font-bold text-[#eaaa00] uppercase tracking-widest hover:underline decoration-2 underline-offset-4">View Statement</button>
                        </div>
                      </div>
                    );
                  })
                )}
             </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-6 text-gray-800 shadow-2xl overflow-hidden mb-8 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-[#0033a0]">High-Yield Fund</h3>
              <div className="bg-blue-50 text-[#0033a0] px-3 py-1 rounded-full text-[10px] font-bold uppercase">Fixed Rate</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Performance Index</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-[#0033a0]">5.42%</span>
                  <span className="text-[#00a884] text-xs font-bold flex items-center uppercase tracking-tighter">
                    Per Month
                  </span>
                </div>
                <p className="mt-4 text-sm font-semibold text-[#0033a0] bg-blue-50 inline-block px-3 py-1 rounded-full">
                  ₦54.20 / ₦1000 monthly
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 border-t border-gray-100 pt-8">
              <StatItem label="₦3,000,000" subLabel="Min. Capital" />
              <StatItem label="5.42%" subLabel="Int. Rate" />
              <StatItem label="60 Days" subLabel="Min. Term" />
              <StatItem label="Secure" subLabel="Risk" />
            </div>

            {/* Investment Subscription Form */}
            <div className="border-t border-gray-100 pt-8">
              <h4 className="text-[#0033a0] font-bold text-lg mb-6 text-center">New Subscription</h4>
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Capital Allocation</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">₦</span>
                    <input 
                      type="number" 
                      value={investAmount}
                      onChange={(e) => setInvestAmount(e.target.value)}
                      placeholder="Min ₦3M"
                      className="w-full bg-gray-50 border-2 border-transparent focus:border-[#0033a0] rounded-xl py-4 pl-10 pr-4 text-sm font-bold outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Duration (Months)</label>
                  <div className="relative">
                    <select 
                      value={months}
                      onChange={(e) => setMonths(parseInt(e.target.value))}
                      className="w-full bg-gray-50 border-2 border-transparent focus:border-[#0033a0] rounded-xl py-4 px-4 text-sm font-bold outline-none transition-all appearance-none cursor-pointer"
                    >
                      {[2, 3, 4, 5, 6, 9, 12, 18, 24].map(m => (
                        <option key={m} value={m}>{m} Months {m === 2 ? '(60 Days)' : ''}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {investAmount && parseFloat(investAmount) >= 3000000 ? (
                  <div className="bg-[#0033a0] rounded-2xl p-6 text-white shadow-lg animate-slide-up">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">Earnings Analysis</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[10px] font-bold opacity-60 uppercase mb-1">Monthly Interest</p>
                        <p className="text-lg font-bold">{formatCurrency(parseFloat(investAmount) * monthlyInterestRateMultiplier)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold opacity-60 uppercase mb-1">Maturity Date</p>
                        <p className="text-xs font-bold text-yellow-300">{getMaturityDateLabel(months)}</p>
                      </div>
                    </div>
                  </div>
                ) : null}

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Digital Signature</label>
                  <div className="relative border-2 border-dashed border-gray-200 rounded-xl p-6 hover:border-[#0033a0] transition-colors bg-gray-50 flex flex-col items-center justify-center cursor-pointer">
                    <input 
                      type="file" 
                      onChange={handleSignatureChange}
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <svg className="w-6 h-6 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    <p className="text-[9px] font-bold text-gray-500 uppercase text-center">
                      {signature ? signature.name : "Sign document"}
                    </p>
                  </div>
                </div>

                <button 
                  onClick={handleExecute}
                  disabled={!investAmount || parseFloat(investAmount) < 3000000 || !signature || parseFloat(investAmount) > user.balance}
                  className="w-full bg-[#0033a0] hover:bg-[#002880] disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95"
                >
                  Confirm Subscription
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center px-4 pb-20 sm:items-center sm:p-0">
          <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm transition-opacity" onClick={() => !isProcessing && setShowConfirmation(false)}></div>
          
          <div className="bg-white rounded-[2rem] overflow-hidden shadow-2xl transform transition-all sm:max-w-lg sm:w-full animate-slide-up relative">
            <div className="p-8">
              <h3 className="text-xl font-bold text-[#0033a0] mb-6">Confirm Investment</h3>
              <div className="space-y-4 mb-8">
                <SummaryItem label="Principal" value={formatCurrency(parseFloat(investAmount))} />
                <SummaryItem label="Duration" value={`${months} Months`} />
                <SummaryItem label="Monthly Rate" value="5.42%" />
                <SummaryItem label="Projected Total" value={formatCurrency(calculateTotalInterest())} highlight />
                <SummaryItem label="Maturity Date" value={getMaturityDateLabel(months)} />
              </div>

              <div className="flex gap-4">
                <button 
                  disabled={isProcessing}
                  onClick={() => setShowConfirmation(false)} 
                  className="flex-1 border-2 border-gray-100 text-gray-400 font-bold py-4 rounded-2xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  disabled={isProcessing}
                  onClick={handleFinalize}
                  className="flex-1 bg-[#0033a0] text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-[#002880] transition-all flex items-center justify-center gap-2"
                >
                  {isProcessing ? 'Processing...' : 'Invest Now'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success State */}
      {isSuccess && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
          <div className="fixed inset-0 bg-[#0033a0]/90 backdrop-blur-xl"></div>
          <div className="text-white text-center animate-slide-up relative z-10">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold mb-2">Activated!</h3>
            <p className="text-blue-200 mb-8 max-w-xs mx-auto">Your investment has been successfully added to your portfolio.</p>
            <button 
              onClick={() => {
                setIsSuccess(false);
                setInvestAmount('');
                setSignature(null);
                setView('portfolio');
              }}
              className="bg-white text-[#0033a0] font-bold px-12 py-4 rounded-2xl shadow-xl active:scale-95 transition-all"
            >
              View Portfolio
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const SummaryItem: React.FC<{ label: string; value: string; highlight?: boolean }> = ({ label, value, highlight }) => (
  <div className="flex justify-between items-center py-1">
    <span className="text-xs font-semibold text-gray-400 uppercase tracking-tight">{label}</span>
    <span className={`text-sm font-bold ${highlight ? 'text-green-600' : 'text-gray-800'}`}>{value}</span>
  </div>
);

const StatItem: React.FC<{ label: string; subLabel: string }> = ({ label, subLabel }) => (
  <div className="text-center md:text-left">
    <p className="text-sm font-bold text-gray-800 tracking-tight">{label}</p>
    <p className="text-[8px] font-bold text-gray-400 uppercase mt-1">
      {subLabel}
    </p>
  </div>
);

export default Investment;
