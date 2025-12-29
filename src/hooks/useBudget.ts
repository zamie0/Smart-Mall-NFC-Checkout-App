import { useState, useCallback, useEffect } from 'react';
import { BudgetSettings } from '@/types/product';
import { toast } from 'sonner';

const BUDGET_KEY = 'smartmall_budget';
const SPENDING_KEY = 'smartmall_spending';

interface SpendingData {
  daily: { date: string; amount: number };
  weekly: { weekStart: string; amount: number };
}

function getWeekStart(): string {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
  const weekStart = new Date(now.setDate(diff));
  return weekStart.toISOString().split('T')[0];
}

function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

export function useBudget() {
  const [settings, setSettings] = useState<BudgetSettings>(() => {
    const stored = localStorage.getItem(BUDGET_KEY);
    return stored ? JSON.parse(stored) : { dailyLimit: 100, weeklyLimit: 500, enabled: true };
  });

  const [spending, setSpending] = useState<SpendingData>(() => {
    const stored = localStorage.getItem(SPENDING_KEY);
    const data = stored ? JSON.parse(stored) : null;
    const today = getTodayDate();
    const weekStart = getWeekStart();

    if (data) {
      // Reset if date changed
      return {
        daily: data.daily.date === today ? data.daily : { date: today, amount: 0 },
        weekly: data.weekly.weekStart === weekStart ? data.weekly : { weekStart, amount: 0 },
      };
    }

    return {
      daily: { date: today, amount: 0 },
      weekly: { weekStart, amount: 0 },
    };
  });

  useEffect(() => {
    localStorage.setItem(BUDGET_KEY, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(SPENDING_KEY, JSON.stringify(spending));
  }, [spending]);

  const updateSettings = useCallback((newSettings: Partial<BudgetSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  const checkBudget = useCallback((amount: number): { canSpend: boolean; warnings: string[] } => {
    if (!settings.enabled) return { canSpend: true, warnings: [] };

    const warnings: string[] = [];
    const newDailyTotal = spending.daily.amount + amount;
    const newWeeklyTotal = spending.weekly.amount + amount;

    if (newDailyTotal > settings.dailyLimit) {
      warnings.push(`Daily budget exceeded! (RM ${newDailyTotal.toFixed(2)} / RM ${settings.dailyLimit.toFixed(2)})`);
    } else if (newDailyTotal > settings.dailyLimit * 0.8) {
      warnings.push(`Approaching daily limit: RM ${(settings.dailyLimit - newDailyTotal).toFixed(2)} remaining`);
    }

    if (newWeeklyTotal > settings.weeklyLimit) {
      warnings.push(`Weekly budget exceeded! (RM ${newWeeklyTotal.toFixed(2)} / RM ${settings.weeklyLimit.toFixed(2)})`);
    } else if (newWeeklyTotal > settings.weeklyLimit * 0.8) {
      warnings.push(`Approaching weekly limit: RM ${(settings.weeklyLimit - newWeeklyTotal).toFixed(2)} remaining`);
    }

    return { canSpend: true, warnings };
  }, [settings, spending]);

  const addSpending = useCallback((amount: number) => {
    const today = getTodayDate();
    const weekStart = getWeekStart();

    setSpending((prev) => ({
      daily: {
        date: today,
        amount: (prev.daily.date === today ? prev.daily.amount : 0) + amount,
      },
      weekly: {
        weekStart,
        amount: (prev.weekly.weekStart === weekStart ? prev.weekly.amount : 0) + amount,
      },
    }));
  }, []);

  const dailyRemaining = Math.max(0, settings.dailyLimit - spending.daily.amount);
  const weeklyRemaining = Math.max(0, settings.weeklyLimit - spending.weekly.amount);
  const dailyPercentage = Math.min(100, (spending.daily.amount / settings.dailyLimit) * 100);
  const weeklyPercentage = Math.min(100, (spending.weekly.amount / settings.weeklyLimit) * 100);

  return {
    settings,
    updateSettings,
    checkBudget,
    addSpending,
    dailySpent: spending.daily.amount,
    weeklySpent: spending.weekly.amount,
    dailyRemaining,
    weeklyRemaining,
    dailyPercentage,
    weeklyPercentage,
  };
}
