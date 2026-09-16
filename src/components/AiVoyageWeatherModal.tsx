import React, { useState } from 'react';
import {
  CloudSun,
  Wind,
  Waves,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Ship,
  Compass,
  ArrowRight,
  ShieldCheck,
  X,
  Droplets,
  Thermometer,
  CloudRain,
  Anchor,
  Sparkles,
  Info,
  Navigation,
  FileSpreadsheet,
  UploadCloud,
  ChevronRight,
  RefreshCw,
  Clock
} from 'lucide-react';
import { MaritimeWeatherAnalystResult, MonthlyWeatherPrediction } from '../types';

interface AiVoyageWeatherModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultOriginPort?: string;
  defaultDestinationPort?: string;
  onAdoptOptimalMonth?: (recommendedMonth: string) => void;
}

const ORIGIN_PORTS_LIST = [
  'Hay Point / Dalrymple Bay (DBCT)',
  'Newcastle (PWCS / NCIG)',
  'Gladstone (RGT / Barney Point)',
  'Port Hedland (Australia)',
  'Taboneo Anchorage (Indonesia)',
  'Muara Berau (East Kalimantan)',
  'Richards Bay (South Africa)',
];

const DESTINATION_PORTS_LIST = [
  'Paradip Port',
  'Haldia Dock Complex',
  'Visakhapatnam (Outer Harbour)',
  'Dhamra Port (DPCL)',
  'Gangavaram Port',
  'Krishnapatnam Port',
  'Ennore / Kamarajar Port',
  'Tuticorin (V.O. Chidambaranar)',
];

const PRESET_MONTH_GROUPS = [
  {
    name: 'Q4 Cyclone Risk (Oct - Dec)',
    months: ['October 2026', 'November 2026', 'December 2026'],
  },
  {
    name: 'Optimal Winter Window (Jan - Mar)',
    months: ['January 2027', 'February 2027', 'March 2027'],
  },
  {
    name: 'SW Monsoon Floods (Jun - Aug)',
    months: ['June 2026', 'July 2026', 'August 2026'],
  },
  {
    name: 'Full Seasonal Comparison (Sep - Feb)',
    months: ['September 2026', 'October 2026', 'November 2026', 'December 2026', 'January 2027', 'February 2027'],
  },
];

