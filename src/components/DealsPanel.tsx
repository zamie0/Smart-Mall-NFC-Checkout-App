import { X, Tag, Clock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAIInsights } from '@/hooks/useAIInsights';
import { products } from '@/data/products';
import { cn } from '@/lib/utils';

interface DealsPanelProps {
  onClose: () => void;
  onAddToCart: (productId: string) => void;
  showCloseButton?: boolean;
}

export function DealsPanel({ onClose, onAddToCart, showCloseButton = true }: DealsPanelProps) {
  const { deals, dismissDeal, priceAlerts, dismissPriceAlert } = useAIInsights();

  const formatTimeLeft = (expiresAt: number) => {
    const hoursLeft = Math.max(0, Math.floor((expiresAt - Date.now()) / (1000 * 60 * 60)));
    if (hoursLeft >= 24) {
      return `${Math.floor(hoursLeft / 24)}d left`;
    }
    return `${hoursLeft}h left`;
  };

  return (
    <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-accent" />
          <h3 className="font-semibold text-foreground">Personalized Deals</h3>
        </div>
        {showCloseButton && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      <div className="p-4 space-y-4 max-h-80 overflow-y-auto">
        {/* Price Alerts */}
        {priceAlerts.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
              <Tag className="w-4 h-4 text-green-500" />
              Price Drops
            </h4>
            {priceAlerts.map((alert) => {
              const product = products.find((p) => p.id === alert.productId);
              return (
                <div
                  key={alert.productId}
                  className="p-3 rounded-lg bg-green-500/10 border border-green-500/20"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{product?.image}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-sm truncate">
                        {alert.productName}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs line-through text-muted-foreground">
                          RM {alert.oldPrice.toFixed(2)}
                        </span>
                        <span className="text-sm font-bold text-green-500">
                          RM {alert.newPrice.toFixed(2)}
                        </span>
                        <span className="text-xs bg-green-500 text-white px-1.5 py-0.5 rounded">
                          -{alert.discount}%
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Button
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => {
                          if (product) onAddToCart(product.id);
                          dismissPriceAlert(alert.productId);
                        }}
                      >
                        Add
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => dismissPriceAlert(alert.productId)}
                      >
                        Dismiss
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Personalized Deals */}
        {deals.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent" />
              Just For You
            </h4>
            {deals.map((deal) => {
              const product = products.find((p) => p.id === deal.productId);
              if (!product) return null;

              return (
                <div
                  key={deal.id}
                  className="p-3 rounded-lg bg-accent/10 border border-accent/20"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{product.image}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-sm truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-muted-foreground">{deal.reason}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs line-through text-muted-foreground">
                          RM {product.price.toFixed(2)}
                        </span>
                        <span className="text-sm font-bold text-accent">
                          RM {(product.price * (1 - deal.discount / 100)).toFixed(2)}
                        </span>
                        <span className="text-xs bg-accent text-accent-foreground px-1.5 py-0.5 rounded">
                          -{deal.discount}%
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTimeLeft(deal.expiresAt)}
                      </span>
                      <Button
                        size="sm"
                        variant="accent"
                        className="h-7 text-xs"
                        onClick={() => {
                          onAddToCart(product.id);
                          dismissDeal(deal.id);
                        }}
                      >
                        Claim
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {deals.length === 0 && priceAlerts.length === 0 && (
          <div className="text-center py-8">
            <Sparkles className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              No deals yet! Keep shopping to unlock personalized offers.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
