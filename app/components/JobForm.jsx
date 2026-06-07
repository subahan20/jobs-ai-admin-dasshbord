'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Plus, Loader2, X } from 'lucide-react';

export default function JobForm({ onSubmit, submitting, onClose, initialData = null }) {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
    experience_level: 'Mid',
    min_experience_years: '2',
    skills_required: '',
    logo_url: '',
    url: '',
    description: '',
  });

  // Sync form inputs with initialData if editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        company: initialData.company || '',
        location: initialData.location || '',
        salary: initialData.salary || '',
        experience_level: initialData.experience_level || 'Mid',
        min_experience_years: initialData.min_experience_years !== undefined ? String(initialData.min_experience_years) : '2',
        skills_required: initialData.skills_required 
          ? (Array.isArray(initialData.skills_required) ? initialData.skills_required.join(', ') : initialData.skills_required)
          : '',
        logo_url: initialData.logo_url || '',
        url: initialData.url || '',
        description: initialData.description || '',
      });
    } else {
      setFormData({
        title: '',
        company: '',
        location: '',
        salary: '',
        experience_level: 'Mid',
        min_experience_years: '2',
        skills_required: '',
        logo_url: '',
        url: '',
        description: '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData, initialData?.id || null, () => {
      // Reset form fields upon successful save only when creating new
      if (!initialData) {
        setFormData({
          title: '',
          company: '',
          location: '',
          salary: '',
          experience_level: 'Mid',
          min_experience_years: '2',
          skills_required: '',
          logo_url: '',
          url: '',
          description: '',
        });
      }
    });
  };

  return (
    <div className="bg-zinc-900/95 border border-zinc-800/80 rounded-xl p-7 backdrop-blur-md shadow-xl flex flex-col gap-5 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600" />
      
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/40 rounded-lg transition-colors z-10"
          title="Close Modal"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      <div className="pr-8">
        <h2 className="text-base font-bold flex items-center gap-2 text-zinc-100">
          <Sparkles className="w-4.5 h-4.5 text-violet-400" />
          {initialData ? 'Update Job Listing' : 'Publish New Job Opening'}
        </h2>
        <p className="text-xs text-zinc-500 mt-0.5">
          {initialData ? 'Modify the details of this active job listing.' : 'Enter details to add this listing directly to the database.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Row 1: Job Title & Company */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="title" className="text-xs font-semibold text-zinc-400">
              Job Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              placeholder="e.g. Senior Frontend Dev"
              value={formData.title}
              onChange={handleChange}
              className="px-3 py-2 bg-zinc-950/60 border border-zinc-800 rounded-lg text-xs text-zinc-100 placeholder-zinc-600 hover:border-zinc-700 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="company" className="text-xs font-semibold text-zinc-400">
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
              className="px-3 py-2 bg-zinc-950/60 border border-zinc-800 rounded-lg text-xs text-zinc-100 placeholder-zinc-600 hover:border-zinc-700 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-colors"
            />
          </div>
        </div>

        {/* Row 2: Location, Salary, Application Link */}
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="location" className="text-xs font-semibold text-zinc-400">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              placeholder="e.g. Bangalore"
              value={formData.location}
              onChange={handleChange}
              className="px-3 py-2 bg-zinc-950/60 border border-zinc-800 rounded-lg text-xs text-zinc-100 placeholder-zinc-600 hover:border-zinc-700 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="salary" className="text-xs font-semibold text-zinc-400">
              Salary Bracket
            </label>
            <input
              type="text"
              id="salary"
              name="salary"
              placeholder="e.g. ₹12L - ₹18L"
              value={formData.salary}
              onChange={handleChange}
              className="px-3 py-2 bg-zinc-950/60 border border-zinc-800 rounded-lg text-xs text-zinc-100 placeholder-zinc-600 hover:border-zinc-700 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="url" className="text-xs font-semibold text-zinc-400">
              Careers URL Link
            </label>
            <input
              type="url"
              id="url"
              name="url"
              placeholder="https://company.com/apply"
              value={formData.url}
              onChange={handleChange}
              className="px-3 py-2 bg-zinc-950/60 border border-zinc-800 rounded-lg text-xs text-zinc-100 placeholder-zinc-600 hover:border-zinc-700 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-colors"
            />
          </div>
        </div>

        {/* Row 3: Seniority, Min Experience, Company Logo */}
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="experience_level" className="text-xs font-semibold text-zinc-400">
              Seniority Level
            </label>
            <select
              id="experience_level"
              name="experience_level"
              value={formData.experience_level}
              onChange={handleChange}
              className="px-3 py-2 bg-zinc-950/60 border border-zinc-800 rounded-lg text-xs text-zinc-300 hover:border-zinc-700 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-colors bg-zinc-900"
            >
              <option value="Junior">Junior</option>
              <option value="Mid">Mid</option>
              <option value="Senior">Senior</option>
              <option value="Lead">Lead</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="min_experience_years" className="text-xs font-semibold text-zinc-400">
              Min Experience (Years)
            </label>
            <input
              type="number"
              id="min_experience_years"
              name="min_experience_years"
              min="0"
              max="30"
              value={formData.min_experience_years}
              onChange={handleChange}
              className="px-3 py-2 bg-zinc-950/60 border border-zinc-800 rounded-lg text-xs text-zinc-100 placeholder-zinc-600 hover:border-zinc-700 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="logo_url" className="text-xs font-semibold text-zinc-400">
              Company Logo URL
            </label>
            <input
              type="url"
              id="logo_url"
              name="logo_url"
              placeholder="https://company.com/logo.png"
              value={formData.logo_url}
              onChange={handleChange}
              className="px-3 py-2 bg-zinc-950/60 border border-zinc-800 rounded-lg text-xs text-zinc-100 placeholder-zinc-600 hover:border-zinc-700 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-colors"
            />
          </div>
        </div>

        {/* Row 4: Required Skills */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="skills_required" className="text-xs font-semibold text-zinc-400">
            Required Skills (comma separated)
          </label>
          <input
            type="text"
            id="skills_required"
            name="skills_required"
            placeholder="e.g. React, Node.js, TypeScript, PostgreSQL"
            value={formData.skills_required}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-zinc-950/60 border border-zinc-800 rounded-lg text-xs text-zinc-100 placeholder-zinc-600 hover:border-zinc-700 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-colors"
          />
        </div>

        {/* Row 5: Job Description */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="description" className="text-xs font-semibold text-zinc-400">
            Job Description
          </label>
          <textarea
            id="description"
            name="description"
            rows="3"
            placeholder="Specify key responsibilities, requirements, and information about the role..."
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2.5 bg-zinc-950/60 border border-zinc-800 rounded-lg text-xs text-zinc-100 placeholder-zinc-600 hover:border-zinc-700 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-colors resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-800/50 disabled:cursor-not-allowed text-white font-semibold rounded-lg px-4 py-2.5 shadow-lg shadow-violet-900/20 hover:shadow-violet-900/35 transition-all text-xs mt-2 cursor-pointer"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4.5 h-4.5 animate-spin" />
              <span>{initialData ? 'Saving Changes...' : 'Publishing...'}</span>
            </>
          ) : (
            <>
              {initialData ? (
                <Sparkles className="w-4.5 h-4.5" />
              ) : (
                <Plus className="w-4.5 h-4.5" />
              )}
              <span>{initialData ? 'Save Changes' : 'Publish Job Opening'}</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
