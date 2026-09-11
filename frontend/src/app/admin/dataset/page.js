'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Database, 
  Plus, 
  Upload, 
  Trash2, 
  Search, 
  ArrowLeft, 
  FileText, 
  CheckCircle, 
  X, 
  RefreshCw 
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { 
  getDatasetSamples, 
  uploadDatasetSample, 
  bulkUploadDatasetCsv, 
  deleteDatasetSample, 
  getCrops, 
  getConditions 
} from '../../../services/api';

export default function DatasetManagementPage() {
  const { token, isAuthenticated } = useAuth();
  const [samples, setSamples] = useState([]);
  const [crops, setCrops] = useState([]);
  const [conditions, setConditions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCsvModal, setShowCsvModal] = useState(false);

  // Form State
  const [newCrop, setNewCrop] = useState('Tomato');
  const [newCondition, setNewCondition] = useState('Tomato Early Blight');
  const [newLabel, setNewLabel] = useState('');
  const [newCategory, setNewCategory] = useState('diseased');
  const [newDescription, setNewDescription] = useState('');
  const [newSource, setNewSource] = useState('KVK Field Survey / PlantVillage');
  const [sampleFile, setSampleFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // CSV Bulk state
  const [csvText, setCsvText] = useState(
    'imageName,crop,condition,category,label,source\n' +
    'paddy_blast_002.jpg,Rice,Rice Blast,diseased,Rice Blast Spindle,ICAR-NRRI\n' +
    'cotton_bw_002.jpg,Cotton,Cotton Bollworm Infestation,pest,Cotton Bollworm Larva,CICR Survey\n' +
    'potato_lb_002.jpg,Potato,Potato Late Blight,diseased,Potato Late Blight Foliar,CPRI Shimla'
  );

  const loadData = async () => {
    setLoading(true);
    try {
      const [sampleRes, cropRes, condRes] = await Promise.all([
        getDatasetSamples({ search, category: filterCategory }),
        getCrops(),
        getConditions(),
      ]);
      setSamples(sampleRes.samples || []);
      setCrops(cropRes || []);
      setConditions(condRes || []);
    } catch (e) {
      console.error('Error loading dataset:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [search, filterCategory]);

  const handleCreateSample = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formData = new FormData();
      if (sampleFile) {
        formData.append('image', sampleFile);
      }
      formData.append('crop', newCrop);
      formData.append('condition', newCondition);
      formData.append('label', newLabel || `${newCrop} - ${newCondition}`);
      formData.append('category', newCategory);
      formData.append('description', newDescription);
      formData.append('source', newSource);

      await uploadDatasetSample(formData, token);
      setShowAddModal(false);
      setSampleFile(null);
      setNewLabel('');
      setNewDescription('');
      await loadData();
      alert('Dataset sample added successfully! Dynamic count updated.');
    } catch (err) {
      alert(err.message || 'Failed to upload sample');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBulkCsv = async () => {
    setSubmitting(true);
    try {
      const lines = csvText.trim().split('\n');
      if (lines.length <= 1) {
        alert('CSV must contain header and at least one data row.');
        return;
      }
      const headers = lines[0].split(',').map((h) => h.trim());
      const rows = [];
      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(',').map((p) => p.trim());
        if (parts.length >= 4) {
          rows.push({
            imageName: parts[0],
            crop: parts[1],
            condition: parts[2],
            category: parts[3],
            label: parts[4] || `${parts[1]} - ${parts[2]}`,
            source: parts[5] || 'CSV Import',
          });
        }
      }

      await bulkUploadDatasetCsv(rows, token);
      setShowCsvModal(false);
      await loadData();
      alert(`Imported ${rows.length} dataset samples into MongoDB successfully!`);
    } catch (err) {
      alert(err.message || 'CSV Import failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this dataset sample?')) return;
    try {
      await deleteDatasetSample(id, token);
      await loadData();
    } catch (e) {
      alert('Delete failed: ' + e.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Top Breadcrumb & Actions */}
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
            <Database className="w-7 h-7 text-emerald-700" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              Dataset Management
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500">
            Upload and organize labeled crop foliar images for CNN model expansion
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setShowCsvModal(true)}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-50"
          >
            <FileText className="w-4 h-4 text-gray-600" />
            <span>Bulk CSV Import</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Sample</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search dataset samples by label, crop, or condition..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
        </div>

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="w-full sm:w-auto px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 bg-white"
        >
          <option value="">All Categories</option>
          <option value="diseased">Diseased Samples</option>
          <option value="pest">Pest Infestation Samples</option>
          <option value="healthy">Healthy Baseline</option>
        </select>
      </div>

      {/* Dataset Samples Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-left text-xs">
            <thead className="bg-gray-50 text-gray-600 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Sample Image</th>
                <th className="px-6 py-4">Crop</th>
                <th className="px-6 py-4">Condition & Label</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Source</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-400">
                    Loading dataset records...
                  </td>
                </tr>
              ) : samples.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-400">
                    No dataset samples recorded yet. Click &quot;Add New Sample&quot; to demonstrate scalability!
                  </td>
                </tr>
              ) : (
                samples.map((s) => (
                  <tr key={s._id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="w-12 h-12 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-lg">
                        🌱
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">
                      {s.crop}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{s.condition}</div>
                      <div className="text-gray-500 text-[11px]">{s.label}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full font-bold uppercase text-[10px] ${
                        s.category === 'healthy'
                          ? 'bg-green-100 text-green-800'
                          : s.category === 'pest'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {s.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {s.source}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>{s.status || 'Verified'}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {isAuthenticated && (
                        <button
                          onClick={() => handleDelete(s._id)}
                          className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete sample"
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
      </div>

      {/* Add New Sample Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-lg text-gray-900">Add New Dataset Sample</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSample} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Select Crop</label>
                <select
                  value={newCrop}
                  onChange={(e) => setNewCrop(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm"
                >
                  {crops.map((c) => (
                    <option key={c._id} value={c.name}>{c.name}</option>
                  ))}
                  <option value="Cotton">Cotton</option>
                  <option value="Corn (Maize)">Corn (Maize)</option>
                  <option value="Wheat">Wheat</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Condition / Pest Name</label>
                <input
                  type="text"
                  value={newCondition}
                  onChange={(e) => setNewCondition(e.target.value)}
                  placeholder="e.g. Tomato Early Blight, Cotton Bollworm"
                  required
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Sample Label</label>
                <input
                  type="text"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="e.g. Concentric ring foliar lesion"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm"
                >
                  <option value="diseased">Diseased Foliage</option>
                  <option value="pest">Insect Pest Infestation</option>
                  <option value="healthy">Healthy Baseline</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Sample Photo (Optional)</label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => setSampleFile(e.target.files?.[0] || null)}
                  className="w-full text-xs text-gray-500"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Dataset Source / Citation</label>
                <input
                  type="text"
                  value={newSource}
                  onChange={(e) => setNewSource(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm"
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
                  className="bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md"
                >
                  {submitting ? 'Saving...' : 'Add Sample to Vault'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk CSV Modal */}
      {showCsvModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-lg text-gray-900">Bulk CSV Dataset Import</h3>
              <button onClick={() => setShowCsvModal(false)} className="text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mb-3">
              Format: <code>imageName,crop,condition,category,label,source</code>
            </p>
            <textarea
              rows={8}
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              className="w-full p-3 font-mono text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowCsvModal(false)}
                className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkCsv}
                disabled={submitting}
                className="bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md"
              >
                {submitting ? 'Importing...' : 'Parse & Insert Rows'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
