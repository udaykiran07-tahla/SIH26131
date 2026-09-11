'use client';

import React from 'react';
import { Sparkles, CheckCircle2, Zap } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const DEMO_SAMPLES = [
  {
    id: 'tomato_early_blight',
    crop: 'Tomato',
    conditionKey: 'Tomato Early Blight',
    type: 'disease',
    icon: '🍅',
    fileName: 'demo_tomato_early_blight.jpg',
  },
  {
    id: 'potato_late_blight',
    crop: 'Potato',
    conditionKey: 'Potato Late Blight',
    type: 'disease',
    icon: '🥔',
    fileName: 'demo_potato_late_blight.jpg',
  },
  {
    id: 'rice_blast',
    crop: 'Rice',
    conditionKey: 'Rice Blast',
    type: 'disease',
    icon: '🌾',
    fileName: 'demo_rice_blast.jpg',
  },
  {
    id: 'corn_armyworm',
    crop: 'Corn (Maize)',
    conditionKey: 'Fall Armyworm Infestation',
    type: 'pest',
    icon: '🌽',
    fileName: 'demo_corn_armyworm.jpg',
  },
  {
    id: 'tomato_healthy',
    crop: 'Tomato',
    conditionKey: 'Tomato Healthy',
    type: 'healthy',
    icon: '🌱',
    fileName: 'demo_tomato_healthy.jpg',
  },
];

export default function SampleImageSelector({ onSelectSample, activeSampleId }) {
  const { t, translateCrop, translateCondition, translateType } = useLanguage();

  return (
    <section className="bg-gradient-to-r from-emerald-900/10 via-emerald-800/5 to-amber-900/10 rounded-3xl p-5 sm:p-6 border border-emerald-700/20 backdrop-blur-sm shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center font-bold text-xs shadow-sm">
            <Zap className="w-4 h-4 fill-emerald-950" />
          </div>
          <div>
            <h3 className="font-extrabold text-emerald-950 text-sm sm:text-base">
              {t('home.demoTitle', 'Try the AI')}
            </h3>
          </div>
        </div>
        <span className="text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
          SIH 1-Click
        </span>
      </div>

      <p className="text-xs text-emerald-900/80 mb-4">
        {t('home.demoDesc', 'Click any crop sample below to test the AI diagnosis instantly:')}
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {DEMO_SAMPLES.map((sample) => {
          const isSelected = activeSampleId === sample.id;
          const translatedCrop = translateCrop(sample.crop);
          const translatedCond = translateCondition(sample.conditionKey);
          return (
            <button
              key={sample.id}
              type="button"
              onClick={() => onSelectSample(sample)}
              className={`group p-3 rounded-2xl border text-left flex flex-col justify-between transition-all duration-200 active:scale-95 cursor-pointer shadow-xs ${
                isSelected
                  ? 'ring-2 ring-emerald-600 border-emerald-600 bg-emerald-100/80 shadow-md scale-[1.02]'
                  : 'border-emerald-200/80 bg-white/90 hover:bg-white hover:border-emerald-500 hover:shadow-md'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl group-hover:scale-110 transition-transform">
                  {sample.icon}
                </span>
                {isSelected ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                ) : (
                  <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                    sample.type === 'healthy' 
                      ? 'bg-green-100 text-green-800' 
                      : sample.type === 'pest' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {translateType(sample.type)}
                  </span>
                )}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-black text-gray-900 truncate group-hover:text-emerald-800">
                  {translatedCrop}
                </div>
                <div className="text-[11px] text-gray-600 truncate mt-0.5">
                  {translatedCond}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
