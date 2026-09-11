'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, Plus, ArrowLeft, Trash2, X, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { getConditions, getCrops, createCondition, deleteCondition } from '../../../services/api';

export default function AdminConditionsPage() {
  const { token, isAuthenticated } = useAuth();
  const [conditions, setConditions] = useState([]);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [crop, setCrop] = useState('Tomato');
  const [type, setType] = useState('disease');
  const [scientificName, setScientificName] = useState('');
  const [description, setDescription] = useState('');
  const [symptomsText, setSymptomsText] = useState('');
  const [causesText, setCausesText] = useState('');
  const [preventionText, setPreventionText] = useState('');
  const [nonChemicalText, setNonChemicalText] = useState('');
  const [chemicalGuidance, setChemicalGuidance] = useState('Apply approved regional fungicides upon reaching economic threshold level.');
  const [referenceOrg, setReferenceOrg] = useState('Indian Council of Agricultural Research (ICAR)');
  const [referenceTitle, setReferenceTitle] = useState('Standard Package of Practices');
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [condData, cropData] = await Promise.all([
        getConditions(),
        getCrops(),
      ]);
      setConditions(condData || []);
      setCrops(cropData || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        name,
        crop,
        type,
        scientificName,
        description,
        symptoms: symptomsText.split('\n').map((s) => s.trim()).filter(Boolean),
        causes: causesText.split('\n').map((c) => c.trim()).filter(Boolean),
        prevention: preventionText.split('\n').map((p) => p.trim()).filter(Boolean),
        management: {
          nonChemical: nonChemicalText.split('\n').map((m) => m.trim()).filter(Boolean),
          chemical: {
            guidance: chemicalGuidance,
            activeIngredients: [],
            disclaimer: 'IMPORTANT STATUTORY NOTICE: Use only products registered and approved for this crop in your state. Follow product label instructions strictly and consult your local KVK.',
          },
        },
        references: [
          {
            organization: referenceOrg,
            title: referenceTitle,
            url: 'https://icar.org.in',
            dateChecked: new Date(),
          },
        ],
      };

      await createCondition(payload, token);
      setShowAddModal(false);
      setName('');
      setDescription('');
      setSymptomsText('');
      setCausesText('');
      setPreventionText('');
      setNonChemicalText('');
      await loadData();
      alert('New agricultural condition added to Knowledge Base!');
    } catch (err) {
      alert(err.message || 'Failed to add condition');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to remove this condition from the knowledge base?')) return;
    try {
      await deleteCondition(id, token);
      await loadData();
    } catch (e) {
      alert('Delete failed: ' + e.message);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Header */}
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
            <BookOpen className="w-7 h-7 text-teal-700" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              Knowledge Base Management (CRUD)
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500">
            Maintain verified agricultural monographs, non-chemical remedies, and statutory guidance
          </p>
        </div>

        {isAuthenticated && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 bg-teal-700 hover:bg-teal-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Condition</span>
          </button>
        )}
      </div>

      {/* Conditions Table */}
      <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-left text-xs">
          <thead className="bg-gray-50 text-gray-600 font-bold uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Condition Name</th>
              <th className="px-6 py-4">Crop</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Scientific Name</th>
              <th className="px-6 py-4">Primary Source</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {loading ? (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                  Loading catalog...
                </td>
              </tr>
            ) : conditions.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                  No conditions registered.
                </td>
              </tr>
            ) : (
              conditions.map((cond) => (
                <tr key={cond._id} className="hover:bg-gray-50/80">
                  <td className="px-6 py-4 font-bold text-gray-900">
                    {cond.name}
                  </td>
                  <td className="px-6 py-4 font-semibold text-emerald-800">
                    {cond.crop}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                      cond.type === 'pest' ? 'bg-purple-100 text-purple-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {cond.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 italic text-gray-500">
                    {cond.scientificName || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {cond.references?.[0]?.organization || 'ICAR'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {isAuthenticated && (
                      <button
                        onClick={() => handleDelete(cond._id)}
                        className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded-lg"
                        title="Delete condition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Condition Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-lg text-gray-900">Add Agricultural Condition</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Condition Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="e.g. Wheat Leaf Rust"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Crop</label>
                  <select
                    value={crop}
                    onChange={(e) => setCrop(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm bg-white"
                  >
                    {crops.map((c) => (
                      <option key={c._id} value={c.name}>{c.name}</option>
                    ))}
                    <option value="Wheat">Wheat</option>
                    <option value="Apple">Apple</option>
                    <option value="Grape">Grape</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm bg-white"
                  >
                    <option value="disease">Foliar Disease</option>
                    <option value="pest">Insect Pest</option>
                    <option value="healthy">Healthy Baseline</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Scientific / Latin Name</label>
                  <input
                    type="text"
                    value={scientificName}
                    onChange={(e) => setScientificName(e.target.value)}
                    placeholder="e.g. Puccinia triticina"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  placeholder="Farmer-friendly summary of the disease/pest..."
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Symptoms (One per line)</label>
                <textarea
                  rows={3}
                  value={symptomsText}
                  onChange={(e) => setSymptomsText(e.target.value)}
                  placeholder="Small orange-brown pustules scattered on upper leaf surface&#10;Yellowing and premature leaf senescence"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Possible Causes (One per line)</label>
                <textarea
                  rows={2}
                  value={causesText}
                  onChange={(e) => setCausesText(e.target.value)}
                  placeholder="Cool moist weather (15-25°C) with morning dew&#10;Wind-blown fungal urediniospores"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Non-Chemical & Cultural Measures (One per line)</label>
                <textarea
                  rows={2}
                  value={nonChemicalText}
                  onChange={(e) => setNonChemicalText(e.target.value)}
                  placeholder="Sow rust-resistant varieties recommended by ICAR&#10;Destroy volunteer wheat seedlings and weed hosts"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Reference Organization</label>
                  <input
                    type="text"
                    value={referenceOrg}
                    onChange={(e) => setReferenceOrg(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Reference Publication</label>
                  <input
                    type="text"
                    value={referenceTitle}
                    onChange={(e) => setReferenceTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm"
                  />
                </div>
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
                  className="bg-teal-700 hover:bg-teal-800 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md"
                >
                  {submitting ? 'Saving...' : 'Add to Knowledge Base'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
