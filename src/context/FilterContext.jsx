import { createContext, useMemo, useState } from "react";

export const FilterContext = createContext(null);

export function FilterProvider({ children }) {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");

  const value = useMemo(
    () => ({
      search,
      setSearch,
      location,
      setLocation,
      jobType,
      setJobType,
      clearFilters: () => {
        setSearch("");
        setLocation("");
        setJobType("");
      },
    }),
    [search, location, jobType]
  );

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
}
