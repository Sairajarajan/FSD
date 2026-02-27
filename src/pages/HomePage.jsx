import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <section className="card">
      <h1>Find Your Next Opportunity</h1>
      <p>Browse open roles, view job details, and submit your application in minutes.</p>
      <Link to="/jobs" className="primary-link">
        Browse Jobs
      </Link>
    </section>
  );
}
