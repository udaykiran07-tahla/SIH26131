'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// Import locales
import en from '../locales/en.json';
import te from '../locales/te.json';
import hi from '../locales/hi.json';
import ta from '../locales/ta.json';
import mr from '../locales/mr.json';
import bn from '../locales/bn.json';
import gu from '../locales/gu.json';
import kn from '../locales/kn.json';
import ml from '../locales/ml.json';
import pa from '../locales/pa.json';
import as from '../locales/as.json';
import or from '../locales/or.json';
import ur from '../locales/ur.json';
import sa from '../locales/sa.json';
import ne from '../locales/ne.json';
import kok from '../locales/kok.json';
import mni from '../locales/mni.json';
import mai from '../locales/mai.json';
import ks from '../locales/ks.json';
import sd from '../locales/sd.json';

const translations = {
  en, te, hi, ta, mr, bn, gu, kn, ml, pa,
  as, or, ur, sa, ne, kok, mni, mai, ks, sd
};

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', native: 'English', region: 'All India' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు', region: 'AP & Telangana' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', region: 'North / Central India' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', region: 'Tamil Nadu' },
  { code: 'mr', name: 'Marathi', native: 'मराठी', region: 'Maharashtra' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা', region: 'West Bengal' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી', region: 'Gujarat' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', region: 'Karnataka' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം', region: 'Kerala' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ', region: 'Punjab' },
];

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState('en');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('krishi_lang');
      if (saved && translations[saved]) {
        setLanguageState(saved);
      }
    } catch (e) {
      console.warn('localStorage not accessible:', e);
    }
  }, []);

  const setLanguage = (code) => {
    if (translations[code]) {
      setLanguageState(code);
      try {
        localStorage.setItem('krishi_lang', code);
      } catch (e) {
        console.warn('Failed to save to localStorage:', e);
      }
    }
  };

  /**
   * Helper translation lookup with dot notation e.g. t('home.heroTitle')
   */
  const t = (keyPath, fallback = '') => {
    const currentDict = translations[language] || translations.en;
    const parts = keyPath.split('.');
    
    let current = currentDict;
    for (const part of parts) {
      if (current && current[part] !== undefined) {
        current = current[part];
      } else {
        // Fallback to English
        let enCurrent = translations.en;
        for (const enPart of parts) {
          if (enCurrent && enCurrent[enPart] !== undefined) {
            enCurrent = enCurrent[enPart];
          } else {
            return fallback || keyPath;
          }
        }
        return enCurrent;
      }
    }
    return current || fallback || keyPath;
  };

  /**
   * Helper to translate crop names
   */
  const translateCrop = (cropName) => {
    if (!cropName) return '';
    const currentDict = translations[language] || translations.en;
    if (currentDict.crops && currentDict.crops[cropName]) {
      return currentDict.crops[cropName];
    }
    return cropName;
  };

  /**
   * Helper to translate condition common names
   */
  const translateCondition = (conditionName) => {
    if (!conditionName) return '';
    const currentDict = translations[language] || translations.en;
    if (currentDict.conditions && currentDict.conditions[conditionName]) {
      return currentDict.conditions[conditionName];
    }
    return conditionName;
  };

  /**
   * Helper to translate condition type (disease/pest/healthy)
   */
  const translateType = (type) => {
    if (!type) return '';
    const currentDict = translations[language] || translations.en;
    if (currentDict.types && currentDict.types[type.toLowerCase()]) {
      return currentDict.types[type.toLowerCase()];
    }
    return type;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        translateCrop,
        translateCondition,
        translateType,
        languages: SUPPORTED_LANGUAGES,
        currentLanguageInfo: SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0],
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
