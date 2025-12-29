import { useState } from 'react';
import { X, Wallet, TrendingUp, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { useBudget } from '@/hooks/useBudget';
import { cn } from '@/lib/utils';

interface BudgetPanelProps {
  onClose: () => void;
  currentCartTotal: number;
  showCloseButton?: boolean;
}

export function BudgetPanel({ onClose, currentCartTotal, showCloseButton = true }: BudgetPanelProps) {
  const {
    settings,
    updateSettings,
    dailySpent,
    weeklySpent,
    dailyRemaining,
    weeklyRemaining,
    dailyPercentage,
    weeklyPercentage,
  } = useBudget();

  const [editMode, setEditMode] = useState(false);
  const [tempDaily, setTempDaily] = useState(settings.dailyLimit.toString());
  const [tempWeekly, setTempWeekly] = useState(settings.weeklyLimit.toString());

  const handleSave = () => {
    updateSettings({
      dailyLimit: parseFloat(tempDaily) || 100,
      weeklyLimit: parseFloat(tempWeekly) || 500,
    });
    setEditMode(false);
  };

  const projectedDaily = dailySpent + currentCartTotal;
  const projectedWeekly = weeklySpent + currentCartTotal;
  const willExceedDaily = projectedDaily > settings.dailyLimit;
  const willExceedWeekly = projectedWeekly > settings.weeklyLimit;

  return (
    <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Wallet className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Budget Guard</h3>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={settings.enabled}
            onCheckedChange={(enabled) => updateSettings({ enabled })}
          />
          {showCloseButton && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Daily Budget */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Daily Budget</span>
            {editMode ? (
              <Input
                type="number"
                value={tempDaily}
                onChange={(e) => setTempDaily(e.target.value)}
                className="w-24 h-8 text-right"
              />
            ) : (
              <span className="text-sm text-muted-foreground">
                RM {dailySpent.toFixed(2)} / RM {settings.dailyLimit.toFixed(2)}
              </span>
            )}
          </div>
          <Progress
            value={dailyPercentage}
            className={cn(
              "h-2",
              dailyPercentage > 80 && "bg-destructive/20"
            )}
          />
          <p className="text-xs text-muted-foreground">
            RM {dailyRemaining.toFixed(2)} remaining today
          </p>
        </div>

        {/* Weekly Budget */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Weekly Budget</span>
            {editMode ? (
              <Input
                type="number"
                value={tempWeekly}
                onChange={(e) => setTempWeekly(e.target.value)}
                className="w-24 h-8 text-right"
              />
            ) : (
              <span className="text-sm text-muted-foreground">
                RM {weeklySpent.toFixed(2)} / RM {settings.weeklyLimit.toFixed(2)}
              </span>
            )}
          </div>
          <Progress
            value={weeklyPercentage}
            className={cn(
              "h-2",
              weeklyPercentage > 80 && "bg-destructive/20"
            )}
          />
          <p className="text-xs text-muted-foreground">
            RM {weeklyRemaining.toFixed(2)} remaining this week
          </p>
        </div>

        {/* Cart Projection */}
        {currentCartTotal > 0 && (
          <div className="p-3 rounded-lg bg-secondary space-y-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">With Current Cart</span>
            </div>
            
            {(willExceedDaily || willExceedWeekly) && (
              <div className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-xs">
                  {willExceedDaily && willExceedWeekly
                    ? 'Will exceed daily & weekly budget!'
                    : willExceedDaily
                    ? 'Will exceed daily budget!'
                    : 'Will exceed weekly budget!'}
                </span>
              </div>
            )}

            <div className="text-xs text-muted-foreground space-y-1">
              <p>
                Daily: RM {projectedDaily.toFixed(2)} / RM {settings.dailyLimit.toFixed(2)}
              </p>
              <p>
                Weekly: RM {projectedWeekly.toFixed(2)} / RM {settings.weeklyLimit.toFixed(2)}
              </p>
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          {editMode ? (
            <>
              <Button variant="outline" className="flex-1" onClick={() => setEditMode(false)}>
                Cancel
              </Button>
              <Button className="flex-1" onClick={handleSave}>
                Save
              </Button>
            </>
          ) : (
            <Button variant="outline" className="w-full" onClick={() => setEditMode(true)}>
              Edit Limits
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
