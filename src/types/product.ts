export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  nfcId: string;
  aisle?: string;
  location?: string;
  alternatives?: string[];
  nearbyPrices?: { store: string; price: number }[];
  nutrition?: NutritionInfo;
}

export interface NutritionInfo {
  calories: number;
  sugar: number;
  protein: number;
  fat: number;
  fiber: number;
  isHalal: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  allergens: string[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  type: 'ewallet' | 'card' | 'bank';
}

export interface ShoppingListItem {
  id: string;
  productId?: string;
  name: string;
  checked: boolean;
}

export interface BudgetSettings {
  dailyLimit: number;
  weeklyLimit: number;
  enabled: boolean;
}

export interface OfflineScan {
  productId: string;
  timestamp: number;
  synced: boolean;
}

export interface SpendingRecord {
  date: string;
  amount: number;
  category: string;
  items: { productId: string; name: string; quantity: number; price: number }[];
}

export interface Deal {
  id: string;
  productId: string;
  discount: number;
  reason: string;
  expiresAt: number;
}

export interface RefillReminder {
  productId: string;
  productName: string;
  lastPurchased: number;
  estimatedRunOutDate: number;
  avgConsumptionDays: number;
}

export interface PriceAlert {
  productId: string;
  productName: string;
  oldPrice: number;
  newPrice: number;
  discount: number;
}
