'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Camera, BookOpen, History } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function BottomNav() {
  const { t } = useLanguage();
  const pathname = usePathname();

  const navItems = [
    {
      href: '/',
      label: t('nav.home', 'Home'),
      icon: Home,
      exact: true,
    },
    {
      href: '/#diagnose-section',
      label: t('nav.diagnose', 'Diagnose'),
      icon: Camera,
      isAction: true,
    },
    {
      href: '/knowledge',
      label: t('nav.knowledge', 'Crop Guide'),
      icon: BookOpen,
    },
    {
      href: '/history',
      label: t('nav.history', 'History'),
      icon: History,
    },
  ];

  return (
    <nav 
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-[#03261d] via-[#064e3b] to-[#02231a] text-white border-t border-emerald-700/50 shadow-2xl backdrop-blur-md px-3 pt-2 pb-[max(env(safe-area-inset-bottom),0.6rem)]"
      aria-label="Mobile Bottom Navigation"
    >
      <div className="grid grid-cols-4 items-center gap-1 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact 
            ? pathname === item.href 
            : pathname.startsWith(item.href) && item.href !== '/';

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all active:scale-95 text-center ${
                isActive
                  ? 'bg-emerald-800/90 text-amber-300 font-black shadow-inner border border-emerald-600/60'
                  : 'text-emerald-200/80 hover:text-white hover:bg-emerald-800/40 font-medium'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'text-amber-300' : 'text-emerald-300'}`} />
                {isActive && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400" />
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-1 truncate max-w-full">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
