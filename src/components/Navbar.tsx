import React from 'react';
import { Ship, Anchor, TrendingUp, ShieldCheck, Sparkles, Building2 } from 'lucide-react';

interface NavbarProps {
  activeTab: 'forecasting' | 'vendors' | 'ports' | 'contracts' | 'copilot';
  setActiveTab: (tab: 'forecasting' | 'vendors' | 'ports' | 'contracts' | 'copilot') => void;
  onSelectPreset: (presetName: string) => void;
  hasApiKey: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onSelectPreset,
  hasApiKey,
}) => {
  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur sticky top-0 z-40">
      {/* Live Maritime Market Ticker */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 overflow-x-auto border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 whitespace-nowrap">
          <div className="flex items-center gap-2 text-emerald-400 font-medium">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            BALTIC DRY INDEX (BDI): <span className="text-white font-bold">1,842</span> <span className="text-emerald-400 font-mono text-[11px]">+32 pts (+1.8%)</span>
          </div>

          <div className="flex items-center gap-5 text-slate-300 font-mono text-[11px]">
            <span>BCI Capesize: <strong className="text-white">$24,150/d</strong> <span className="text-emerald-400">(+2.4%)</span></span>
            <span className="text-slate-700">|</span>
            <span>BPI Panamax: <strong className="text-white">$14,820/d</strong> <span className="text-emerald-400">(+1.1%)</span></span>
            <span className="text-slate-700">|</span>
            <span>BSI Supramax: <strong className="text-white">$13,400/d</strong> <span className="text-slate-400">(-0.3%)</span></span>
            <span className="text-slate-700">|</span>
            <span>Singapore VLSFO: <strong className="text-amber-400">$624.50/MT</strong></span>
            <span className="text-slate-700">|</span>
            <span className="text-slate-400">East Coast India Weather: <strong className="text-emerald-300">Monsoon Fair (Wave &lt;1.8m)</strong></span>
          </div>

          <div className="hidden lg:flex items-center gap-2">
            <span className="text-[11px] text-slate-400">Model Engine:</span>
            <span className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded font-medium ${
              hasApiKey ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-blue-950 text-blue-300 border border-blue-800'
            }`}>
              <Sparkles className="w-3 h-3" />
              {hasApiKey ? 'Gemini 3.8 Flash Active' : 'Maritime Econometric Core'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-200">
              <Ship className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-slate-900 leading-tight">
                  NAVI-FREIGHT AI
                </h1>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded">
                  India East Coast
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Intelligent Freight Rate Forecasting & Optimized Vessel Chartering Model
              </p>
            </div>
          </div>

          {/* Quick Scenario Presets */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            <span className="text-xs font-semibold text-slate-400 mr-1 whitespace-nowrap">Load Preset:</span>
            <button
              onClick={() => onSelectPreset('australia-paradip')}
              className="text-xs px-2.5 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium whitespace-nowrap transition-colors"
            >
              🇦🇺 Aus Coking Coal → Paradip
            </button>
            <button
              onClick={() => onSelectPreset('indonesia-haldia')}
              className="text-xs px-2.5 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium whitespace-nowrap transition-colors"
            >
              🇮🇩 Indo Thermal → Haldia Lightening
            </button>
            <button
              onClick={() => onSelectPreset('mozambique-vizag')}
              className="text-xs px-2.5 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium whitespace-nowrap transition-colors"
            >
              🇲🇿 Moz Met Coal → Vizag Outer
            </button>
            <button
              onClick={() => onSelectPreset('us-dhamra')}
              className="text-xs px-2.5 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium whitespace-nowrap transition-colors"
            >
              🇺🇸 US Met Coal → Dhamra Cape
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-100">
          <button
            onClick={() => setActiveTab('forecasting')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeTab === 'forecasting'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Ship Procurement & Forecast Engine
          </button>

          <button
            onClick={() => setActiveTab('vendors')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeTab === 'vendors'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-emerald-400" />
            Vendor Procurement Engine
            <span className="px-1.5 py-0.2 text-[9px] bg-emerald-500/20 text-emerald-700 font-bold rounded uppercase">
              Ministry Spec
            </span>
          </button>

          <button
            onClick={() => setActiveTab('ports')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeTab === 'ports'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Anchor className="w-3.5 h-3.5" />
            Port Infrastructure & Draft Matrix
          </button>

          <button
            onClick={() => setActiveTab('contracts')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeTab === 'contracts'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Spot vs COA Contract Economics
          </button>

          <button
            onClick={() => setActiveTab('copilot')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeTab === 'copilot'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            AI Chartering Advisor & Memo Drafter
          </button>
        </div>
      </div>
    </header>
  );
};
