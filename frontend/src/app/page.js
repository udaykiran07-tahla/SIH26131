'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { 
  Camera, 
  Upload, 
  BookOpen, 
  History, 
  PhoneCall, 
  ChevronRight, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  Sprout,
  Activity,
  ShieldCheck,
  Zap,
  Leaf,
  Scan
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import HeroFarmer from '../components/farmer/HeroFarmer';
import ImageUploader from '../components/farmer/ImageUploader';
import SampleImageSelector from '../components/farmer/SampleImageSelector';
import ResultCards from '../components/farmer/ResultCards';
import DetailedInfoModal from '../components/analysis/DetailedInfoModal';
import TechnicalAnalysisModal from '../components/analysis/TechnicalAnalysisModal';
import { uploadAndAnalyze, getPredictionHistory } from '../services/api';
import { 
  isNativeApp, 
  capturePhotoWithNativeCamera, 
  pickPhotoFromNativeGallery 
} from '../utils/nativeCamera';

export default function FarmerDashboard() {
  const { t, translateCrop, translateCondition } = useLanguage();

  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSampleId, setActiveSampleId] = useState(null);
  const [externalFile, setExternalFile] = useState(null);
  const [activeFilePreview, setActiveFilePreview] = useState(null);
  const [recentDiagnoses, setRecentDiagnoses] = useState([]);
  const [loadingRecent, setLoadingRecent] = useState(true);

  // Modals
  const [detailedModalOpen, setDetailedModalOpen] = useState(false);
  const [technicalModalOpen, setTechnicalModalOpen] = useState(false);

  const uploaderSectionRef = useRef(null);
  const cameraInputRef = useRef(null);
  const fileInputRef = useRef(null);

  // Load recent diagnoses for the dashboard widget
  const fetchRecent = async () => {
    try {
      const data = await getPredictionHistory(1, 3);
      setRecentDiagnoses(data.predictions || []);
    } catch (e) {
      console.warn('Could not load recent history:', e);
    } finally {
      setLoadingRecent(false);
    }
  };

  useEffect(() => {
    fetchRecent();
  }, [analysisResult]);

  const handleFileSelected = (file) => {
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    setExternalFile({ file, previewUrl });
    setActiveFilePreview(previewUrl);
    uploaderSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Trigger camera capture directly
  const handleTriggerCamera = async () => {
    if (isNativeApp()) {
      const file = await capturePhotoWithNativeCamera();
      if (file) handleFileSelected(file);
    } else if (cameraInputRef.current) {
      cameraInputRef.current.click();
    } else {
      uploaderSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Trigger file upload directly
  const handleTriggerUpload = async () => {
    if (isNativeApp()) {
      const file = await pickPhotoFromNativeGallery();
      if (file) handleFileSelected(file);
    } else if (fileInputRef.current) {
      fileInputRef.current.click();
    } else {
      uploaderSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 1-Click Demo Evaluation Sample handler
  const handleSelectSample = (sample) => {
    setActiveSampleId(sample.id);

    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = sample.type === 'healthy' ? '#166534' : sample.type === 'pest' ? '#7e22ce' : '#92400e';
    ctx.fillRect(0, 0, 256, 256);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(sample.crop, 128, 110);
    ctx.font = '13px sans-serif';
    ctx.fillText(sample.conditionKey, 128, 140);
    ctx.fillText('🌱 SIH Demo Leaf', 128, 170);

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], sample.fileName, { type: 'image/jpeg' });
        const previewUrl = canvas.toDataURL('image/jpeg');
        setExternalFile({ file, previewUrl });
        setActiveFilePreview(previewUrl);
        uploaderSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    }, 'image/jpeg');
  };

  // Analyze crop photo
  const handleAnalyze = async (file) => {
    setIsLoading(true);
    try {
      const data = await uploadAndAnalyze(file);
      setAnalysisResult(data);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      alert(error.message || 'Unable to analyze image. Please verify backend server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setActiveSampleId(null);
    setExternalFile(null);
    setActiveFilePreview(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-7">
      
      {/* If Result exists, show Result View. Otherwise, show Living Agricultural Dashboard */}
      {analysisResult ? (
        <>
          <ResultCards
            result={analysisResult}
            onReset={handleReset}
            onOpenDetailed={() => setDetailedModalOpen(true)}
            onOpenTechnical={() => setTechnicalModalOpen(true)}
          />

          <DetailedInfoModal
            isOpen={detailedModalOpen}
            onClose={() => setDetailedModalOpen(false)}
            recommendation={analysisResult.recommendation}
            prediction={analysisResult.prediction}
          />

          <TechnicalAnalysisModal
            isOpen={technicalModalOpen}
            onClose={() => setTechnicalModalOpen(false)}
            result={analysisResult}
          />
        </>
      ) : (
        <>
          {/* ============================================================== */}
          {/* 1. ATMOSPHERIC AGRICULTURAL HERO WITH "AI CROP VISION"         */}
          {/* ============================================================== */}
          <HeroFarmer
            onTriggerCamera={handleTriggerCamera}
            onTriggerUpload={handleTriggerUpload}
            activeFilePreview={activeFilePreview}
            analysisResult={analysisResult}
            isLoading={isLoading}
          />

          {/* ============================================================== */}
          {/* 2. VISUAL STORY: "From Photo to Protection" (3 Connected Steps)*/}
          {/* ============================================================== */}
          <section className="bg-white/85 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-emerald-700/20 shadow-sm text-center sm:text-left">
            <div className="mb-5 text-center">
              <h3 className="text-base sm:text-xl font-black text-emerald-950">
                🌱 {t('home.storySectionTitle', 'From Photo to Protection')}
              </h3>
              <p className="text-xs sm:text-sm text-emerald-800/80 mt-1">
                {t('home.storySectionSubtitle', 'Simple, reliable crop care in three connected steps')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
              
              {/* Stage 1: Capture */}
              <div className="relative p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100/40 border border-emerald-200/80 flex flex-col items-center sm:items-start text-center sm:text-left shadow-xs">
                <div className="w-12 h-12 rounded-2xl bg-amber-400 text-emerald-950 flex items-center justify-center font-black text-lg mb-3 shadow-sm">
                  📷
                </div>
                <h4 className="font-extrabold text-sm sm:text-base text-gray-900">
                  {t('home.storyStep1Title', '1. Capture')}
                </h4>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  {t('home.storyStep1Desc', 'Photograph the affected leaf or pest in natural daylight')}
                </p>
              </div>

              {/* Stage 2: AI Analysis */}
              <div className="relative p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100/40 border border-emerald-200/80 flex flex-col items-center sm:items-start text-center sm:text-left shadow-xs">
                <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-black text-lg mb-3 shadow-sm">
                  🤖
                </div>
                <h4 className="font-extrabold text-sm sm:text-base text-gray-900">
                  {t('home.storyStep2Title', '2. AI Analysis')}
                </h4>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  {t('home.storyStep2Desc', 'Intelligent vision scans foliar spots and symptom patterns')}
                </p>
              </div>

              {/* Stage 3: Crop Care */}
              <div className="relative p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100/40 border border-emerald-200/80 flex flex-col items-center sm:items-start text-center sm:text-left shadow-xs">
                <div className="w-12 h-12 rounded-2xl bg-green-600 text-white flex items-center justify-center font-black text-lg mb-3 shadow-sm">
                  🌱
                </div>
                <h4 className="font-extrabold text-sm sm:text-base text-gray-900">
                  {t('home.storyStep3Title', '3. Crop Care')}
                </h4>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  {t('home.storyStep3Desc', 'Receive verified ICAR organic remedies and field guidance')}
                </p>
              </div>

            </div>
          </section>

          {/* ============================================================== */}
          {/* 3. DEDICATED IMAGE UPLOADER SECTION (Camera / Dropzone)        */}
          {/* ============================================================== */}
          <div id="diagnose-section" ref={uploaderSectionRef}>
            <ImageUploader
              onAnalyze={handleAnalyze}
              isLoading={isLoading}
              externalFile={externalFile}
              onClearExternal={() => {
                setActiveSampleId(null);
                setExternalFile(null);
                setActiveFilePreview(null);
              }}
              cameraInputRef={cameraInputRef}
              fileInputRef={fileInputRef}
              onFilePreviewChange={(url) => setActiveFilePreview(url)}
            />
          </div>

          {/* ============================================================== */}
          {/* 4. SIH DEMO EVALUATION SAMPLES ("Try the AI")                 */}
          {/* ============================================================== */}
          <SampleImageSelector
            onSelectSample={handleSelectSample}
            activeSampleId={activeSampleId}
          />

          {/* ============================================================== */}
          {/* 5. QUICK ACTIONS (3 Compact Beautiful Feature Cards)           */}
          {/* ============================================================== */}
          <div>
            <h3 className="text-xs font-black text-emerald-950 uppercase tracking-wider mb-3 px-1">
              {t('home.quickActionsTitle', 'Quick Actions')}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <button
                type="button"
                onClick={handleTriggerCamera}
                className="group bg-white/90 backdrop-blur-sm p-4 rounded-2xl border border-emerald-700/20 hover:border-emerald-500 shadow-sm text-left flex items-start gap-3.5 transition-all hover:shadow-md hover:-translate-y-0.5 active:scale-98 cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Camera className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <h4 className="font-black text-sm text-gray-900 group-hover:text-emerald-800">
                    {t('home.actionDiagnose', 'Diagnose Crop')}
                  </h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    {t('home.actionDiagnoseDesc', 'Open camera or upload leaf photo')}
                  </p>
                </div>
              </button>

              <Link
                href="/knowledge"
                className="group bg-white/90 backdrop-blur-sm p-4 rounded-2xl border border-emerald-700/20 hover:border-emerald-500 shadow-sm text-left flex items-start gap-3.5 transition-all hover:shadow-md hover:-translate-y-0.5 active:scale-98"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <BookOpen className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <h4 className="font-black text-sm text-gray-900 group-hover:text-emerald-800">
                    {t('home.actionGuide', 'Crop Guide')}
                  </h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    {t('home.actionGuideDesc', 'Learn about common crop diseases and pests')}
                  </p>
                </div>
              </Link>

              <Link
                href="/history"
                className="group bg-white/90 backdrop-blur-sm p-4 rounded-2xl border border-emerald-700/20 hover:border-emerald-500 shadow-sm text-left flex items-start gap-3.5 transition-all hover:shadow-md hover:-translate-y-0.5 active:scale-98"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <History className="w-5 h-5 text-purple-700" />
                </div>
                <div>
                  <h4 className="font-black text-sm text-gray-900 group-hover:text-emerald-800">
                    {t('home.actionHistory', 'My History')}
                  </h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    {t('home.actionHistoryDesc', 'View your previous crop diagnoses')}
                  </p>
                </div>
              </Link>
            </div>
          </div>

          {/* ============================================================== */}
          {/* 6. RECENT DIAGNOSES WIDGET ("Your Recent Crop Checks")         */}
          {/* ============================================================== */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-5 sm:p-6 border border-emerald-700/20 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-black text-emerald-950 uppercase tracking-wider">
                {t('home.recentTitle', 'Your Recent Crop Checks')}
              </h3>

              {recentDiagnoses.length > 0 && (
                <Link
                  href="/history"
                  className="text-xs font-black text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
                >
                  <span>{t('home.viewAllHistory', 'View All')}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>

            {loadingRecent ? (
              <p className="text-xs text-gray-400 py-2">Loading...</p>
            ) : recentDiagnoses.length === 0 ? (
              <div className="py-4 text-center text-xs text-gray-500">
                {t('home.recentEmpty', 'No diagnoses yet. Take your first crop photo.')}
              </div>
            ) : (
              <div className="space-y-2">
                {recentDiagnoses.map((item) => {
                  const conf = Math.round((item.confidence || 0) * 100);
                  const cropName = translateCrop(item.crop);
                  const condName = translateCondition(item.condition);
                  return (
                    <div
                      key={item._id}
                      className="p-3 bg-emerald-50/40 hover:bg-emerald-50/80 rounded-2xl border border-emerald-100 flex items-center justify-between gap-3 text-xs transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-base">🌱</span>
                        <div className="truncate">
                          <span className="font-extrabold text-gray-900">{cropName}</span>
                          <span className="text-gray-600"> — {condName}</span>
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        <span className="font-black text-emerald-700 text-xs">{conf}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ============================================================== */}
          {/* 7. COMPACT KISAN HELPLINE BANNER                               */}
          {/* ============================================================== */}
          <div className="bg-gradient-to-r from-emerald-900/10 via-emerald-800/10 to-amber-900/10 rounded-2xl p-4 sm:p-5 border border-emerald-700/30 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center shrink-0 shadow-sm">
                <PhoneCall className="w-5 h-5 text-emerald-950" />
              </div>
              <div>
                <h4 className="font-black text-xs sm:text-sm text-emerald-950">
                  {t('home.helpTitle', 'Need expert help?')}
                </h4>
                <p className="text-[11px] text-emerald-800">
                  {t('home.helpSubtitle', 'Talk directly to government agricultural scientists')}
                </p>
              </div>
            </div>

            <a
              href="tel:18001801551"
              className="w-full sm:w-auto text-center bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2.5 rounded-xl font-black text-xs shadow-md transition-colors"
            >
              {t('home.callHelpline', 'Call Kisan Helpline (1800-180-1551)')}
            </a>
          </div>
        </>
      )}

    </div>
  );
}
