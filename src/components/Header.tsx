import { useNavigate } from 'react-router-dom';
import { ShoppingCart, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
  isCartOpen: boolean;
}

export function Header({ cartCount, onCartClick, isCartOpen }: HeaderProps) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleProfileClick = () => {
    if (isAuthenticated) {
      navigate('/profile');
    } else {
      navigate('/auth');
    }
  };

  return (
    <header className="sticky top-0 z-50 glass border-b border-border/50">
      <div className="container flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">S</span>
          </div>
          <div>
            <h1 className="font-bold text-foreground text-lg leading-none">SmartMall</h1>
            <p className="text-xs text-muted-foreground">NFC Checkout</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn("relative", isAuthenticated && "text-primary")}
            onClick={handleProfileClick}
          >
            <User className="w-5 h-5" />
          </Button>
          
          <Button
            variant={isCartOpen ? 'default' : 'glass'}
            size="icon"
            onClick={onCartClick}
            className="relative"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className={cn(
                "absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center",
                isCartOpen 
                  ? "bg-primary-foreground text-primary" 
                  : "gradient-accent text-accent-foreground"
              )}>
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
