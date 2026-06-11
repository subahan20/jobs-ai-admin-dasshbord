'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AuthScreen from './components/AuthScreen';
import Notification from './components/Notification';
import JobForm from './components/JobForm';
import AdminDashboardLayout from './components/AdminDashboardLayout';
import AdminStatCards from './components/AdminStatCards';
import AdminJobsTable from './components/AdminJobsTable';
import { loadSession, logout } from './store/authSlice';
import { fetchJobs, publishJob, updateJob, deleteJob } from './store/jobsSlice';
import { setModalOpen, triggerNotification, setEditingJob } from './store/uiSlice';
import { Loader2 } from 'lucide-react';

export default function AdminDashboard() {
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState('Upload Job');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const session = useSelector((state) => state.auth.session);
  const checkingAuth = useSelector((state) => state.auth.checkingAuth);
  const jobs = useSelector((state) => state.jobs.jobs);
  const loading = useSelector((state) => state.jobs.loading);
  const submitting = useSelector((state) => state.jobs.submitting);
  const isModalOpen = useSelector((state) => state.ui.isModalOpen);
  const editingJob = useSelector((state) => state.ui.editingJob);
  const notification = useSelector((state) => state.ui.notification);

  useEffect(() => {
    dispatch(loadSession());
  }, [dispatch]);

  useEffect(() => {
    if (session) {
      dispatch(fetchJobs());
    }
  }, [session, dispatch]);

  const handlePublishJob = (formData, jobId, resetFormCallback) => {
    if (jobId) {
      dispatch(updateJob({ jobId, formData, resetFormCallback }));
    } else {
      dispatch(publishJob({ formData, resetFormCallback }));
    }
    setActiveTab('All Posted Jobs');
  };

  const handleEditJob = (job) => {
    dispatch(setEditingJob(job));
    dispatch(setModalOpen(true));
  };

  const handleDeleteJob = (jobId) => {
    if (window.confirm('Are you sure you want to delete this job posting?')) {
      dispatch(deleteJob(jobId));
    }
  };

  const handleSignOut = () => {
    dispatch(logout());
    dispatch(triggerNotification('success', 'Signed out successfully.'));
  };

  const filteredJobs = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return jobs;

    return jobs.filter((job) => {
      const haystack = [job.title, job.company, job.location, job.description, job.status]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(query);
    });
  }, [jobs, searchTerm]);

  if (checkingAuth) {
    return (
      <main className="fixed inset-0 flex flex-col justify-center items-center gap-4 bg-[#f0eef8] text-zinc-500 font-sans overflow-hidden">
        <Loader2 className="w-8 h-8 animate-spin text-[#22c55e]" />
        <p className="text-[13px] font-bold">Verifying administrator session...</p>
      </main>
    );
  }

  if (!session) {
    return <AuthScreen />;
  }

  return (
    <AdminDashboardLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onLogout={handleSignOut}
      user={session.user}
    >
      <div className="w-full relative">
        <Notification notification={notification} />

        {activeTab === 'Upload Job' ? (
          <div className="flex items-start justify-center px-6 py-10 min-h-[calc(100vh-72px-3rem)]">
            <JobForm onSubmit={handlePublishJob} submitting={submitting} />
          </div>
        ) : (
          <div className="max-w-6xl mx-auto px-8 py-8 flex flex-col gap-6 w-full">
            <div>
              <h2 className="text-2xl font-extrabold text-[#1a1c2e] tracking-tight">All Posted Jobs</h2>
              <p className="text-sm text-zinc-500 mt-1">Manage and review every job listing on the portal.</p>
            </div>

            <AdminStatCards jobs={jobs} />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <svg
                  className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search jobs, companies..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-9 pr-4 py-2.5 border border-zinc-200 rounded-lg text-sm font-medium text-zinc-900 placeholder-zinc-400 focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e]/30 focus:outline-none transition-colors bg-white"
                />
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('Upload Job')}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#22c55e] text-white rounded-xl text-sm font-bold hover:bg-[#16a34a] transition-colors shadow-sm shrink-0"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Upload Job
              </button>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-[#22c55e]" />
                <span className="text-sm font-bold text-zinc-500">Loading your data...</span>
              </div>
            ) : (
              <AdminJobsTable
                jobs={filteredJobs}
                currentPage={currentPage}
                totalJobs={filteredJobs.length}
                jobsPerPage={10}
                onPageChange={setCurrentPage}
                onEdit={handleEditJob}
                onDelete={handleDeleteJob}
              />
            )}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#1a1c2e]/40 backdrop-blur-sm">
          <div
            className="absolute inset-0 cursor-default"
            onClick={() => {
              dispatch(setModalOpen(false));
              dispatch(setEditingJob(null));
            }}
          />
          <div className="w-full max-w-3xl relative z-10 max-h-[90vh] overflow-y-auto auth-scroll-hidden">
            <JobForm
              onSubmit={handlePublishJob}
              submitting={submitting}
              showPageHeader={false}
              onClose={() => {
                dispatch(setModalOpen(false));
                dispatch(setEditingJob(null));
              }}
              initialData={editingJob}
            />
          </div>
        </div>
      )}
    </AdminDashboardLayout>
  );
}
