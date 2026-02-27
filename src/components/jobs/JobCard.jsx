import { Link } from "react-router-dom";
import { formatSalary } from "../../utils/helpers";

export default function JobCard({ job }) {
  return (
    <article className="card">
      <h3>{job.title}</h3>
      <p className="muted">{job.company}</p>
      <p>{job.location} | {job.type}</p>
      <p>{formatSalary(job.salaryMin, job.salaryMax)}</p>
      <Link to={`/jobs/${job.id}`} className="primary-link">
        View Details
      </Link>
    </article>
  );
}
