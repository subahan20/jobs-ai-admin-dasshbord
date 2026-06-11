'use client';

import React from 'react';
import AdminSidebar from './AdminSidebar';


const getUserDisplay = (user) => {
  const meta = user?.user_metadata || {};
  const fullName = meta.full_name || meta.name || '';
  const email = user?.email || '';

  if (fullName) {
    const parts = fullName.split(' ');
    return {
      name: fullName,
      title: meta.job_title || 'Senior Recruiter',
      initials: parts.length > 1
        ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
        : fullName.substring(0, 2).toUpperCase(),
      avatar: meta.avatar_url || meta.picture || null,
    };
  }

  if (email) {
    const local = email.split('@')[0];
    return {
      name: local.charAt(0).toUpperCase() + local.slice(1),
      title: 'Administrator',
      initials: local.substring(0, 2).toUpperCase(),
      avatar: null,
    };
  }

  return { name: 'Alex Rivera', title: 'Senior Recruiter', initials: 'AR', avatar: null };
};

export default function AdminDashboardLayout({ children, activeTab, onTabChange, onLogout, user }) {
  const profile = getUserDisplay(user);

  return (
    <div className="flex h-screen w-full bg-[#f9f9f9] text-zinc-900 font-sans overflow-hidden">
      <AdminSidebar activeTab={activeTab} onTabChange={onTabChange} onLogout={onLogout} />

      <div className="flex-1 flex flex-col ml-[240px] min-w-0">
        <header className="h-[72px] bg-white border-b border-zinc-200/80 px-8 flex items-center justify-between shrink-0">
          <h1 className="text-lg font-extrabold text-[#22c55e] tracking-tight">Admin Portal</h1>

          <div className="flex items-center gap-5">
            <button
              type="button"
              className="text-zinc-400 hover:text-zinc-600 transition-colors"
              aria-label="Notifications"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-[13px] font-bold text-[#1a1c2e] leading-tight">{profile.name}</p>
                  <p className="text-[11px] text-zinc-500 font-medium">{profile.title}</p>
                </div>
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-zinc-100"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#22c55e] to-[#16a34a] flex items-center justify-center text-white font-bold text-sm shadow-sm">
                    {profile.initials}
                  </div>
                )}
              </div>
              <div className="w-[1px] h-8 bg-zinc-200 hidden sm:block"></div>
              <button
                type="button"
                onClick={onLogout}
                className="text-[13px] font-bold text-zinc-500 hover:text-red-600 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto auth-scroll-hidden flex flex-col min-h-0">
          <div className="flex-1">{children}</div>

          <footer className="shrink-0 py-5 text-center">
            <p className="text-[11px] text-zinc-400 font-medium">
              © {new Date().getFullYear()} JobHunt10x.ai Admin • Secure Portal
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}
