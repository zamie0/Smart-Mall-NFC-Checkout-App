import { useState, useCallback, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { NFCScanner } from '@/components/NFCScanner';
import { ProductCard } from '@/components/ProductCard';
import { CartSummary } from '@/components/CartSummary';
import { CheckoutFlow } from '@/components/CheckoutFlow';
import { useCart } from '@/hooks/useCart';
import { useShoppingList } from '@/hooks/useShoppingList';
import { useBudget } from '@/hooks/useBudget';
import { useOfflineSync } from '@/hooks/useOfflineSync';
import { useAIInsights } from '@/hooks/useAIInsights';
import { products } from '@/data/products';
import { Product } from '@/types/product';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Smartphone, Grid3X3, ShoppingBag, WifiOff, Zap } from 'lucide-react';
import { toast } from 'sonner';

type AppView = 'shopping' | 'checkout';

const Index = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [lastAddedId, setLastAddedId] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [view, setView] = useState<AppView>('shopping');
  
  const { items, addItem, removeItem, updateQuantity, clearCart, total, itemCount } = useCart();
  const { markAsScanned, isOnList } = useShoppingList();
  const { checkBudget, addSpending } = useBudget();
  const { isOnline, pendingCount, addOfflineScan, syncScans } = useOfflineSync();
  const { recordPurchase, deals, refillReminders, priceAlerts } = useAIInsights();

  // Auto-detect quantity: track last scanned product and time
  const lastScanRef = useRef<{ productId: string; time: number } | null>(null);

  // Sync offline scans when coming back online
  useEffect(() => {
    if (isOnline && pendingCount > 0) {
      syncScans((productId) => {
        const product = products.find((p) => p.id === productId);
        if (product) {
          addItem(product);
        }
      });
    }
  }, [isOnline, pendingCount, syncScans, addItem]);

  const handleScan = useCallback(() => {
    setIsScanning(true);
    
    // Simulate NFC scan - randomly pick a product
    setTimeout(() => {
      const randomProduct = products[Math.floor(Math.random() * products.length)];
      
      // Auto-detect repeated scans (within 3 seconds = same product)
      const now = Date.now();
      if (
        lastScanRef.current &&
        lastScanRef.current.productId === randomProduct.id &&
        now - lastScanRef.current.time < 3000
      ) {
        // Same product scanned again quickly - just increase quantity
        const existingItem = items.find((i) => i.id === randomProduct.id);
        if (existingItem) {
          updateQuantity(randomProduct.id, existingItem.quantity + 1);
          toast.success(`${randomProduct.name} quantity increased`, {
            description: `Quantity: ${existingItem.quantity + 1}`,
          });
        }
      } else {
        // Check if online
        if (!isOnline) {
          addOfflineScan(randomProduct.id);
          toast.info(`${randomProduct.name} saved offline`, {
            description: 'Will sync when back online',
          });
        } else {
          addItem(randomProduct);
          
          // Check if item is on shopping list
          if (isOnList(randomProduct.id)) {
            markAsScanned(randomProduct.id);
            toast.success(`${randomProduct.name} checked off your list!`, {
              description: 'Item was on your shopping list',
            });
          }
          
          // Budget check
          const { warnings } = checkBudget(total + randomProduct.price);
          warnings.forEach((warning) => {
            toast.warning(warning);
          });
        }
      }
      
      lastScanRef.current = { productId: randomProduct.id, time: now };
      setLastAddedId(randomProduct.id);
      setIsScanning(false);
      
      setTimeout(() => setLastAddedId(null), 500);
    }, 1500);
  }, [addItem, items, updateQuantity, isOnList, markAsScanned, checkBudget, total, isOnline, addOfflineScan]);

  const handleAddProduct = useCallback((product: Product) => {
    setLastAddedId(product.id);
    
    if (!isOnline) {
      addOfflineScan(product.id);
      toast.info(`${product.name} saved offline`);
    } else {
      addItem(product);
      
      if (isOnList(product.id)) {
        markAsScanned(product.id);
        toast.success(`${product.name} checked off your list!`);
      }
      
      const { warnings } = checkBudget(total + product.price);
      warnings.forEach((warning) => {
        toast.warning(warning);
      });
    }
    
    setTimeout(() => setLastAddedId(null), 300);
  }, [addItem, isOnList, markAsScanned, checkBudget, total, isOnline, addOfflineScan]);

  const handleCheckout = () => {
    setView('checkout');
    setIsCartOpen(false);
  };

  const handleCheckoutComplete = () => {
    // Record purchase for AI insights
    const purchaseItems = items.map((item) => ({
      productId: item.id,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
    }));
    recordPurchase(purchaseItems, total);
    addSpending(total);
    clearCart();
    setView('shopping');
  };

  if (view === 'checkout') {
    return (
      <div className="min-h-screen gradient-hero">
        <Header 
          cartCount={itemCount} 
          onCartClick={() => {}} 
          isCartOpen={false}
        />
        <main className="container px-4 py-6 max-w-lg mx-auto">
          <CheckoutFlow
            items={items}
            total={total}
            onBack={() => setView('shopping')}
            onComplete={handleCheckoutComplete}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-hero">
      <Header 
        cartCount={itemCount} 
        onCartClick={() => setIsCartOpen(!isCartOpen)} 
        isCartOpen={isCartOpen}
      />

      <main className="container px-4 py-6 max-w-lg mx-auto pb-32">
        {/* Connectivity Status */}
        {!isOnline && (
          <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center gap-2">
            <WifiOff className="w-4 h-4 text-destructive" />
            <span className="text-sm text-destructive">
              Offline Mode - {pendingCount} scans pending sync
            </span>
          </div>
        )}

        {/* Smart Features Link */}
        <Link to="/smart">
          <Button variant="outline" size="sm" className="mb-4 relative">
            <Zap className="w-4 h-4 mr-1" />
            Smart Features
            {(deals.length + priceAlerts.length + refillReminders.length) > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-accent-foreground text-[10px] rounded-full flex items-center justify-center">
                {deals.length + priceAlerts.length + refillReminders.length}
              </span>
            )}
          </Button>
        </Link>

        {isCartOpen ? (
          <div className="animate-slide-up">
            <div className="flex items-center gap-2 mb-6">
              <ShoppingBag className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold text-foreground">Your Cart</h2>
              <span className="ml-auto text-sm text-muted-foreground">
                {itemCount} items
              </span>
            </div>
            <CartSummary
              items={items}
              total={total}
              onUpdateQuantity={updateQuantity}
              onRemove={removeItem}
              onCheckout={handleCheckout}
            />
          </div>
        ) : (
          <Tabs defaultValue="scan" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 h-12 p-1 bg-secondary rounded-xl">
              <TabsTrigger 
                value="scan" 
                className="rounded-lg data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-soft flex items-center gap-2"
              >
                <Smartphone className="w-4 h-4" />
                NFC Scan
              </TabsTrigger>
              <TabsTrigger 
                value="browse"
                className="rounded-lg data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-soft flex items-center gap-2"
              >
                <Grid3X3 className="w-4 h-4" />
                Browse
              </TabsTrigger>
            </TabsList>

            <TabsContent value="scan" className="mt-0">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-foreground">Quick Scan</h2>
                <p className="text-muted-foreground mt-2">
                  Tap your phone on product NFC tags
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Repeated taps auto-increase quantity
                </p>
              </div>
              
              <NFCScanner onScan={handleScan} isScanning={isScanning} />
              
              {items.length > 0 && (
                <div className="mt-8 p-4 bg-card rounded-2xl border border-border shadow-card">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Cart Total</p>
                      <p className="text-2xl font-bold text-primary">
                        RM {total.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">{itemCount} items</p>
                      <button 
                        onClick={() => setIsCartOpen(true)}
                        className="text-primary font-semibold text-sm hover:underline"
                      >
                        View Cart →
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="browse" className="mt-0">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-foreground">Products</h2>
                <p className="text-muted-foreground mt-1">
                  Tap to add • Shows aisle location & price comparison
                </p>
              </div>
              
              <div className="space-y-3">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAdd={handleAddProduct}
                    isAdding={lastAddedId === product.id}
                    isOnShoppingList={isOnList(product.id)}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </main>

      {/* Bottom Cart Bar (when cart has items and not viewing cart) */}
      {!isCartOpen && itemCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 glass border-t border-border/50 animate-slide-up">
          <div className="container max-w-lg mx-auto">
            <button
              onClick={() => setIsCartOpen(true)}
              className="w-full gradient-primary text-primary-foreground rounded-2xl p-4 flex items-center justify-between shadow-medium hover:brightness-110 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-foreground/20 rounded-xl flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <span className="font-semibold">{itemCount} items</span>
              </div>
              <span className="text-xl font-bold">RM {total.toFixed(2)}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
