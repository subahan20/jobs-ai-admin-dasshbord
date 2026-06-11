'use client';

import React from 'react';

// Helper for generating deterministic colors for fallback avatars
function getAvatarColors(str) {
  const letter = (str || '?').charAt(0).toUpperCase();
  const colors = [
    ['#0c231b', '#22c55e'], ['#2c1d05', '#f59e0b'], ['#230c2c', '#f43f5e'],
    ['#0c232c', '#2dd4bf'], ['#0c2423', '#34d399'], ['#1c0c23', '#a855f7'],
  ];
  const idx = letter.charCodeAt(0) % colors.length;
  return { bg: colors[idx][0], fg: colors[idx][1], letter };
}

export default function AdminJobsTable({ jobs = [], currentPage, totalJobs, jobsPerPage = 5, onPageChange, onEdit, onDelete }) {
  // Extract paginated jobs
  const startIndex = (currentPage - 1) * jobsPerPage;
  const paginatedJobs = jobs.slice(startIndex, startIndex + jobsPerPage);
  const totalPages = Math.ceil(totalJobs / jobsPerPage);

  // Pagination Logic
  const renderPagination = () => {
    const pages = [];
    const maxVisible = 3;
    for (let i = 1; i <= Math.min(maxVisible, totalPages); i++) pages.push(i);

    return (
      <div className="flex items-center justify-between px-6 py-4 bg-zinc-50 border-t border-zinc-200">
        <span className="text-[12px] font-medium text-zinc-500">
          Showing {Math.min(startIndex + 1, totalJobs)} to {Math.min(startIndex + jobsPerPage, totalJobs)} of {totalJobs.toLocaleString()} results
        </span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="w-7 h-7 flex items-center justify-center rounded border border-zinc-200 text-zinc-500 hover:bg-zinc-100 disabled:opacity-40 text-xs font-bold cursor-pointer transition-colors bg-white shadow-sm"
          >
            ‹
          </button>
          
          {pages.map(p => (
            <button 
              key={p} 
              onClick={() => onPageChange(p)}
              className={`w-7 h-7 flex items-center justify-center rounded text-[11px] font-bold cursor-pointer transition-colors shadow-sm ${
                currentPage === p 
                  ? 'bg-[#22c55e] text-white border border-[#22c55e]' 
                  : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50'
              }`}
            >
              {p}
            </button>
          ))}

          {totalPages > maxVisible && (
            <>
              <span className="text-zinc-400 text-xs px-1 font-black">...</span>
              <button 
                onClick={() => onPageChange(totalPages)}
                className={`w-7 h-7 flex items-center justify-center rounded text-[11px] font-bold cursor-pointer transition-colors shadow-sm ${
                  currentPage === totalPages 
                    ? 'bg-[#22c55e] text-white border border-[#22c55e]' 
                    : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                }`}
              >
                {totalPages}
              </button>
            </>
          )}

          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="w-7 h-7 flex items-center justify-center rounded border border-zinc-200 text-zinc-500 hover:bg-zinc-100 disabled:opacity-40 text-xs font-bold cursor-pointer transition-colors bg-white shadow-sm"
          >
            ›
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-sm overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-200">
              <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-wider whitespace-nowrap">Company</th>
              <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-wider whitespace-nowrap">Role</th>
              <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-wider whitespace-nowrap">Location</th>
              <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-wider whitespace-nowrap">Package</th>
              <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-wider whitespace-nowrap">Type</th>
              <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-wider whitespace-nowrap">Posted Date</th>
              <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-wider whitespace-nowrap text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {paginatedJobs.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center text-zinc-400 text-sm font-semibold">
                  No jobs found matching your criteria.
                </td>
              </tr>
            ) : (
              paginatedJobs.map((job) => {
                const isTech = (job.title || '').toLowerCase().match(/engineer|developer|data|tech|scientist|ml|mobile|cloud|frontend|backend/);
                const { bg, fg, letter } = getAvatarColors(job.company);
                const postedDate = new Date(job.created_at || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                const websiteUrl = job.url ? new URL(job.url).hostname : `${(job.company || 'company').toLowerCase().replace(/\s+/g, '')}.com`;

                return (
                  <tr key={job.id} className="hover:bg-zinc-50/50 transition-colors group">
                    {/* Company Column */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {job.logo_url ? (
                          <div className="w-10 h-10 rounded-lg border border-zinc-200 overflow-hidden shrink-0 bg-white p-1">
                            <img src={job.logo_url} alt={job.company} className="w-full h-full object-contain" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 text-[13px] font-black shadow-sm" style={{ backgroundColor: bg, color: fg }}>
                            {letter}
                          </div>
                        )}
                        <div className="flex flex-col">
                          <span className="text-[13px] font-black text-zinc-900">{job.company}</span>
                          <span className="text-[11px] text-zinc-500 font-medium">{websiteUrl}</span>
                        </div>
                      </div>
                    </td>

                    {/* Role Column */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-[13px] font-black text-zinc-900 truncate max-w-[200px]">{job.title}</span>
                        <span className="text-[11px] text-zinc-500 font-medium truncate max-w-[200px]">{job.category || job.experience_level}</span>
                      </div>
                    </td>

                    {/* Location Column */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-zinc-600">
                        <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-[12px] font-bold">{job.location || 'Remote'}</span>
                      </div>
                    </td>

                    {/* Package Column */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        {job.salary && (
                          <span className="text-[13px] font-black text-[#22c55e] whitespace-nowrap">{job.salary}</span>
                        )}
                        {!job.salary && (
                          <span className="text-[12px] text-zinc-400 font-semibold">—</span>
                        )}
                        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">{job.employment_type || 'Full-time'}</span>
                      </div>
                    </td>

                    {/* Type Column */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isTech ? (
                        <span className="inline-flex text-[10px] font-black px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 uppercase tracking-wider">
                          TECH
                        </span>
                      ) : (
                        <span className="inline-flex text-[10px] font-black px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-100 uppercase tracking-wider">
                          NON-TECH
                        </span>
                      )}
                    </td>

                    {/* Posted Date Column */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-[12px] font-semibold text-zinc-500">{postedDate}</span>
                    </td>

                    {/* Actions Column */}
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => onEdit(job)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Edit Job">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button onClick={() => onDelete(job.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete Job">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      
      {renderPagination()}
    </div>
  );
}
