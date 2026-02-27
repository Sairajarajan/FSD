import { useMemo } from "react";
import { useFilters } from "../../hooks/useFilters";
import { useJobs } from "../../hooks/useJobs";
import { uniqueValues } from "../../utils/helpers";

export default function JobFilters() {
  const { jobs } = useJobs();
  const { location, setLocation, jobType, setJobType, clearFilters } = useFilters();

  const locations = useMemo(() => uniqueValues(jobs, "location"), [jobs]);
  const types = useMemo(() => uniqueValues(jobs, "type"), [jobs]);

  return (
    <div className="filter-row">
      <select value={location} onChange={(e) => setLocation(e.target.value)}>
        <option value="">All locations</option>
        {locations.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>

      <select value={jobType} onChange={(e) => setJobType(e.target.value)}>
        <option value="">All types</option>
        {types.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>

      <button type="button" onClick={clearFilters}>
        Reset
      </button>
    </div>
  );
}
