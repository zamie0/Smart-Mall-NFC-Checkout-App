import { X, RefreshCw, ShoppingCart, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAIInsights } from '@/hooks/useAIInsights';
import { products } from '@/data/products';

interface RefillRemindersPanelProps {
  onClose: () => void;
  onAddToCart: (productId: string) => void;
  showCloseButton?: boolean;
}

export function RefillRemindersPanel({ onClose, onAddToCart, showCloseButton = true }: RefillRemindersPanelProps) {
  const { refillReminders, dismissReminder } = useAIInsights();

  const formatDaysLeft = (estimatedRunOut: number) => {
    const daysLeft = Math.max(0, Math.floor((estimatedRunOut - Date.now()) / (1000 * 60 * 60 * 24)));
    if (daysLeft === 0) return 'Running out today!';
    if (daysLeft === 1) return 'Running out tomorrow';
    return `${daysLeft} days left`;
  };

  const getUrgencyColor = (estimatedRunOut: number) => {
    const daysLeft = Math.floor((estimatedRunOut - Date.now()) / (1000 * 60 * 60 * 24));
    if (daysLeft <= 1) return 'bg-destructive/10 border-destructive/20';
    if (daysLeft <= 2) return 'bg-amber-500/10 border-amber-500/20';
    return 'bg-secondary border-border';
  };

  return (
    <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Smart Refill</h3>
          {refillReminders.length > 0 && (
            <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
              {refillReminders.length}
            </span>
          )}
        </div>
        {showCloseButton && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      <div className="p-4 space-y-2 max-h-80 overflow-y-auto">
        {refillReminders.length > 0 ? (
          refillReminders.map((reminder) => {
            const product = products.find((p) => p.id === reminder.productId);
            return (
              <div
                key={reminder.productId}
                className={`p-3 rounded-lg border ${getUrgencyColor(reminder.estimatedRunOutDate)}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{product?.image}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm truncate">
                      {reminder.productName}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                      <Clock className="w-3 h-3" />
                      {formatDaysLeft(reminder.estimatedRunOutDate)}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      className="h-8"
                      onClick={() => {
                        if (product) onAddToCart(product.id);
                      }}
                    >
                      <ShoppingCart className="w-3 h-3 mr-1" />
                      Add
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2"
                      onClick={() => dismissReminder(reminder.productId)}
                    >
                      ✕
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8">
            <RefreshCw className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              No refill reminders yet! We'll track your purchases and remind you when items might be running low.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
