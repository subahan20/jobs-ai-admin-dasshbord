import React from 'react';
import { Briefcase, Database, RefreshCw, LogOut, Plus } from 'lucide-react';

export default function Header({ apiStatus, onRefresh, loading, user, onSignOut, onCreateListingClick }) {
  return (
    <header className="border-b border-zinc-900 bg-zinc-950/60 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-lg shadow-lg shadow-violet-900/30">
            <Briefcase className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
              AI Job Sync
            </h1>
            <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">
              Admin Control Center
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Create Job Action Button */}
          {user && (
            <button 
              onClick={onCreateListingClick}
              className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-md shadow-violet-950/40 hover:shadow-violet-900/50 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Job</span>
            </button>
          )}

          {/* Active User Label */}
          {user && (
            <div className="hidden md:flex flex-col text-right">
              <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">Logged in as</span>
              <span className="text-xs text-zinc-300 font-medium truncate max-w-[150px]" title={user.email}>
                {user.email}
              </span>
            </div>
          )}

          {/* API indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/60 border border-zinc-800 text-xs">
            <Database className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden sm:inline">API:</span>
            <span className="flex items-center gap-1.5 font-medium">
              {apiStatus === 'connected' && (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-emerald-400">Connected</span>
                </>
              )}
              {apiStatus === 'connecting' && (
                <>
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  <span className="text-amber-400">Syncing</span>
                </>
              )}
              {apiStatus === 'error' && (
                <>
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-red-400">Offline</span>
                </>
              )}
            </span>
          </div>

          {/* Actions */}
          <button 
            onClick={onRefresh}
            className="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60 border border-zinc-800/80 rounded-lg transition-colors"
            title="Force Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          {/* Sign Out Button */}
          {user && (
            <button 
              onClick={onSignOut}
              className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-950/20 border border-zinc-800/80 hover:border-red-900/30 rounded-lg transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
