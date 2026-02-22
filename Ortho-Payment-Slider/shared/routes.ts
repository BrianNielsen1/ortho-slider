import { z } from 'zod';
import { insertPaymentPlanSchema, insertTreatmentSchema, treatments, paymentPlans } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  treatments: {
    list: {
      method: 'GET' as const,
      path: '/api/treatments' as const,
      responses: {
        200: z.array(z.custom<typeof treatments.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/treatments/:id' as const,
      responses: {
        200: z.custom<typeof treatments.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
  paymentPlans: {
    create: {
      method: 'POST' as const,
      path: '/api/payment-plans' as const,
      input: insertPaymentPlanSchema,
      responses: {
        201: z.custom<typeof paymentPlans.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    list: {
      method: 'GET' as const,
      path: '/api/payment-plans' as const,
      responses: {
        200: z.array(z.custom<typeof paymentPlans.$inferSelect>()),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
