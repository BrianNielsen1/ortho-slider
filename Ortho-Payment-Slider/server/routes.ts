import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // === Treatments ===
  app.get(api.treatments.list.path, async (req, res) => {
    const items = await storage.getTreatments();
    res.json(items);
  });

  app.get(api.treatments.get.path, async (req, res) => {
    const item = await storage.getTreatment(Number(req.params.id));
    if (!item) {
      return res.status(404).json({ message: 'Treatment not found' });
    }
    res.json(item);
  });

  // === Payment Plans ===
  app.post(api.paymentPlans.create.path, async (req, res) => {
    try {
      const input = api.paymentPlans.create.input.parse(req.body);
      const plan = await storage.createPaymentPlan(input);
      res.status(201).json(plan);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.get(api.paymentPlans.list.path, async (req, res) => {
    const plans = await storage.getPaymentPlans();
    res.json(plans);
  });

  return httpServer;
}
