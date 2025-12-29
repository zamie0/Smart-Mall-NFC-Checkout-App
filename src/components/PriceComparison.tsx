import { X, TrendingDown, TrendingUp, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/types/product';
import { products } from '@/data/products';
import { cn } from '@/lib/utils';

interface PriceComparisonProps {
  product: Product;
  onClose: () => void;
}

export function PriceComparison({ product, onClose }: PriceComparisonProps) {
  const alternatives = product.alternatives
    ?.map((id) => products.find((p) => p.id === id))
    .filter(Boolean) as Product[];

  const bestPrice = product.nearbyPrices?.reduce(
    (min, p) => (p.price < min.price ? p : min),
    { store: 'Current', price: product.price }
  );

  const isBestHere = bestPrice?.store === 'Current';

  return (
    <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{product.image}</span>
          <div>
            <h3 className="font-semibold text-foreground">{product.name}</h3>
            <p className="text-sm text-muted-foreground">Price Comparison</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="p-4 space-y-4">
        {/* Current Price */}
        <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-primary">Current Store</p>
              <p className="text-lg font-bold text-foreground">RM {product.price.toFixed(2)}</p>
            </div>
            {isBestHere && (
              <span className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded-full">
                Best Price!
              </span>
            )}
          </div>
        </div>

        {/* Nearby Store Prices */}
        {product.nearbyPrices && product.nearbyPrices.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Nearby Stores</p>
            {product.nearbyPrices.map((store, index) => {
              const diff = store.price - product.price;
              const isLower = diff < 0;

              return (
                <div
                  key={index}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg",
                    isLower ? "bg-green-500/10" : "bg-secondary"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{store.store}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">RM {store.price.toFixed(2)}</span>
                    <span
                      className={cn(
                        "flex items-center text-xs",
                        isLower ? "text-green-500" : "text-destructive"
                      )}
                    >
                      {isLower ? (
                        <TrendingDown className="w-3 h-3 mr-0.5" />
                      ) : (
                        <TrendingUp className="w-3 h-3 mr-0.5" />
                      )}
                      {isLower ? '-' : '+'}RM {Math.abs(diff).toFixed(2)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Similar Products */}
        {alternatives && alternatives.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Similar Products</p>
            {alternatives.map((alt) => (
              <div
                key={alt.id}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary"
              >
                <div className="flex items-center gap-2">
                  <span>{alt.image}</span>
                  <span className="text-sm">{alt.name}</span>
                </div>
                <span className="font-semibold">RM {alt.price.toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
