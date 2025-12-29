import { useState, useCallback, useEffect } from 'react';
import { ShoppingListItem } from '@/types/product';

const STORAGE_KEY = 'smartmall_shopping_list';

export function useShoppingList() {
  const [items, setItems] = useState<ShoppingListItem[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((name: string, productId?: string) => {
    const newItem: ShoppingListItem = {
      id: crypto.randomUUID(),
      productId,
      name,
      checked: false,
    };
    setItems((prev) => [...prev, newItem]);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const toggleItem = useCallback((id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  }, []);

  const markAsScanned = useCallback((productId: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, checked: true } : item
      )
    );
  }, []);

  const isOnList = useCallback((productId: string) => {
    return items.some((item) => item.productId === productId && !item.checked);
  }, [items]);

  const clearChecked = useCallback(() => {
    setItems((prev) => prev.filter((item) => !item.checked));
  }, []);

  const clearAll = useCallback(() => {
    setItems([]);
  }, []);

  return {
    items,
    addItem,
    removeItem,
    toggleItem,
    markAsScanned,
    isOnList,
    clearChecked,
    clearAll,
  };
}
