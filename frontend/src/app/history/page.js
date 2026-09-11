'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { History, Calendar, RefreshCw, Sprout, ChevronRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { getPredictionHistory, getPrediction } from '../../services/api';
import DetailedInfoModal from '../../components/analysis/DetailedInfoModal';

export default function HistoryPage() {
  const { t, translateCrop, translateCondition, translateType } = useLanguage();
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await getPredictionHistory();
      setPredictions(data.predictions || []);
    } catch (e) {
      console.error('Failed to load history:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleOpenDetails = async (id) => {
    try {
      const data = await getPrediction(id);
      setSelectedRecord(data);
      setModalOpen(true);
    } catch (err) {
      console.error('Unable to load details:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Page Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-emerald-700/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-emerald-950 flex items-center justify-center shrink-0 shadow-md">
            <History className="w-6 h-6 text-emerald-950" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              {t('history.pageTitle', 'My Crop Diagnoses')}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-200 mt-0.5">
              {t('history.pageSubtitle', 'Record of previous crop health checks')}
            </p>
          </div>
        </div>

        <button
          onClick={fetchHistory}
          className="flex items-center gap-2 text-xs font-bold text-emerald-950 bg-amber-400 hover:bg-amber-300 px-4 py-2.5 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer self-start sm:self-center"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>{t('history.refresh', 'Refresh')}</span>
        </button>
      </div>

      {/* History List */}
      {loading ? (
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-10 text-center border border-emerald-700/20 shadow-sm">
          <p className="text-xs text-gray-500">{t('history.loading', 'Loading historical diagnoses...')}</p>
        </div>
      ) : predictions.length === 0 ? (
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-10 text-center border border-emerald-700/20 shadow-sm space-y-3">
          <Sprout className="w-12 h-12 text-emerald-500 mx-auto" />
          <h3 className="text-base font-bold text-gray-900">
            {t('history.empty', 'No diagnoses yet. Take your first crop photo.')}
          </h3>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-3 rounded-xl font-bold text-xs shadow-md"
          >
            {t('history.checkCropNow', 'Check Crop Now')}
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {predictions.map((p) => {
            const conf = Math.round((p.confidence || 0) * 100);
            const cropName = translateCrop(p.crop);
            const condName = translateCondition(p.condition);
            const typeName = translateType(p.conditionType || 'disease');
            return (
              <div
                key={p._id}
                className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border border-emerald-700/20 hover:border-emerald-500 shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 text-xl shadow-inner">
                    🌱
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-black text-emerald-800 uppercase tracking-wider bg-emerald-100 px-2.5 py-0.5 rounded">
                        {cropName}
                      </span>
                      <span className="text-[10px] font-bold text-gray-400 uppercase">
                        {typeName}
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-black text-gray-900 truncate">
                      {condName}
                    </h3>
                    <div className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(p.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                  <div className="text-left sm:text-right">
                    <div className="text-base font-black text-emerald-700">{conf}%</div>
                    <div className="text-[10px] text-gray-500">{t('history.confidence', 'Confidence')}</div>
                  </div>

                  <button
                    onClick={() => handleOpenDetails(p._id)}
                    className="flex items-center gap-1 text-xs font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-2 rounded-xl border border-emerald-200 transition-colors cursor-pointer"
                  >
                    <span>{t('history.viewDetails', 'View Details')}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detailed Modal */}
      {selectedRecord && (
        <DetailedInfoModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          recommendation={selectedRecord.recommendation}
          prediction={selectedRecord.prediction}
        />
      )}

    </div>
  );
}
