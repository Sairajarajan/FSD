export default function JobListAdmin({ jobs, onEdit, onDelete }) {
  return (
    <section className="card">
      <h3>Existing Jobs</h3>
      {!jobs.length ? <p className="state-text">No jobs yet.</p> : null}

      <ul className="admin-list">
        {jobs.map((job) => (
          <li key={job.id}>
            <div>
              <strong>{job.title}</strong>
              <p className="muted">{job.company} | {job.location}</p>
            </div>
            <div className="actions">
              <button type="button" onClick={() => onEdit(job)}>
                Edit
              </button>
              <button type="button" onClick={() => onDelete(job.id)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
