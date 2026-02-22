import { storage } from "../server/storage";

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
      totalCost: "5780.00",
      minDownPayment: "300.00",
      maxMonths: 22,
      interestRate: "0",
      type: "ceramic",
      imageUrl: "https://images.unsplash.com/photo-1588776813677-77aa57e616da?q=80&w=600&auto=format&fit=crop"
    });

    await storage.createTreatment({
      name: "Angel Aligner",
      description: "Advanced clear aligner system for precise results.",
      totalCost: "6419.00",
      minDownPayment: "300.00",
      maxMonths: 18,
      interestRate: "0",
      type: "angel",
      imageUrl: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?q=80&w=600&auto=format&fit=crop"
    });

    await storage.createTreatment({
      name: "In-House Aligners",
      description: "Cost-effective clear aligner solution made in our office.",
      totalCost: "5780.00",
      minDownPayment: "300.00",
      maxMonths: 12,
      interestRate: "0",
      type: "in-house",
      imageUrl: "https://images.unsplash.com/photo-1593054992451-22920268759d?q=80&w=600&auto=format&fit=crop"
    });
    
    console.log("Seeding complete.");
  } else {
    console.log("Database already seeded.");
  }
}

seedDatabase()
  .then(() => {
    console.log("Finished seeding.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Error seeding database:", err);
    process.exit(1);
  });
