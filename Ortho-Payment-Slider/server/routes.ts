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

  // === SEED DATA ===
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existingTreatments = await storage.getTreatments();
  if (existingTreatments.length === 0) {
    console.log("Seeding database with default treatments...");
    
    await storage.createTreatment({
      name: "Metal Braces",
      description: "Traditional reliable orthodontic treatment.",
      totalCost: "5280.00",
      minDownPayment: "300.00",
      maxMonths: 24,
      interestRate: "0",
      type: "metal",
      imageUrl: "https://images.unsplash.com/photo-1599612307525-4c6e93245452?q=80&w=600&auto=format&fit=crop"
    });

    await storage.createTreatment({
      name: "Ceramic Braces",
      description: "Tooth-colored brackets for a less visible option.",
      totalCost: "5780.00", // Will be calculated dynamically in frontend based on Metal
      minDownPayment: "300.00",
      maxMonths: 22,
      interestRate: "0",
      type: "ceramic",
      imageUrl: "https://images.unsplash.com/photo-1588776813677-77aa57e616da?q=80&w=600&auto=format&fit=crop"
    });

    await storage.createTreatment({
      name: "Angel Aligner",
      description: "Advanced clear aligner system for precise results.",
      totalCost: "6419.00", // Will be calculated dynamically
      minDownPayment: "300.00",
      maxMonths: 18,
      interestRate: "0",
      type: "angel",
      imageUrl: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?q=80&w=600&auto=format&fit=crop"
    });

    await storage.createTreatment({
      name: "In-House Aligners",
      description: "Cost-effective clear aligner solution made in our office.",
      totalCost: "5780.00", // Will be calculated dynamically
      minDownPayment: "300.00",
      maxMonths: 12,
      interestRate: "0",
      type: "in-house",
      imageUrl: "https://images.unsplash.com/photo-1593054992451-22920268759d?q=80&w=600&auto=format&fit=crop"
    });
    
    console.log("Seeding complete.");
  }
}