export const AiVoyageWeatherModal: React.FC<AiVoyageWeatherModalProps> = ({
  isOpen,
  onClose,
  defaultOriginPort = 'Hay Point / Dalrymple Bay (DBCT)',
  defaultDestinationPort = 'Paradip Port',
  onAdoptOptimalMonth,
}) => {
  const [originPort, setOriginPort] = useState<string>(defaultOriginPort);
  const [destinationPort, setDestinationPort] = useState<string>(defaultDestinationPort);
  const [selectedMonths, setSelectedMonths] = useState<string[]>([
    'October 2026',
    'November 2026',
    'December 2026',
    'January 2027',
  ]);
  const [customMonthInput, setCustomMonthInput] = useState<string>('');
  const [commodity, setCommodity] = useState<string>('Met Coking Coal');
  const [fileUploadStatus, setFileUploadStatus] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [weatherData, setWeatherData] = useState<MaritimeWeatherAnalystResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'detailed' | 'warnings'>('overview');

  if (!isOpen) return null;

  const handleAddCustomMonth = () => {
    const trimmed = customMonthInput.trim();
    if (!trimmed) return;
    const tokens = trimmed.split(/[,;]+/).map((t) => t.trim()).filter(Boolean);
    const updated = Array.from(new Set([...selectedMonths, ...tokens]));
    setSelectedMonths(updated);
    setCustomMonthInput('');
    setFileUploadStatus(null);
  };

  const handleRemoveMonth = (monthToRemove: string) => {
    setSelectedMonths(selectedMonths.filter((m) => m !== monthToRemove));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const tokens = text
          .split(/[\r\n,;]+/)
          .map((m) => m.trim().replace(/['"]/g, ''))
          .filter((m) => m.length > 2 && !/^(month|period|date|sl|id|tonnage|volume|header)$/i.test(m));

        if (tokens.length > 0) {
          const distinct = Array.from(new Set(tokens)).slice(0, 12);
          setSelectedMonths(distinct);
          setFileUploadStatus(`Uploaded ${distinct.length} months from "${file.name}"`);
        } else {
          setFileUploadStatus(`Could not parse month names from "${file.name}". Format: Month Year`);
        }
      } catch {
        setFileUploadStatus(`Error reading "${file.name}"`);
      }
    };
    reader.readAsText(file);
  };

  const runWeatherAnalysis = async () => {
    if (selectedMonths.length === 0) {
      setErrorMsg('Please select or add at least one shipping month.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/maritime-weather-analyst', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originPort,
          destinationPort,
          months: selectedMonths,
          commodity,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const data: MaritimeWeatherAnalystResult = await res.json();
      setWeatherData(data);
    } catch (err: any) {
      console.error('Weather analysis error:', err);
      setErrorMsg('Failed to fetch weather analysis. Please retry.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-indigo-950 px-6 py-4 text-white flex items-start justify-between gap-4 shrink-0 border-b border-sky-800/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-sky-500/20 border border-sky-400/30 rounded-xl text-sky-300">
              <CloudSun className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  AI Maritime Weather Analyst & Route Risk Forecaster
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-sky-500/20 border border-sky-400/30 text-sky-200">
                  Meteorological Climatology
                </span>
              </div>
              <p className="text-xs text-sky-200/80 mt-0.5">
                Simulates voyage route sea states, predicts river flood siltation & cyclone hazards, and recommends the safest shipment window.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Port Route Configuration Section */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-indigo-600" />
                Voyage Route: Departure & Arrival Ports
              </span>
              <span className="text-[11px] text-slate-500">
                Determines ocean swells, coastal cyclone corridors & river basin flood zones
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {/* Port Ship Leaves (Origin) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <Anchor className="w-3.5 h-3.5 text-sky-600" />
                  Port Ship Leaves (Origin):
                </label>
                <select
                  value={originPort}
                  onChange={(e) => setOriginPort(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg font-medium text-slate-800 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                >
                  {ORIGIN_PORTS_LIST.map((port) => (
                    <option key={port} value={port}>
                      {port}
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Checks loading weather, cyclone risk & rail washouts
                </span>
              </div>

              {/* Port Ship Lands (Destination) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <Ship className="w-3.5 h-3.5 text-indigo-600" />
                  Port Ship Lands (Destination):
                </label>
                <select
                  value={destinationPort}
                  onChange={(e) => setDestinationPort(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  {DESTINATION_PORTS_LIST.map((port) => (
                    <option key={port} value={port}>
                      {port}
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Analyzes Bay of Bengal swells, river floods & lightering limits
                </span>
              </div>

              {/* Commodity Type */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <Droplets className="w-3.5 h-3.5 text-amber-600" />
                  Bulk Commodity:
                </label>
                <select
                  value={commodity}
                  onChange={(e) => setCommodity(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg font-medium text-slate-800 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                >
                  <option value="Met Coking Coal">Met Coking Coal (Moisture Sensitive)</option>
                  <option value="Thermal Steam Coal">Thermal Steam Coal</option>
                  <option value="Iron Ore Fines / Pellets">Iron Ore Fines / Pellets (Liquefaction Risk)</option>
                  <option value="Limestone / Flux">Limestone / Metallurgical Flux</option>
                </select>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Controls rain hatch closure rules and cargo safety thresholds
                </span>
              </div>
            </div>
          </div>

          {/* Month Selection Area */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-sky-600" />
                Shipping Months to Predict Weather & Flood Hazards:
              </label>

              {/* Presets */}
              <div className="flex flex-wrap items-center gap-1 text-[11px]">
                <span className="text-slate-500 text-[10px] font-medium mr-1">Quick Windows:</span>
                {PRESET_MONTH_GROUPS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => {
                      setSelectedMonths(preset.months);
                      setFileUploadStatus(null);
                    }}
                    className="px-2 py-0.5 rounded bg-slate-100 hover:bg-sky-50 hover:text-sky-700 text-slate-700 border border-slate-200 transition-colors font-medium text-[11px] cursor-pointer"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Selected Month Tags */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {selectedMonths.map((m) => (
                <span
                  key={m}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-sky-50 text-sky-800 border border-sky-200 shadow-2xs"
                >
                  <CloudSun className="w-3 h-3 text-sky-600" />
                  {m}
                  <button
                    type="button"
                    onClick={() => handleRemoveMonth(m)}
                    className="text-sky-400 hover:text-rose-600 text-xs font-bold leading-none cursor-pointer"
                    title="Remove month"
                  >
                    ×
                  </button>
                </span>
              ))}
              {selectedMonths.length === 0 && (
                <span className="text-xs text-amber-600 italic">Please add at least one shipping month below.</span>
              )}
            </div>

            {/* Add Custom Month & File Upload Schedule */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 pt-1">
              <div className="sm:col-span-7 flex gap-1.5">
                <input
                  type="text"
                  placeholder="Add month(s), e.g. 'October 2026, November 2026'..."
                  value={customMonthInput}
                  onChange={(e) => setCustomMonthInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCustomMonth();
                    }
                  }}
                  className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                />
                <button
                  type="button"
                  onClick={handleAddCustomMonth}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 cursor-pointer whitespace-nowrap"
                >
                  + Add Month
                </button>
              </div>

              <div className="sm:col-span-5 flex items-center justify-end">
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-dashed border-sky-300 bg-sky-50/60 hover:bg-sky-100 text-sky-800 cursor-pointer transition-colors whitespace-nowrap">
                  <UploadCloud className="w-3.5 h-3.5 text-sky-600" />
                  <span>Upload Month Schedule (.csv/.txt)</span>
                  <input
                    type="file"
                    accept=".csv,.txt,.json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {fileUploadStatus && (
              <div className="text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                {fileUploadStatus}
              </div>
            )}
          </div>

          {/* Action Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-sky-600 shrink-0" />
              <span>Grounded in India Meteorological Dept (IMD) & BoM historical cyclone and ocean swell climatology.</span>
            </div>

            <button
              type="button"
              onClick={runWeatherAnalysis}
              disabled={isLoading || selectedMonths.length === 0}
              className="w-full sm:w-auto px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-sky-200" />
                  <span>Analyzing Ocean Route & Flood Data...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Predict Route Weather, Flood Warnings & Best Month</span>
                  <ArrowRight className="w-4 h-4 text-sky-200" />
                </>
              )}
            </button>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Analysis Results Display */}
          {weatherData && (
            <div className="space-y-4 pt-2 border-t border-slate-200">
              {/* Top Banner: Weather Analyst Recommendation & Optimal Month Highlight */}
              <div className="bg-gradient-to-br from-slate-900 via-sky-950 to-indigo-950 text-white rounded-xl p-5 shadow-lg border border-sky-900/50 space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-sky-800/40">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider">
                        ★ Weather Analyst Recommendation
                      </span>
                      <span className="text-xs text-sky-300 font-medium">
                        Route: {weatherData.originPort} ➔ {weatherData.destinationPort}
                      </span>
                    </div>
                    <div className="text-lg font-bold text-white flex items-center gap-2">
                      <span>Optimal Shipment Window:</span>
                      <span className="text-amber-300 underline decoration-amber-400 font-mono">
                        {weatherData.recommendedBestMonth.month}
                      </span>
                    </div>
                  </div>

                  {/* Demurrage Delay Savings Callout */}
                  <div className="bg-white/10 backdrop-blur-xs p-3 rounded-lg border border-white/15 text-right shrink-0">
                    <div className="text-[10px] uppercase text-sky-300 font-bold">Estimated Weather Delay Savings</div>
                    <div className="text-xl font-mono font-bold text-emerald-300">
                      -{weatherData.recommendedBestMonth.estimatedDemurrageSavingsDays} Days Demurrage
                    </div>
                    <div className="text-[10px] text-slate-300">
                      Avoids ~${(weatherData.recommendedBestMonth.estimatedDemurrageSavingsDays * 28000).toLocaleString()} in port waiting fees
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-1">
                  <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                    <div className="text-sky-300 font-bold text-[11px] mb-1 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      Meteorological Rationale:
                    </div>
                    <p className="text-slate-200 text-[11px] leading-relaxed">
                      {weatherData.recommendedBestMonth.rationale}
                    </p>
                  </div>

                  <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                    <div className="text-sky-300 font-bold text-[11px] mb-1 flex items-center gap-1">
                      <Waves className="w-3.5 h-3.5 text-sky-400" />
                      Oceanographic Advantage:
                    </div>
                    <p className="text-slate-200 text-[11px] leading-relaxed">
                      {weatherData.recommendedBestMonth.weatherAdvantage}
                    </p>
                  </div>

                  <div className="bg-white/5 p-3 rounded-lg border border-white/10 flex flex-col justify-between">
                    <div>
                      <div className="text-sky-300 font-bold text-[11px] mb-1 flex items-center gap-1">
                        <Navigation className="w-3.5 h-3.5 text-amber-300" />
                        Voyage Transit Overview:
                      </div>
                      <p className="text-slate-200 text-[11px]">
                        ~{weatherData.voyageDistanceNm.toLocaleString()} NM across open waters (~{weatherData.estimatedTransitDays} sailing days at 13.5 knots).
                      </p>
                    </div>

                    {onAdoptOptimalMonth && (
                      <button
                        type="button"
                        onClick={() => {
                          onAdoptOptimalMonth(weatherData.recommendedBestMonth.month);
                          onClose();
                        }}
                        className="mt-2 w-full py-1.5 px-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-md shadow-xs transition-colors cursor-pointer text-center"
                      >
                        Adopt {weatherData.recommendedBestMonth.month} for Tender
                      </button>
                    )}
                  </div>
                </div>

                {/* High Warning Notice if applicable */}
                {weatherData.cautionaryMonths.length > 0 && (
                  <div className="bg-rose-500/20 border border-rose-500/40 p-2.5 rounded-lg flex items-center gap-2 text-xs text-rose-200">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>
                      <strong>Cautionary Months ({weatherData.cautionaryMonths.join(', ')}):</strong> Elevated risk of tropical cyclones or monsoon river floods causing severe berth delays.
                    </span>
                  </div>
                )}
              </div>

              {/* Tab Navigation */}
              <div className="flex items-center justify-between border-b border-slate-200 pt-1">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedTab('overview')}
                    className={`pb-2 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
                      selectedTab === 'overview'
                        ? 'border-sky-600 text-sky-700'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Month-by-Month Weather Matrix ({weatherData.monthlyForecasts.length} Months)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedTab('warnings')}
                    className={`pb-2 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                      selectedTab === 'warnings'
                        ? 'border-rose-600 text-rose-700'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <span>Flood & Cyclone Warnings</span>
                    {weatherData.cautionaryMonths.length > 0 && (
                      <span className="px-1.5 py-0.2 bg-rose-100 text-rose-700 rounded-full text-[10px] font-bold">
                        {weatherData.cautionaryMonths.length}
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* TAB 1: Detailed Month-by-Month Weather Cards */}
              {selectedTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {weatherData.monthlyForecasts.map((item, idx) => {
                    const isOptimal = weatherData.recommendedBestMonth.month.includes(item.month);
                    const isHazardous = item.overallSafetyRating === 'Hazardous / Unfavorable';
                    const isModerate = item.overallSafetyRating === 'Moderate Operational Risk';

                    return (
                      <div
                        key={idx}
                        className={`p-4 rounded-xl border transition-all flex flex-col justify-between relative ${
                          isOptimal
                            ? 'bg-emerald-50/40 border-emerald-300 ring-2 ring-emerald-200 shadow-sm'
                            : isHazardous
                            ? 'bg-rose-50/30 border-rose-200'
                            : 'bg-white border-slate-200'
                        }`}
                      >
                        {isOptimal && (
                          <div className="absolute -top-2.5 right-4 bg-emerald-600 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs">
                            ★ Safest & Recommended Month
                          </div>
                        )}

                        <div>
                          {/* Header */}
                          <div className="flex items-start justify-between gap-2 mb-3">
                            <div>
                              <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-sky-600" />
                                {item.month}
                              </div>
                              <span className="text-[11px] text-slate-500 font-medium">
                                Risk Index: {item.riskScore}/100 • {item.cargoSafetyStatus}
                              </span>
                            </div>

                            <span
                              className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider ${
                                isHazardous
                                  ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                  : isModerate
                                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                  : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              }`}
                            >
                              {item.overallSafetyRating}
                            </span>
                          </div>

                          {/* Port Weather Comparison Grid */}
                          <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200 mb-3">
                            {/* Departure Port */}
                            <div>
                              <div className="text-[10px] font-bold uppercase text-slate-500 flex items-center gap-1">
                                <Anchor className="w-3 h-3 text-sky-600" />
                                Leave: {originPort.split('(')[0].trim()}
                              </div>
                              <div className="font-mono text-xs font-bold text-slate-800 mt-0.5">
                                {item.departurePortWeather.temperatureC}°C • {item.departurePortWeather.rainfallMm} mm rain
                              </div>
                              <div className="text-[10px] text-slate-500">
                                Wind: {item.departurePortWeather.windSpeedKnots} kts • Swell: {item.departurePortWeather.seaStateSwellMeters}m
                              </div>
                            </div>

                            {/* Arrival Port */}
                            <div>
                              <div className="text-[10px] font-bold uppercase text-slate-500 flex items-center gap-1">
                                <Ship className="w-3 h-3 text-indigo-600" />
                                Land: {destinationPort.split('(')[0].trim()}
                              </div>
                              <div className="font-mono text-xs font-bold text-slate-800 mt-0.5">
                                {item.arrivalPortWeather.temperatureC}°C • {item.arrivalPortWeather.rainfallMm} mm rain
                              </div>
                              <div className="text-[10px] text-slate-500">
                                Wind: {item.arrivalPortWeather.windSpeedKnots} kts • Swell: {item.arrivalPortWeather.seaStateSwellMeters}m
                              </div>
                            </div>
                          </div>

                          {/* Specific Flood & Storm Warnings for this month */}
                          <div className="space-y-1.5 text-xs mb-3">
                            {item.warnings.floodWarning && (
                              <div className="p-2 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-[11px] flex items-start gap-1.5">
                                <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                                <div>
                                  <strong className="font-semibold">Flood Advisory:</strong> {item.warnings.floodWarning}
                                </div>
                              </div>
                            )}

                            {item.warnings.severeStormOrCycloneWarning && (
                              <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-[11px] flex items-start gap-1.5">
                                <Wind className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                                <div>
                                  <strong className="font-semibold">Cyclone Advisory ({item.voyageRouteHazards.cycloneProbabilityPercent}% risk):</strong> {item.warnings.severeStormOrCycloneWarning}
                                </div>
                              </div>
                            )}

                            {!item.warnings.floodWarning && !item.warnings.severeStormOrCycloneWarning && (
                              <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-[11px] flex items-center gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span>Calm sea conditions. No active flood alerts or cyclone depressions along route.</span>
                              </div>
                            )}

                            <p className="text-[11px] text-slate-600 leading-snug pt-1">
                              <strong>Analyst Verdict:</strong> {item.monthlyVerdict}
                            </p>
                          </div>
                        </div>

                        {/* Footer: Weather Demurrage Delay Days */}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1 text-slate-500 text-[11px]">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>Est. Weather Delay:</span>
                            <span className="font-mono font-bold text-slate-800">
                              +{item.warnings.operationalDelaysEstDays} Days
                            </span>
                          </div>

                          {onAdoptOptimalMonth && (
                            <button
                              type="button"
                              onClick={() => {
                                onAdoptOptimalMonth(item.month);
                                onClose();
                              }}
                              className="text-[11px] font-bold text-sky-600 hover:text-sky-800 underline cursor-pointer"
                            >
                              Adopt This Month
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* TAB 2: Flood & Cyclone Warnings Tab */}
              {selectedTab === 'warnings' && (
                <div className="space-y-3">
                  <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900 leading-relaxed">
                    <strong>Maritime Weather Advisory:</strong> Monsoon deluges, riverine flood discharges from the Mahanadi and Hooghly basins, and post-monsoon cyclogenesis in the Bay of Bengal represent the primary cause of unbudgeted demurrage penalties for Indian dry bulk importers.
                  </div>

                  <div className="space-y-2.5">
                    {weatherData.monthlyForecasts.map((f, i) => (
                      <div
                        key={i}
                        className={`p-3.5 rounded-xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                          f.warnings.floodWarning || f.warnings.severeStormOrCycloneWarning
                            ? 'bg-rose-50/40 border-rose-200'
                            : 'bg-emerald-50/30 border-emerald-200'
                        }`}
                      >
                        <div className="space-y-1 max-w-2xl">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{f.month}</span>
                            <span
                              className={`px-2 py-0.2 rounded text-[10px] font-bold uppercase ${
                                f.riskScore >= 60 ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'
                              }`}
                            >
                              Risk Score: {f.riskScore}/100
                            </span>
                            <span className="text-[11px] text-slate-500">
                              Cyclone Threat: {f.voyageRouteHazards.cycloneProbabilityPercent}%
                            </span>
                          </div>

                          {f.warnings.floodWarning && (
                            <div className="text-rose-700 text-[11px] font-medium">
                              🌊 <strong>Flood Warning:</strong> {f.warnings.floodWarning}
                            </div>
                          )}

                          {f.warnings.severeStormOrCycloneWarning && (
                            <div className="text-amber-800 text-[11px] font-medium">
                              🌀 <strong>Storm Warning:</strong> {f.warnings.severeStormOrCycloneWarning}
                            </div>
                          )}

                          {!f.warnings.floodWarning && !f.warnings.severeStormOrCycloneWarning && (
                            <div className="text-emerald-700 text-[11px]">
                              ✓ Safe Window: Sea swells average {f.arrivalPortWeather.seaStateSwellMeters}m with zero flood alerts at {destinationPort}.
                            </div>
                          )}
                        </div>

                        <div className="text-right shrink-0">
                          <div className="text-[10px] text-slate-500">Est. Weather Demurrage:</div>
                          <div className="font-mono font-bold text-sm text-slate-900">
                            +{f.warnings.operationalDelaysEstDays} Days
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            Route: {originPort.split('(')[0]} ➔ {destinationPort.split('(')[0]}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
