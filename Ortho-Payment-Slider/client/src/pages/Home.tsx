import { useTreatments } from "@/hooks/use-treatments";
import { TreatmentCard } from "@/components/TreatmentCard";
import { PaymentCalculator } from "@/components/PaymentCalculator";
import { useState, useEffect } from "react";
import { type Treatment } from "@shared/schema";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, Loader2 } from "lucide-react";

export default function Home() {
  const { data: treatments, isLoading, error } = useTreatments();
  const [selectedTreatmentId, setSelectedTreatmentId] = useState<number | null>(null);
  const [metalBracesCost, setMetalBracesCost] = useState(5280);

  // Auto-select first treatment when loaded
  useEffect(() => {
    if (treatments && treatments.length > 0 && !selectedTreatmentId) {
      setSelectedTreatmentId(treatments[0].id);
    }
  }, [treatments, selectedTreatmentId]);

  const selectedTreatment = treatments?.find((t) => t.id === selectedTreatmentId);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-destructive">
        Error loading treatments. Please try again.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white font-bold text-xl shadow-lg shadow-primary/20">
              O
            </div>
            <span className="text-xl font-bold tracking-tight text-primary">Orem Orthodontics</span>
          </div>
          <div className="hidden sm:block text-sm font-semibold text-primary/60 uppercase tracking-wider">
            Treatment Calculator
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-bold text-primary mb-6"
          >
            <Calculator className="h-4 w-4" />
            Orem Orthodontics Treatment Calculator
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-7xl mb-8"
          >
            Your Smile, <span className="text-primary">Your Way</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto max-w-3xl text-xl text-slate-600 leading-relaxed font-medium"
          >
            Choose your treatment and customize a monthly payment plan that works for your budget. <span className="text-primary font-bold">0% interest financing</span> available for all patients who finish payments within the treatment time.
          </motion.p>
        </header>

        {/* Step 1: Treatment Selection */}
        <section className="mb-16">
          <div className="mb-8 flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-bold text-white shadow-md">
              1
            </div>
            <h2 className="text-3xl font-bold text-slate-900">Select Treatment Option</h2>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {treatments?.map((treatment, idx) => (
              <TreatmentCard
                key={treatment.id}
                treatment={treatment}
                isSelected={selectedTreatmentId === treatment.id}
                onSelect={() => setSelectedTreatmentId(treatment.id)}
                index={idx}
              />
            ))}
          </div>
        </section>

        {/* Step 2: Calculator */}
        <AnimatePresence mode="wait">
          {selectedTreatment && (
            <motion.section
              key={selectedTreatment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="mb-8 flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-bold text-white shadow-md">
                  2
                </div>
                <h2 className="text-3xl font-bold text-slate-900">Customize Your Payment Plan</h2>
              </div>
              
              <PaymentCalculator 
                treatment={selectedTreatment} 
                metalBracesCost={metalBracesCost}
                onMetalBracesCostChange={setMetalBracesCost}
              />
            </motion.section>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
