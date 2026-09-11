'use client';

import React from 'react';
import { 
  Camera, 
  Upload, 
  Sparkles, 
  Scan, 
  ShieldCheck, 
  Leaf, 
  Eye, 
  CheckCircle2,
  Activity,
  SunMedium
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function HeroFarmer({ 
  onTriggerCamera, 
  onTriggerUpload,
  activeFilePreview,
  analysisResult,
  isLoading
}) {
  const { t, translateCrop, translateCondition } = useLanguage();

  const previewCrop = analysisResult?.prediction?.crop 
    ? translateCrop(analysisResult.prediction.crop) 
    : t('home.aiSampleLeaf', 'Crop Leaf');

  const previewCondition = analysisResult?.prediction?.condition 
    ? translateCondition(analysisResult.prediction.condition) 
    : t('home.aiSampleCondition', 'Early Blight');

  const previewConfidence = analysisResult?.prediction?.confidence 
    ? `${Math.round(analysisResult.prediction.confidence * 100)}%` 
    : t('home.aiConfidence', '91% Confidence');

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#03261d] via-[#064e3b] to-[#02231a] text-white shadow-2xl border border-emerald-600/40 p-6 sm:p-10 mb-8 transition-all">
      
      {/* Soft atmospheric background lights and fireflies */}
      <div className="absolute -top-16 -left-16 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-16 w-96 h-96 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 left-1/3 w-72 h-72 bg-teal-400/15 rounded-full blur-3xl pointer-events-none" />

      {/* Floating Fireflies */}
      <div className="absolute top-12 left-1/4 w-2 h-2 rounded-full bg-amber-300 shadow-[0_0_8px_#fde047] animate-firefly-1 pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-2.5 h-2.5 rounded-full bg-emerald-300 shadow-[0_0_10px_#6ee7b7] animate-firefly-2 pointer-events-none" />
      <div className="absolute bottom-16 right-1/3 w-1.5 h-1.5 rounded-full bg-amber-200 shadow-[0_0_6px_#fef08a] animate-firefly-3 pointer-events-none" />

      {/* Decorative Botanical leaf outlines in corners */}
      <div className="absolute -bottom-6 -right-6 opacity-10 text-emerald-200 pointer-events-none hidden lg:block">
        <Leaf className="w-48 h-48 transform -rotate-45 animate-leaf-sway" />
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* ============================================================== */}
        {/* LEFT COLUMN: Dominant Farmer Action Area                       */}
        {/* ============================================================== */}
        <div className="lg:col-span-7 text-center lg:text-left space-y-5">
          
          {/* SIH Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-800/80 border border-emerald-500/50 text-xs sm:text-sm font-semibold text-emerald-100 shadow-sm backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>{t('home.heroBadge', 'Smart India Hackathon 2026')}</span>
          </div>

          {/* Core Title & Identity */}
          <div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white drop-shadow-md leading-tight">
              {t('home.heroTitle', 'KISAN DRISHTI')}
            </h1>
            <p className="text-sm sm:text-lg font-bold text-amber-300 mt-1">
              🌾 {t('home.heroCompanion', 'Your Intelligent Crop Companion')}
            </p>
          </div>

          {/* Simple Storyline */}
          <div className="space-y-2">
            <h2 className="text-lg sm:text-2xl font-extrabold text-emerald-50 leading-snug">
              {t('home.heroTagline', 'See what your crop is telling you.')}
            </h2>
            <p className="text-xs sm:text-base text-emerald-100/90 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              {t('home.heroSubtitle', 'Capture a leaf or plant photo and let AI identify possible diseases and pests instantly.')}
            </p>
          </div>

          {/* TWO Dominant Primary Actions */}
          <div className="pt-2">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3.5 max-w-md mx-auto lg:mx-0">
              
              {/* PRIMARY ACTION 1: TAKE PHOTO */}
              <button
                type="button"
                onClick={onTriggerCamera}
                className="group relative flex-1 flex items-center justify-center gap-3 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-emerald-950 py-4 px-6 rounded-2xl font-black text-base sm:text-lg shadow-[0_4px_20px_rgba(245,158,11,0.4)] hover:shadow-[0_6px_25px_rgba(245,158,11,0.5)] active:scale-95 transition-all cursor-pointer"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-950/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Camera className="w-5 h-5 text-emerald-950" />
                </div>
                <span>{t('home.takePhoto', 'Take a Photo')}</span>
              </button>

              {/* PRIMARY ACTION 2: UPLOAD PHOTO */}
              <button
                type="button"
                onClick={onTriggerUpload}
                className="flex-1 flex items-center justify-center gap-2.5 bg-emerald-900/90 hover:bg-emerald-800/90 border-2 border-emerald-500/80 text-white py-4 px-6 rounded-2xl font-bold text-base sm:text-lg shadow-md hover:border-amber-300 active:scale-95 transition-all cursor-pointer backdrop-blur-sm"
              >
                <Upload className="w-5 h-5 text-amber-300" />
                <span>{t('home.uploadPhoto', 'Upload a Photo')}</span>
              </button>

            </div>

            {/* Daylight Accuracy Tip */}
            <div className="flex items-center justify-center lg:justify-start gap-1.5 text-[11px] sm:text-xs text-emerald-200/80 mt-3">
              <SunMedium className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span>{t('home.daylightTip', 'Use a clear photo in good daylight for best accuracy.')}</span>
            </div>
          </div>

        </div>

        {/* ============================================================== */}
        {/* RIGHT COLUMN: "AI Crop Vision" Interactive Visual             */}
        {/* ============================================================== */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-full max-w-sm rounded-3xl p-4 bg-emerald-950/80 border-2 border-emerald-600/50 shadow-2xl backdrop-blur-md overflow-hidden group">
            
            {/* HUD Status Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-emerald-800/60 text-xs">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="font-extrabold tracking-wide text-emerald-200">
                  {t('home.aiCropVision', 'AI Crop Vision Active')}
                </span>
              </div>
              <span className="text-[10px] font-mono bg-emerald-900/90 text-amber-300 px-2 py-0.5 rounded-full border border-emerald-700">
                AI / ICAR
              </span>
            </div>

            {/* Visual Viewport: Stylized Leaf / Uploaded Preview with Laser Scan */}
            <div className="relative aspect-4/3 rounded-2xl bg-[#021d15] border border-emerald-700/60 overflow-hidden flex items-center justify-center">
              
              {activeFilePreview ? (
                /* User's active uploaded leaf */
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={activeFilePreview}
                  alt="Scanned Plant Leaf"
                  className="w-full h-full object-cover"
                />
              ) : (
                /* High-fidelity Stylized Botanical Plant Illustration */
                <div className="relative w-full h-full flex flex-col items-center justify-center p-4 bg-radial from-emerald-900/60 to-transparent">
                  {/* Botanical Leaf SVG */}
                  <svg 
                    viewBox="0 0 100 100" 
                    className="w-28 h-28 text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)] animate-leaf-sway"
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2.5"
                  >
                    <path 
                      d="M50 15 C30 35 20 60 50 85 C80 60 70 35 50 15 Z" 
                      fill="rgba(16, 185, 129, 0.25)"
                    />
                    <path d="M50 20 L50 82" stroke="rgba(245, 158, 11, 0.6)" strokeWidth="2" />
                    <path d="M50 35 Q65 40 68 46" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
                    <path d="M50 48 Q35 53 32 58" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
                    <path d="M50 60 Q65 65 67 70" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
                  </svg>

                  {/* Foliar spot indicator representing early blight symptom */}
                  <div className="absolute top-1/3 right-1/3 w-3.5 h-3.5 rounded-full bg-amber-500/80 border-2 border-amber-300 animate-ping opacity-75" />
                  <div className="absolute top-1/3 right-1/3 w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b]" />
                </div>
              )}

              {/* Holographic Laser Scanning Line */}
              <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_12px_#fbbf24] animate-laser-scan pointer-events-none" />

              {/* Scanning Target Crosshairs */}
              <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-emerald-400" />
              <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-emerald-400" />
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-emerald-400" />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-emerald-400" />

              {/* Scanning badge */}
              <div className="absolute top-3 inset-x-0 flex justify-center pointer-events-none">
                <span className="bg-black/60 backdrop-blur-sm border border-emerald-500/50 text-amber-300 px-3 py-0.5 rounded-full text-[10px] font-mono tracking-widest font-bold">
                  {t('home.aiScanningDemo', 'AI SCAN')}
                </span>
              </div>

            </div>

            {/* Diagnostic Telemetry Output */}
            <div className="mt-3 p-3 rounded-2xl bg-emerald-900/60 border border-emerald-700/60 flex items-center justify-between gap-3 text-xs">
              <div className="min-w-0">
                <div className="text-[10px] uppercase font-black text-amber-300 tracking-wider">
                  {previewCrop}
                </div>
                <div className="font-extrabold text-white truncate text-xs sm:text-sm">
                  {previewCondition}
                </div>
              </div>

              <div className="shrink-0 text-right bg-emerald-800/80 px-2.5 py-1 rounded-xl border border-emerald-600/60">
                <div className="text-amber-300 font-black text-xs sm:text-sm">
                  {previewConfidence}
                </div>
                <div className="text-[9px] text-emerald-200">
                  {t('result.confidenceLabel', 'Confidence')}
                </div>
              </div>
            </div>

            {/* Reassurance Footer */}
            <div className="mt-2.5 flex items-center justify-center gap-1.5 text-[10px] text-emerald-300 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span>{t('home.technologyWatching', 'Technology watching over your crops')}</span>
            </div>

          </div>
        </div>

      </div>

    </section>
  );
}
