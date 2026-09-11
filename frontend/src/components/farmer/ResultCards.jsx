'use client';

import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Leaf, 
  Sprout, 
  PhoneCall, 
  Camera, 
  Layers, 
  Sliders, 
  Printer, 
  ThumbsUp, 
  ThumbsDown,
  Info,
  ShieldCheck,
  Activity,
  AlertCircle
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { submitFarmerFeedback } from '../../services/api';

export default function ResultCards({ 
  result, 
  onReset, 
  onOpenDetailed, 
  onOpenTechnical 
}) {
  const { t, translateCrop, translateCondition, translateType } = useLanguage();
  const [feedbackSent, setFeedbackSent] = useState(false);

  if (!result || !result.prediction) return null;

  const { prediction, recommendation, technical, id } = result;
  const isLowConfidence = prediction.isLowConfidence || prediction.confidence < 0.60;
  const confidencePercent = Math.round((prediction.confidence || 0) * 100);

  const translatedCrop = translateCrop(prediction.crop);
  const translatedCondition = translateCondition(prediction.condition);
  const translatedType = translateType(prediction.conditionType || 'disease');

  const handleFeedback = async (helpful) => {
    try {
      if (id) {
        await submitFarmerFeedback(id, helpful, '');
      }
      setFeedbackSent(true);
    } catch (e) {
      setFeedbackSent(true);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-250">
      
      {/* 1. Primary Diagnosis Result Card with Agricultural Depth */}
      <div className={`rounded-3xl p-6 sm:p-9 text-white shadow-2xl border ${
        prediction.conditionType === 'healthy'
          ? 'bg-gradient-to-br from-[#044e32] via-[#065f46] to-[#033b26] border-green-500/60'
          : isLowConfidence
          ? 'bg-gradient-to-br from-[#78350f] via-[#92400e] to-[#451a03] border-amber-500/60'
          : 'bg-gradient-to-br from-[#042f24] via-[#064e3b] to-[#02231a] border-emerald-500/60'
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 mb-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider bg-white/20 text-white px-3.5 py-1 rounded-full backdrop-blur-sm shadow-xs border border-white/20">
                🌱 {t('result.cropLabel', 'Crop')}: {translatedCrop}
              </span>
              <span className="text-xs font-bold uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/40 px-3.5 py-1 rounded-full">
                {translatedType}
              </span>
            </div>
            
            <div className="text-xs uppercase text-amber-300 font-extrabold tracking-wider pt-1">
              ⚠️ {t('result.conditionLabel', 'Possible Condition')}
            </div>
            
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight drop-shadow-md">
              {translatedCondition}
            </h2>
            
            {/* Latin binomial scientific name preserved untranslated in Latin italics */}
            {recommendation?.scientificName && recommendation.scientificName !== 'N/A' && (
              <p className="text-xs sm:text-sm text-emerald-200 italic font-serif">
                {recommendation.scientificName}
              </p>
            )}
          </div>

          {/* Confidence Badge */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center sm:text-right shrink-0 min-w-[140px] shadow-inner">
            <div className="text-[11px] text-emerald-200 uppercase font-bold tracking-wider">
              {t('result.confidenceLabel', 'Confidence')}
            </div>
            <div className="text-3xl sm:text-4xl font-black text-amber-300 drop-shadow-sm my-0.5">
              {confidencePercent}%
            </div>
            <div className="text-[10px] text-emerald-100 font-semibold">
              {isLowConfidence ? t('result.confidenceLow', 'Low Confidence') : t('result.confidenceHigh', 'High Confidence')}
            </div>
          </div>
        </div>

        {/* Demo Mode Notice */}
        {technical?.isDemo && (
          <div className="text-[11px] bg-black/40 text-emerald-200 px-3.5 py-2 rounded-xl border border-white/10 flex items-center justify-between">
            <span>ℹ️ {t('result.demoNotice', 'Prototype Demo Mode (Simulated MobileNetV3 CNN inference)')}</span>
            <span className="font-mono text-[10px] bg-emerald-950 px-2 py-0.5 rounded text-amber-300">{technical.inferenceTimeMs}ms</span>
          </div>
        )}
      </div>

      {/* 2. Low Confidence Handling (Uncertainty Notice) */}
      {isLowConfidence && (
        <div className="bg-amber-50 border-2 border-amber-400 rounded-3xl p-5 sm:p-6 text-amber-950 shadow-md">
          <div className="flex items-start gap-3.5">
            <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5 animate-bounce" />
            <div className="space-y-2">
              <h3 className="font-black text-base sm:text-lg text-amber-950">
                {t('lowConfidence.title', 'AI confidence is low')}
              </h3>
              <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">
                {t('lowConfidence.message', 'AI confidence is low. The symptoms may resemble more than one condition. Consider taking another clear photo or consulting an agricultural expert.')}
              </p>
              <div className="flex flex-wrap gap-2.5 pt-1.5">
                <button
                  type="button"
                  onClick={onReset}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm active:scale-95 transition-all cursor-pointer"
                >
                  📷 {t('lowConfidence.retake', 'Take Another Clear Photo')}
                </button>
                <a
                  href="tel:18001801551"
                  className="bg-white border border-amber-300 hover:bg-amber-100 text-amber-900 px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-colors"
                >
                  📞 {t('lowConfidence.callKvk', 'Call KVK Helpline')}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. "What We Observed" Explanation */}
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 sm:p-7 border border-emerald-700/20 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-emerald-900">
          <Info className="w-5 h-5 text-emerald-700" />
          <h3 className="font-black text-base sm:text-lg text-gray-900">
            {t('result.whatWeFound', 'What We Observed')}
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
          {recommendation?.description || t('result.whatWeFound', 'What We Observed')}
        </p>

        {/* Symptoms checklist */}
        {recommendation?.symptoms?.length > 0 && (
          <div className="pt-3 border-t border-gray-100">
            <div className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2.5">
              {t('result.diagnosticSymptoms', 'What you may notice on plants')}:
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-700">
              {recommendation.symptoms.map((s, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-emerald-50/40 p-3 rounded-xl border border-emerald-100">
                  <span className="text-amber-500 font-bold shrink-0">•</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* 4. "What You Can Do" (Management & Cultural Advice) */}
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 sm:p-7 border border-emerald-700/20 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-emerald-900">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <h3 className="font-black text-base sm:text-lg text-gray-900">
            {t('result.whatYouCanDo', 'What You Can Do')}
          </h3>
        </div>

        {/* Immediate actionable steps */}
        <div className="space-y-2">
          {(recommendation?.prevention || []).slice(0, 3).map((step, idx) => (
            <div key={idx} className="flex items-start gap-2.5 p-3.5 rounded-xl bg-green-50/80 border border-green-100 text-xs text-green-950 font-medium">
              <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span>{step}</span>
            </div>
          ))}
        </div>

        {/* Non-chemical management */}
        <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200/60">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-950 uppercase tracking-wider mb-2">
            <Leaf className="w-4 h-4 text-emerald-700" />
            <span>{t('result.nonChemical', 'Natural & Field Care (Non-Chemical)')}</span>
          </div>
          <ul className="space-y-2 text-xs text-emerald-950">
            {(recommendation?.management?.nonChemical || []).map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <Sprout className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Statutory Chemical Notice */}
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 text-xs text-amber-950 leading-relaxed font-medium">
          ⚠️ <strong>{t('result.chemicalDisclaimer', 'STATUTORY NOTICE: Use only products registered and approved for this crop in your state. Follow the container label strictly and consult your local KVK.')}</strong>
        </div>
      </div>

      {/* 5. "When to Seek Expert Help" */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white rounded-3xl p-5 sm:p-6 shadow-xl border border-emerald-700/50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-emerald-950 flex items-center justify-center shrink-0 shadow-md">
            <PhoneCall className="w-6 h-6 text-emerald-950" />
          </div>
          <div>
            <h4 className="font-black text-sm sm:text-base">
              {t('result.whenToSeekExpert', 'When to Seek Expert Help')}
            </h4>
            <p className="text-xs text-emerald-200 mt-0.5 leading-relaxed">
              {t('result.expertNotice', 'If symptoms spread to more than 20% of the crop canopy or continue worsening, immediately contact your local KVK or agricultural officer.')}
            </p>
          </div>
        </div>
        <a
          href="tel:18001801551"
          className="w-full sm:w-auto text-center bg-amber-400 hover:bg-amber-300 text-emerald-950 px-6 py-3 rounded-xl font-black text-xs shrink-0 shadow-md transition-colors"
        >
          1800-180-1551
        </a>
      </div>

      {/* 6. Dominant "New Diagnosis" Action + Detailed/Technical Modals */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={onReset}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-emerald-950 px-8 py-4 rounded-2xl font-black text-base shadow-lg active:scale-95 transition-all cursor-pointer"
        >
          <Camera className="w-5 h-5 text-emerald-950" />
          <span>{t('result.newDiagnosis', 'New Diagnosis')}</span>
        </button>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={onOpenDetailed}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 bg-white hover:bg-emerald-50 text-emerald-950 border border-emerald-700/30 px-4 py-3.5 rounded-2xl text-xs font-bold shadow-sm transition-colors cursor-pointer"
          >
            <Layers className="w-4 h-4 text-emerald-700" />
            <span>{t('result.viewDetailed', 'Detailed Biological View')}</span>
          </button>

          <button
            type="button"
            onClick={onOpenTechnical}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 bg-gray-900 hover:bg-black text-white px-4 py-3.5 rounded-2xl text-xs font-bold shadow-sm transition-colors cursor-pointer"
          >
            <Sliders className="w-4 h-4 text-amber-300" />
            <span>{t('result.technicalAnalysis', 'Technical ML Analysis')}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="p-3.5 rounded-2xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 shadow-sm transition-colors cursor-pointer"
            title={t('result.printAdvisory', 'Print / Save Advisory')}
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 7. Feedback Widget */}
      <div className="bg-white/80 border border-emerald-700/20 rounded-2xl p-3 text-center shadow-xs">
        {!feedbackSent ? (
          <div className="flex items-center justify-center gap-3 text-xs text-gray-700">
            <span className="font-semibold">{t('result.wasHelpful', 'Was this diagnosis helpful?')}</span>
            <button
              onClick={() => handleFeedback(true)}
              className="flex items-center gap-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 px-3 py-1.5 rounded-xl font-bold cursor-pointer transition-colors"
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>{t('result.yes', 'Yes')}</span>
            </button>
            <button
              onClick={() => handleFeedback(false)}
              className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1.5 rounded-xl font-bold cursor-pointer transition-colors"
            >
              <ThumbsDown className="w-3.5 h-3.5" />
              <span>{t('result.needReview', 'Need Review')}</span>
            </button>
          </div>
        ) : (
          <div className="text-xs text-emerald-700 font-bold flex items-center justify-center gap-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>{t('result.feedbackThanks', 'Thank you for your feedback!')}</span>
          </div>
        )}
      </div>

    </div>
  );
}
