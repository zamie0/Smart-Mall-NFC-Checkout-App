import { CartItem as CartItemType } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2 } from 'lucide-react';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  return (
    <div className="glass rounded-xl p-4 border border-border/50 animate-slide-up">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center text-2xl">
          {item.image}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-foreground truncate">{item.name}</h4>
          <p className="text-sm text-muted-foreground">
            RM {item.price.toFixed(2)} each
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="icon-sm"
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
          >
            <Minus className="w-4 h-4" />
          </Button>
          
          <span className="w-8 text-center font-semibold text-foreground">
            {item.quantity}
          </span>
          
          <Button
            variant="secondary"
            size="icon-sm"
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="text-right ml-2">
          <p className="font-bold text-foreground">
            RM {(item.price * item.quantity).toFixed(2)}
          </p>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onRemove(item.id)}
            className="text-destructive hover:text-destructive hover:bg-destructive/10 mt-1"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
