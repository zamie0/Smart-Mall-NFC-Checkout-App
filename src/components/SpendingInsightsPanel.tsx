import { X, TrendingUp, TrendingDown, PieChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAIInsights } from '@/hooks/useAIInsights';
import { cn } from '@/lib/utils';

interface SpendingInsightsPanelProps {
  onClose: () => void;
  showCloseButton?: boolean;
}

export function SpendingInsightsPanel({ onClose, showCloseButton = true }: SpendingInsightsPanelProps) {
  const { weeklyTotal, monthlyTotal, getWeeklySpending, getCategoryBreakdown } = useAIInsights();
  
  const weeklyData = getWeeklySpending();
  const categoryBreakdown = getCategoryBreakdown();

  // Simple bar chart data - last 7 days
  const last7Days = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = date.toISOString().split('T')[0];
    const daySpending = weeklyData.filter((r) => r.date === dateStr).reduce((sum, r) => sum + r.amount, 0);
    last7Days.push({
      day: date.toLocaleDateString('en', { weekday: 'short' }),
      amount: daySpending,
    });
  }

  const maxSpending = Math.max(...last7Days.map((d) => d.amount), 1);

  // Category colors
  const categoryColors: Record<string, string> = {
    'Fruits': 'bg-green-500',
    'Dairy': 'bg-blue-500',
    'Bakery': 'bg-amber-500',
    'Meat': 'bg-red-500',
    'Seafood': 'bg-cyan-500',
    'Beverages': 'bg-purple-500',
    'Vegetables': 'bg-emerald-500',
  };

  return (
    <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">AI Spending Insights</h3>
        </div>
        {showCloseButton && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      <div className="p-4 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
            <p className="text-xs text-primary">This Week</p>
            <p className="text-xl font-bold text-foreground">RM {weeklyTotal.toFixed(2)}</p>
          </div>
          <div className="p-3 rounded-lg bg-secondary">
            <p className="text-xs text-muted-foreground">This Month</p>
            <p className="text-xl font-bold text-foreground">RM {monthlyTotal.toFixed(2)}</p>
          </div>
        </div>

        {/* Weekly Bar Chart */}
        <div>
          <h4 className="text-sm font-medium text-foreground mb-3">Weekly Spending</h4>
          <div className="flex items-end gap-1 h-24">
            {last7Days.map((day, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-1">
                <div 
                  className="w-full rounded-t gradient-primary transition-all"
                  style={{ height: `${(day.amount / maxSpending) * 100}%`, minHeight: day.amount > 0 ? 4 : 0 }}
                />
                <span className="text-[10px] text-muted-foreground">{day.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Breakdown */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <PieChart className="w-4 h-4 text-primary" />
            <h4 className="text-sm font-medium text-foreground">By Category</h4>
          </div>
          
          {categoryBreakdown.length > 0 ? (
            <div className="space-y-2">
              {categoryBreakdown
                .sort((a, b) => b.amount - a.amount)
                .slice(0, 5)
                .map((cat) => (
                  <div key={cat.category} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-foreground">{cat.category}</span>
                      <span className="text-muted-foreground">
                        RM {cat.amount.toFixed(2)} ({cat.percentage.toFixed(0)}%)
                      </span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className={cn("h-full rounded-full", categoryColors[cat.category] || 'bg-primary')}
                        style={{ width: `${cat.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No spending data yet. Start shopping to see insights!
            </p>
          )}
        </div>

        {/* AI Insight */}
        <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
          <p className="text-xs font-medium text-accent mb-1">🤖 AI Insight</p>
          <p className="text-xs text-foreground">
            {monthlyTotal > 200
              ? `You're spending more on ${categoryBreakdown[0]?.category || 'groceries'}. Consider bulk buying to save up to 15%.`
              : `Great job keeping spending low! You're averaging RM ${(monthlyTotal / 30).toFixed(2)} per day.`}
          </p>
        </div>
      </div>
    </div>
  );
}
