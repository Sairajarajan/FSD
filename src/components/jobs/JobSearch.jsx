import { useFilters } from "../../hooks/useFilters";

export default function JobSearch() {
  const { search, setSearch } = useFilters();

  return (
    <input
      type="search"
      placeholder="Search by title or company"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  );
}
