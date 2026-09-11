'use client';

import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function NetworkBanner() {
  const { t } = useLanguage();
  const [isOffline, setIsOffline] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setWasOffline(true);
      setTimeout(() => setWasOffline(false), 4000);
    };
    const handleOffline = () => {
      setIsOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    setIsOffline(!navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOffline) {
    return (
      <div className="bg-amber-600 text-white px-4 py-2 text-center text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-md">
        <WifiOff className="w-4 h-4 animate-pulse" />
        <span>{t('network.offlineNotice', 'You are currently working in offline / low-connectivity mode. Previously cached advice remains accessible.')}</span>
      </div>
    );
  }

  if (wasOffline) {
    return (
      <div className="bg-emerald-600 text-white px-4 py-2 text-center text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-md transition-all">
        <Wifi className="w-4 h-4" />
        <span>{t('network.onlineNotice', 'Internet connection restored. AI diagnosis service online.')}</span>
      </div>
    );
  }

  return null;
}
