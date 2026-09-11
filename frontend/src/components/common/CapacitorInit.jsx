'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function CapacitorInit() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let cleanupBackButton = null;

    async function initCapacitor() {
      try {
        const { Capacitor } = await import('@capacitor/core');
        if (!Capacitor.isNativePlatform()) return;

        // 1. Status Bar Setup
        try {
          const { StatusBar, Style } = await import('@capacitor/status-bar');
          await StatusBar.setStyle({ style: Style.Dark });
          await StatusBar.setBackgroundColor({ color: '#042f24' });
          await StatusBar.setOverlaysWebView({ overlay: false });
        } catch (e) {
          console.warn('StatusBar initialization skipped:', e);
        }

        // 2. Hide Splash Screen cleanly
        try {
          const { SplashScreen } = await import('@capacitor/splash-screen');
          setTimeout(async () => {
            await SplashScreen.hide();
          }, 600);
        } catch (e) {
          console.warn('SplashScreen hide skipped:', e);
        }

        // 3. Android System / Hardware Back Button
        try {
          const { App } = await import('@capacitor/app');
          const listener = await App.addListener('backButton', ({ canGoBack }) => {
            // Check if user is currently on an inner route
            if (pathname !== '/') {
              router.push('/');
            } else {
              // At root home: exit app gracefully
              App.exitApp();
            }
          });
          cleanupBackButton = () => listener.remove();
        } catch (e) {
          console.warn('App backButton listener skipped:', e);
        }

      } catch (err) {
        console.warn('Capacitor native modules not loaded in web mode:', err);
      }
    }

    initCapacitor();

    return () => {
      if (cleanupBackButton) cleanupBackButton();
    };
  }, [pathname, router]);

  return null;
}
