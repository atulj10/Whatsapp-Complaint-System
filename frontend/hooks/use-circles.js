import { useQuery } from "@tanstack/react-query";
import { fetchCircles } from "../lib/api";

export function useCircles() {
  return useQuery({
    queryKey: ["circles"],
    queryFn: fetchCircles,
    staleTime: 5 * 60 * 1000,
  });
}
