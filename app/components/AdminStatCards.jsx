'use client';

import React from 'react';

export default function AdminStatCards({ jobs = [] }) {
  const totalJobs = jobs.length;
  const activeListings = jobs.filter((j) => j.status === 'Active' || !j.status).length;

  const techJobs = jobs.filter((j) => {
    const t = (j.title || '').toLowerCase();
    return (
      t.includes('engineer') ||
      t.includes('developer') ||
      t.includes('data') ||
      t.includes('tech')
    );
  }).length;
  const techRatio = totalJobs > 0 ? Math.round((techJobs / totalJobs) * 100) : 0;

  const remoteJobs = jobs.filter((j) => {
    const loc = (j.location || '').toLowerCase();
    return loc.includes('remote') || loc.includes('work from home');
  }).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div className="bg-white rounded-xl border border-zinc-200 p-6 flex flex-col justify-between shadow-sm">
        <h3 className="text-[11px] font-black text-zinc-500 uppercase tracking-wider">Total Jobs</h3>
        <div className="mt-4">
          <span className="text-3xl font-black text-zinc-900 tracking-tight">{totalJobs.toLocaleString()}</span>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-zinc-200 p-6 flex flex-col justify-between shadow-sm">
        <h3 className="text-[11px] font-black text-zinc-500 uppercase tracking-wider">Active Listings</h3>
        <div className="mt-4">
          <span className="text-3xl font-black text-zinc-900 tracking-tight">{activeListings.toLocaleString()}</span>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-zinc-200 p-6 flex flex-col justify-between shadow-sm">
        <h3 className="text-[11px] font-black text-zinc-500 uppercase tracking-wider">Remote Listings</h3>
        <div className="mt-4">
          <span className="text-3xl font-black text-zinc-900 tracking-tight">{remoteJobs.toLocaleString()}</span>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-zinc-200 p-6 flex flex-col justify-between shadow-sm">
        <h3 className="text-[11px] font-black text-zinc-500 uppercase tracking-wider">Tech Ratio</h3>
        <div className="mt-4">
          <span className="text-3xl font-black text-zinc-900 tracking-tight">{techRatio}%</span>
        </div>
      </div>
    </div>
  );
}
