export const filterRecentJobs = (jobs = []) => {
    const cutoff = new Date();
    cutoff.setHours(cutoff.getHours() - 24);
    
    return jobs.filter(job => {
        if (!job.postedAt && !job.createdAt) return true;
        const dateStr = job.postedAt || job.createdAt;
        const jobDate = new Date(dateStr);
        if (isNaN(jobDate.getTime())) return true;
        return jobDate >= cutoff;
    });
};
