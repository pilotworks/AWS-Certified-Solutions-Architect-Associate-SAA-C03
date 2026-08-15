import React, { useEffect, useState } from 'react';
import { IconWifiOff } from '@tabler/icons-react';

export const OfflineStatus: React.FC = () => {
  const [isOffline, setIsOffline] = useState(
    () => typeof navigator !== 'undefined' && !navigator.onLine
  );

  useEffect(() => {
    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => setIsOffline(false);

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div
      role="status"
      className="fixed top-16 left-0 right-0 z-40 flex items-center justify-center gap-2 px-4 py-2 text-xs font-medium shadow-sm"
      style={{ backgroundColor: 'var(--accent-bg)', color: 'var(--text-accent)' }}
    >
      <IconWifiOff className="h-3.5 w-3.5" />
      <span>Offline mode — nội dung học và tiến độ vẫn dùng được trên thiết bị này.</span>
    </div>
  );
};
