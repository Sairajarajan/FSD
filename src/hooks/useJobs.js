import { useContext } from "react";
import { JobContext } from "../context/JobContext";

export function useJobs() {
  return useContext(JobContext);
}
