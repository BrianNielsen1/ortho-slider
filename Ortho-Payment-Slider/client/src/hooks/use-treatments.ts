import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useTreatments() {
  return useQuery({
    queryKey: [api.treatments.list.path],
    queryFn: async () => {
      const res = await fetch(api.treatments.list.path);
      if (!res.ok) throw new Error("Failed to fetch treatments");
      return api.treatments.list.responses[200].parse(await res.json());
    },
  });
}

export function useTreatment(id: number) {
  return useQuery({
    queryKey: [api.treatments.get.path, id],
    enabled: !!id,
    queryFn: async () => {
      const res = await fetch(api.treatments.get.path.replace(':id', id.toString()));
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch treatment");
      return api.treatments.get.responses[200].parse(await res.json());
    },
  });
}
