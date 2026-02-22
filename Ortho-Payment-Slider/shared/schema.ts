import { pgTable, text, serial, integer, numeric, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===

// Base treatment types (e.g., "Metal Braces", "Invisalign", "Ceramic")
export const treatments = pgTable("treatments", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  totalCost: numeric("total_cost").notNull(), // Stored as decimal string
  minDownPayment: numeric("min_down_payment").notNull(),
  maxMonths: integer("max_months").notNull(),
  interestRate: numeric("interest_rate").default("0"),
  imageUrl: text("image_url"),
  type: text("type").notNull().default("other"), // 'metal', 'ceramic', 'in-house', 'angel'
});

// Saved payment plans created by users
export const paymentPlans = pgTable("payment_plans", {
  id: serial("id").primaryKey(),
  patientName: text("patient_name").notNull(),
  patientAge: integer("patient_age"),
  treatmentId: integer("treatment_id").notNull(),
  totalCost: numeric("total_cost").notNull(),
  downPayment: numeric("down_payment").notNull(),
  monthlyPayment: numeric("monthly_payment").notNull(),
  months: integer("months").notNull(),
  arches: integer("arches").default(2),
  createdAt: timestamp("created_at").defaultNow(),
});

// === SCHEMAS ===

export const insertTreatmentSchema = createInsertSchema(treatments).omit({ id: true });
export const insertPaymentPlanSchema = createInsertSchema(paymentPlans).omit({ id: true, createdAt: true });

// === TYPES ===

export type Treatment = typeof treatments.$inferSelect;
export type InsertTreatment = z.infer<typeof insertTreatmentSchema>;

export type PaymentPlan = typeof paymentPlans.$inferSelect;
export type InsertPaymentPlan = z.infer<typeof insertPaymentPlanSchema>;

// API Exchange Types
export type TreatmentResponse = Treatment;
export type PaymentPlanResponse = PaymentPlan;
