export default function ApplicationListAdmin({ applications, loading, error }) {
  return (
    <section className="card">
      <h3>Submitted Applications</h3>

      {loading ? <p className="state-text">Loading applications...</p> : null}
      {error ? <p className="error-text">{error}</p> : null}
      {!loading && !error && !applications.length ? <p className="state-text">No applications submitted yet.</p> : null}

      <ul className="admin-list">
        {applications.map((application) => (
          <li key={application.id} className="application-item">
            <div>
              <strong>
                {application.name} - {application.jobTitle}
              </strong>
              <p className="muted">
                {application.email} | {application.phone}
              </p>
              <p className="muted">
                {application.company} | Applied: {application.appliedAt}
              </p>
              {application.resumeUrl ? (
                <p>
                  Resume:{" "}
                  <a href={application.resumeUrl} target="_blank" rel="noreferrer" className="primary-link">
                    Open Link
                  </a>
                </p>
              ) : null}
              <p className="cover-letter-text">{application.coverLetter}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
