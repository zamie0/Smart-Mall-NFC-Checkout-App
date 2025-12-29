import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingListPanel } from '@/components/ShoppingListPanel';
import { BudgetPanel } from '@/components/BudgetPanel';
import { SpendingInsightsPanel } from '@/components/SpendingInsightsPanel';
import { DealsPanel } from '@/components/DealsPanel';
import { RefillRemindersPanel } from '@/components/RefillRemindersPanel';
import { useAIInsights } from '@/hooks/useAIInsights';
import { useCart } from '@/hooks/useCart';
import { products } from '@/data/products';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, ListChecks, Wallet, TrendingUp, Sparkles, RefreshCw } from 'lucide-react';

const SmartFeatures = () => {
  const [activeTab, setActiveTab] = useState('list');
  const { deals, refillReminders, priceAlerts } = useAIInsights();
  const { total, addItem } = useCart();

  const handleAddToCart = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      addItem(product);
    }
  };

  return (
    <div className="min-h-screen gradient-hero">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border/50">
        <div className="container max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-foreground">Smart Features</h1>
        </div>
      </header>

      <main className="container px-4 py-6 max-w-lg mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6 h-14 p-1 bg-secondary rounded-xl">
            <TabsTrigger
              value="list"
              className="rounded-lg data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground flex flex-col items-center gap-0.5 text-xs py-2"
            >
              <ListChecks className="w-4 h-4" />
              List
            </TabsTrigger>
            <TabsTrigger
              value="budget"
              className="rounded-lg data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground flex flex-col items-center gap-0.5 text-xs py-2"
            >
              <Wallet className="w-4 h-4" />
              Budget
            </TabsTrigger>
            <TabsTrigger
              value="insights"
              className="rounded-lg data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground flex flex-col items-center gap-0.5 text-xs py-2"
            >
              <TrendingUp className="w-4 h-4" />
              Insights
            </TabsTrigger>
            <TabsTrigger
              value="deals"
              className="rounded-lg data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground flex flex-col items-center gap-0.5 text-xs py-2 relative"
            >
              <Sparkles className="w-4 h-4" />
              Deals
              {(deals.length + priceAlerts.length) > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-accent text-accent-foreground text-[10px] rounded-full flex items-center justify-center">
                  {deals.length + priceAlerts.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="refill"
              className="rounded-lg data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground flex flex-col items-center gap-0.5 text-xs py-2 relative"
            >
              <RefreshCw className="w-4 h-4" />
              Refill
              {refillReminders.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-destructive text-destructive-foreground text-[10px] rounded-full flex items-center justify-center">
                  {refillReminders.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="mt-0">
            <ShoppingListPanel onClose={() => {}} showCloseButton={false} />
          </TabsContent>

          <TabsContent value="budget" className="mt-0">
            <BudgetPanel onClose={() => {}} currentCartTotal={total} showCloseButton={false} />
          </TabsContent>

          <TabsContent value="insights" className="mt-0">
            <SpendingInsightsPanel onClose={() => {}} showCloseButton={false} />
          </TabsContent>

          <TabsContent value="deals" className="mt-0">
            <DealsPanel onClose={() => {}} onAddToCart={handleAddToCart} showCloseButton={false} />
          </TabsContent>

          <TabsContent value="refill" className="mt-0">
            <RefillRemindersPanel onClose={() => {}} onAddToCart={handleAddToCart} showCloseButton={false} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default SmartFeatures;
