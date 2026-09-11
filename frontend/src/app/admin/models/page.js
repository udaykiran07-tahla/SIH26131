'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Cpu, Plus, ArrowLeft, CheckCircle, Clock, ShieldCheck, X } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { getModelVersions, createModelVersion } from '../../../services/api';

export default function ModelManagementPage() {
  const { token, isAuthenticated } = useAuth();
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [name, setName] = useState('MobileNetV3-PlantDisease');
  const [version, setVersion] = useState('v1.2.0-field');
  const [framework, setFramework] = useState('PyTorch / MobileNetV3');
  const [datasetVersion, setDatasetVersion] = useState('PlantVillage-India-v1.3');
  const [accuracy, setAccuracy] = useState('94.8');
  const [precision, setPrecision] = useState('94.2');
  const [recall, setRecall] = useState('94.5');
  const [f1Score, setF1Score] = useState('94.3');
  const [status, setStatus] = useState('Testing');
  const [notes, setNotes] = useState('Tested against AP and Karnataka KVK validation set.');
  const [submitting, setSubmitting] = useState(false);

  const fetchModels = async () => {
    setLoading(true);
    try {
      const data = await getModelVersions();
      setModels(data || []);
    } catch (e) {
      console.error('Failed to load models:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  const handleCreateModel = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createModelVersion(
        {
          name,
          version,
          framework,
          datasetVersion,
          accuracy: accuracy ? parseFloat(accuracy) : null,
          precision: precision ? parseFloat(precision) : null,
          recall: recall ? parseFloat(recall) : null,
          f1Score: f1Score ? parseFloat(f1Score) : null,
          status,
          notes,
        },
        token
      );
      setShowAddModal(false);
      await fetchModels();
      alert('Model version registered successfully!');
    } catch (err) {
      alert(err.message || 'Failed to register model');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/admin"
            className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-900 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Admin Dashboard</span>
          </Link>
          <div className="flex items-center gap-2">
            <Cpu className="w-7 h-7 text-purple-700" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              AI/ML Model Version Management
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500">
            Track CNN model weights, evaluated benchmark metrics, and production status
          </p>
        </div>

        {isAuthenticated && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 bg-purple-700 hover:bg-purple-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Register Model Version</span>
          </button>
        )}
      </div>

      {/* Model Cards List */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-200">
            <p className="text-sm text-gray-500">Loading model catalog...</p>
          </div>
        ) : models.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-200">
            <p className="text-sm text-gray-500">No model versions tracked yet.</p>
          </div>
        ) : (
          models.map((m) => (
            <div
              key={m._id}
              className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-extrabold text-gray-900">{m.name}</h3>
                    <span className="font-mono text-xs bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded">
                      {m.version}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Framework: <span className="font-semibold text-gray-700">{m.framework}</span> • Dataset: <span className="font-semibold text-gray-700">{m.datasetVersion}</span>
                  </p>
                </div>

                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                  m.status === 'Active'
                    ? 'bg-green-100 text-green-800 border border-green-300'
                    : m.status === 'Testing'
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  ● {m.status}
                </span>
              </div>

              {/* Verified Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                  <div className="text-[10px] text-gray-400 font-bold uppercase">Accuracy</div>
                  <div className="text-lg font-black text-gray-900 mt-0.5">
                    {m.accuracy !== null ? `${m.accuracy}%` : 'Pending Eval'}
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                  <div className="text-[10px] text-gray-400 font-bold uppercase">Precision</div>
                  <div className="text-lg font-black text-gray-900 mt-0.5">
                    {m.precision !== null ? `${m.precision}%` : 'Pending Eval'}
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                  <div className="text-[10px] text-gray-400 font-bold uppercase">Recall</div>
                  <div className="text-lg font-black text-gray-900 mt-0.5">
                    {m.recall !== null ? `${m.recall}%` : 'Pending Eval'}
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                  <div className="text-[10px] text-gray-400 font-bold uppercase">F1-Score</div>
                  <div className="text-lg font-black text-gray-900 mt-0.5">
                    {m.f1Score !== null ? `${m.f1Score}%` : 'Pending Eval'}
                  </div>
                </div>
              </div>

              {m.notes && (
                <p className="text-xs text-gray-600 italic bg-purple-50/40 p-3 rounded-xl border border-purple-100">
                  Note: {m.notes}
                </p>
              )}
            </div>
          ))
        )}
      </div>

      {/* Register Model Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-lg text-gray-900">Register Evaluated Model Version</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateModel} className="space-y-3.5 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Model Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Version String</label>
                  <input
                    type="text"
                    value={version}
                    onChange={(e) => setVersion(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm bg-white"
                  >
                    <option value="Testing">Testing</option>
                    <option value="Active">Active</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Framework & Architecture</label>
                <input
                  type="text"
                  value={framework}
                  onChange={(e) => setFramework(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm"
                />
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="block font-bold text-gray-700 text-[11px] mb-1">Accuracy %</label>
                  <input
                    type="number"
                    step="0.1"
                    value={accuracy}
                    onChange={(e) => setAccuracy(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl border border-gray-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 text-[11px] mb-1">Precision %</label>
                  <input
                    type="number"
                    step="0.1"
                    value={precision}
                    onChange={(e) => setPrecision(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl border border-gray-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 text-[11px] mb-1">Recall %</label>
                  <input
                    type="number"
                    step="0.1"
                    value={recall}
                    onChange={(e) => setRecall(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl border border-gray-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 text-[11px] mb-1">F1 %</label>
                  <input
                    type="number"
                    step="0.1"
                    value={f1Score}
                    onChange={(e) => setF1Score(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl border border-gray-200 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Evaluation Notes</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-purple-700 hover:bg-purple-800 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md"
                >
                  {submitting ? 'Registering...' : 'Register Model'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
