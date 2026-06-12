import { cleanJobField, cleanJobSkills } from './cleanJobField';
import { filterRecentJobs } from './filterRecentJobs';

export const mapAiSearchJob = (row = {}) => {
  const job = {
    id: row.id,
    title: cleanJobField(row.title),
    url: cleanJobField(row.url),
    source: cleanJobField(row.platform || row.source),
    platform: cleanJobField(row.platform || row.source),
    createdAt: row.createdAt || row.created_at || null,
    roleSearched: row.roleSearched || row.role_searched || '',
    skillsSearched: row.skillsSearched || row.skills_searched || '',
    experienceSearched: row.experienceSearched ?? row.experience_searched ?? 0,
    locationSearched: row.locationSearched || row.location_searched || '',
  };

  const company = cleanJobField(row.company);
  const location = cleanJobField(row.location);
  const salary = cleanJobField(row.salary);
  const description = cleanJobField(row.description);
  const postedTime = cleanJobField(row.postedTime || row.posted_time);
  const skillsRequired = cleanJobSkills(row.skillsRequired || row.skills_required);

  if (company) job.company = company;
  if (location) job.location = location;
  if (salary) job.salary = salary;
  if (description) job.description = description;
  if (postedTime) job.postedTime = postedTime;
  if (row.posted_at || row.postedAt) job.postedAt = row.posted_at || row.postedAt;
  if (skillsRequired.length) job.skillsRequired = skillsRequired;

  if (row.minExperienceYears !== undefined && row.minExperienceYears !== null) {
    job.minExperienceYears = row.minExperienceYears;
  } else if (row.min_experience_years !== undefined && row.min_experience_years !== null) {
    job.minExperienceYears = row.min_experience_years;
  }

  return job;
};

export const mapAiSearchResponse = (result = {}) => {
  const jobs = filterRecentJobs(
    (result.jobs || []).map(mapAiSearchJob).filter((job) => job.title && job.url)
  );

  return {
    jobs,
    byPlatform: Object.fromEntries(
      Object.entries(result.byPlatform || {}).map(([platform, platformJobs]) => [
        platform,
        filterRecentJobs(platformJobs.map(mapAiSearchJob).filter((job) => job.title && job.url)),
      ])
    ),
  };
};
