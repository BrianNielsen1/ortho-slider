import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import type { InsertPaymentPlan } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function usePaymentPlans() {
  return useQuery({
    queryKey: [api.paymentPlans.list.path],
    queryFn: async () => {
      const res = await fetch(api.paymentPlans.list.path);
      if (!res.ok) throw new Error("Failed to fetch payment plans");
      return api.paymentPlans.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreatePaymentPlan() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (plan: InsertPaymentPlan) => {
      const res = await fetch(api.paymentPlans.create.path, {
        method: api.paymentPlans.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(plan),
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = await res.json();
          throw new Error(error.message || "Validation failed");
        }
        throw new Error("Failed to create payment plan");
      }

      return api.paymentPlans.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.paymentPlans.list.path] });
      toast({
        title: "Success!",
        description: "Your payment plan has been saved.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
