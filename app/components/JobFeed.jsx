'use client';

import React, { useState, useMemo } from 'react';
import { Layers, Search, Briefcase, Loader2 } from 'lucide-react';
import JobCard from './JobCard';

export default function JobFeed({ jobs = [], loading, onEdit, onDelete }) {
  const [searchTerm, setSearchTerm] = useState('');

  // Localized memoized filtering
  const filteredJobs = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return jobs;
    return jobs.filter(job => 
      job?.title?.toLowerCase().includes(term) ||
      job?.company?.toLowerCase().includes(term) ||
      job?.location?.toLowerCase().includes(term) ||
      (job?.skills_required && job.skills_required.some(skill => skill.toLowerCase().includes(term)))
    );
  }, [jobs, searchTerm]);

  return (
    <div className="bg-zinc-900/30 border border-zinc-800/60 rounded-xl p-6 backdrop-blur-md shadow-xl flex-1 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            Live Directory
          </h2>
          <p className="text-xs text-zinc-500 mt-1">
            Active listings loaded directly from the backend API. Search, edit, or delete entries below.
          </p>
        </div>
        
        <div className="text-right">
          <span className="text-xs text-zinc-500 block font-semibold uppercase tracking-wider">Total Listings</span>
          <span className="text-xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            {jobs.length}
          </span>
        </div>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search postings by company, title, or skills..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-zinc-950/60 border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder-zinc-500 hover:border-zinc-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
        />
      </div>

      <div className="flex-1 overflow-y-auto max-h-[640px] pr-1 space-y-4">
        {loading ? (
          <div className="h-48 flex flex-col items-center justify-center gap-3 text-zinc-400">
            <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
            <p className="text-sm">Fetching job feed...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="h-48 flex flex-col items-center justify-center gap-2 border border-dashed border-zinc-800/80 rounded-xl p-8 text-center text-zinc-500">
            <Briefcase className="w-8 h-8 text-zinc-600 mb-1" />
            <p className="text-sm font-semibold">No listings found</p>
            <p className="text-xs text-zinc-600">
              {searchTerm ? 'Adjust your search filters' : 'Publish your first job opening to see it here.'}
            </p>
          </div>
        ) : (
          filteredJobs.map((job) => (
            <JobCard 
              key={job?.id || Math.random().toString()} 
              job={job} 
              onEdit={onEdit}
              onDelete={onDelete} 
            />
          ))
        )}
      </div>
    </div>
  );
}
