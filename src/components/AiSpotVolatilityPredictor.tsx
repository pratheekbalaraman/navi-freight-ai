import React, { useState } from 'react';
import {
  Sparkles,
  CloudSun,
  Wind,
  TrendingUp,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  RefreshCw,
  Info,
  ChevronRight,
  ArrowUpRight,
  ShieldCheck,
  FileSpreadsheet,
  UploadCloud,
  Layers
} from 'lucide-react';
import { AiMarketWeatherForecastResult, MonthForecastPrediction } from '../types';

interface AiSpotVolatilityPredictorProps {
  currentBaseRate: number;
  onApplySurgePercentage: (percentage: number) => void;
}

const PRESET_MONTH_SETS: { label: string; months: string[] }[] = [
  {
    label: 'Q4 Peak & Cyclones (Oct - Jan)',
    months: ['October 2026', 'November 2026', 'December 2026', 'January 2027'],
  },
  {
    label: 'Monsoon Heavy Swells (Jun - Sep)',
    months: ['June 2026', 'July 2026', 'August 2026', 'September 2026'],
  },
  {
    label: 'Pre-Monsoon Build-up (Feb - May)',
    months: ['February 2026', 'March 2026', 'April 2026', 'May 2026'],
  },
  {
    label: 'Full H2 Delivery Program (Jul - Dec)',
    months: ['July 2026', 'August 2026', 'September 2026', 'October 2026', 'November 2026', 'December 2026'],
  },
];

