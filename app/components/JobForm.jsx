'use client';

import React, { useState, useEffect } from 'react';
import { Loader2, X } from 'lucide-react';

const EMPTY_FORM = {
  title: '',
  company: '',
  url: '',
  salary: '',
  location: '',
  posted_date: new Date().toISOString().split('T')[0],
  min_experience_years: '2',
  experience_level: 'Mid',
  employment_type: 'Full-time',
  description: '',
  skills_required: '',
  logo_url: '',
  category: 'Engineering',
  remote_on_site: 'Remote',
  publish_state: 'Published',
  status: 'Active',
};

const inputCls =
  'w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-900 placeholder-zinc-400 focus:border-[#22c55e] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#22c55e]/30 transition-colors';

const labelCls = 'text-xs font-semibold text-zinc-600 block mb-1.5';

export default function JobForm({ onSubmit, submitting, onClose, initialData = null, showPageHeader = true }) {
  const [formData, setFormData] = useState(EMPTY_FORM);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        company: initialData.company || '',
        url: initialData.url || '',
        salary: initialData.salary || '',
        location: initialData.location || '',
        posted_date: initialData.created_at
          ? new Date(initialData.created_at).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        min_experience_years:
          initialData.min_experience_years !== undefined
            ? String(initialData.min_experience_years)
            : '2',
        experience_level: initialData.experience_level || 'Mid',
        employment_type: initialData.employment_type || 'Full-time',
        description: initialData.description || '',
        skills_required: initialData.skills_required
          ? Array.isArray(initialData.skills_required)
            ? initialData.skills_required.join(', ')
            : initialData.skills_required
          : '',
        logo_url: initialData.logo_url || '',
        category: initialData.category || 'Engineering',
        remote_on_site: initialData.remote_on_site || 'Remote',
        publish_state: initialData.publish_state || 'Published',
        status: initialData.status || 'Active',
      });
    } else {
      setFormData({ ...EMPTY_FORM, posted_date: new Date().toISOString().split('T')[0] });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClear = () => {
    setFormData({ ...EMPTY_FORM, posted_date: new Date().toISOString().split('T')[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData, initialData?.id || null, () => {
      if (!initialData) {
        setFormData({ ...EMPTY_FORM, posted_date: new Date().toISOString().split('T')[0] });
      }
    });
  };

  const isEdit = Boolean(initialData);

  return (
    <div className="w-full max-w-3xl mx-auto">
      {showPageHeader && !onClose && (
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-[28px] font-extrabold text-[#1a1c2e] tracking-tight">
            {isEdit ? 'Update Job Listing' : 'Post a New Opportunity'}
          </h2>
          <p className="text-sm text-zinc-500 mt-2 max-w-lg mx-auto leading-relaxed">
            {isEdit
              ? 'Modify the details of this active job listing.'
              : 'Fill in the details below to broadcast your job to thousands of verified candidates.'}
          </p>
        </div>
      )}

      <div className="bg-white border border-zinc-200/80 rounded-2xl shadow-sm relative">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors z-10"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col max-h-[calc(100dvh-14rem)]">
          <div className="overflow-y-auto auth-scroll-hidden px-8 py-8 flex flex-col gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="title" className={labelCls}>
                  Role / Position <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  placeholder="e.g. Senior Frontend Developer"
                  value={formData.title}
                  onChange={handleChange}
                  className={inputCls}
                />
              </div>
              <div>
                <label htmlFor="company" className={labelCls}>
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  required
                  placeholder="e.g. Google"
                  value={formData.company}
                  onChange={handleChange}
                  className={inputCls}
                />
              </div>
            </div>

            <div>
              <label htmlFor="url" className={labelCls}>
                Job Link (Application URL)
              </label>
              <div className="relative">
                <svg
                  className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <input
                  type="url"
                  id="url"
                  name="url"
                  placeholder="https://company.com/careers/apply"
                  value={formData.url}
                  onChange={handleChange}
                  className={`${inputCls} pl-10`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label htmlFor="salary" className={labelCls}>
                  Package (LPA)
                </label>
                <input
                  type="text"
                  id="salary"
                  name="salary"
                  placeholder="e.g. 12 - 18 LPA"
                  value={formData.salary}
                  onChange={handleChange}
                  className={inputCls}
                />
              </div>
              <div>
                <label htmlFor="location" className={labelCls}>
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  placeholder="e.g. Bangalore, India"
                  value={formData.location}
                  onChange={handleChange}
                  className={inputCls}
                />
              </div>
              <div>
                <label htmlFor="posted_date" className={labelCls}>
                  Posted Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id="posted_date"
                    name="posted_date"
                    value={formData.posted_date}
                    onChange={handleChange}
                    className={`${inputCls} pr-10`}
                  />
                  <svg
                    className="w-4 h-4 text-zinc-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="min_experience_years" className={labelCls}>
                  Experience Required
                </label>
                <select
                  id="min_experience_years"
                  name="min_experience_years"
                  value={formData.min_experience_years}
                  onChange={handleChange}
                  className={`${inputCls} appearance-none bg-[length:16px] bg-[right_12px_center] bg-no-repeat`}
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23a1a1aa'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                  }}
                >
                  <option value="0">Fresher (0 yrs)</option>
                  <option value="1">1+ years</option>
                  <option value="2">2+ years</option>
                  <option value="3">3+ years</option>
                  <option value="5">5+ years</option>
                  <option value="8">8+ years</option>
                </select>
              </div>
              <div>
                <label htmlFor="employment_type" className={labelCls}>
                  Job Type
                </label>
                <select
                  id="employment_type"
                  name="employment_type"
                  value={formData.employment_type}
                  onChange={handleChange}
                  className={inputCls}
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23a1a1aa'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 12px center',
                    backgroundSize: '16px',
                    appearance: 'none',
                  }}
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="description" className={labelCls}>
                Job Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={5}
                placeholder="Specify key responsibilities, requirements, and information about the role..."
                value={formData.description}
                onChange={handleChange}
                className={`${inputCls} resize-none leading-relaxed`}
              />
            </div>
          </div>

          <div className="px-8 py-5 border-t border-zinc-100 flex items-center justify-between shrink-0 bg-white rounded-b-2xl">
            {!isEdit && (
              <button
                type="button"
                onClick={handleClear}
                className="text-sm font-semibold text-zinc-500 hover:text-zinc-800 transition-colors"
              >
                Clear Form
              </button>
            )}
            {isEdit && <span />}

            <button
              type="submit"
              disabled={submitting}
              className="flex items-center justify-center gap-2 bg-[#22c55e] hover:bg-[#16a34a] disabled:opacity-60 text-white font-bold rounded-lg px-6 py-2.5 shadow-md shadow-[#22c55e]/20 transition-all text-sm ml-auto"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{isEdit ? 'Saving...' : 'Publishing...'}</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  <span>{isEdit ? 'Save Changes' : 'Post Job'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
