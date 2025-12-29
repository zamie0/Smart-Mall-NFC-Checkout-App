import { MapPin, Navigation } from 'lucide-react';
import { Product } from '@/types/product';

interface ProductLocationProps {
  product: Product;
}

export function ProductLocation({ product }: ProductLocationProps) {
  if (!product.aisle && !product.location) return null;

  return (
    <div className="flex items-center gap-2 mt-2 p-2 bg-secondary/50 rounded-lg">
      <MapPin className="w-4 h-4 text-primary" />
      <div className="flex-1">
        <p className="text-xs font-medium text-foreground">
          {product.aisle && <span className="text-primary">Aisle {product.aisle}</span>}
          {product.aisle && product.location && ' • '}
          {product.location}
        </p>
      </div>
      <Navigation className="w-4 h-4 text-muted-foreground" />
    </div>
  );
}
