import { useEffect, useState } from "react";
import AdminLayout from "../components/admin/AdminLayout";
import JobForm from "../components/admin/JobForm";
import JobListAdmin from "../components/admin/JobListAdmin";
import ApplicationListAdmin from "../components/admin/ApplicationListAdmin";
import { useJobs } from "../hooks/useJobs";
import { createJob, deleteJob, fetchApplications, updateJob } from "../services/api";

export default function AdminPage() {
  const { jobs, reloadJobs } = useJobs();
  const [editingJob, setEditingJob] = useState(null);
  const [error, setError] = useState("");
  const [applications, setApplications] = useState([]);
  const [applicationsLoading, setApplicationsLoading] = useState(true);
  const [applicationsError, setApplicationsError] = useState("");

  useEffect(() => {
    const loadApplications = async () => {
      try {
        setApplicationsLoading(true);
        setApplicationsError("");
        const data = await fetchApplications();
        setApplications(data);
      } catch (err) {
        setApplicationsError(err.message || "Failed to load applications");
      } finally {
        setApplicationsLoading(false);
      }
    };

    loadApplications();
  }, []);

  const handleCreate = async (payload) => {
    try {
      setError("");
      await createJob(payload);
      await reloadJobs();
    } catch (err) {
      setError(err.message || "Failed to create job");
    }
  };

  const handleUpdate = async (payload) => {
    try {
      setError("");
      await updateJob(editingJob.id, payload);
      setEditingJob(null);
      await reloadJobs();
    } catch (err) {
      setError(err.message || "Failed to update job");
    }
  };

  const handleDelete = async (id) => {
    try {
      setError("");
      await deleteJob(id);
      await reloadJobs();
    } catch (err) {
      setError(err.message || "Failed to delete job");
    }
  };

  return (
    <AdminLayout>
      <h1>Admin Panel</h1>
      {error ? <p className="error-text">{error}</p> : null}

      <section className="grid grid-2">
        <div>
          <h2>{editingJob ? "Edit Job" : "Create Job"}</h2>
          <JobForm
            initialData={editingJob}
            onSubmit={editingJob ? handleUpdate : handleCreate}
            submitLabel={editingJob ? "Update Job" : "Create Job"}
            onCancel={editingJob ? () => setEditingJob(null) : undefined}
          />
        </div>
        <JobListAdmin jobs={jobs} onEdit={setEditingJob} onDelete={handleDelete} />
      </section>

      <section className="admin-applications">
        <ApplicationListAdmin applications={applications} loading={applicationsLoading} error={applicationsError} />
      </section>
    </AdminLayout>
  );
}
