import orgApi from "@/api/org-api";
import { useQuery } from "@tanstack/react-query";

function useGetOrgById(id: string) {
  return useQuery({
    queryKey: ["org", id],
    queryFn: () => orgApi.getOrgById(id),
    enabled: !!id,
  });
}

export default function useOrg() {
  const getOrgById = useGetOrgById;

  return {
    getOrgById,
  };
}
