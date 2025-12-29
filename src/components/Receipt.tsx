import { CartItem } from '@/types/product';
import { QRCodeSVG } from 'qrcode.react';
import { CheckCircle2, Download, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ReceiptProps {
  items: CartItem[];
  total: number;
  transactionId: string;
  paymentMethod: string;
  onDone: () => void;
}

export function Receipt({
  items,
  total,
  transactionId,
  paymentMethod,
  onDone,
}: ReceiptProps) {
  const tax = total * 0.06;
  const grandTotal = total + tax;
  const timestamp = new Date().toLocaleString('en-MY', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return (
    <div className="animate-scale-in">
      {/* Success Header */}
      <div className="text-center mb-6">
        <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-12 h-12 text-success" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Payment Successful!</h2>
        <p className="text-muted-foreground mt-1">Thank you for shopping with us</p>
      </div>

      {/* Receipt Card */}
      <div className="bg-card rounded-2xl border border-border p-6 shadow-card">
        <div className="text-center mb-4">
          <h3 className="text-lg font-bold text-foreground">SmartMall</h3>
          <p className="text-sm text-muted-foreground">{timestamp}</p>
          <p className="text-xs text-muted-foreground mt-1">#{transactionId}</p>
        </div>

        <div className="border-t border-dashed border-border my-4" />

        {/* Items */}
        <div className="space-y-2 mb-4">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-foreground">
                {item.name} x{item.quantity}
              </span>
              <span className="text-foreground font-medium">
                RM {(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <div className="border-t border-dashed border-border my-4" />

        {/* Totals */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="text-foreground">RM {total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tax (6%)</span>
            <span className="text-foreground">RM {tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold">
            <span className="text-foreground">Total Paid</span>
            <span className="text-primary">RM {grandTotal.toFixed(2)}</span>
          </div>
        </div>

        <div className="border-t border-dashed border-border my-4" />

        <div className="text-center text-sm text-muted-foreground">
          <p>Paid via {paymentMethod}</p>
        </div>
      </div>

      {/* Exit QR Code */}
      <div className="mt-6 bg-card rounded-2xl border border-border p-6 shadow-card text-center">
        <h4 className="font-semibold text-foreground mb-4">Exit QR Code</h4>
        <div className="inline-block p-4 bg-background rounded-xl">
          <QRCodeSVG
            value={`SMARTMALL-EXIT-${transactionId}`}
            size={160}
            level="H"
            includeMargin
          />
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          Show this QR code at the exit gate
        </p>
      </div>

      {/* Actions */}
      <div className="mt-6 flex gap-3">
        <Button variant="secondary" className="flex-1">
          <Download className="w-4 h-4 mr-2" />
          Save Receipt
        </Button>
        <Button variant="secondary" className="flex-1">
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
      </div>

      <Button
        variant="default"
        size="lg"
        className="w-full mt-4"
        onClick={onDone}
      >
        Done
      </Button>
    </div>
  );
}
