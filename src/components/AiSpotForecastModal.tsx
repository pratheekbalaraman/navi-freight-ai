import React, { useState } from 'react';
import {
  Sparkles,
  CloudRain,
  TrendingUp,
  Wind,
  Compass,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  BarChart3,
  Loader2,
  RefreshCw,
  Info,
  UploadCloud,
  FileSpreadsheet
} from 'lucide-react';
import { AiMarketWeatherForecastResult, MonthForecastPrediction } from '../types';

interface AiSpotForecastModalProps {
  isOpen: boolean;
  onClose: () => void;
  baseSpotRate: number;
  currentVolSurgePct: number;
  onApplyPredictedRate: (rate: number, surgePct: number) => void;
}

const DEFAULT_MONTHS = [
  'October 2026',
  'November 2026',
  'December 2026',
  'January 2027',
  'February 2027',
  'March 2027'
];

export const AiSpotForecastModal: React.FC<AiSpotForecastModalProps> = ({
  isOpen,
  onClose,
  baseSpotRate,
  currentVolSurgePct,
  onApplyPredictedRate
}) => {
  const [selectedMonths, setSelectedMonths] = useState<string[]>(['October 2026', 'November 2026', 'December 2026']);
  const [customMonthInput, setCustomMonthInput] = useState<string>('');
  const [fileUploadNote, setFileUploadNote] = useState<string | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<string>('Australia (Hay Point/DBCT) -> Paradip Port (East Coast India)');
  const [commodity, setCommodity] = useState<string>('Met Coking Coal');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<AiMarketWeatherForecastResult | null>(null);
  const [selectedMonthIdx, setSelectedMonthIdx] = useState<number>(0);

  if (!isOpen) return null;

  const toggleMonth = (month: string) => {
    if (selectedMonths.includes(month)) {
      if (selectedMonths.length === 1) return; // keep at least one
      setSelectedMonths(selectedMonths.filter((m) => m !== month));
    } else {
      setSelectedMonths([...selectedMonths, month]);
    }
  };

  const handleAddCustomMonth = () => {
    const trimmed = customMonthInput.trim();
    if (!trimmed) return;
    const parts = trimmed.split(/[,;]+/).map((s) => s.trim()).filter((s) => s.length > 0);
    const updated = Array.from(new Set([...selectedMonths, ...parts]));
    setSelectedMonths(updated);
    setCustomMonthInput('');
    setFileUploadNote(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const extracted = text
          .split(/[\r\n,;]+/)
          .map((m) => m.trim().replace(/['"]/g, ''))
          .filter((m) => m.length > 2 && !/^(month|period|date|sl|id|tonnage|volume|header)$/i.test(m));

        if (extracted.length > 0) {
          const distinct = Array.from(new Set(extracted)).slice(0, 12);
          setSelectedMonths(distinct);
          setFileUploadNote(`Uploaded ${distinct.length} months from "${file.name}"`);
        } else {
          setFileUploadNote(`Could not parse month names from "${file.name}". Format: Month Year`);
        }
      } catch {
        setFileUploadNote(`Error reading file "${file.name}"`);
      }
    };
    reader.readAsText(file);
  };

  const handleRunAiForecast = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/spot-market-weather-forecast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          months: selectedMonths,
          baseSpotRate,
          route: selectedRoute,
          commodity
        })
      });
      const data = await res.json();
      if (data && data.data) {
        setResult(data.data);
        setSelectedMonthIdx(0);
      }
    } catch (err) {
      console.error('Failed to run AI spot forecast:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const activePrediction: MonthForecastPrediction | undefined = result?.monthlyPredictions?.[selectedMonthIdx];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-indigo-200" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                AI Deep-Market & Weather-Driven Spot Rate Predictor
                <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                  Live Market & Meteorological Engine
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Synthesizes historical Baltic indices, monsoon/cyclone weather patterns, bunker fuel trends, and port congestion
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors text-lg cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Target Route & Parameter Configuration */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-indigo-600" />
              1. Trade Lane & Cargo Profile
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Trade Lane Corridor</label>
                <select
                  value={selectedRoute}
                  onChange={(e) => setSelectedRoute(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Australia (Hay Point/DBCT) -> Paradip Port (East Coast India)">
                    Australia (Hay Point) → Paradip Port
                  </option>
                  <option value="Indonesia (Taboneo Anchorage) -> Haldia Dock Complex (HDC)">
                    Indonesia (Taboneo) → Haldia Dock (HDC)
                  </option>
                  <option value="Mozambique (Maputo) -> Visakhapatnam (Outer Harbour)">
                    Mozambique (Maputo) → Vizag Outer Harbour
                  </option>
                  <option value="United States (Norfolk) -> Dhamra Port (DPCL)">
                    United States (Norfolk) → Dhamra Port
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Commodity</label>
                <select
                  value={commodity}
                  onChange={(e) => setCommodity(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Met Coking Coal">Met Coking Coal (Australia / US / Mozambique)</option>
                  <option value="Thermal / Steam Coal">Thermal Steam Coal (Indonesia / Australia)</option>
                  <option value="Iron Ore Lump / Fines">Iron Ore Lump & Fines</option>
                  <option value="Limestone / Flux">Limestone & Raw Flux Material</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Baseline Spot Rate Benchmark</label>
                <div className="flex items-center gap-2">
                  <div className="text-xs font-mono font-bold text-slate-800 bg-white border border-slate-300 px-3 py-1.5 rounded-lg w-full">
                    ${baseSpotRate.toFixed(2)} / MT
                  </div>
                </div>
              </div>
            </div>

            {/* Target Months Selector */}
            <div className="pt-3 border-t border-slate-200">
              <label className="block text-xs font-semibold text-slate-700 mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                  Select or Add Evaluation Months for Prediction
                </span>
                <span className="text-[11px] font-normal text-slate-500">
                  Click to select/deselect ({selectedMonths.length} active)
                </span>
              </label>

              <div className="flex flex-wrap gap-2">
                {DEFAULT_MONTHS.map((m) => {
                  const isSelected = selectedMonths.includes(m);
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => toggleMonth(m)}
                      className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '}
                      {m}
                    </button>
                  );
                })}

                {/* Additional user-added months */}
                {selectedMonths
                  .filter((m) => !DEFAULT_MONTHS.includes(m))
                  .map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => toggleMonth(m)}
                      className="text-xs px-3 py-1.5 rounded-lg border bg-indigo-600 border-indigo-600 text-white font-medium cursor-pointer"
                    >
                      ✓ {m}
                    </button>
                  ))}
              </div>

              {/* Add Custom Month Input & CSV/TXT File Upload */}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 max-w-sm flex-1">
                  <input
                    type="text"
                    placeholder="Add month(s), e.g. 'Nov 2026, Dec 2026'..."
                    value={customMonthInput}
                    onChange={(e) => setCustomMonthInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCustomMonth();
                      }
                    }}
                    className="text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg flex-1 focus:ring-1 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomMonth}
                    disabled={!customMonthInput.trim()}
                    className="text-xs px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium disabled:opacity-40 cursor-pointer whitespace-nowrap"
                  >
                    + Add
                  </button>
                </div>

                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-dashed border-indigo-300 bg-indigo-50/70 hover:bg-indigo-100/80 text-indigo-700 cursor-pointer transition-colors">
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Upload Months Schedule (.csv/.txt)</span>
                  <input
                    type="file"
                    accept=".csv,.txt,.json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {fileUploadNote && (
                <div className="mt-2 text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                  {fileUploadNote}
                </div>
              )}
            </div>

            {/* Run Button */}
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={handleRunAiForecast}
                disabled={isLoading || selectedMonths.length === 0}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center gap-2 shadow-sm transition-all disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Synthesizing Weather Models & Market Indices...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-indigo-200" />
                    <span>Generate AI Market & Weather Rate Prediction</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results Display */}
          {result && (
            <div className="space-y-5 animate-fadeIn">
              {/* Executive Assessment Banner */}
              <div className="p-4 rounded-xl bg-slate-900 text-white border border-slate-800 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                      Predictive Econometric & Weather Assessment
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-400">Projected Volatility Index:</span>
                    <span
                      className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                        result.overallVolatilityIndex === 'Extreme'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : result.overallVolatilityIndex === 'High'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {result.overallVolatilityIndex} Risk
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {result.summaryRationale}
                </p>

                {/* Macro Drivers Chips */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {result.keyMacroDrivers.map((driver, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-slate-300 flex items-center gap-1.5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                      {driver}
                    </span>
                  ))}
                </div>
              </div>

              {/* Monthly Tabs Navigation */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                    Month-by-Month Projected Freight Rates & Weather Hazards
                  </label>
                  <span className="text-xs text-slate-500">
                    Click any month to inspect details or apply its rate directly
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                  {result.monthlyPredictions.map((pred, idx) => {
                    const isSelected = selectedMonthIdx === idx;
                    const isSpike = pred.predictedSpikePercentage > 15;
                    return (
                      <button
                        key={pred.month}
                        type="button"
                        onClick={() => setSelectedMonthIdx(idx)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-50/90 border-indigo-500 ring-2 ring-indigo-200'
                            : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/70'
                        }`}
                      >
                        <div className="text-[11px] font-semibold text-slate-700 truncate">{pred.month}</div>
                        <div className="mt-1 text-base font-bold font-mono text-slate-900">
                          ${pred.predictedSpotRate.toFixed(2)}
                          <span className="text-[10px] font-normal text-slate-500">/t</span>
                        </div>
                        <div className="mt-1 flex items-center justify-between text-[10px]">
                          <span
                            className={`font-mono font-semibold ${
                              isSpike ? 'text-rose-600' : 'text-emerald-700'
                            }`}
                          >
                            +{pred.predictedSpikePercentage}%
                          </span>
                          <span className="text-slate-400">{pred.weatherFactor.cycloneRisk} Risk</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected Month In-Depth Breakdown Card */}
              {activePrediction && (
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-slate-900">{activePrediction.month} Detailed Forecast</h4>
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {activePrediction.confidenceScore}% Model Confidence
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Projected spot freight surge: <strong className="text-rose-600 font-mono">+{activePrediction.predictedSpikePercentage}%</strong> over baseline (${baseSpotRate.toFixed(2)}/MT)
                      </p>
                    </div>

                    {/* Quick Apply Button */}
                    <button
                      type="button"
                      onClick={() => {
                        onApplyPredictedRate(
                          activePrediction.predictedSpotRate,
                          activePrediction.predictedSpikePercentage
                        );
                        onClose();
                      }}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Apply ${activePrediction.predictedSpotRate.toFixed(2)} (+{activePrediction.predictedSpikePercentage}%) to Simulator</span>
                    </button>
                  </div>

                  {/* 3 Metric Mini-Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-slate-500 block mb-1 text-[11px] uppercase font-semibold">Predicted Spot Rate</span>
                      <div className="text-xl font-bold font-mono text-slate-900">
                        ${activePrediction.predictedSpotRate.toFixed(2)} / MT
                      </div>
                      <span className="text-[11px] text-slate-500">
                        Estimated range: ${activePrediction.lowEstimate.toFixed(2)} - ${activePrediction.highEstimate.toFixed(2)}
                      </span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-slate-500 block mb-1 text-[11px] uppercase font-semibold flex items-center gap-1">
                        <CloudRain className="w-3.5 h-3.5 text-blue-500" />
                        Weather & Cyclone Risk
                      </span>
                      <div className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${
                            activePrediction.weatherFactor.cycloneRisk === 'Severe'
                              ? 'bg-rose-600'
                              : activePrediction.weatherFactor.cycloneRisk === 'Elevated'
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                        />
                        {activePrediction.weatherFactor.cycloneRisk} Delay Hazard
                      </div>
                      <span className="text-[11px] text-slate-600 block mt-1">
                        {activePrediction.weatherFactor.monsoonImpact}
                      </span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-slate-500 block mb-1 text-[11px] uppercase font-semibold flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                        Recommended Commercial Action
                      </span>
                      <div className="text-sm font-bold text-indigo-700">
                        {activePrediction.recommendation}
                      </div>
                      <span className="text-[11px] text-slate-500 block mt-1">
                        Protects against spot price spikes
                      </span>
                    </div>
                  </div>

                  {/* Weather Meteorological Narrative */}
                  <div className="p-3.5 bg-blue-50/60 rounded-lg border border-blue-200 text-xs text-blue-950 flex items-start gap-2.5">
                    <Wind className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-blue-900 font-semibold mb-0.5">
                        Meteorological & Port Swell Pattern for {activePrediction.month}:
                      </strong>
                      <p className="text-blue-900/90 leading-relaxed text-[11px]">
                        {activePrediction.weatherFactor.weatherSummary}
                      </p>
                    </div>
                  </div>

                  {/* Market Catalysts List */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-xs font-semibold text-slate-700 block">
                      Active Market & Commodity Catalysts Driving This Rate:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {activePrediction.marketCatalysts.map((cat, i) => (
                        <div
                          key={i}
                          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 flex items-center gap-2"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0"></span>
                          <span>{cat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between flex-shrink-0 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-slate-400" />
            <span>AI synthesizes seasonal shipping congestion, cyclone frequency tables, and raw material restocking indices.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
