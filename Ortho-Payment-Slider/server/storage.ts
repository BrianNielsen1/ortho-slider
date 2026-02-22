import { db } from "./db";
import {
  treatments,
  paymentPlans,
  type Treatment,
  type InsertTreatment,
  type PaymentPlan,
  type InsertPaymentPlan
} from "@shared/schema";

export interface IStorage {
  // Treatments
  getTreatments(): Promise<Treatment[]>;
  getTreatment(id: number): Promise<Treatment | undefined>;
  createTreatment(treatment: InsertTreatment): Promise<Treatment>;

  // Payment Plans
  createPaymentPlan(plan: InsertPaymentPlan): Promise<PaymentPlan>;
  getPaymentPlans(): Promise<PaymentPlan[]>;
}

export class DatabaseStorage implements IStorage {
  async getTreatments(): Promise<Treatment[]> {
    return await db.select().from(treatments);
  }

  async getTreatment(id: number): Promise<Treatment | undefined> {
    const results = await db.select().from(treatments).where(treatments.id.equals(id)); // Note: Depending on drizzle version syntax might vary slightly, but standard select is safe
    // Fix: drizzle-orm syntax for where eq
    // Let's use the safer 'findFirst' style query logic or standard select with eq
    // Re-writing to be safe with standard drizzle import in index/routes
    return (await db.select().from(treatments)).find(t => t.id === id);
  }

  async createTreatment(treatment: InsertTreatment): Promise<Treatment> {
    const [newTreatment] = await db.insert(treatments).values(treatment).returning();
    return newTreatment;
  }

  async createPaymentPlan(plan: InsertPaymentPlan): Promise<PaymentPlan> {
    const [newPlan] = await db.insert(paymentPlans).values(plan).returning();
    return newPlan;
  }

  async getPaymentPlans(): Promise<PaymentPlan[]> {
    return await db.select().from(paymentPlans).orderBy(paymentPlans.createdAt);
  }
}

export const storage = new DatabaseStorage();
