import { createContext, useCallback, useEffect, useState } from "react";
import { fetchJobs } from "../services/api";

export const JobContext = createContext(null);

export function JobProvider({ children }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await fetchJobs();
      setJobs(data);
    } catch (err) {
      setError(err.message || "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  return (
    <JobContext.Provider value={{ jobs, loading, error, reloadJobs: loadJobs, setJobs }}>
      {children}
    </JobContext.Provider>
  );
}
