import { useState } from 'react';
import { CartItem, PaymentMethod } from '@/types/product';
import { paymentMethods } from '@/data/products';
import { PaymentMethodCard } from './PaymentMethodCard';
import { Receipt } from './Receipt';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, Lock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface CheckoutFlowProps {
  items: CartItem[];
  total: number;
  onBack: () => void;
  onComplete: () => void;
}

type CheckoutStep = 'payment' | 'processing' | 'complete';

export function CheckoutFlow({ items, total, onBack, onComplete }: CheckoutFlowProps) {
  const [step, setStep] = useState<CheckoutStep>('payment');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [transactionId, setTransactionId] = useState('');
  const { addPurchase, isAuthenticated } = useAuth();

  const tax = total * 0.06;
  const grandTotal = total + tax;

  const handlePay = () => {
    if (!selectedMethod) return;
    
    setStep('processing');
    
    // Simulate payment processing
    setTimeout(() => {
      const txId = `TXN${Date.now().toString(36).toUpperCase()}`;
      setTransactionId(txId);
      
      // Save purchase history if authenticated
      if (isAuthenticated) {
        addPurchase({
          items: items.map(item => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
          total: grandTotal,
          qrCode: txId,
        });
      }
      
      setStep('complete');
    }, 2000);
  };

  if (step === 'complete') {
    return (
      <Receipt
        items={items}
        total={total}
        transactionId={transactionId}
        paymentMethod={selectedMethod?.name || 'Unknown'}
        onDone={onComplete}
      />
    );
  }

  if (step === 'processing') {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-scale-in">
        <div className="w-24 h-24 rounded-full gradient-primary flex items-center justify-center mb-6">
          <Loader2 className="w-12 h-12 text-primary-foreground animate-spin" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Processing Payment</h2>
        <p className="text-muted-foreground mt-2">Please wait...</p>
        <div className="flex items-center gap-2 mt-6 text-sm text-muted-foreground">
          <Lock className="w-4 h-4" />
          <span>Secured by SmartMall</span>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-slide-up">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="text-xl font-bold text-foreground">Checkout</h2>
      </div>

      {/* Order Summary */}
      <div className="bg-card rounded-2xl border border-border p-4 shadow-card mb-6">
        <h3 className="font-semibold text-foreground mb-3">Order Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">{items.length} items</span>
            <span className="text-foreground">RM {total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tax (6%)</span>
            <span className="text-foreground">RM {tax.toFixed(2)}</span>
          </div>
          <div className="border-t border-border pt-2 flex justify-between font-bold">
            <span className="text-foreground">Total</span>
            <span className="text-primary">RM {grandTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="mb-6">
        <h3 className="font-semibold text-foreground mb-3">Payment Method</h3>
        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <PaymentMethodCard
              key={method.id}
              method={method}
              isSelected={selectedMethod?.id === method.id}
              onSelect={setSelectedMethod}
            />
          ))}
        </div>
      </div>

      {/* Pay Button */}
      <Button
        variant="default"
        size="lg"
        className="w-full"
        disabled={!selectedMethod}
        onClick={handlePay}
      >
        <Lock className="w-4 h-4 mr-2" />
        Pay RM {grandTotal.toFixed(2)}
      </Button>

      <p className="text-center text-xs text-muted-foreground mt-4 flex items-center justify-center gap-1">
        <Lock className="w-3 h-3" />
        Your payment is secured and encrypted
      </p>
    </div>
  );
}
