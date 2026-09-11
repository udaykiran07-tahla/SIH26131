'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Database, 
  BookOpen, 
  Cpu, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  ShieldCheck, 
  Lock, 
  LogOut, 
  RefreshCw 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { adminLogin, getDashboardStats } from '../../services/api';

export default function AdminPage() {
  const { isAuthenticated, login, logout, admin } = useAuth();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [loginError, setLoginError] = useState(null);
  const [loadingLogin, setLoadingLogin] = useState(false);

  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoadingLogin(true);
    setLoginError(null);
    try {
      const data = await adminLogin(username, password);
      login(data.token, data.admin);
    } catch (err) {
      setLoginError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoadingLogin(false);
    }
  };

  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load dashboard stats:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchStats();
    }
  }, [isAuthenticated]);

  // If not logged in, render clean admin login
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-12">
        <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7" />
          </div>

          <h2 className="text-2xl font-extrabold text-center text-gray-900 mb-1">
            Admin / Server Manager Portal
          </h2>
          <p className="text-xs text-center text-gray-500 mb-6">
            Manage agricultural knowledge base, dataset samples, and model versions
          </p>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            {loginError && (
              <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loadingLogin}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-3.5 rounded-xl font-bold text-sm shadow-md active:scale-98 transition-all"
            >
              {loadingLogin ? 'Authenticating...' : 'Sign In to Admin Dashboard'}
            </button>
          </form>

          {/* Quick testing helper for SIH judges */}
          <div className="mt-6 pt-4 border-t border-gray-100 text-center text-xs text-gray-500">
            <span>Prototype Default: </span>
            <code className="bg-gray-100 px-2 py-0.5 rounded font-mono text-emerald-800">admin</code> / <code className="bg-gray-100 px-2 py-0.5 rounded font-mono text-emerald-800">admin123</code>
          </div>
        </div>
      </div>
    );
  }

  const metrics = stats?.metrics || {};
  const charts = stats?.charts || {};

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      {/* Admin Header Bar */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
              Agricultural Administration
            </span>
            <span className="text-xs text-gray-400">• Logged in as {admin?.username}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            System Analytics & Management Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchStats}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh Stats</span>
          </button>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 text-xs font-semibold border border-red-200"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Admin Module Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/admin/dataset"
          className="group bg-gradient-to-br from-emerald-800 to-green-900 text-white p-6 rounded-3xl shadow-md hover:shadow-lg transition-all"
        >
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Database className="w-6 h-6 text-amber-300" />
          </div>
          <h3 className="text-lg font-bold mb-1">Dataset Management</h3>
          <p className="text-xs text-emerald-100 mb-3">
            Upload new sample images, label crops and pests, manage CSV bulk imports.
          </p>
          <span className="text-xs font-bold text-amber-300 inline-flex items-center gap-1">
            Open Dataset Portal →
          </span>
        </Link>

        <Link
          href="/admin/conditions"
          className="group bg-gradient-to-br from-teal-800 to-emerald-950 text-white p-6 rounded-3xl shadow-md hover:shadow-lg transition-all"
        >
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <BookOpen className="w-6 h-6 text-emerald-300" />
          </div>
          <h3 className="text-lg font-bold mb-1">Knowledge Base CRUD</h3>
          <p className="text-xs text-emerald-100 mb-3">
            Add new crops, foliar diseases, pests, non-chemical controls, and ICAR references.
          </p>
          <span className="text-xs font-bold text-emerald-300 inline-flex items-center gap-1">
            Manage Conditions →
          </span>
        </Link>

        <Link
          href="/admin/models"
          className="group bg-gradient-to-br from-gray-900 to-slate-950 text-white p-6 rounded-3xl shadow-md hover:shadow-lg transition-all"
        >
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Cpu className="w-6 h-6 text-purple-300" />
          </div>
          <h3 className="text-lg font-bold mb-1">Model Versioning</h3>
          <p className="text-xs text-gray-300 mb-3">
            Track CNN model versions, test accuracy metrics, and deployment status.
          </p>
          <span className="text-xs font-bold text-purple-300 inline-flex items-center gap-1">
            Inspect Models →
          </span>
        </Link>
      </div>

      {/* Dynamic MongoDB Metric Cards */}
      <div>
        <h3 className="font-extrabold text-lg text-gray-900 mb-4">
          Real-Time MongoDB Platform Intelligence
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <div className="text-xs text-gray-500 font-medium">Total Diagnoses</div>
            <div className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">
              {metrics.totalPredictions ?? 0}
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1">Recorded in DB</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <div className="text-xs text-gray-500 font-medium">Diseases Detected</div>
            <div className="text-2xl sm:text-3xl font-black text-amber-600 mt-1">
              {metrics.totalDiseasesDetected ?? 0}
            </div>
            <div className="text-[11px] text-gray-400 mt-1">Foliar Pathogens</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <div className="text-xs text-gray-500 font-medium">Pests Detected</div>
            <div className="text-2xl sm:text-3xl font-black text-purple-600 mt-1">
              {metrics.totalPestsDetected ?? 0}
            </div>
            <div className="text-[11px] text-gray-400 mt-1">Insect Borers & Vectors</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <div className="text-xs text-gray-500 font-medium">Dataset Samples</div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-700 mt-1">
              {metrics.totalDatasetSamples ?? 0}
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1">Training Vault</div>
          </div>

        </div>
      </div>

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Crop Breakdown */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
          <h4 className="font-extrabold text-base text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <span>Diagnoses by Crop Type</span>
          </h4>
          <div className="space-y-3">
            {(charts.cropDistribution || []).map((c, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>{c.name}</span>
                  <span className="text-emerald-800">{c.count} scans</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-emerald-600 h-2.5 rounded-full"
                    style={{ width: `${Math.min(100, c.count * 20)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Condition Breakdown */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
          <h4 className="font-extrabold text-base text-gray-900 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-amber-600" />
            <span>Most Frequent Conditions</span>
          </h4>
          <div className="space-y-3">
            {(charts.conditionDistribution || []).map((cond, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>{cond.name}</span>
                  <span className="text-amber-800">{cond.count} cases</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-amber-500 h-2.5 rounded-full"
                    style={{ width: `${Math.min(100, cond.count * 25)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
