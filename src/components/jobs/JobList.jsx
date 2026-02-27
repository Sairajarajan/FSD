import JobCard from "./JobCard";

export default function JobList({ jobs }) {
  if (!jobs.length) {
    return <p className="state-text">No jobs found.</p>;
  }

  return (
    <section className="grid">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </section>
  );
}
