import { useState, useEffect, useCallback } from 'react';
import { User, PurchaseHistory } from '@/types/auth';

const USERS_KEY = 'smartmall_users';
const CURRENT_USER_KEY = 'smartmall_current_user';
const HISTORY_KEY = 'smartmall_purchase_history';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(CURRENT_USER_KEY);
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setIsLoading(false);
  }, []);

  const login = useCallback((email: string, password: string): { success: boolean; error?: string } => {
    const usersRaw = localStorage.getItem(USERS_KEY);
    const users: Record<string, { user: User; password: string }> = usersRaw ? JSON.parse(usersRaw) : {};
    
    const userData = users[email];
    if (!userData) {
      return { success: false, error: 'User not found' };
    }
    if (userData.password !== password) {
      return { success: false, error: 'Invalid password' };
    }
    
    setUser(userData.user);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData.user));
    return { success: true };
  }, []);

  const register = useCallback((email: string, password: string, name: string): { success: boolean; error?: string } => {
    const usersRaw = localStorage.getItem(USERS_KEY);
    const users: Record<string, { user: User; password: string }> = usersRaw ? JSON.parse(usersRaw) : {};
    
    if (users[email]) {
      return { success: false, error: 'Email already registered' };
    }
    
    const newUser: User = {
      id: crypto.randomUUID(),
      email,
      name,
      createdAt: new Date().toISOString(),
    };
    
    users[email] = { user: newUser, password };
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
    setUser(newUser);
    
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(CURRENT_USER_KEY);
    setUser(null);
  }, []);

  const getPurchaseHistory = useCallback((): PurchaseHistory[] => {
    if (!user) return [];
    const raw = localStorage.getItem(`${HISTORY_KEY}_${user.id}`);
    return raw ? JSON.parse(raw) : [];
  }, [user]);

  const addPurchase = useCallback((purchase: Omit<PurchaseHistory, 'id' | 'date'>) => {
    if (!user) return;
    const history = getPurchaseHistory();
    const newPurchase: PurchaseHistory = {
      ...purchase,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
    };
    history.unshift(newPurchase);
    localStorage.setItem(`${HISTORY_KEY}_${user.id}`, JSON.stringify(history));
  }, [user, getPurchaseHistory]);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    getPurchaseHistory,
    addPurchase,
  };
}
