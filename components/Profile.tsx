import React from 'react';
import { UserProfile } from '../types';

interface ProfileProps {
  user: UserProfile;
  onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onLogout }) => {
  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('');

  return (
    <div className="min-h-full">
      <header className="bg-white border-b border-gray-200 px-4 h-14 flex items-center">
        <h1 className="text-base font-semibold text-gray-900">Profile</h1>
      </header>

      <div className="px-4 py-4 space-y-4">
        {/* Identity */}
        <div className="bg-white border border-gray-200 rounded-xl px-4 py-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#0033a0]/10 text-[#0033a0] font-semibold text-sm flex items-center justify-center">
            {initials}
          </div>
          <div>
            <p className="text-[15px] font-semibold text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-500 mt-0.5">
              {user.accountType} · {user.accountNumber}
            </p>
          </div>
        </div>

        <Group title="Account">
          <Item label="Personal details" />
          <Item label="Statements & documents" />
          <Item label="Linked accounts & cards" />
        </Group>

        <Group title="Security">
          <Item label="Change PIN" />
          <Item label="Biometric login" toggle />
          <Item label="Manage devices" />
        </Group>

        <Group title="Support">
          <Item label="Help centre" />
          <Item label="Contact us" />
        </Group>

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <button
            onClick={onLogout}
            className="w-full px-4 py-3 text-left text-[13px] font-medium text-red-600 active:bg-gray-50"
          >
            Sign out
          </button>
        </div>

        <p className="text-[11px] text-gray-400 text-center pb-2">Version 1.0.4</p>
      </div>
    </div>
  );
};

const Group: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section>
    <h2 className="text-xs font-medium text-gray-500 mb-2">{title}</h2>
    <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100 overflow-hidden">
      {children}
    </div>
  </section>
);

const Item: React.FC<{ label: string; toggle?: boolean }> = ({ label, toggle }) => (
  <div className="px-4 py-3 flex items-center justify-between cursor-pointer active:bg-gray-50">
    <span className="text-[13px] font-medium text-gray-900">{label}</span>
    {toggle ? (
      <div className="w-10 h-[22px] bg-[#0033a0] rounded-full p-0.5 flex items-center justify-end">
        <div className="w-[18px] h-[18px] bg-white rounded-full shadow-sm" />
      </div>
    ) : (
      <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    )}
  </div>
);

export default Profile;
