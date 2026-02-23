
import { cn } from "@/lib/utils";
import { type Treatment } from "@shared/schema";
import { Check } from "lucide-react";

interface TreatmentCardProps {
  treatment: Treatment;
  isSelected: boolean;
  onClick: () => void;
}

export function TreatmentCard({ treatment, isSelected, onClick }: TreatmentCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "relative cursor-pointer overflow-hidden rounded-2xl border-2 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg",
        isSelected
          ? "border-primary bg-primary/5 shadow-xl shadow-primary/10"
          : "border-transparent bg-white shadow-md hover:border-primary/30"
      )}
    >
      {isSelected && (
        <div className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white">
          <Check className="h-4 w-4" />
        </div>
      )}
      
      <div className="p-6">
        <div className="mb-4 flex h-32 w-full items-center justify-center overflow-hidden rounded-lg bg-gray-100">
          {treatment.imageUrl ? (
            <img src={treatment.imageUrl} alt={treatment.name} className="h-full w-full object-cover" />
          ) : (
            <span className="text-5xl">{treatment.name.includes("Aligner") ? "✨" : "🦷"}</span>
          )}
        </div>
        
        <h3 className="mb-2 text-lg font-bold text-slate-900">{treatment.name}</h3>
        <p className="mb-4 text-sm text-slate-500 line-clamp-2">{treatment.description}</p>
        
        <div className="flex items-baseline gap-1">
          <span className="text-sm font-medium text-slate-400">Total:</span>
          <span className="text-xl font-bold text-primary">
            ${parseInt(treatment.totalCost).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
