import React from 'react';
import { UserProfile, STANBIC_LOGO } from '../types';

interface ProfileProps {
  user: UserProfile;
}

const Profile: React.FC<ProfileProps> = ({ user }) => {
  return (
    <div className="bg-[#0033a0] min-h-screen flex flex-col font-sans pb-12 text-white relative overflow-hidden">
      {/* Background design elements */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"></div>
      <div className="absolute top-1/3 -right-32 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl"></div>

      {/* Top Header */}
      <div className="p-6 pt-8 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <img src={STANBIC_LOGO} alt="Stanbic Logo" className="w-8 h-auto filter brightness-0 invert" />
        </div>
        <button className="w-9 h-9 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-full flex items-center justify-center transition-all shadow-md active:scale-95">
          <svg className="w-5 h-5 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>

      {/* Profile Avatar Block */}
      <div className="px-6 py-4 flex flex-col items-center text-center relative z-10">
        <div className="relative mb-4">
          {/* Avatar frame */}
          <div className="w-24 h-24 rounded-full border-[3px] border-white/20 shadow-2xl flex items-center justify-center bg-white text-[#0033a0] text-3xl font-black overflow-hidden relative group">
            {/* Realistically styled portrait representation or dynamic avatar initials */}
            <span className="relative z-10">{user.name.split(' ').map(n => n[0]).join('')}</span>
            {/* Nice subtle color overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-50/10 to-blue-100/30"></div>
          </div>
          {/* Upload picture label bubble */}
          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-blue-600 text-[9px] font-black tracking-wider uppercase py-1 px-3 rounded-full shadow-md border border-white/20 whitespace-nowrap">
            Upload picture
          </span>
        </div>
        <h2 className="text-lg font-black tracking-wide mt-2">{user.name}</h2>
        <p className="text-[10px] text-white/60 font-bold uppercase tracking-widest mt-0.5">David Jaiye Sokeyo</p>
      </div>

      {/* Menu Options White Rounded Box (Matches Inspiration Card) */}
      <div className="mt-8 px-6 space-y-6 relative z-10">
        <div>
          <h3 className="text-white/60 font-bold text-[10px] uppercase tracking-[0.2em] mb-3 px-1">General</h3>
          <div className="bg-white text-gray-800 rounded-3xl shadow-[0_15px_40px_rgba(0,0,0,0.15)] overflow-hidden divide-y divide-gray-50 border border-white/5">
            <ProfileMenuItem title="App Sound" toggle />
            <ProfileMenuItem title="Share App" hasArrow />
            <ProfileMenuItem title="Refer a friend" hasArrow />
            <ProfileMenuItem title="Support" hasArrow />
            <ProfileMenuItem title="Live Chat" hasArrow />
            <ProfileMenuItem title="F.A.Qs" hasArrow />
            <ProfileMenuItem title="View BVN" hasArrow />
            <ProfileMenuItem title="Submit Complaint" hasArrow />
          </div>
        </div>

        <div>
          <h3 className="text-white/60 font-bold text-[10px] uppercase tracking-[0.2em] mb-3 px-1">Security</h3>
          <div className="bg-white text-gray-800 rounded-3xl shadow-[0_15px_40px_rgba(0,0,0,0.15)] overflow-hidden border border-white/5">
            <ProfileMenuItem title="Change Password" hasArrow />
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileMenuItem: React.FC<{ title: string; hasArrow?: boolean; toggle?: boolean }> = ({ title, hasArrow, toggle }) => (
  <div className="flex items-center justify-between px-5 py-4 hover:bg-gray-50/80 transition-colors cursor-pointer group">
    <span className="text-sm font-bold text-gray-700 group-hover:text-[#0033a0] transition-colors">{title}</span>
    {toggle && (
      <div className="w-11 h-6 bg-[#0033a0] rounded-full relative p-1 cursor-pointer flex items-center justify-end transition-all">
        <div className="w-4.5 h-4.5 bg-white rounded-full shadow-md"></div>
      </div>
    )}
    {hasArrow && (
      <div className="w-6 h-6 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center group-hover:bg-[#0033a0]/10 group-hover:text-[#0033a0] transition-all">
        <svg className="w-3.5 h-3.5 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    )}
  </div>
);

export default Profile;
