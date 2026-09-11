'use client';

import React from 'react';
import { X, BookOpen, ExternalLink, ShieldCheck, Leaf } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function DetailedInfoModal({ isOpen, onClose, recommendation, prediction }) {
  const { t, translateCrop, translateCondition, translateType } = useLanguage();

  if (!isOpen || !recommendation) return null;

  const translatedCrop = translateCrop(recommendation.crop);
  const translatedCondition = translateCondition(recommendation.name);
  const translatedType = translateType(recommendation.type);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200">
        
        {/* Header */}
        <div className="sticky top-0 bg-emerald-900 text-white p-5 flex items-center justify-between border-b border-emerald-800 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-emerald-300 font-bold">
                {t('modal.detailedTitle', 'Layer 2 • Detailed Biological Guide')}
              </div>
              <h2 className="text-lg font-extrabold">{translatedCondition}</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-emerald-200 hover:text-white rounded-xl hover:bg-emerald-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 text-gray-800 text-sm">
          
          {/* Metadata chips */}
          <div className="flex flex-wrap gap-2 pb-3 border-b border-gray-100">
            <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold">
              {t('result.cropLabel', 'Crop')}: {translatedCrop}
            </span>
            <span className="bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-full text-xs font-bold">
              {translatedType}
            </span>
            {recommendation.scientificName && (
              <span className="bg-purple-50 text-purple-800 border border-purple-200 px-3 py-1 rounded-full text-xs italic font-serif">
                {recommendation.scientificName}
              </span>
            )}
          </div>

          {/* Biological Description */}
          <div>
            <h4 className="font-extrabold text-sm text-gray-900 mb-1.5">
              {t('modal.epidemiology', 'Biological Description & Epidemiology')}
            </h4>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
              {recommendation.description}
            </p>
          </div>

          {/* Symptoms in detail */}
          <div>
            <h4 className="font-extrabold text-sm text-gray-900 mb-1.5">
              {t('modal.symptoms', 'Diagnostic Foliar Signs')}
            </h4>
            <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-gray-700">
              {recommendation.symptoms?.map((s, idx) => (
                <li key={idx}>{s}</li>
              ))}
            </ul>
          </div>

          {/* Causes and triggers */}
          <div>
            <h4 className="font-extrabold text-sm text-gray-900 mb-1.5">
              {t('modal.causes', 'Environmental & Agronomic Drivers')}
            </h4>
            <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-gray-700">
              {recommendation.causes?.map((c, idx) => (
                <li key={idx}>{c}</li>
              ))}
            </ul>
          </div>

          {/* Non-Chemical Protocols */}
          <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100">
            <div className="flex items-center gap-1.5 text-emerald-900 font-bold mb-1.5 text-xs">
              <Leaf className="w-4 h-4 text-emerald-600" />
              <span>{t('modal.culturalMeasures', 'Cultural & Biological Management Measures')}</span>
            </div>
            <ul className="list-disc pl-5 space-y-1 text-xs text-emerald-950">
              {recommendation.management?.nonChemical?.map((m, idx) => (
                <li key={idx}>{m}</li>
              ))}
            </ul>
          </div>

          {/* Chemical Precautions */}
          <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200">
            <div className="flex items-center gap-1.5 text-amber-950 font-bold mb-1 text-xs">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              <span>{t('modal.chemicalPrecautions', 'Chemical Control Precautions & State Advisories')}</span>
            </div>
            <p className="text-xs text-amber-900 mb-2">
              {recommendation.management?.chemical?.guidance}
            </p>
            <div className="text-[11px] text-amber-950 bg-white/80 p-2.5 rounded-xl border border-amber-300">
              {recommendation.management?.chemical?.disclaimer}
            </div>
          </div>

          {/* References */}
          <div>
            <h4 className="font-extrabold text-sm text-gray-900 mb-1.5">
              {t('modal.citations', 'Verified Institutional Citations')}
            </h4>
            <div className="space-y-2">
              {recommendation.references?.map((ref, idx) => (
                <div key={idx} className="p-2.5 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-between gap-2 text-xs">
                  <div>
                    <div className="font-bold text-gray-900">{ref.organization}</div>
                    <div className="text-gray-500 text-[11px]">{ref.title}</div>
                  </div>
                  {ref.url && (
                    <a
                      href={ref.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-700 hover:text-emerald-900 p-1 rounded shrink-0"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-3.5 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-800 hover:bg-black text-white px-5 py-2 rounded-xl font-bold text-xs"
          >
            {t('modal.close', 'Close')}
          </button>
        </div>

      </div>
    </div>
  );
}
