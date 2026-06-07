'use client';

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Header from './components/Header';
import Notification from './components/Notification';
import JobForm from './components/JobForm';
import JobFeed from './components/JobFeed';
import AuthScreen from './components/AuthScreen';
import { loadSession, logout } from './store/authSlice';
import { fetchJobs, publishJob, updateJob, deleteJob } from './store/jobsSlice';
import { setModalOpen, triggerNotification, setEditingJob } from './store/uiSlice';
import { Loader2 } from 'lucide-react';

export default function AdminDashboard() {
  const dispatch = useDispatch();

  // Select states from Redux Store
  const session = useSelector(state => state.auth.session);
  const checkingAuth = useSelector(state => state.auth.checkingAuth);

  const jobs = useSelector(state => state.jobs.jobs);
  const loading = useSelector(state => state.jobs.loading);
  const apiStatus = useSelector(state => state.jobs.apiStatus);
  const submitting = useSelector(state => state.jobs.submitting);

  const isModalOpen = useSelector(state => state.ui.isModalOpen);
  const editingJob = useSelector(state => state.ui.editingJob);
  const notification = useSelector(state => state.ui.notification);

  // Check auth session on load
  useEffect(() => {
    dispatch(loadSession());
  }, [dispatch]);

  // Fetch jobs once authenticated
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
  };

  const handleEditJob = (job) => {
    dispatch(setEditingJob(job));
  };

  const handleDeleteJob = (jobId) => {
    dispatch(deleteJob(jobId));
  };

  const handleSignOut = () => {
    dispatch(logout());
    dispatch(triggerNotification('success', 'Signed out successfully.'));
  };

  // Loading view while parsing cookies/localStorage
  if (checkingAuth) {
    return (
      <main className="min-h-screen bg-zinc-950 flex flex-col justify-center items-center gap-4 text-zinc-400">
        <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
        <p className="text-sm">Verifying administrator session...</p>
      </main>
    );
  }

  // Redirect to Auth Screen if no active session exists
  if (!session) {
    return <AuthScreen />;
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-violet-600/30 selection:text-violet-300 antialiased relative overflow-x-hidden">
      
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-violet-600/5 rounded-full blur-[120px] pointer-events-none" />

      <Header 
        apiStatus={apiStatus} 
        onRefresh={() => dispatch(fetchJobs())} 
        loading={loading} 
        user={session.user}
        onSignOut={handleSignOut}
        onCreateListingClick={() => dispatch(setModalOpen(true))}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col gap-6 w-full z-10">
        <Notification notification={notification} />

        <section className="flex-1 flex flex-col">
          <JobFeed 
            jobs={jobs} 
            loading={loading} 
            onEdit={handleEditJob}
            onDelete={handleDeleteJob} 
          />
        </section>
      </div>

      {/* Modal Overlay for Job Creation / Editing */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div 
            className="absolute inset-0 cursor-default" 
            onClick={() => dispatch(setModalOpen(false))} 
          />
          <div className="w-full max-w-2xl relative animate-in zoom-in-95 duration-200 z-10 max-h-[90vh] overflow-y-auto animate-out zoom-out-95">
            <JobForm 
              onSubmit={handlePublishJob} 
              submitting={submitting} 
              onClose={() => dispatch(setModalOpen(false))}
              initialData={editingJob}
            />
          </div>
        </div>
      )}
    </main>
  );
}
