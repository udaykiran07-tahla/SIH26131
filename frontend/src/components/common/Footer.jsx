'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Phone, Shield, ExternalLink, Server } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import ServerConfigModal from './ServerConfigModal';

export default function Footer() {
  const { t } = useLanguage();
  const [serverModalOpen, setServerModalOpen] = useState(false);

  return (
    <>
      <footer className="bg-emerald-950 text-emerald-200 py-6 border-t border-emerald-900 text-xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <div className="font-bold text-white text-sm">
              {t('appName', 'KisanDrishti')}
            </div>
            <p className="text-emerald-300 text-[11px] mt-0.5 max-w-md">
              {t('footer.disclaimer', 'Built for Smart India Hackathon 2026. Non-chemical recommendations are drawn from verified ICAR practices. Always confirm chemical controls with your local KVK.')}
            </p>
            <div className="text-[10px] text-emerald-400/80 mt-1 font-mono">
              {t('footer.copyright', 'KisanDrishti • Smart India Hackathon Prototype (Problem Statement #26131)')}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6">
            <button
              type="button"
              onClick={() => setServerModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 text-amber-300 border border-emerald-700/60 font-semibold text-[11px] transition-all"
            >
              <Server className="w-3.5 h-3.5" />
              <span>Backend Host</span>
            </button>

            <a
              href="tel:18001801551"
              className="inline-flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 px-4 py-2 rounded-xl font-bold text-xs transition-all"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{t('footer.callNumber', '1800-180-1551')}</span>
            </a>

            <Link href="/admin" className="text-emerald-400 hover:text-white underline text-[11px]">
              {t('nav.admin', 'Admin Portal')}
            </Link>
          </div>
        </div>
      </footer>

      <ServerConfigModal
        isOpen={serverModalOpen}
        onClose={() => setServerModalOpen(false)}
      />
    </>
  );
}
