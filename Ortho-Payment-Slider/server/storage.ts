import { db } from "./db";
import { eq } from "drizzle-orm";
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
    const results = await db.select().from(treatments).where(eq(treatments.id, id));
    return results[0];
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
