import { PaymentMethod } from '@/types/product';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface PaymentMethodCardProps {
  method: PaymentMethod;
  isSelected: boolean;
  onSelect: (method: PaymentMethod) => void;
}

export function PaymentMethodCard({
  method,
  isSelected,
  onSelect,
}: PaymentMethodCardProps) {
  return (
    <button
      onClick={() => onSelect(method)}
      className={cn(
        "w-full p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-4",
        isSelected
          ? "border-primary bg-primary/5 shadow-soft"
          : "border-border bg-card hover:border-primary/50 hover:bg-secondary/50"
      )}
    >
      <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center text-2xl">
        {method.icon}
      </div>
      
      <div className="flex-1 text-left">
        <h4 className="font-semibold text-foreground">{method.name}</h4>
        <p className="text-sm text-muted-foreground capitalize">{method.type}</p>
      </div>
      
      {isSelected && (
        <div className="w-6 h-6 rounded-full gradient-primary flex items-center justify-center">
          <Check className="w-4 h-4 text-primary-foreground" />
        </div>
      )}
    </button>
  );
}
