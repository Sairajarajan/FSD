import { Link } from "react-router-dom";

export default function ApplicationSuccess() {
  return (
    <section className="card">
      <h2>Application Submitted</h2>
      <p>Thank you for applying. We will contact you if your profile matches the role.</p>
      <Link to="/jobs" className="primary-link">
        Back to Jobs
      </Link>
    </section>
  );
}
