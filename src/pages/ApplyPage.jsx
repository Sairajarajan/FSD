import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ApplicationForm from "../components/applications/ApplicationForm";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorMessage from "../components/common/ErrorMessage";
import { fetchJobById } from "../services/api";

export default function ApplyPage() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchJobById(id);
        setJob(data);
        setError("");
      } catch (err) {
        setError(err.message || "Failed to load job");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !job) {
    return <ErrorMessage message={error || "Job not found"} />;
  }

  return <ApplicationForm job={job} />;
}
