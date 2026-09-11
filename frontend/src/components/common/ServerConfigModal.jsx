'use client';

import React, { useState, useEffect } from 'react';
import { Server, Check, X, RefreshCw, Smartphone, Laptop, AlertCircle } from 'lucide-react';
import { getApiBaseUrl, setCustomApiUrl, getCrops } from '../../services/api';

export default function ServerConfigModal({ isOpen, onClose }) {
  const [currentUrl, setCurrentUrl] = useState('');
  const [customInput, setCustomInput] = useState('');
  const [pingStatus, setPingStatus] = useState(null); // 'checking' | 'success' | 'failed'
  const [pingMessage, setPingMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      const active = getApiBaseUrl();
      setCurrentUrl(active);
      const saved = localStorage.getItem('kisan_custom_api_url') || '';
      setCustomInput(saved);
      setPingStatus(null);
      setPingMessage('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestConnection = async (urlToTest) => {
    setPingStatus('checking');
    setPingMessage('Testing connection to backend...');
    try {
      const target = urlToTest || getApiBaseUrl();
      const res = await fetch(`${target.replace(/\/+$/, '')}/crops`, { method: 'GET' });
      if (res.ok) {
        setPingStatus('success');
        setPingMessage('Connected successfully! Backend is online and responding.');
      } else {
        setPingStatus('failed');
        setPingMessage(`Server responded with status ${res.status}`);
      }
    } catch (err) {
      setPingStatus('failed');
      setPingMessage(`Connection failed: ${err.message}. Ensure backend is running.`);
    }
  };

  const handleApplyPreset = (preset) => {
    setCustomInput(preset);
    setCustomApiUrl(preset);
    setCurrentUrl(getApiBaseUrl());
    handleTestConnection(preset);
  };

  const handleSaveCustom = () => {
    setCustomApiUrl(customInput);
    setCurrentUrl(getApiBaseUrl());
    handleTestConnection(customInput);
  };

  const handleReset = () => {
    setCustomInput('');
    setCustomApiUrl('');
    setCurrentUrl(getApiBaseUrl());
    handleTestConnection();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-gray-200 text-gray-900 space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base text-gray-900">Backend Server Connection</h3>
              <p className="text-[11px] text-gray-500">Configure API host for Android Emulator or Physical Device</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-xl hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Active URL */}
        <div className="bg-emerald-50 rounded-2xl p-3 border border-emerald-200">
          <div className="text-[10px] uppercase font-bold text-emerald-800">Active API Target</div>
          <div className="font-mono text-xs font-bold text-emerald-950 truncate mt-0.5">
            {currentUrl}
          </div>
        </div>

        {/* Quick Presets */}
        <div className="space-y-1.5">
          <div className="text-xs font-bold text-gray-700">Quick Presets:</div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleApplyPreset('http://10.0.2.2:5000/api')}
              className="flex items-center gap-2 p-2.5 rounded-xl border border-gray-200 hover:border-emerald-600 bg-gray-50 hover:bg-emerald-50/50 text-left text-xs font-semibold transition-all"
            >
              <Smartphone className="w-4 h-4 text-emerald-700 shrink-0" />
              <div>
                <div className="font-bold text-gray-900">Android Emulator</div>
                <div className="text-[10px] text-gray-500 font-mono">10.0.2.2:5000</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleApplyPreset('http://localhost:5000/api')}
              className="flex items-center gap-2 p-2.5 rounded-xl border border-gray-200 hover:border-emerald-600 bg-gray-50 hover:bg-emerald-50/50 text-left text-xs font-semibold transition-all"
            >
              <Laptop className="w-4 h-4 text-emerald-700 shrink-0" />
              <div>
                <div className="font-bold text-gray-900">Local Browser</div>
                <div className="text-[10px] text-gray-500 font-mono">localhost:5000</div>
              </div>
            </button>
          </div>
        </div>

        {/* Custom Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-700">Custom IP (e.g. Phone on Wi-Fi hotspot):</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="http://192.168.1.100:5000/api"
              className="flex-1 px-3.5 py-2 rounded-xl border border-gray-300 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
            <button
              type="button"
              onClick={handleSaveCustom}
              className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-sm"
            >
              Save
            </button>
          </div>
          <div className="text-[10px] text-gray-400">
            For physical Android phones, connect your phone and laptop to the same Wi-Fi network and enter your laptop&apos;s IP address.
          </div>
        </div>

        {/* Ping status feedback */}
        {pingStatus && (
          <div
            className={`p-3 rounded-2xl text-xs flex items-center gap-2 ${
              pingStatus === 'success'
                ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                : pingStatus === 'checking'
                ? 'bg-amber-50 text-amber-900 border border-amber-200'
                : 'bg-red-50 text-red-900 border border-red-200'
            }`}
          >
            {pingStatus === 'success' && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
            {pingStatus === 'checking' && <RefreshCw className="w-4 h-4 text-amber-600 animate-spin shrink-0" />}
            {pingStatus === 'failed' && <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />}
            <span className="font-medium">{pingMessage}</span>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <button
            type="button"
            onClick={handleReset}
            className="text-xs text-gray-500 hover:text-red-600 underline font-medium"
          >
            Reset to Default
          </button>
          
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleTestConnection()}
              className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-all"
            >
              Test Connection
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all"
            >
              Done
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
