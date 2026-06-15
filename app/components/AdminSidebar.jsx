'use client';

import React from 'react';

export default function AdminSidebar({ activeTab = 'Upload Job', onTabChange, onLogout }) {
  const navItems = [
    {
      id: 'Upload Job',
      label: 'Upload Job',
      icon: 'M12 4v16m8-8H4',
      isPrimary: true,
    },
    {
      id: 'All Posted Jobs',
      label: 'All Posted Jobs',
      icon: 'M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2',
      isPrimary: false,
    },
    {
      id: 'Issue Reports',
      label: 'Issue Reports',
      icon: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      isPrimary: false,
    },
  ];

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[240px] bg-[#f4f5ff] border-r border-zinc-200/60 flex flex-col z-20">
      <div className="h-[72px] flex items-center px-7 shrink-0">
        <div className="flex flex-col leading-tight">
          <span className="text-[18px] font-black tracking-tight">
            <span className="text-[#1a1c2e]">JobHunt</span>
            <span className="text-[#22c55e]">10x.ai</span>
          </span>
          <span className="text-[10px] font-semibold text-zinc-500 mt-0.5 tracking-wide">
            Admin Portal
          </span>
        </div>
      </div>

      <nav className="flex-1 px-5 py-6 flex flex-col gap-1.5">
        {navItems.map((tab) => {
          const isActive = activeTab === tab.id;

          if (tab.isPrimary) {
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl text-[13px] font-bold transition-all ${
                  isActive
                    ? 'bg-[#22c55e] text-white shadow-md shadow-[#22c55e]/25'
                    : 'bg-[#22c55e]/90 text-white hover:bg-[#16a34a] shadow-sm'
                }`}
              >
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} />
                </svg>
                {tab.label}
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-semibold transition-all ${
                isActive
                  ? 'text-[#1a1c2e] bg-white/80 shadow-sm'
                  : 'text-zinc-600 hover:text-[#1a1c2e] hover:bg-white/50'
              }`}
            >
              <svg className="w-[18px] h-[18px] shrink-0 text-zinc-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} />
              </svg>
              {tab.label}
            </button>
          );
        })}
      </nav>

      <div className="p-5 mt-auto shrink-0">
        <button
          type="button"
          onClick={onLogout}
          className="flex items-center gap-3 px-2 py-2 w-full text-[13px] font-semibold text-zinc-500 hover:text-red-600 transition-colors"
        >
          <svg className="w-[18px] h-[18px] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
    </aside>
  );
}
