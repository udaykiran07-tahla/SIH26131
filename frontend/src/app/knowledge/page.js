'use client';

import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Search, 
  Leaf, 
  ShieldCheck, 
  ExternalLink, 
  ChevronDown, 
  ChevronUp, 
  AlertCircle 
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { getConditions, getCrops } from '../../services/api';

export default function KnowledgePage() {
  const { t, translateCrop, translateCondition, translateType } = useLanguage();
  const [conditions, setConditions] = useState([]);
  const [crops, setCrops] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [condData, cropData] = await Promise.all([
          getConditions({ crop: selectedCrop, type: selectedType, search: searchQuery }),
          getCrops(),
        ]);
        setConditions(condData || []);
        setCrops(cropData || []);
      } catch (e) {
        console.error('Failed to load knowledge base:', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [selectedCrop, selectedType, searchQuery]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-emerald-700/40">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-emerald-950 flex items-center justify-center shrink-0 shadow-md">
            <BookOpen className="w-6 h-6 text-emerald-950" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black">
              {t('knowledge.pageTitle', 'Crop Guide & Knowledge Base')}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-200 mt-0.5">
              {t('knowledge.pageSubtitle', 'Learn about common crop diseases, pests, and natural remedies')}
            </p>
          </div>
        </div>
      </div>

      {/* Clean Search and Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('knowledge.searchPlaceholder', 'Search by crop, disease, or symptom...')}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Crop Selector */}
          <select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="w-1/2 sm:w-auto px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm font-semibold text-gray-700 bg-white"
          >
            <option value="">{t('knowledge.allCrops', 'All Crops')}</option>
            {crops.map((c) => (
              <option key={c._id} value={c.name}>
                {translateCrop(c.name)}
              </option>
            ))}
          </select>

          {/* Type Selector */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-1/2 sm:w-auto px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm font-semibold text-gray-700 bg-white"
          >
            <option value="">{t('knowledge.allTypes', 'All Types')}</option>
            <option value="disease">{t('knowledge.diseases', 'Diseases')}</option>
            <option value="pest">{t('knowledge.pests', 'Pests')}</option>
            <option value="healthy">{t('knowledge.healthy', 'Healthy')}</option>
          </select>
        </div>
      </div>

      {/* Conditions Cards */}
      {loading ? (
        <div className="bg-white rounded-3xl p-10 text-center border border-gray-200 shadow-sm">
          <p className="text-xs text-gray-500">{t('knowledge.loading', 'Loading crop knowledge...')}</p>
        </div>
      ) : conditions.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border border-gray-200 shadow-sm">
          <p className="text-xs text-gray-500">{t('knowledge.emptyResult', 'No conditions found matching your search.')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {conditions.map((item) => {
            const isExpanded = expandedId === item._id;
            const cropName = translateCrop(item.crop);
            const condName = translateCondition(item.name);
            const typeName = translateType(item.type);

            return (
              <div
                key={item._id}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden transition-all hover:border-emerald-500"
              >
                {/* Collapsed Header */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : item._id)}
                  className="p-4 sm:p-5 flex items-center justify-between gap-3 cursor-pointer hover:bg-gray-50/70"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded">
                        {cropName}
                      </span>
                      <span className="text-[10px] font-bold text-gray-400 uppercase">
                        {typeName}
                      </span>
                      {item.scientificName && (
                        <span className="text-xs italic font-serif text-gray-400 hidden sm:inline">
                          ({item.scientificName})
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm sm:text-base font-extrabold text-gray-900 truncate">
                      {condName}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                      {item.description}
                    </p>
                  </div>

                  <div className="p-1.5 text-gray-400 shrink-0">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-4 pb-5 sm:px-5 space-y-3.5 border-t border-gray-100 pt-3 text-xs text-gray-700">
                    
                    {/* Symptoms */}
                    {item.symptoms?.length > 0 && (
                      <div>
                        <div className="font-bold text-gray-900 uppercase tracking-wider text-[11px] mb-1">
                          {t('knowledge.symptomsHeader', 'Symptoms:')}
                        </div>
                        <ul className="list-disc pl-4 space-y-0.5 text-gray-600">
                          {item.symptoms.map((s, idx) => (
                            <li key={idx}>{s}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Causes */}
                    {item.causes?.length > 0 && (
                      <div>
                        <div className="font-bold text-gray-900 uppercase tracking-wider text-[11px] mb-1">
                          {t('knowledge.causesHeader', 'Causes:')}
                        </div>
                        <ul className="list-disc pl-4 space-y-0.5 text-gray-600">
                          {item.causes.map((c, idx) => (
                            <li key={idx}>{c}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Prevention & Field Care */}
                    <div className="bg-green-50/70 p-3 rounded-xl border border-green-100">
                      <div className="font-bold text-green-950 uppercase tracking-wider text-[11px] mb-1 flex items-center gap-1">
                        <Leaf className="w-3.5 h-3.5 text-green-700" />
                        <span>{t('knowledge.preventionHeader', 'Prevention & Field Care:')}</span>
                      </div>
                      <ul className="list-disc pl-4 space-y-0.5 text-green-900">
                        {(item.management?.nonChemical || item.prevention || []).map((m, idx) => (
                          <li key={idx}>{m}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Chemical Guidance */}
                    <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200">
                      <div className="font-bold text-amber-950 uppercase tracking-wider text-[11px] mb-1 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                        <span>{t('knowledge.chemicalHeader', 'Chemical Advice & Safety Notice:')}</span>
                      </div>
                      <p className="text-amber-900 mb-1.5 leading-relaxed">
                        {item.management?.chemical?.guidance}
                      </p>
                      <div className="text-[10px] text-amber-950 font-medium">
                        {item.management?.chemical?.disclaimer}
                      </div>
                    </div>

                    {/* Citations */}
                    {item.references?.length > 0 && (
                      <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
                        <span>{t('knowledge.sourceLabel', 'Verified Source:')} {item.references[0]?.organization}</span>
                        {item.references[0]?.url && (
                          <a
                            href={item.references[0].url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-emerald-700 hover:text-emerald-900 font-bold inline-flex items-center gap-1"
                          >
                            {t('knowledge.verifyLink', 'Verify')} <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    )}

                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
