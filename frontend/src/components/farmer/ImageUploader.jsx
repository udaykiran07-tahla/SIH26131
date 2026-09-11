'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  Camera, 
  X, 
  Sparkles, 
  AlertCircle, 
  Loader2, 
  CheckCircle2,
  Leaf
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  isNativeApp, 
  capturePhotoWithNativeCamera, 
  pickPhotoFromNativeGallery 
} from '../../utils/nativeCamera';

export default function ImageUploader({ 
  onAnalyze, 
  isLoading, 
  externalFile, 
  onClearExternal,
  cameraInputRef,
  fileInputRef,
  onFilePreviewChange
}) {
  const { t } = useLanguage();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const localFileInputRef = useRef(null);
  const localCameraInputRef = useRef(null);

  const activeFileInput = fileInputRef || localFileInputRef;
  const activeCameraInput = cameraInputRef || localCameraInputRef;

  // Sync external file (e.g. from 1-Click Demo Sample Selector)
  useEffect(() => {
    if (externalFile) {
      setSelectedFile(externalFile.file);
      setPreviewUrl(externalFile.previewUrl);
      setErrorMessage(null);
      if (onFilePreviewChange) onFilePreviewChange(externalFile.previewUrl);
    }
  }, [externalFile, onFilePreviewChange]);

  const handleValidateAndSetFile = (file) => {
    setErrorMessage(null);
    if (!file) return;

    const validMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validMimes.includes(file.type.toLowerCase())) {
      setErrorMessage(t('validation.invalidType', 'Please upload a clear JPG, JPEG, PNG, or WEBP photo.'));
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage(t('validation.tooLarge', 'Photo is larger than 10MB. Please select a smaller photo.'));
      return;
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    if (onFilePreviewChange) onFilePreviewChange(url);

    if (onClearExternal) onClearExternal();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleValidateAndSetFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleValidateAndSetFile(file);
  };

  const handleRemove = () => {
    setSelectedFile(null);
    if (previewUrl && !previewUrl.startsWith('data:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    if (onFilePreviewChange) onFilePreviewChange(null);
    setErrorMessage(null);
    if (activeFileInput.current) activeFileInput.current.value = '';
    if (activeCameraInput.current) activeCameraInput.current.value = '';
    if (onClearExternal) onClearExternal();
  };

  const handleTriggerNativeCamera = async () => {
    if (isNativeApp()) {
      const file = await capturePhotoWithNativeCamera();
      if (file) handleValidateAndSetFile(file);
    } else {
      activeCameraInput.current?.click();
    }
  };

  const handleTriggerNativeUpload = async () => {
    if (isNativeApp()) {
      const file = await pickPhotoFromNativeGallery();
      if (file) handleValidateAndSetFile(file);
    } else {
      activeFileInput.current?.click();
    }
  };

  const handleSubmit = () => {
    if (!selectedFile) {
      setErrorMessage(t('validation.noImage', 'Please select or take a photo of the crop leaf first.'));
      return;
    }
    onAnalyze(selectedFile);
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-5 sm:p-7 border border-emerald-700/20 shadow-lg">
      
      {/* Hidden File & Camera Inputs */}
      <input
        ref={activeFileInput}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />
      <input
        ref={activeCameraInput}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />

      {!previewUrl ? (
        /* Empty Upload / Dropzone */
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-6 sm:p-10 text-center transition-all ${
            dragOver
              ? 'border-emerald-600 bg-emerald-100/50 scale-[1.01]'
              : 'border-emerald-300/80 hover:border-emerald-500 bg-emerald-50/40'
          }`}
        >
          <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-emerald-100 to-amber-100 text-emerald-800 flex items-center justify-center shadow-inner">
            <Upload className="w-8 h-8 text-emerald-700" />
          </div>

          <h3 className="text-base sm:text-xl font-black text-gray-900 mb-1">
            {t('diagnosis.title', 'Diagnose Crop Leaf')}
          </h3>

          <p className="text-xs text-gray-500 mb-2 max-w-sm mx-auto">
            {t('home.daylightTip', 'Use a clear photo in good daylight for best accuracy.')}
          </p>

          <p className="text-[11px] text-emerald-800 font-medium mb-5">
            {t('diagnosis.dragDropText', 'or drag and drop photo here')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleTriggerNativeCamera}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 px-6 py-3.5 rounded-2xl font-black text-sm shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <Camera className="w-5 h-5" />
              <span>{t('home.takePhoto', 'Take a Photo')}</span>
            </button>

            <button
              type="button"
              onClick={handleTriggerNativeUpload}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-3.5 rounded-2xl font-bold text-sm shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>{t('home.uploadPhoto', 'Upload a Photo')}</span>
            </button>
          </div>

          <div className="text-[10px] text-gray-400 mt-4">
            {t('diagnosis.formatsText', 'Supported: JPG, JPEG, PNG, WEBP (Max 10MB)')}
          </div>
        </div>
      ) : (
        /* Image Preview with Step 2 / Step 3 */
        <div className="space-y-4">
          <div className="relative rounded-2xl overflow-hidden border border-emerald-800/40 bg-gray-950 max-h-84 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="Crop Leaf Preview"
              className="max-h-84 w-auto object-contain rounded-2xl"
            />
            
            <button
              type="button"
              onClick={handleRemove}
              disabled={isLoading}
              className="absolute top-3 right-3 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full shadow-lg transition-transform hover:scale-110 cursor-pointer"
              title={t('diagnosis.changePhoto', 'Change Photo')}
            >
              <X className="w-4 h-4" />
            </button>

            <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-sm text-white px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-2 border border-white/20">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="font-bold">{t('diagnosis.previewTitle', 'Selected Crop Leaf Photo')}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full flex-1 flex items-center justify-center gap-2.5 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-emerald-950 py-4 px-6 rounded-2xl font-black text-base shadow-lg active:scale-98 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-emerald-950" />
                  <span>{t('diagnosis.analyzing', 'Analyzing your crop...')}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-emerald-950" />
                  <span>{t('diagnosis.analyzeButton', 'Analyze Crop')}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleRemove}
              disabled={isLoading}
              className="w-full sm:w-auto px-5 py-4 rounded-2xl border border-gray-300 text-gray-700 hover:bg-gray-100 font-bold text-xs transition-all cursor-pointer"
            >
              {t('diagnosis.changePhoto', 'Change Photo')}
            </button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="mt-3 p-3.5 bg-red-50 border border-red-200 rounded-2xl text-red-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* STEP 3: Clear Loading Animation with HUD styling */}
      {isLoading && (
        <div className="mt-4 p-5 bg-gradient-to-r from-emerald-900/10 via-emerald-800/15 to-emerald-900/10 border border-emerald-600/40 rounded-2xl text-center space-y-2.5 animate-in fade-in duration-200">
          <Loader2 className="w-8 h-8 text-emerald-700 animate-spin mx-auto" />
          <div className="font-black text-sm sm:text-base text-emerald-950">
            {t('diagnosis.analyzing', 'Analyzing your crop...')}
          </div>
          <div className="text-xs text-emerald-900 space-y-1 font-medium">
            <div className="text-emerald-700">✓ {t('diagnosis.analyzingStep1', 'Checking photo clarity & daylight...')}</div>
            <div className="font-bold text-amber-700 animate-pulse">⚙ {t('diagnosis.analyzingStep2', 'Scanning leaf symptoms with neural network...')}</div>
            <div className="text-gray-500">⏳ {t('diagnosis.analyzingStep3', 'Matching verified ICAR crop advice...')}</div>
          </div>
        </div>
      )}

    </div>
  );
}
