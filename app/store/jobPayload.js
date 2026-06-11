const LOGO_THEMES = [
  'bg-indigo-600/30 text-indigo-200 border-indigo-500/30',
  'bg-blue-600/30 text-blue-200 border-blue-500/30',
  'bg-emerald-600/30 text-emerald-200 border-emerald-500/30',
  'bg-cyan-600/30 text-cyan-200 border-cyan-500/30',
  'bg-rose-600/30 text-rose-200 border-rose-500/30',
  'bg-amber-600/30 text-amber-200 border-amber-500/30',
];

const parseSkills = (skills) => {
  if (!skills) return [];
  if (Array.isArray(skills)) return skills.map((s) => s.trim()).filter(Boolean);
  return String(skills).split(',').map((s) => s.trim()).filter(Boolean);
};

export const buildJobPayload = (formData, { includeLogoColor = true } = {}) => {
  const minExp = parseInt(formData?.min_experience_years || '0', 10);

  const payload = {
    title: formData?.title?.trim(),
    company: formData?.company?.trim(),
    location: formData?.location?.trim() || 'Remote',
    salary: formData?.salary?.trim() || 'Not Disclosed',
    experience_level: formData?.experience_level || 'Mid',
    min_experience_years: minExp,
    skills_required: parseSkills(formData?.skills_required),
    logo_url: formData?.logo_url?.trim() || null,
    description: formData?.description?.trim() || 'No description provided.',
    url: formData?.url?.trim() || '',
    employment_type: formData?.employment_type || 'Full-time',
    category: formData?.category || 'Engineering',
    remote_on_site: formData?.remote_on_site || 'Remote',
    publish_state: formData?.publish_state || 'Published',
    status: formData?.status || 'Active',
  };

  if (formData?.posted_date) {
    const posted = new Date(formData.posted_date);
    if (!Number.isNaN(posted.getTime())) {
      payload.posted_at = posted.toISOString();
      payload.posted_time = posted.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }
  }

  if (includeLogoColor) {
    payload.logo_color = LOGO_THEMES[Math.floor(Math.random() * LOGO_THEMES.length)];
    payload.source = 'Admin Portal';
    if (!payload.posted_time) {
      payload.posted_time = 'Just now';
    }
    if (!payload.posted_at) {
      payload.posted_at = new Date().toISOString();
    }
  }

  return payload;
};
