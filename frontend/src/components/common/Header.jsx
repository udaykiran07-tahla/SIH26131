'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Sprout, 
  Globe, 
  Menu, 
  X, 
  ShieldCheck, 
  History, 
  BookOpen, 
  Camera,
  Home,
  LogOut,
  Sparkles,
  Server
} from 'lucide-react';
import ServerConfigModal from './ServerConfigModal';

export default function Header() {
  const { language, setLanguage, languages, currentLanguageInfo, t } = useLanguage();
  const { isAuthenticated, logout, admin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [serverModalOpen, setServerModalOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: t('nav.home', 'Home'), icon: Home },
    { href: '/#diagnose-section', label: t('nav.diagnose', 'Diagnose'), icon: Camera },
    { href: '/knowledge', label: t('nav.knowledge', 'Crop Guide'), icon: BookOpen },
    { href: '/history', label: t('nav.history', 'History'), icon: History },
  ];

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white shadow-lg border-b border-emerald-700/50 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Tagline */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group">
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-emerald-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6 text-emerald-950 animate-leaf-sway" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-300 rounded-full animate-ping opacity-75" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg sm:text-2xl tracking-tight text-white drop-shadow-sm">
                  {t('appName', 'KisanDrishti')}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-emerald-200 line-clamp-1 font-medium">
                {t('appTagline', 'AI Crop Disease & Pest Protection')}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    isActive
                      ? 'bg-emerald-800 text-white shadow-md border border-emerald-600'
                      : 'text-emerald-100 hover:bg-emerald-800/60 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 text-amber-300" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Language Selector & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-2 bg-emerald-800/80 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold border border-emerald-600/70 shadow-md focus:ring-2 focus:ring-amber-400 transition-all active:scale-95"
                aria-label={t('nav.selectLanguage', 'Select Language')}
              >
                <Globe className="w-4 h-4 text-amber-300 shrink-0" />
                <span>{currentLanguageInfo.native}</span>
              </button>

              {langDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-60 max-h-80 overflow-y-auto bg-white rounded-2xl shadow-2xl border border-gray-200 py-2 z-50 text-gray-800 animate-in fade-in zoom-in-95 duration-100"
                  onClick={() => setLangDropdownOpen(false)}
                >
                  <div className="px-3.5 py-2 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center justify-between">
                    <span>{t('nav.selectLanguage', 'Language')}</span>
                    <Sparkles className="w-3 h-3 text-amber-500" />
                  </div>
                  <div className="divide-y divide-gray-50">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => setLanguage(lang.code)}
                        className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between hover:bg-emerald-50 transition-colors ${
                          language === lang.code ? 'bg-emerald-50 font-extrabold text-emerald-900' : 'text-gray-700'
                        }`}
                      >
                        <div>
                          <div className="font-bold text-sm">{lang.native}</div>
                          <div className="text-[11px] text-gray-400">{lang.name} • {lang.region}</div>
                        </div>
                        {language === lang.code && (
                          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Admin session indicator (if logged in) */}
            {isAuthenticated && (
              <div className="hidden lg:flex items-center gap-1.5 bg-amber-500/20 text-amber-200 border border-amber-500/30 px-3 py-1.5 rounded-xl text-xs">
                <span>{t('nav.admin', 'Admin Portal')}</span>
                <button onClick={logout} className="hover:text-white ml-1">
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-emerald-200 hover:text-white hover:bg-emerald-800"
              aria-label={t('nav.selectLanguage', 'Menu')}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-emerald-950 border-t border-emerald-800 px-4 py-3 space-y-1.5 animate-in slide-in-from-top-2 duration-150">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
                  isActive ? 'bg-emerald-800 text-white' : 'text-emerald-100 hover:bg-emerald-900'
                }`}
              >
                <Icon className="w-5 h-5 text-amber-300" />
                <span>{link.label}</span>
              </Link>
            );
          })}

          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              setServerModalOpen(true);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-amber-300 hover:bg-emerald-900 transition-colors"
          >
            <Server className="w-5 h-5 text-amber-300" />
            <span>Server Connection</span>
          </button>
        </div>
      )}

      <ServerConfigModal
        isOpen={serverModalOpen}
        onClose={() => setServerModalOpen(false)}
      />
    </header>
  );
}
