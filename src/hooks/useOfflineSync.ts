import { useState, useCallback, useEffect } from 'react';
import { OfflineScan, Product } from '@/types/product';
import { toast } from 'sonner';

const OFFLINE_KEY = 'smartmall_offline_scans';

export function useOfflineSync() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingScans, setPendingScans] = useState<OfflineScan[]>(() => {
    const stored = localStorage.getItem(OFFLINE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(OFFLINE_KEY, JSON.stringify(pendingScans));
  }, [pendingScans]);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('Back online! Syncing scans...');
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.warning('You are offline. Scans will be saved locally.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const addOfflineScan = useCallback((productId: string) => {
    const scan: OfflineScan = {
      productId,
      timestamp: Date.now(),
      synced: false,
    };
    setPendingScans((prev) => [...prev, scan]);
  }, []);

  const syncScans = useCallback((onSync: (productId: string) => void) => {
    const unsynced = pendingScans.filter((scan) => !scan.synced);
    
    unsynced.forEach((scan) => {
      onSync(scan.productId);
    });

    setPendingScans((prev) =>
      prev.map((scan) => ({ ...scan, synced: true }))
    );

    if (unsynced.length > 0) {
      toast.success(`Synced ${unsynced.length} offline scans`);
    }
  }, [pendingScans]);

  const clearSynced = useCallback(() => {
    setPendingScans((prev) => prev.filter((scan) => !scan.synced));
  }, []);

  return {
    isOnline,
    pendingScans,
    pendingCount: pendingScans.filter((s) => !s.synced).length,
    addOfflineScan,
    syncScans,
    clearSynced,
  };
}
