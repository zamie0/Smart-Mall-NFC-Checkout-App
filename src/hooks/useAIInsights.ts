import { useState, useCallback, useEffect } from 'react';
import { SpendingRecord, Deal, RefillReminder, PriceAlert } from '@/types/product';
import { products } from '@/data/products';

const SPENDING_HISTORY_KEY = 'smartmall_spending_history';
const DEALS_KEY = 'smartmall_deals';
const REFILL_KEY = 'smartmall_refill_reminders';
const PRICE_ALERTS_KEY = 'smartmall_price_alerts';

// Simulated consumption days per product category
const CATEGORY_CONSUMPTION_DAYS: Record<string, number> = {
  'Fruits': 5,
  'Dairy': 7,
  'Bakery': 4,
  'Meat': 5,
  'Seafood': 3,
  'Beverages': 7,
  'Vegetables': 4,
};

export function useAIInsights() {
  const [spendingHistory, setSpendingHistory] = useState<SpendingRecord[]>(() => {
    const stored = localStorage.getItem(SPENDING_HISTORY_KEY);
    return stored ? JSON.parse(stored) : generateMockSpendingHistory();
  });

  const [deals, setDeals] = useState<Deal[]>(() => {
    const stored = localStorage.getItem(DEALS_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  const [refillReminders, setRefillReminders] = useState<RefillReminder[]>(() => {
    const stored = localStorage.getItem(REFILL_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>(() => {
    const stored = localStorage.getItem(PRICE_ALERTS_KEY);
    return stored ? JSON.parse(stored) : generateMockPriceAlerts();
  });

  useEffect(() => {
    localStorage.setItem(SPENDING_HISTORY_KEY, JSON.stringify(spendingHistory));
  }, [spendingHistory]);

  useEffect(() => {
    localStorage.setItem(DEALS_KEY, JSON.stringify(deals));
  }, [deals]);

  useEffect(() => {
    localStorage.setItem(REFILL_KEY, JSON.stringify(refillReminders));
  }, [refillReminders]);

  useEffect(() => {
    localStorage.setItem(PRICE_ALERTS_KEY, JSON.stringify(priceAlerts));
  }, [priceAlerts]);

  // Add a purchase to history
  const recordPurchase = useCallback((items: { productId: string; name: string; quantity: number; price: number }[], total: number) => {
    const categoryTotals: Record<string, number> = {};
    items.forEach((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (product) {
        categoryTotals[product.category] = (categoryTotals[product.category] || 0) + (item.price * item.quantity);
      }
    });

    const mainCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0]?.[0] || 'General';

    const record: SpendingRecord = {
      date: new Date().toISOString().split('T')[0],
      amount: total,
      category: mainCategory,
      items,
    };

    setSpendingHistory((prev) => [...prev, record]);

    // Update refill reminders
    items.forEach((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (product) {
        const consumptionDays = CATEGORY_CONSUMPTION_DAYS[product.category] || 7;
        const estimatedRunOut = Date.now() + consumptionDays * 24 * 60 * 60 * 1000;

        setRefillReminders((prev) => {
          const existing = prev.find((r) => r.productId === item.productId);
          if (existing) {
            return prev.map((r) =>
              r.productId === item.productId
                ? { ...r, lastPurchased: Date.now(), estimatedRunOutDate: estimatedRunOut }
                : r
            );
          }
          return [
            ...prev,
            {
              productId: item.productId,
              productName: item.name,
              lastPurchased: Date.now(),
              estimatedRunOutDate: estimatedRunOut,
              avgConsumptionDays: consumptionDays,
            },
          ];
        });
      }
    });

    // Generate personalized deals based on purchase
    generateDealsFromPurchase(items);
  }, []);

  const generateDealsFromPurchase = useCallback((items: { productId: string; name: string }[]) => {
    const purchasedIds = items.map((i) => i.productId);
    const newDeals: Deal[] = [];

    // Suggest deals on alternatives to what they bought
    purchasedIds.forEach((id) => {
      const product = products.find((p) => p.id === id);
      if (product?.alternatives) {
        product.alternatives.forEach((altId) => {
          const altProduct = products.find((p) => p.id === altId);
          if (altProduct && !purchasedIds.includes(altId)) {
            newDeals.push({
              id: `deal-${altId}-${Date.now()}`,
              productId: altId,
              discount: Math.floor(Math.random() * 15) + 5, // 5-20% off
              reason: `Because you bought ${product.name}`,
              expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
            });
          }
        });
      }
    });

    // Limit to 3 new deals
    setDeals((prev) => [...prev.filter((d) => d.expiresAt > Date.now()), ...newDeals.slice(0, 3)]);
  }, []);

  // Get spending insights
  const getWeeklySpending = useCallback(() => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return spendingHistory.filter((r) => new Date(r.date) >= weekAgo);
  }, [spendingHistory]);

  const getMonthlySpending = useCallback(() => {
    const now = new Date();
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    return spendingHistory.filter((r) => new Date(r.date) >= monthAgo);
  }, [spendingHistory]);

  const getCategoryBreakdown = useCallback(() => {
    const monthlyRecords = getMonthlySpending();
    const breakdown: Record<string, number> = {};
    
    monthlyRecords.forEach((record) => {
      record.items.forEach((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (product) {
          breakdown[product.category] = (breakdown[product.category] || 0) + (item.price * item.quantity);
        }
      });
    });

    return Object.entries(breakdown).map(([category, amount]) => ({
      category,
      amount,
      percentage: (amount / monthlyRecords.reduce((sum, r) => sum + r.amount, 0)) * 100 || 0,
    }));
  }, [getMonthlySpending]);

  const getActiveReminders = useCallback(() => {
    const now = Date.now();
    const threeDaysFromNow = now + 3 * 24 * 60 * 60 * 1000;
    
    return refillReminders.filter(
      (r) => r.estimatedRunOutDate <= threeDaysFromNow && r.estimatedRunOutDate > now
    );
  }, [refillReminders]);

  const dismissReminder = useCallback((productId: string) => {
    setRefillReminders((prev) => prev.filter((r) => r.productId !== productId));
  }, []);

  const dismissPriceAlert = useCallback((productId: string) => {
    setPriceAlerts((prev) => prev.filter((a) => a.productId !== productId));
  }, []);

  const dismissDeal = useCallback((dealId: string) => {
    setDeals((prev) => prev.filter((d) => d.id !== dealId));
  }, []);

  // Calculate totals
  const weeklyTotal = getWeeklySpending().reduce((sum, r) => sum + r.amount, 0);
  const monthlyTotal = getMonthlySpending().reduce((sum, r) => sum + r.amount, 0);
  const activeDeals = deals.filter((d) => d.expiresAt > Date.now());

  return {
    spendingHistory,
    recordPurchase,
    weeklyTotal,
    monthlyTotal,
    getWeeklySpending,
    getMonthlySpending,
    getCategoryBreakdown,
    deals: activeDeals,
    dismissDeal,
    refillReminders: getActiveReminders(),
    dismissReminder,
    priceAlerts,
    dismissPriceAlert,
  };
}

// Generate mock spending history for demo
function generateMockSpendingHistory(): SpendingRecord[] {
  const history: SpendingRecord[] = [];
  const now = new Date();

  for (let i = 30; i >= 0; i -= Math.floor(Math.random() * 3) + 1) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const numItems = Math.floor(Math.random() * 4) + 1;
    const selectedProducts = products.slice().sort(() => Math.random() - 0.5).slice(0, numItems);
    
    const items = selectedProducts.map((p) => ({
      productId: p.id,
      name: p.name,
      quantity: Math.floor(Math.random() * 3) + 1,
      price: p.price,
    }));

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    history.push({
      date: date.toISOString().split('T')[0],
      amount: total,
      category: selectedProducts[0]?.category || 'General',
      items,
    });
  }

  return history;
}

// Generate mock price alerts
function generateMockPriceAlerts(): PriceAlert[] {
  const alerts: PriceAlert[] = [];
  const discountProducts = products.slice().sort(() => Math.random() - 0.5).slice(0, 2);

  discountProducts.forEach((product) => {
    const discount = Math.floor(Math.random() * 20) + 10; // 10-30%
    alerts.push({
      productId: product.id,
      productName: product.name,
      oldPrice: product.price,
      newPrice: product.price * (1 - discount / 100),
      discount,
    });
  });

  return alerts;
}
