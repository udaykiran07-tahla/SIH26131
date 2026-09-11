'use client';

import React, { useState } from 'react';
import { X, Sliders, Cpu, Activity, Clock, Code } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function TechnicalAnalysisModal({ isOpen, onClose, result }) {
  const { t, translateCrop, translateCondition } = useLanguage();
  const [showJson, setShowJson] = useState(false);

  if (!isOpen || !result) return null;

  const { prediction, technical } = result;
  const alternatives = prediction.alternatives || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200">
        
        {/* Header */}
        <div className="sticky top-0 bg-gray-950 text-white p-5 flex items-center justify-between border-b border-gray-800 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center">
              <Sliders className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-amber-400 font-bold">
                {t('modal.technicalTitle', 'Layer 3 • Technical ML Analysis')}
              </div>
              <h2 className="text-base sm:text-lg font-extrabold text-white">
                {translateCondition(prediction.condition)}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-gray-800 text-sm">
          
          {/* Key Metric Tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-gray-50 border border-gray-200 p-3 rounded-2xl">
              <div className="text-[10px] text-gray-500 font-bold uppercase">{t('modal.modelArch', 'Model')}</div>
              <div className="text-xs font-bold text-gray-900 truncate mt-1">
                {technical?.modelVersion || 'MobileNetV3'}
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 p-3 rounded-2xl">
              <div className="text-[10px] text-gray-500 font-bold uppercase">{t('modal.latency', 'Latency')}</div>
              <div className="text-xs font-extrabold text-emerald-700 mt-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{technical?.inferenceTimeMs || 420} ms</span>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 p-3 rounded-2xl">
              <div className="text-[10px] text-gray-500 font-bold uppercase">{t('modal.tensor', 'Input Tensor')}</div>
              <div className="text-xs font-extrabold text-gray-900 mt-1">
                (1, 3, 224, 224)
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 p-3 rounded-2xl">
              <div className="text-[10px] text-gray-500 font-bold uppercase">{t('modal.engine', 'Engine')}</div>
              <div className="text-xs font-extrabold text-purple-700 mt-1 flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5" />
                <span>{technical?.isDemo ? 'Demo CNN' : 'ONNX / PyTorch'}</span>
              </div>
            </div>
          </div>

          {/* Probability Distribution */}
          <div className="bg-gray-50 border border-gray-200 p-4 rounded-2xl">
            <h4 className="font-extrabold text-xs text-gray-900 mb-3 flex items-center gap-1.5 uppercase tracking-wider">
              <Activity className="w-4 h-4 text-emerald-600" />
              <span>{t('modal.probDist', 'Softmax Probability Distribution')}</span>
            </h4>

            <div className="space-y-2.5">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-emerald-900">1. {translateCondition(prediction.condition)}</span>
                  <span className="text-emerald-900">{Math.round(prediction.confidence * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className="bg-emerald-600 h-2.5 rounded-full" 
                    style={{ width: `${Math.min(100, Math.round(prediction.confidence * 100))}%` }}
                  />
                </div>
              </div>

              {alternatives.map((alt, idx) => {
                const pct = Math.round(alt.confidence * 100);
                return (
                  <div key={idx}>
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>{idx + 2}. {translateCondition(alt.condition)} ({translateCrop(alt.crop)})</span>
                      <span>{pct}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-gray-400 h-2 rounded-full" 
                        style={{ width: `${Math.min(100, pct)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Preprocessing details */}
          <div className="bg-gray-50 border border-gray-200 p-4 rounded-2xl">
            <h4 className="font-extrabold text-xs text-gray-900 mb-2 uppercase tracking-wider">
              {t('modal.cvPipeline', 'OpenCV / Sharp Preprocessing Pipeline')}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <div className="bg-white p-2.5 rounded-xl border border-gray-200">
                <span className="text-gray-400 text-[10px] block">{t('modal.resolution', 'Resolution')}:</span>
                <span className="font-semibold text-gray-800">
                  {technical?.dimensions ? `${technical.dimensions.width}x${technical.dimensions.height}` : '224x224'}
                </span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-gray-200">
                <span className="text-gray-400 text-[10px] block">{t('modal.blurScore', 'Blur Score')}:</span>
                <span className="font-semibold text-gray-800">
                  {technical?.quality?.sharpnessScore || 48} ({technical?.quality?.isBlurry ? t('modal.blurry', 'Blurry') : t('modal.clear', 'Clear')})
                </span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-gray-200">
                <span className="text-gray-400 text-[10px] block">{t('modal.luminance', 'Luminance')}:</span>
                <span className="font-semibold text-gray-800">
                  RGB • {technical?.quality?.brightnessScore || 135}/255
                </span>
              </div>
            </div>
          </div>

          {/* Raw JSON toggle */}
          <div>
            <button
              onClick={() => setShowJson(!showJson)}
              className="flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-gray-900"
            >
              <Code className="w-3.5 h-3.5" />
              <span>{showJson ? t('modal.hideJson', 'Hide Raw JSON') : t('modal.rawJson', 'Inspect Raw Inference JSON')}</span>
            </button>
            {showJson && (
              <pre className="mt-2 p-3 bg-gray-950 text-emerald-400 text-xs rounded-xl overflow-x-auto max-h-40 border border-gray-800 font-mono">
                {JSON.stringify(result, null, 2)}
              </pre>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-3.5 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-900 hover:bg-black text-white px-5 py-2 rounded-xl font-bold text-xs"
          >
            {t('modal.close', 'Close')}
          </button>
        </div>

      </div>
    </div>
  );
}
