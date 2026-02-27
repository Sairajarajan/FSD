import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorMessage from "../components/common/ErrorMessage";
import JobDetails from "../components/jobs/JobDetails";
import { fetchJobById } from "../services/api";

export default function JobDetailPage() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadJob = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await fetchJobById(id);
        setJob(data);
      } catch (err) {
        setError(err.message || "Failed to load job details");
      } finally {
        setLoading(false);
      }
    };

    loadJob();
  }, [id]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !job) {
    return <ErrorMessage message={error || "Job not found"} />;
  }

  return <JobDetails job={job} />;
}
