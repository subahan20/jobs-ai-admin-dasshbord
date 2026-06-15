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
    employment_type: 'Full-time',
    category: 'Engineering',
    remote_on_site: 'Remote',
    publish_state: 'Published',
    status: 'Active'
  });

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
        employment_type: initialData.employment_type || 'Full-time',
        category: initialData.category || 'Engineering',
        remote_on_site: initialData.remote_on_site || 'Remote',
        publish_state: initialData.publish_state || 'Published',
        status: initialData.status || 'Active'
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
        employment_type: 'Full-time',
        category: 'Engineering',
        remote_on_site: 'Remote',
        publish_state: 'Published',
        status: 'Active'
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
          employment_type: 'Full-time',
          category: 'Engineering',
          remote_on_site: 'Remote',
          publish_state: 'Published',
          status: 'Active'
        });
      }
    });
  };

  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-8 shadow-sm flex flex-col gap-6 relative w-full max-w-4xl mx-auto">
      
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 p-1.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors z-10"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      <div className="pr-8 border-b border-zinc-100 pb-4">
        <h2 className="text-xl font-black flex items-center gap-2 text-zinc-900 tracking-tight">
          {initialData ? 'Update Job Listing' : 'Post New Job Opening'}
        </h2>
        <p className="text-[13px] text-zinc-500 mt-1 font-medium">
          {initialData ? 'Modify the details of this active job listing.' : 'Enter details to add this listing directly to the database.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Row 1: Title, Company, Category */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="title" className="text-[12px] font-black text-zinc-600 uppercase tracking-wider">
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
              className="px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-[13px] text-zinc-900 placeholder-zinc-400 focus:border-[#008738] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#008738] transition-colors font-medium"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="company" className="text-[12px] font-black text-zinc-600 uppercase tracking-wider">
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
              className="px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-[13px] text-zinc-900 placeholder-zinc-400 focus:border-[#008738] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#008738] transition-colors font-medium"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="category" className="text-[12px] font-black text-zinc-600 uppercase tracking-wider">
              Category
            </label>
            <input
              type="text"
              id="category"
              name="category"
              placeholder="e.g. Engineering, Sales"
              value={formData.category}
              onChange={handleChange}
              className="px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-[13px] text-zinc-900 placeholder-zinc-400 focus:border-[#008738] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#008738] transition-colors font-medium"
            />
          </div>
        </div>

        {/* Row 2: Location, Remote, Salary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="location" className="text-[12px] font-black text-zinc-600 uppercase tracking-wider">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              placeholder="e.g. Bangalore"
              value={formData.location}
              onChange={handleChange}
              className="px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-[13px] text-zinc-900 placeholder-zinc-400 focus:border-[#008738] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#008738] transition-colors font-medium"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="remote_on_site" className="text-[12px] font-black text-zinc-600 uppercase tracking-wider">
              Work Setting
            </label>
            <select
              id="remote_on_site"
              name="remote_on_site"
              value={formData.remote_on_site}
              onChange={handleChange}
              className="px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-[13px] text-zinc-900 focus:border-[#008738] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#008738] transition-colors font-medium"
            >
              <option value="Remote">Remote</option>
              <option value="On-site">On-site</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="salary" className="text-[12px] font-black text-zinc-600 uppercase tracking-wider">
              Package
            </label>
            <input
              type="text"
              id="salary"
              name="salary"
              placeholder="e.g. $180k - $240k"
              value={formData.salary}
              onChange={handleChange}
              className="px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-[13px] text-zinc-900 placeholder-zinc-400 focus:border-[#008738] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#008738] transition-colors font-medium"
            />
          </div>
        </div>

        {/* Row 3: Employment Type, Seniority, Min Exp */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="employment_type" className="text-[12px] font-black text-zinc-600 uppercase tracking-wider">
              Employment Type
            </label>
            <select
              id="employment_type"
              name="employment_type"
              value={formData.employment_type}
              onChange={handleChange}
              className="px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-[13px] text-zinc-900 focus:border-[#008738] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#008738] transition-colors font-medium"
            >
              <option value="Full-time">Full-time</option>
              <option value="Contract">Contract</option>
              <option value="Part-time">Part-time</option>
              <option value="Internship">Internship</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="experience_level" className="text-[12px] font-black text-zinc-600 uppercase tracking-wider">
              Seniority
            </label>
            <select
              id="experience_level"
              name="experience_level"
              value={formData.experience_level}
              onChange={handleChange}
              className="px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-[13px] text-zinc-900 focus:border-[#008738] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#008738] transition-colors font-medium"
            >
              <option value="Junior">Junior</option>
              <option value="Mid">Mid</option>
              <option value="Senior">Senior</option>
              <option value="Lead">Lead</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="min_experience_years" className="text-[12px] font-black text-zinc-600 uppercase tracking-wider">
              Min Experience (Yrs)
            </label>
            <input
              type="number"
              id="min_experience_years"
              name="min_experience_years"
              min="0"
              max="30"
              value={formData.min_experience_years}
              onChange={handleChange}
              className="px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-[13px] text-zinc-900 focus:border-[#008738] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#008738] transition-colors font-medium"
            />
          </div>
        </div>

        {/* Row 4: Logo URL, App URL, Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="logo_url" className="text-[12px] font-black text-zinc-600 uppercase tracking-wider">
              Company Logo URL
            </label>
            <input
              type="url"
              id="logo_url"
              name="logo_url"
              placeholder="https://company.com/logo.png"
              value={formData.logo_url}
              onChange={handleChange}
              className="px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-[13px] text-zinc-900 placeholder-zinc-400 focus:border-[#008738] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#008738] transition-colors font-medium"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="url" className="text-[12px] font-black text-zinc-600 uppercase tracking-wider">
              Careers URL
            </label>
            <input
              type="url"
              id="url"
              name="url"
              placeholder="https://company.com/apply"
              value={formData.url}
              onChange={handleChange}
              className="px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-[13px] text-zinc-900 placeholder-zinc-400 focus:border-[#008738] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#008738] transition-colors font-medium"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="publish_state" className="text-[12px] font-black text-zinc-600 uppercase tracking-wider">
              Visibility
            </label>
            <select
              id="publish_state"
              name="publish_state"
              value={formData.publish_state}
              onChange={handleChange}
              className="px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-[13px] text-zinc-900 focus:border-[#008738] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#008738] transition-colors font-medium"
            >
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
            </select>
          </div>
        </div>

        {/* Row 5: Skills */}
        <div className="flex flex-col gap-2">
          <label htmlFor="skills_required" className="text-[12px] font-black text-zinc-600 uppercase tracking-wider">
            Required Skills (comma separated)
          </label>
          <input
            type="text"
            id="skills_required"
            name="skills_required"
            placeholder="e.g. React, Node.js, TypeScript"
            value={formData.skills_required}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-[13px] text-zinc-900 placeholder-zinc-400 focus:border-[#008738] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#008738] transition-colors font-medium"
          />
        </div>

        {/* Row 6: Description */}
        <div className="flex flex-col gap-2">
          <label htmlFor="description" className="text-[12px] font-black text-zinc-600 uppercase tracking-wider">
            Job Description
          </label>
          <textarea
            id="description"
            name="description"
            rows="5"
            placeholder="Specify key responsibilities, requirements, and information about the role..."
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-lg text-[13px] text-zinc-900 placeholder-zinc-400 focus:border-[#008738] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#008738] transition-colors resize-none font-medium leading-relaxed"
          />
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center justify-center gap-2 bg-[#008738] hover:bg-[#00702e] disabled:bg-[#008738]/50 disabled:cursor-not-allowed text-white font-bold rounded-lg px-8 py-3 shadow-sm shadow-[#008738]/20 transition-all text-[13px] cursor-pointer"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{initialData ? 'Saving Changes...' : 'Publishing...'}</span>
              </>
            ) : (
              <>
                {initialData ? <Sparkles className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                <span>{initialData ? 'Save Changes' : 'Post New Job'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
