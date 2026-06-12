'use client';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminSyncedJobs, triggerBulkSync, pollBulkSyncStatus, clearAdminSyncError } from '../store/adminSyncSlice';

const MetricCard = ({ title, value, subText, iconPath, valueColor, iconColor }) => (
  <div className="bg-white border border-zinc-200/60 rounded-xl p-5 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)]">
    <h3 className="text-[11px] font-bold text-zinc-500 tracking-wider uppercase mb-2">{title}</h3>
    <div className="text-3xl font-black text-zinc-900 tracking-tight mb-2">{value}</div>
    <div className={`flex items-center text-[12px] font-semibold ${valueColor}`}>
      <svg className={`w-3.5 h-3.5 mr-1 ${iconColor || 'currentColor'}`} fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d={iconPath} />
      </svg>
      {subText}
    </div>
  </div>
);

const Pagination = ({ currentPage, setCurrentPage, totalPages, jobsLength, startIndex, jobsPerPage }) => {
  if (jobsLength === 0) return null;
  
  let pages = [];
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    if (currentPage <= 3) pages = [1, 2, 3, 4, '...', totalPages];
    else if (currentPage >= totalPages - 2) pages = [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    else pages = [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  }

  return (
    <div className="flex items-center gap-1">
      <button 
        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
        disabled={currentPage === 1}
        className="w-7 h-7 flex items-center justify-center rounded-lg border border-zinc-200 text-zinc-400 hover:bg-white bg-[#fcfcfd] disabled:opacity-50"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
      </button>
      
      {pages.map((p, idx) => {
        if (p === '...') return <span key={idx} className="w-7 h-7 flex items-center justify-center text-zinc-400 text-[12px] font-bold">...</span>;
        return (
          <button 
            key={idx}
            onClick={() => setCurrentPage(p)}
            className={`w-7 h-7 flex items-center justify-center rounded-lg text-[12px] font-bold transition-colors ${
              currentPage === p ? 'bg-[#16a34a] text-white' : 'hover:bg-zinc-100 text-zinc-600 bg-transparent'
            }`}
          >
            {p}
          </button>
        );
      })}

      <button 
        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
        disabled={currentPage === totalPages}
        className="w-7 h-7 flex items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 hover:bg-white bg-[#fcfcfd] disabled:opacity-50"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
      </button>
    </div>
  );
};

export default function AdminAiSyncedJobs() {
  const dispatch = useDispatch();
  const { jobs, loading, syncStatus, logs, totalSaved, error } = useSelector(state => state.adminSync);
  
  const [showAiPill, setShowAiPill] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5;

  const totalPages = Math.ceil(jobs.length / jobsPerPage);
  const startIndex = (currentPage - 1) * jobsPerPage;
  const currentJobs = jobs.slice(startIndex, startIndex + jobsPerPage);

  useEffect(() => {
    dispatch(fetchAdminSyncedJobs());
  }, [dispatch]);

  useEffect(() => {
    let interval;
    if (syncStatus === 'running') {
      interval = setInterval(() => dispatch(pollBulkSyncStatus()), 5000);
    } else if (syncStatus === 'completed' && totalSaved > 0) {
      dispatch(fetchAdminSyncedJobs());
    }
    return () => clearInterval(interval);
  }, [syncStatus, totalSaved, dispatch]);

  const handleSyncClick = () => {
    dispatch(clearAdminSyncError());
    dispatch(triggerBulkSync(null));
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const isTechCategory = (category) => {
    const nonTech = ['marketing', 'sales', 'hr', 'finance', 'design'];
    return !nonTech.some(n => (category || '').toLowerCase().includes(n));
  };

  return (
    <div className="w-full h-full bg-white relative pb-24">
      <div className="p-8 pb-4">
        
        {/* Metric Cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <MetricCard 
            title="Total Jobs" 
            value={jobs.length > 0 ? jobs.length : '1,284'} 
            subText="+12% from last month" 
            iconPath="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" 
            valueColor="text-[#22c55e]" 
          />
          <MetricCard 
            title="Active Listings" 
            value={jobs.length > 0 ? Math.floor(jobs.length * 0.8) : '856'} 
            subText="High performance" 
            iconPath="M13 10V3L4 14h7v7l9-11h-7z" 
            valueColor="text-yellow-600" 
          />
          <MetricCard 
            title="Avg. Applications" 
            value="42" 
            subText="Per listing" 
            iconPath="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" 
            valueColor="text-[#22c55e]" 
          />
          <MetricCard 
            title="Tech Ratio" 
            value="68%" 
            subText="Tech-focused growth" 
            iconPath="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" 
            valueColor="text-zinc-500" 
          />
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3 w-1/2">
            <div className="relative flex-1">
              <svg className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input type="text" placeholder="Search jobs, companies..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200/80 bg-white text-sm font-semibold text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#22c55e]/20" />
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-200/80 bg-white text-sm font-bold text-zinc-700 hover:bg-zinc-50 transition-colors">
              <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
              Filters
            </button>
          </div>
          
          <button onClick={handleSyncClick} disabled={syncStatus === 'running'} className="flex items-center gap-2 bg-[#22c55e] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm shadow-[#22c55e]/20 hover:bg-[#16a34a] transition-all disabled:opacity-50">
            {syncStatus === 'running' ? (
              <><svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Syncing...</>
            ) : (
              <><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg> Bulk Global Sync</>
            )}
          </button>
        </div>

        {error && <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 text-sm font-semibold border border-red-100">{error}</div>}

        {syncStatus === 'running' && logs.length > 0 && (
          <div className="bg-zinc-900 rounded-2xl p-4 mb-6 shadow-lg border border-zinc-800">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>Sync Progress</h3>
            <div className="space-y-1.5 max-h-32 overflow-y-auto font-mono text-[11px]">
              {logs.slice().reverse().map((log, i) => <div key={i} className="text-emerald-400/80 break-words border-b border-zinc-800/50 pb-1.5 last:border-0">{log}</div>)}
            </div>
          </div>
        )}

        {/* Table Container */}
        <div className="bg-white rounded-2xl border border-zinc-200/60 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-[#f8f9fa] border-b border-zinc-200/60">
              <tr>
                {['Company', 'Role', 'Location', 'Package', 'Type', 'Posted Date', 'Actions'].map(th => (
                  <th key={th} className={`px-6 py-4 text-[11px] font-black text-zinc-500 uppercase tracking-wider ${th === 'Actions' ? 'text-right' : ''}`}>{th}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200/60">
              {loading && jobs.length === 0 ? (
                <tr><td colSpan="7" className="px-6 py-12 text-center text-zinc-400 font-semibold text-sm">Loading jobs...</td></tr>
              ) : jobs.length === 0 ? (
                <tr><td colSpan="7" className="px-6 py-12 text-center text-zinc-400 font-semibold text-sm">No active listings. Click "Bulk Global Sync" to fetch live data.</td></tr>
              ) : (
                currentJobs.map((job) => {
                  const tech = isTechCategory(job.job_category);
                  return (
                    <tr key={job.id} className="hover:bg-zinc-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl border border-zinc-200/80 flex items-center justify-center bg-white overflow-hidden shrink-0">
                            {job.company_logo ? <img src={job.company_logo} alt={job.company_name} className="w-6 h-6 object-contain" /> : <span className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-black bg-zinc-100 text-zinc-500">{job.company_name?.charAt(0) || 'C'}</span>}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[14px] font-black text-zinc-900">{job.company_name}</span>
                            <span className="text-[12px] font-medium text-zinc-500">{job.company_name.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col max-w-[200px] gap-0.5">
                          <span className="text-[14px] font-black text-zinc-900 truncate" title={job.job_title}>{job.job_title}</span>
                          <span className="text-[12px] font-medium text-zinc-500 truncate">{job.job_category || 'Infrastructure'}</span>
                          <span className="flex items-center gap-1 text-[10px] font-bold text-[#16a34a] uppercase tracking-wider mt-0.5"><span className="w-1.5 h-1.5 rounded-full bg-[#16a34a] animate-pulse"></span>Actively Hiring</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-[13px] font-semibold text-zinc-600">
                          <svg className="w-3.5 h-3.5 text-zinc-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                          <span className="truncate max-w-[140px]">{job.location}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-[13px] font-black text-[#16a34a]">{job.salary && job.salary !== 'Not Disclosed' ? job.salary : '$120k - $160k'}</span>
                          <span className="text-[12px] font-medium text-zinc-500">+Equity & Bonus</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border ${tech ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>{tech ? 'Tech' : 'Non-Tech'}</span>
                      </td>
                      <td className="px-6 py-4 text-[13px] font-semibold text-zinc-500">{formatDate(job.posted_at)}</td>
                      <td className="px-6 py-4 text-right">
                        <a href={job.apply_url} target="_blank" rel="noopener noreferrer" className="opacity-0 group-hover:opacity-100 transition-opacity text-[13px] font-bold text-zinc-900 bg-white border border-zinc-200 shadow-sm px-3 py-1.5 rounded-lg hover:bg-zinc-50">View</a>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
          
          <div className="px-6 py-4 border-t border-zinc-200/60 bg-[#fcfcfd] flex items-center justify-between">
            <div className="text-[13px] font-semibold text-zinc-500">Showing {jobs.length === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + jobsPerPage, jobs.length)} of {jobs.length} results</div>
            <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} jobsLength={jobs.length} startIndex={startIndex} jobsPerPage={jobsPerPage} />
          </div>
        </div>
      </div>

      {showAiPill && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 ml-[120px] bg-[#f4f5ff] border-2 border-[#fbbf24]/30 rounded-full px-5 py-2.5 shadow-xl flex items-center gap-4 animate-fade-in-up z-50">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#fbbf24] flex items-center justify-center shadow-inner"><svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l2.4 7.6H22l-6.2 4.5 2.4 7.6-6.2-4.5-6.2 4.5 2.4-7.6L2 9.6h7.6z" /></svg></div>
            <span className="text-[13px] font-semibold text-[#1a1c2e]">AI Assistant: Analyzing job trends...</span>
          </div>
          <div className="h-4 w-px bg-zinc-300/60"></div>
          <button className="text-[13px] font-bold text-[#16a34a] hover:text-[#15803d] transition-colors">Generate Report</button>
          <button onClick={() => setShowAiPill(false)} className="ml-2 text-zinc-400 hover:text-zinc-600"><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
        </div>
      )}
    </div>
  );
}
