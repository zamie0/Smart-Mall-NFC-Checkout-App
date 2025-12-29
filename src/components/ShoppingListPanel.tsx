import { useState } from 'react';
import { Plus, Trash2, CheckCircle2, Circle, X, ListChecks } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useShoppingList } from '@/hooks/useShoppingList';
import { products } from '@/data/products';
import { cn } from '@/lib/utils';

interface ShoppingListPanelProps {
  onClose: () => void;
  showCloseButton?: boolean;
}

export function ShoppingListPanel({ onClose, showCloseButton = true }: ShoppingListPanelProps) {
  const [newItemName, setNewItemName] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { items, addItem, removeItem, toggleItem, clearChecked, clearAll } = useShoppingList();

  const filteredProducts = newItemName
    ? products.filter((p) =>
        p.name.toLowerCase().includes(newItemName.toLowerCase())
      )
    : [];

  const handleAddItem = (name: string, productId?: string) => {
    if (name.trim()) {
      addItem(name.trim(), productId);
      setNewItemName('');
      setShowSuggestions(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAddItem(newItemName);
  };

  return (
    <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <ListChecks className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Shopping List</h3>
          <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
            {items.filter((i) => !i.checked).length} remaining
          </span>
        </div>
        {showCloseButton && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      <div className="p-4">
        <form onSubmit={handleSubmit} className="relative mb-4">
          <div className="flex gap-2">
            <Input
              value={newItemName}
              onChange={(e) => {
                setNewItemName(e.target.value);
                setShowSuggestions(e.target.value.length > 0);
              }}
              placeholder="Add item to list..."
              className="flex-1"
            />
            <Button type="submit" size="icon" className="shrink-0">
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {showSuggestions && filteredProducts.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-10 max-h-40 overflow-y-auto">
              {filteredProducts.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => handleAddItem(product.name, product.id)}
                  className="w-full px-3 py-2 text-left hover:bg-secondary flex items-center gap-2"
                >
                  <span>{product.image}</span>
                  <span className="text-sm">{product.name}</span>
                  <span className="text-xs text-muted-foreground ml-auto">
                    RM {product.price.toFixed(2)}
                  </span>
                </button>
              ))}
            </div>
          )}
        </form>

        <div className="space-y-2 max-h-60 overflow-y-auto">
          {items.length === 0 ? (
            <p className="text-center text-muted-foreground py-8 text-sm">
              Your shopping list is empty
            </p>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg transition-all",
                  item.checked
                    ? "bg-secondary/50 opacity-60"
                    : "bg-secondary"
                )}
              >
                <button onClick={() => toggleItem(item.id)}>
                  {item.checked ? (
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  ) : (
                    <Circle className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>
                <span
                  className={cn(
                    "flex-1 text-sm",
                    item.checked && "line-through text-muted-foreground"
                  )}
                >
                  {item.name}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => removeItem(item.id)}
                >
                  <Trash2 className="w-4 h-4 text-muted-foreground" />
                </Button>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="flex gap-2 mt-4 pt-4 border-t border-border">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={clearChecked}
            >
              Clear Checked
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={clearAll}
            >
              Clear All
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
