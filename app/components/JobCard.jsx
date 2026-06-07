import React from 'react';
import { MapPin, DollarSign, Clock, Calendar, ExternalLink, Trash2, Edit } from 'lucide-react';

export default function JobCard({ job, onEdit, onDelete }) {
  const fallbackTheme = job?.logo_color || 'bg-indigo-600/30 text-indigo-200 border-indigo-500/30';
  const initials = job?.company ? job.company.substring(0, 2).toUpperCase() : 'JB';

  return (
    <div className="group p-5 bg-zinc-950/40 border border-zinc-800/60 rounded-xl hover:border-zinc-700 hover:bg-zinc-950/80 transition-all duration-300 relative">
      <div className="flex gap-4 items-start">
        {job?.logo_url ? (
          <img 
            src={job.logo_url} 
            alt={`${job?.company || 'Company'} Logo`}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
            className="w-12 h-12 rounded-lg object-contain bg-zinc-900 border border-zinc-800 shrink-0"
          />
        ) : (
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-sm font-bold border shrink-0 uppercase shadow-inner ${fallbackTheme}`}>
            {initials}
          </div>
        )}
 
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-sm text-zinc-100 group-hover:text-violet-400 transition-colors truncate">
              {job?.title}
            </h3>
            {job?.source === 'Admin Portal' && (
              <span className="px-2 py-0.5 bg-violet-950/60 text-violet-300 border border-violet-800/40 rounded-full text-[10px] font-semibold tracking-wide uppercase">
                Admin Portal
              </span>
            )}
          </div>

          <p className="text-xs font-semibold text-zinc-400 mt-1 truncate">
            {job?.company}
          </p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-xs text-zinc-500">
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-zinc-500" />
              <span>{job?.location || 'Remote'}</span>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-zinc-500" />
              <span>{job?.salary || 'Not Disclosed'}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-zinc-500" />
              <span>{job?.experience_level} ({job?.min_experience_years || 0}+ yrs)</span>
            </div>
          </div>

          {job?.skills_required && job.skills_required.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {job.skills_required.map((skill, index) => (
                <span 
                  key={index}
                  className="px-2 py-0.5 bg-zinc-900 border border-zinc-800/80 rounded-md text-[10px] font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}

          {job?.description && (
            <p className="text-xs text-zinc-500 mt-3 line-clamp-2 leading-relaxed italic">
              {job.description}
            </p>
          )}

          <div className="flex items-center justify-between border-t border-zinc-900/60 pt-3 mt-4">
            <span className="text-[10px] text-zinc-600 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Added: {job?.created_at ? new Date(job.created_at).toLocaleDateString() : 'Just now'}
            </span>

            <div className="flex items-center gap-3">
              {job?.url && (
                <a 
                  href={job.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1.5 transition-colors mr-2"
                >
                  <span>View link</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
              
              <button 
                onClick={() => onEdit(job)}
                className="p-1.5 text-zinc-500 hover:text-blue-400 hover:bg-blue-950/20 rounded-md transition-colors"
                title="Edit job posting"
              >
                <Edit className="w-3.5 h-3.5" />
              </button>

              <button 
                onClick={() => onDelete(job?.id)}
                className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-950/20 rounded-md transition-colors"
                title="Delete job posting"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
