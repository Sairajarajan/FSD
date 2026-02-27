import { Link } from "react-router-dom";
import { formatSalary } from "../../utils/helpers";

export default function JobDetails({ job }) {
  return (
    <article className="card">
      <h2>{job.title}</h2>
      <p className="muted">{job.company}</p>
      <p>{job.location} | {job.type}</p>
      <p>{formatSalary(job.salaryMin, job.salaryMax)}</p>
      <p>{job.description}</p>
      <Link to={`/apply/${job.id}`} className="primary-link">
        Apply Now
      </Link>
    </article>
  );
}
