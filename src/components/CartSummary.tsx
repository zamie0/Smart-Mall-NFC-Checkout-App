import { CartItem as CartItemType } from '@/types/product';
import { CartItem } from './CartItem';
import { Button } from '@/components/ui/button';
import { ShoppingCart, CreditCard } from 'lucide-react';

interface CartSummaryProps {
  items: CartItemType[];
  total: number;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
}

export function CartSummary({
  items,
  total,
  onUpdateQuantity,
  onRemove,
  onCheckout,
}: CartSummaryProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-4">
          <ShoppingCart className="w-10 h-10 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">Your cart is empty</h3>
        <p className="text-muted-foreground mt-2 text-sm">
          Scan products to add them to your cart
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-3 pb-4">
        {items.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            onUpdateQuantity={onUpdateQuantity}
            onRemove={onRemove}
          />
        ))}
      </div>
      
      <div className="border-t border-border pt-4 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium text-foreground">RM {total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Tax (6%)</span>
          <span className="font-medium text-foreground">RM {(total * 0.06).toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center text-lg">
          <span className="font-semibold text-foreground">Total</span>
          <span className="font-bold text-primary">RM {(total * 1.06).toFixed(2)}</span>
        </div>
        
        <Button
          variant="default"
          size="lg"
          className="w-full"
          onClick={onCheckout}
        >
          <CreditCard className="w-5 h-5 mr-2" />
          Proceed to Checkout
        </Button>
      </div>
    </div>
  );
}