export const AiSpotVolatilityPredictor: React.FC<AiSpotVolatilityPredictorProps> = ({
  currentBaseRate,
  onApplySurgePercentage,
}) => {
  const [selectedMonths, setSelectedMonths] = useState<string[]>([
    'October 2026',
    'November 2026',
    'December 2026',
    'January 2027',
  ]);
  const [customMonthInput, setCustomMonthInput] = useState<string>('');
  const [commodity, setCommodity] = useState<string>('Met Coking Coal');
  const [tradeRoute, setTradeRoute] = useState<{ origin: string; discharge: string }>({
    origin: 'Hay Point / Dalrymple Bay (DBCT)',
    discharge: 'Paradip Port',
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [predictionData, setPredictionData] = useState<AiMarketWeatherForecastResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'cards' | 'matrix'>('cards');
  const [uploadedFileStatus, setUploadedFileStatus] = useState<string | null>(null);

  // Parse text or CSV of months uploaded by user
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        // Extract comma, newline, or semicolon delimited month names
        const extracted = text
          .split(/[\r\n,;]+/)
          .map((m) => m.trim().replace(/['"]/g, ''))
          .filter((m) => m.length > 2 && !/^(month|period|date|sl|id|tonnage|volume)$/i.test(m));

        if (extracted.length > 0) {
          setSelectedMonths(extracted.slice(0, 12));
          setUploadedFileStatus(`✓ Uploaded "${file.name}" (${extracted.length} months recognized)`);
        } else {
          setUploadedFileStatus(`⚠️ Could not parse months from "${file.name}". Please format as: "Month Year"`);
        }
      } catch {
        setUploadedFileStatus(`⚠️ Error reading ${file.name}`);
      }
    };
    reader.readAsText(file);
  };

  const handleAddCustomMonth = () => {
    if (!customMonthInput.trim()) return;
    const added = customMonthInput
      .split(/[,;]+/)
      .map((m) => m.trim())
      .filter((m) => m.length > 0);

    const merged = Array.from(new Set([...selectedMonths, ...added]));
    setSelectedMonths(merged);
    setCustomMonthInput('');
  };

  const handleRemoveMonth = (monthToRemove: string) => {
    setSelectedMonths(selectedMonths.filter((m) => m !== monthToRemove));
  };

  const fetchPrediction = async () => {
    if (selectedMonths.length === 0) {
      setErrorMsg('Please select or add at least one month.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/predict-spot-weather-surge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          months: selectedMonths,
          currentSpotFreightPerMT: currentBaseRate,
          originPort: tradeRoute.origin,
          dischargePort: tradeRoute.discharge,
          commodity: commodity,
          vesselClass: 'Panamax / Kamsarmax (82,000 DWT)',
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const data: AiMarketWeatherForecastResult = await res.json();
      setPredictionData(data);
    } catch (err: any) {
      console.error('Error fetching AI spot weather prediction:', err);
      setErrorMsg('Unable to retrieve AI forecast. Please check connection and retry.');
    } finally {
      setIsLoading(false);
    }
  };

  // Average predicted spike across the returned dataset
  const averagePredictedSpike =
    predictionData && predictionData.monthlyPredictions.length > 0
      ? Math.round(
          predictionData.monthlyPredictions.reduce((sum, p) => sum + p.predictedSpikePercentage, 0) /
            predictionData.monthlyPredictions.length
        )
      : null;

  const maxSpikeMonth =
    predictionData && predictionData.monthlyPredictions.length > 0
      ? [...predictionData.monthlyPredictions].sort((a, b) => b.predictedSpikePercentage - a.predictedSpikePercentage)[0]
      : null;

  return (
    <div className="mt-4 rounded-xl border border-indigo-200/90 bg-gradient-to-br from-indigo-50/40 via-white to-sky-50/30 p-5 shadow-sm space-y-4">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-100 pb-3.5">
        <div className="flex items-start gap-2.5">
          <div className="p-2 rounded-lg bg-indigo-600 text-white shadow-sm mt-0.5">
            <Sparkles className="w-4 h-4 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">
                AI Market & Weather Spot Surge Predictor
              </h3>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
                Gemini Multi-Agent
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Analyzes historical Bay of Bengal cyclone frequencies, Indian monsoon swells, Australian wet season delays,
              and global Baltic Dry Index (BDI/BPI) cycles to forecast spot volatility for your target months.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={fetchPrediction}
          disabled={isLoading || selectedMonths.length === 0}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              Scanning Weather & Freight Trends...
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Run AI Spot Rate Prediction
            </>
          )}
        </button>
      </div>

      {/* Month Selection & Upload Area */}
      <div className="space-y-3 bg-white/80 rounded-lg p-3.5 border border-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-indigo-600" />
            Target Months for Spot Rate Forecast:
          </label>

          {/* Presets */}
          <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
            <span className="text-slate-500 text-[10px] font-medium">Quick Presets:</span>
            {PRESET_MONTH_SETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => {
                  setSelectedMonths(preset.months);
                  setUploadedFileStatus(null);
                }}
                className="px-2 py-0.5 rounded bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 border border-slate-200 transition-colors font-medium text-[11px] cursor-pointer"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Active Selected Months Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {selectedMonths.map((m) => (
            <span
              key={m}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-800 border border-indigo-200"
            >
              {m}
              <button
                type="button"
                onClick={() => handleRemoveMonth(m)}
                className="text-indigo-400 hover:text-rose-600 text-xs font-bold leading-none cursor-pointer"
                title="Remove month"
              >
                ×
              </button>
            </span>
          ))}
          {selectedMonths.length === 0 && (
            <span className="text-xs text-amber-600 italic">No months selected yet. Add below or choose a preset.</span>
          )}
        </div>

        {/* Add custom month or upload file */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 pt-1">
          <div className="sm:col-span-7 flex gap-1.5">
            <input
              type="text"
              placeholder="Add month(s), e.g. 'November 2026, December 2026'..."
              value={customMonthInput}
              onChange={(e) => setCustomMonthInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddCustomMonth();
                }
              }}
              className="flex-1 px-2.5 py-1.5 text-xs rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={handleAddCustomMonth}
              className="px-3 py-1.5 text-xs font-medium rounded bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 cursor-pointer"
            >
              + Add Month
            </button>
          </div>

          {/* Upload Month List / CSV */}
          <div className="sm:col-span-5 flex items-center justify-end gap-2">
            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded border border-dashed border-indigo-300 bg-indigo-50/50 hover:bg-indigo-100 text-indigo-700 cursor-pointer transition-colors">
              <UploadCloud className="w-3.5 h-3.5" />
              Upload Month Schedule (CSV/TXT)
              <input
                type="file"
                accept=".csv,.txt,.json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {uploadedFileStatus && (
          <div className="text-[11px] text-slate-600 italic px-1">{uploadedFileStatus}</div>
        )}
      </div>

      {errorMsg && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Loading state indicator */}
      {isLoading && (
        <div className="p-6 bg-white rounded-lg border border-indigo-100 text-center space-y-3">
          <RefreshCw className="w-6 h-6 animate-spin text-indigo-600 mx-auto" />
          <div className="text-xs font-semibold text-slate-700">
            Running Meteorological & Baltic Dry Freight Regression Models...
          </div>
          <p className="text-[11px] text-slate-500 max-w-md mx-auto">
            Cross-referencing historical Bay of Bengal cyclone paths (October–December), Indian monsoon swells, and
            Pacific bulk freight tight tonnage supply...
          </p>
        </div>
      )}

      {/* Prediction Output Display */}
      {predictionData && !isLoading && (
        <div className="space-y-4 pt-1">
          {/* Summary Metric Ribbon */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-xl p-4 shadow-md">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold">
                    AI Forecast Verdict for {predictionData.route}
                  </span>
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                      predictionData.overallVolatilityIndex === 'Extreme'
                        ? 'bg-rose-500 text-white'
                        : predictionData.overallVolatilityIndex === 'High'
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-emerald-500 text-white'
                    }`}
                  >
                    {predictionData.overallVolatilityIndex} Volatility Risk
                  </span>
                </div>
                <div className="text-sm text-slate-200 mt-1 max-w-2xl leading-relaxed">
                  {predictionData.summaryRationale}
                </div>
              </div>

              {/* Action pill & Quick-apply button */}
              <div className="flex md:flex-col items-center md:items-end justify-between gap-2 shrink-0 border-t md:border-t-0 pt-2 md:pt-0 border-slate-700">
                <div className="text-right">
                  <div className="text-[11px] text-slate-400">Average Predicted Surge:</div>
                  <div className="text-xl font-mono font-bold text-amber-300">
                    +{averagePredictedSpike}% ($
                    {((currentBaseRate * (1 + (averagePredictedSpike || 0) / 100))).toFixed(2)}/MT)
                  </div>
                </div>

                {averagePredictedSpike !== null && (
                  <button
                    type="button"
                    onClick={() => onApplySurgePercentage(averagePredictedSpike)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 shadow transition-all cursor-pointer"
                    title="Transfer this predicted percentage directly to the slider above"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    Apply +{averagePredictedSpike}% to Simulator
                  </button>
                )}
              </div>
            </div>

            {/* Macro drivers list */}
            {predictionData.keyMacroDrivers && predictionData.keyMacroDrivers.length > 0 && (
              <div className="mt-3 pt-3 border-t border-slate-800 flex flex-wrap items-center gap-2 text-[11px]">
                <span className="text-indigo-300 font-semibold">Key Catalysts:</span>
                {predictionData.keyMacroDrivers.map((driver, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700"
                  >
                    • {driver}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* View Toggle */}
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
              <span>Month-by-Month Weather & Spot Freight Projections:</span>
              <span className="text-slate-400 font-normal">({predictionData.monthlyPredictions.length} periods analyzed)</span>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('cards')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  activeTab === 'cards' ? 'bg-white text-indigo-700 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Card View
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('matrix')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  activeTab === 'matrix' ? 'bg-white text-indigo-700 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Table Matrix
              </button>
            </div>
          </div>

          {/* Card View */}
          {activeTab === 'cards' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {predictionData.monthlyPredictions.map((pred, i) => {
                const isHighest = maxSpikeMonth?.month === pred.month;
                const isRiskHigh = pred.predictedSpikePercentage >= 30;

                return (
                  <div
                    key={pred.month || i}
                    className={`rounded-xl border p-4 bg-white shadow-xs transition-all relative flex flex-col justify-between ${
                      isHighest
                        ? 'border-rose-300 ring-2 ring-rose-100'
                        : isRiskHigh
                        ? 'border-amber-200'
                        : 'border-slate-200'
                    }`}
                  >
                    {isHighest && (
                      <div className="absolute -top-2.5 right-3 bg-rose-600 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs">
                        Peak Volatility Month
                      </div>
                    )}

                    <div>
                      {/* Month Header */}
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-xs font-bold text-slate-900">{pred.month}</div>
                          <div className="text-[10px] text-slate-500 mt-0.5">
                            Baseline: ${predictionData.baseSpotRate.toFixed(2)}/MT
                          </div>
                        </div>

                        <div className="text-right">
                          <span
                            className={`inline-block text-xs font-mono font-bold px-2 py-0.5 rounded ${
                              pred.predictedSpikePercentage >= 30
                                ? 'bg-rose-100 text-rose-800'
                                : pred.predictedSpikePercentage >= 15
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            +{pred.predictedSpikePercentage}%
                          </span>
                        </div>
                      </div>

                      {/* Predicted Freight Rate */}
                      <div className="mt-3 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                        <div className="text-[10px] text-slate-500 font-medium">Predicted Spot Rate</div>
                        <div className="text-xl font-mono font-bold text-slate-900">
                          ${pred.predictedSpotRate.toFixed(2)} <span className="text-xs font-normal text-slate-500">/ MT</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5 flex justify-between">
                          <span>Low: ${pred.lowEstimate.toFixed(2)}</span>
                          <span>High: ${pred.highEstimate.toFixed(2)}</span>
                        </div>
                      </div>

                      {/* Weather Impact Breakdown */}
                      <div className="mt-3 space-y-1.5 text-[11px]">
                        <div className="flex items-center justify-between text-slate-600">
                          <span className="flex items-center gap-1 font-medium">
                            <Wind className="w-3 h-3 text-sky-600" />
                            Cyclone Threat:
                          </span>
                          <span
                            className={`font-semibold ${
                              pred.weatherFactor.cycloneRisk === 'Severe' || pred.weatherFactor.cycloneRisk === 'Elevated'
                                ? 'text-rose-600'
                                : pred.weatherFactor.cycloneRisk === 'Moderate'
                                ? 'text-amber-600'
                                : 'text-slate-600'
                            }`}
                          >
                            {pred.weatherFactor.cycloneRisk}
                          </span>
                        </div>

                        <div className="p-2 rounded bg-sky-50/70 border border-sky-100 text-[10px] text-sky-900 leading-snug">
                          <strong>Weather:</strong> {pred.weatherFactor.weatherSummary}
                        </div>

                        <div className="text-[10px] text-slate-500">
                          <strong>Market Driver:</strong> {pred.marketCatalysts[0] || 'Seasonal cargo flow.'}
                        </div>
                      </div>
                    </div>

                    {/* Footer Action & Apply */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-1">
                      <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-tight truncate">
                        {pred.recommendation}
                      </span>
                      <button
                        type="button"
                        onClick={() => onApplySurgePercentage(pred.predictedSpikePercentage)}
                        className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 underline shrink-0 cursor-pointer"
                      >
                        Apply +{pred.predictedSpikePercentage}%
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Matrix / Table View */}
          {activeTab === 'matrix' && (
            <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto shadow-xs">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Month</th>
                    <th className="px-4 py-3">Predicted Spot ($/MT)</th>
                    <th className="px-4 py-3">Volatility Surge</th>
                    <th className="px-4 py-3">Confidence Range</th>
                    <th className="px-4 py-3">Weather & Cyclone Hazard</th>
                    <th className="px-4 py-3">Market Catalysts</th>
                    <th className="px-4 py-3">Chartering Action</th>
                    <th className="px-4 py-3 text-right">Apply</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {predictionData.monthlyPredictions.map((pred, i) => (
                    <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3 font-semibold text-slate-900 whitespace-nowrap">
                        {pred.month}
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-slate-900 whitespace-nowrap">
                        ${pred.predictedSpotRate.toFixed(2)}/MT
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
                            pred.predictedSpikePercentage >= 30
                              ? 'bg-rose-100 text-rose-800'
                              : pred.predictedSpikePercentage >= 15
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          +{pred.predictedSpikePercentage}%
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                        ${pred.lowEstimate.toFixed(2)} - ${pred.highEstimate.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 max-w-xs text-slate-700 text-[11px]">
                        <span className="font-semibold text-sky-900">[{pred.weatherFactor.cycloneRisk} Cyclone Risk]</span>{' '}
                        {pred.weatherFactor.weatherSummary}
                      </td>
                      <td className="px-4 py-3 max-w-xs text-slate-600 text-[11px]">
                        {pred.marketCatalysts.join('; ')}
                      </td>
                      <td className="px-4 py-3 font-semibold text-indigo-700 whitespace-nowrap">
                        {pred.recommendation}
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => onApplySurgePercentage(pred.predictedSpikePercentage)}
                          className="px-2.5 py-1 text-[11px] font-bold rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 cursor-pointer"
                        >
                          Set +{pred.predictedSpikePercentage}%
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Strategic Executive Takeaway */}
          <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs text-emerald-900 leading-relaxed">
              <strong>Chief Chartering Recommendation:</strong> {predictionData.recommendedAction}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
