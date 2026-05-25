import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchComplaints, fetchComplaint, updateComplaintStatus } from "../lib/api";

export function useComplaints(params) {
  return useQuery({
    queryKey: ["complaints", params],
    queryFn: () => fetchComplaints(params),
    placeholderData: (prev) => prev,
  });
}

export function useComplaint(id) {
  return useQuery({
    queryKey: ["complaint", id],
    queryFn: () => fetchComplaint(id),
    enabled: !!id,
  });
}

export function useUpdateStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) => updateComplaintStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["complaints"] });
    },
  });
}
