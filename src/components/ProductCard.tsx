import { useState } from 'react';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Plus, BarChart3, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ProductLocation } from '@/components/ProductLocation';
import { PriceComparison } from '@/components/PriceComparison';
import { NutritionPanel } from '@/components/NutritionPanel';

type ViewMode = 'default' | 'comparison' | 'nutrition';

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
  isAdding?: boolean;
  isOnShoppingList?: boolean;
}

export function ProductCard({ product, onAdd, isAdding, isOnShoppingList }: ProductCardProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('default');

  if (viewMode === 'comparison') {
    return <PriceComparison product={product} onClose={() => setViewMode('default')} />;
  }

  if (viewMode === 'nutrition') {
    return <NutritionPanel product={product} onClose={() => setViewMode('default')} />;
  }

  return (
    <div 
      className={cn(
        "glass rounded-2xl p-4 border border-border/50 shadow-card transition-all duration-300 hover:shadow-medium hover:scale-[1.02]",
        isAdding && "animate-cart-bounce ring-2 ring-primary",
        isOnShoppingList && "ring-2 ring-accent"
      )}
    >
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16 rounded-xl bg-secondary flex items-center justify-center text-4xl">
          {product.image}
          {isOnShoppingList && (
            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full gradient-accent flex items-center justify-center">
              <Heart className="w-3 h-3 text-accent-foreground" />
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground truncate">{product.name}</h3>
            {isOnShoppingList && (
              <span className="text-xs bg-accent/20 text-accent px-1.5 py-0.5 rounded">
                On List
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{product.category}</p>
          <p className="text-lg font-bold text-primary mt-1">
            RM {product.price.toFixed(2)}
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setViewMode('nutrition')}
            className="h-7 w-7"
            title="Nutrition info"
          >
            <Heart className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setViewMode('comparison')}
            className="h-7 w-7"
            title="Compare prices"
          >
            <BarChart3 className="w-3 h-3" />
          </Button>
          <Button
            variant="default"
            size="icon"
            onClick={() => onAdd(product)}
            className="shrink-0 h-8 w-8"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <ProductLocation product={product} />
    </div>
  );
}
