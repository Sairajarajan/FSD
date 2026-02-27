import { useMemo } from "react";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorMessage from "../components/common/ErrorMessage";
import JobSearch from "../components/jobs/JobSearch";
import JobFilters from "../components/jobs/JobFilters";
import JobList from "../components/jobs/JobList";
import { useJobs } from "../hooks/useJobs";
import { useFilters } from "../hooks/useFilters";

export default function JobsPage() {
  const { jobs, loading, error } = useJobs();
  const { search, location, jobType } = useFilters();

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        job.title.toLowerCase().includes(q) ||
        job.company.toLowerCase().includes(q);

      const matchesLocation = !location || job.location === location;
      const matchesType = !jobType || job.type === jobType;

      return matchesSearch && matchesLocation && matchesType;
    });
  }, [jobs, search, location, jobType]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <section>
      <h1>Open Jobs</h1>
      <div className="filter-row">
        <JobSearch />
      </div>
      <JobFilters />
      <JobList jobs={filteredJobs} />
    </section>
  );
}
