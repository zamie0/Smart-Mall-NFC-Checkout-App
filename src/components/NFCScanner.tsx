import { useState } from 'react';
import { Smartphone, Wifi } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NFCScannerProps {
  onScan: () => void;
  isScanning: boolean;
}

export function NFCScanner({ onScan, isScanning }: NFCScannerProps) {
  const [isPressed, setIsPressed] = useState(false);

  const handleTap = () => {
    setIsPressed(true);
    onScan();
    setTimeout(() => setIsPressed(false), 300);
  };

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="relative">
        {/* Pulse rings */}
        {isScanning && (
          <>
            <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-pulse-ring" />
            <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-pulse-ring" style={{ animationDelay: '0.5s' }} />
            <div className="absolute inset-0 rounded-full border-2 border-primary/10 animate-pulse-ring" style={{ animationDelay: '1s' }} />
          </>
        )}
        
        {/* Main scanner button */}
        <button
          onClick={handleTap}
          className={cn(
            "relative w-40 h-40 rounded-full gradient-primary shadow-glow flex flex-col items-center justify-center gap-2 transition-all duration-200",
            isPressed && "scale-95",
            isScanning && "animate-pulse"
          )}
        >
          <Smartphone className="w-12 h-12 text-primary-foreground" />
          <Wifi className="w-6 h-6 text-primary-foreground/80" />
        </button>
      </div>
      
      <div className="mt-8 text-center">
        <h3 className="text-xl font-semibold text-foreground">
          {isScanning ? 'Scanning...' : 'Tap to Scan'}
        </h3>
        <p className="text-muted-foreground mt-2 text-sm max-w-xs">
          {isScanning 
            ? 'Hold your phone near the NFC tag' 
            : 'Simulate NFC scanning by tapping the button'
          }
        </p>
      </div>
    </div>
  );
}
