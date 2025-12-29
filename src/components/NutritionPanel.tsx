import { X, Leaf, AlertTriangle, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product, NutritionInfo } from '@/types/product';
import { cn } from '@/lib/utils';

interface NutritionPanelProps {
  product: Product;
  onClose: () => void;
}

export function NutritionPanel({ product, onClose }: NutritionPanelProps) {
  const nutrition = product.nutrition;

  if (!nutrition) {
    return (
      <div className="bg-card rounded-2xl border border-border shadow-card p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Nutrition Info</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground text-center py-4">
          Nutrition information not available for this product.
        </p>
      </div>
    );
  }

  const getNutrientLevel = (value: number, type: 'sugar' | 'fat' | 'fiber' | 'protein') => {
    const thresholds = {
      sugar: { low: 5, high: 15 },
      fat: { low: 3, high: 17 },
      fiber: { low: 1.5, high: 6 },
      protein: { low: 5, high: 15 },
    };

    const t = thresholds[type];
    if (value <= t.low) return type === 'fiber' || type === 'protein' ? 'low' : 'good';
    if (value >= t.high) return type === 'fiber' || type === 'protein' ? 'good' : 'high';
    return 'medium';
  };

  const levelColors = {
    good: 'text-green-500 bg-green-500/10',
    medium: 'text-amber-500 bg-amber-500/10',
    low: 'text-amber-500 bg-amber-500/10',
    high: 'text-red-500 bg-red-500/10',
  };

  return (
    <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{product.image}</span>
          <div>
            <h3 className="font-semibold text-foreground">{product.name}</h3>
            <p className="text-xs text-muted-foreground">Nutrition & Health Info</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="p-4 space-y-4">
        {/* Dietary Badges */}
        <div className="flex flex-wrap gap-2">
          {nutrition.isHalal && (
            <span className="px-2 py-1 text-xs rounded-full bg-green-500/10 text-green-500 border border-green-500/20 flex items-center gap-1">
              <Check className="w-3 h-3" /> Halal
            </span>
          )}
          {nutrition.isVegan && (
            <span className="px-2 py-1 text-xs rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-1">
              <Leaf className="w-3 h-3" /> Vegan
            </span>
          )}
          {nutrition.isGlutenFree && (
            <span className="px-2 py-1 text-xs rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20 flex items-center gap-1">
              <Check className="w-3 h-3" /> Gluten-Free
            </span>
          )}
        </div>

        {/* Allergens Warning */}
        {nutrition.allergens.length > 0 && (
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
            <div className="flex items-center gap-2 text-destructive mb-1">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-medium">Contains Allergens</span>
            </div>
            <p className="text-xs text-destructive/80">
              {nutrition.allergens.join(', ')}
            </p>
          </div>
        )}

        {/* Nutrition Facts */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground">Nutrition Facts (per serving)</h4>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 rounded-lg bg-secondary text-center">
              <p className="text-xl font-bold text-foreground">{nutrition.calories}</p>
              <p className="text-xs text-muted-foreground">Calories</p>
            </div>
            <div className={cn("p-2 rounded-lg text-center", levelColors[getNutrientLevel(nutrition.protein, 'protein')])}>
              <p className="text-xl font-bold">{nutrition.protein}g</p>
              <p className="text-xs">Protein</p>
            </div>
          </div>

          <div className="space-y-1">
            {[
              { label: 'Sugar', value: nutrition.sugar, unit: 'g', type: 'sugar' as const },
              { label: 'Fat', value: nutrition.fat, unit: 'g', type: 'fat' as const },
              { label: 'Fiber', value: nutrition.fiber, unit: 'g', type: 'fiber' as const },
            ].map((item) => {
              const level = getNutrientLevel(item.value, item.type);
              return (
                <div key={item.label} className="flex items-center justify-between p-2 rounded-lg bg-secondary">
                  <span className="text-sm text-foreground">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{item.value}{item.unit}</span>
                    <span className={cn("text-xs px-1.5 py-0.5 rounded", levelColors[level])}>
                      {level === 'good' ? '✓ Good' : level === 'high' ? '⚠ High' : 'Mod'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Health Tip */}
        <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
          <p className="text-xs font-medium text-primary mb-1">💡 Health Tip</p>
          <p className="text-xs text-foreground">
            {nutrition.protein >= 10
              ? 'High in protein - great for muscle building!'
              : nutrition.fiber >= 3
              ? 'Good source of fiber - supports digestive health.'
              : nutrition.sugar <= 5
              ? 'Low in sugar - a healthier choice!'
              : 'Enjoy in moderation as part of a balanced diet.'}
          </p>
        </div>
      </div>
    </div>
  );
}
