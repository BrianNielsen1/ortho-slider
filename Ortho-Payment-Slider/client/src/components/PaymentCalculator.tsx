import { useState, useEffect } from "react";
import { type Treatment, type InsertPaymentPlan } from "@shared/schema";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useCreatePaymentPlan } from "@/hooks/use-payment-plans";
import { Loader2, Send, DollarSign, Calendar, CreditCard } from "lucide-react";
import { motion } from "framer-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PaymentCalculatorProps {
  treatment: Treatment;
  metalBracesCost: number;
  onMetalBracesCostChange: (cost: number) => void;
}

export function PaymentCalculator({ treatment, metalBracesCost, onMetalBracesCostChange }: PaymentCalculatorProps) {
  const [arches, setArches] = useState(2);
  
  // Calculate total cost based on treatment type and arches
  const calculateCost = () => {
    const base = metalBracesCost;
    switch (treatment.type) {
      case 'metal':
        return base;
      case 'ceramic':
        return base + (arches === 1 ? 500 : 1000);
      case 'in-house':
        return base + (arches === 1 ? 500 : 1000);
      case 'angel':
        return base + 1139;
      default:
        return parseFloat(treatment.totalCost);
    }
  };

  const totalCost = calculateCost();
  const minDown = 300;
  const maxMonths = treatment.maxMonths;

  // State
  const [downPayment, setDownPayment] = useState(minDown);
  const [months, setMonths] = useState(maxMonths);
  const [patientName, setPatientName] = useState("");
  const [patientAge, setPatientAge] = useState<number | "">("");

  const createPlan = useCreatePaymentPlan();

  // Derived values
  const financedAmount = totalCost - downPayment;
  const monthlyPayment = financedAmount / months;

  // Effects
  useEffect(() => {
    setDownPayment(300);
    setMonths(treatment.maxMonths);
  }, [treatment, totalCost]);

  // Handlers
  const handleDownPaymentChange = (value: number[]) => {
    setDownPayment(value[0]);
  };

  const handleMonthsChange = (value: number[]) => {
    setMonths(value[0]);
  };

  const handleMonthlyPaymentChange = (value: number[]) => {
    const val = value[0];
    if (val > 0) {
      const newMonths = Math.round(financedAmount / val);
      if (newMonths >= 1 && newMonths <= maxMonths) {
        setMonths(newMonths);
      }
    }
  };

  const handleSubmit = () => {
    if (!patientName.trim()) return;
    
    const plan: InsertPaymentPlan = {
      patientName,
      patientAge: patientAge === "" ? null : patientAge,
      treatmentId: treatment.id,
      totalCost: totalCost.toString(),
      downPayment: downPayment.toString(),
      monthlyPayment: monthlyPayment.toFixed(2),
      months,
      arches,
    };
    
    createPlan.mutate(plan);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      {/* Box 2: Customize Your Plan */}
      <Card className="overflow-hidden border-0 bg-primary text-white shadow-2xl lg:col-span-8">
        <div className="relative p-8 md:p-12">
          {/* Background decoration */}
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-secondary/10 blur-3xl" />

          <div className="relative z-10">
            <h2 className="mb-2 text-2xl font-bold tracking-tight text-white/90">
              Customize Your Plan
            </h2>
            <p className="mb-10 text-accent/80">
              Find a payment that fits your budget by adjusting the sliders.
            </p>

            <div className="grid gap-8 sm:grid-cols-2">
              {/* Item 1: Case Fee */}
              <div className="rounded-xl bg-white/10 p-6 backdrop-blur-sm border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-white/10">
                    <CreditCard className="h-5 w-5 text-accent" />
                  </div>
                  <Label className="text-lg font-semibold text-white">Case Fee</Label>
                </div>
                {treatment.type === 'metal' ? (
                  <div className="space-y-4">
                    <Input 
                      type="number"
                      value={metalBracesCost}
                      onChange={(e) => onMetalBracesCostChange(parseFloat(e.target.value) || 0)}
                      className="bg-white/10 border-white/20 text-white h-12 text-xl font-bold"
                    />
                    <p className="text-sm text-accent/60">Total treatment cost</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-3xl font-bold text-white">${totalCost.toLocaleString()}</div>
                    {(treatment.type === 'ceramic' || treatment.type === 'in-house') && (
                      <Select value={arches.toString()} onValueChange={(v) => setArches(parseInt(v))}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white h-10">
                          <SelectValue placeholder="Select arches" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">One Arch</SelectItem>
                          <SelectItem value="2">Two Arches</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                )}
              </div>

              {/* Item 2: Down Payment */}
              <div className="rounded-xl bg-white/10 p-6 backdrop-blur-sm border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-white/10">
                    <DollarSign className="h-5 w-5 text-accent" />
                  </div>
                  <Label className="text-lg font-semibold text-white">Down Payment</Label>
                </div>
                <div className="space-y-6">
                  <Input 
                    type="number"
                    value={downPayment}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      setDownPayment(Math.max(0, Math.min(totalCost, val)));
                    }}
                    className="bg-white/10 border-white/20 text-white h-12 text-3xl font-bold p-0 border-0 focus-visible:ring-0"
                  />
                  <Slider
                    value={[downPayment]}
                    min={minDown}
                    max={totalCost * 0.8}
                    step={50}
                    onValueChange={handleDownPaymentChange}
                    className="slider-root"
                  />
                  <div className="flex justify-between text-xs text-accent/40 font-bold uppercase tracking-wider">
                    <span>Min: ${minDown}</span>
                    <span>Max: ${Math.round(totalCost * 0.8)}</span>
                  </div>
                </div>
              </div>

              {/* Item 3: Monthly Payment */}
              <div className="rounded-xl bg-white/10 p-6 backdrop-blur-sm border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-white/10">
                    <Calendar className="h-5 w-5 text-accent" />
                  </div>
                  <Label className="text-lg font-semibold text-white">Monthly Payment</Label>
                </div>
                <div className="space-y-6">
                  <Input 
                    type="number"
                    value={Math.round(monthlyPayment)}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      if (val > 0) {
                        const newMonths = Math.round(financedAmount / val);
                        if (newMonths >= 1 && newMonths <= maxMonths) {
                          setMonths(newMonths);
                        }
                      }
                    }}
                    className="bg-white/10 border-white/20 text-white h-12 text-3xl font-bold p-0 border-0 focus-visible:ring-0"
                  />
                  <Slider
                    value={[Math.round(monthlyPayment)]}
                    min={Math.round(financedAmount / maxMonths)}
                    max={Math.round(financedAmount / 1)}
                    step={10}
                    onValueChange={handleMonthlyPaymentChange}
                    className="slider-root"
                  />
                </div>
              </div>

              {/* Item 4: Term (months) */}
              <div className="rounded-xl bg-white/10 p-6 backdrop-blur-sm border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-white/10">
                    <Calendar className="h-5 w-5 text-accent" />
                  </div>
                  <Label className="text-lg font-semibold text-white">Term (months)</Label>
                </div>
                <div className="space-y-6">
                  <Input 
                    type="number"
                    value={months}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      setMonths(Math.max(1, Math.min(maxMonths, val)));
                    }}
                    className="bg-white/10 border-white/20 text-white h-12 text-3xl font-bold p-0 border-0 focus-visible:ring-0"
                  />
                  <Slider
                    value={[months]}
                    min={1}
                    max={maxMonths}
                    step={1}
                    onValueChange={handleMonthsChange}
                    className="slider-root"
                  />
                  <div className="flex justify-between text-xs text-accent/40 font-bold uppercase tracking-wider">
                    <span>1 Month</span>
                    <span>{maxMonths} Months</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/10 bg-black/20 px-8 py-4 md:px-12">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-secondary" />
              <span className="text-sm font-medium text-accent">0% APR Interest</span>
            </div>
            <div className="text-right">
              <span className="mr-2 text-sm text-accent/60">Total Treatment Cost:</span>
              <span className="text-lg font-bold text-white">${totalCost.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex flex-col gap-6 lg:col-span-4">
        <Card className="flex flex-col justify-between p-6 shadow-lg border-t-4 border-t-primary h-full">
          <div>
            <h3 className="mb-6 text-xl font-bold text-slate-800">Plan Summary</h3>
            
            <div className="space-y-4 rounded-xl bg-slate-50 p-4 mb-8">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-sm text-slate-500">Treatment</span>
                <span className="font-medium text-slate-900">{treatment.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Down Payment</span>
                <span className="font-medium text-slate-900">${downPayment.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Monthly</span>
                <span className="font-medium text-primary">${monthlyPayment.toFixed(2)} /mo</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2">
                <span className="text-sm text-slate-500">Term Length</span>
                <span className="font-medium text-slate-900">{months} Months</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Patient Name</Label>
                <Input
                  id="name"
                  placeholder="Enter full name"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Patient Age</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Age"
                  value={patientAge}
                  onChange={(e) => setPatientAge(e.target.value === "" ? "" : parseInt(e.target.value))}
                  className="bg-white"
                />
              </div>
            </div>
          </div>

          <Button 
            className="mt-8 w-full bg-primary hover:bg-primary/90 h-12 text-lg shadow-lg shadow-primary/25"
            onClick={handleSubmit}
            disabled={!patientName.trim() || createPlan.isPending}
          >
            {createPlan.isPending ? (
              <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Saving...</>
            ) : (
              <>Save & Start Plan <Send className="ml-2 h-5 w-5" /></>
            )}
          </Button>
        </Card>
      </div>
    </div>
  );
}
