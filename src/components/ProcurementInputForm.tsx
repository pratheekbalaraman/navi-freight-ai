import React, { useMemo } from 'react';
import {
  Ship,
  Calendar,
  Compass,
  DollarSign,
  Fuel,
  Info,
  Clock,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  Gauge
} from 'lucide-react';
import { ProcurementInputs } from '../types';
import {
  INDIAN_EAST_COAST_PORTS,
  OVERSEAS_ORIGIN_PORTS,
  COMMODITY_OPTIONS,
  TRADE_LANE_DISTANCES,
  VESSEL_CLASSES
} from '../data/maritimeData';

interface ProcurementInputFormProps {
  inputs: ProcurementInputs;
  onChange: (inputs: ProcurementInputs) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const ProcurementInputForm: React.FC<ProcurementInputFormProps> = ({
  inputs,
  onChange,
  onSubmit,
  isLoading,
}) => {
  // Find selected ports metadata
  const selectedOrigin = useMemo(() => {
    return OVERSEAS_ORIGIN_PORTS.find(p => p.name === inputs.originPort) || OVERSEAS_ORIGIN_PORTS[0];
  }, [inputs.originPort]);

  const selectedDestination = useMemo(() => {
    return INDIAN_EAST_COAST_PORTS.find(p => p.name === inputs.dischargePort) || INDIAN_EAST_COAST_PORTS[0];
  }, [inputs.dischargePort]);

  // Compute nautical distance & estimated sailing days
  const tradeLaneInfo = useMemo(() => {
    const originKey = selectedOrigin.id;
    return TRADE_LANE_DISTANCES[originKey] || { distanceNM: 4500, daysSteamAt13Knots: 14.5 };
  }, [selectedOrigin]);

  // Quick parcel buttons handler
  const handleParcelPreset = (volume: number) => {
    onChange({ ...inputs, cargoVolumeMT: volume });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header bar */}
      <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700">
            <Ship className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Ship Procurement & Cargo Details</h2>
            <p className="text-xs text-slate-500">Feed cargo parcels, origin/destination constraints, and target contract duration</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Objective:</span>
          <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
            Spot → Multi-Voyage Migration
          </span>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Section 1: Commodity & Cargo Volume */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              <span>1. Bulk Cargo Commodity & Parcel Size</span>
              <span className="text-xs font-normal text-slate-400">(Required for displacement & vessel sizing)</span>
            </label>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-400 font-medium">Standard Parcels:</span>
              <button
                type="button"
                onClick={() => handleParcelPreset(35000)}
                className={`text-xs px-2 py-0.5 rounded font-medium border ${
                  inputs.cargoVolumeMT === 35000
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Handy (35k)
              </button>
              <button
                type="button"
                onClick={() => handleParcelPreset(58000)}
                className={`text-xs px-2 py-0.5 rounded font-medium border ${
                  inputs.cargoVolumeMT === 58000
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Supra (58k)
              </button>
              <button
                type="button"
                onClick={() => handleParcelPreset(75000)}
                className={`text-xs px-2 py-0.5 rounded font-medium border ${
                  inputs.cargoVolumeMT === 75000
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Panamax (75k)
              </button>
              <button
                type="button"
                onClick={() => handleParcelPreset(80000)}
                className={`text-xs px-2 py-0.5 rounded font-medium border ${
                  inputs.cargoVolumeMT === 80000
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Kamsarmax (80k)
              </button>
              <button
                type="button"
                onClick={() => handleParcelPreset(150000)}
                className={`text-xs px-2 py-0.5 rounded font-medium border ${
                  inputs.cargoVolumeMT === 150000
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Capesize (150k)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Commodity Type</label>
              <select
                value={inputs.commodity}
                onChange={(e) => onChange({ ...inputs, commodity: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {COMMODITY_OPTIONS.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-medium text-slate-700">Cargo Volume (Metric Tonnes)</label>
                <span className="text-xs font-bold text-indigo-700 font-mono">
                  {Number(inputs.cargoVolumeMT).toLocaleString()} MT
                </span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="25000"
                  max="200000"
                  step="5000"
                  value={inputs.cargoVolumeMT}
                  onChange={(e) => onChange({ ...inputs, cargoVolumeMT: Number(e.target.value) })}
                  className="w-full accent-indigo-600"
                />
                <input
                  type="number"
                  min="10000"
                  max="300000"
                  step="1000"
                  value={inputs.cargoVolumeMT}
                  onChange={(e) => onChange({ ...inputs, cargoVolumeMT: Number(e.target.value) })}
                  className="w-28 px-2.5 py-1.5 text-xs text-right font-mono font-semibold bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Origin & Destination Ports */}
        <div className="pt-4 border-t border-slate-100">
          <label className="block text-sm font-semibold text-slate-800 mb-3">
            2. Origin Loading Port vs. East Coast India Discharge Port
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Origin */}
            <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/70">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">Overseas Loading Port</span>
                <span className="text-[11px] font-medium px-2 py-0.5 bg-blue-100 text-blue-800 rounded">
                  {selectedOrigin.country}
                </span>
              </div>
              <select
                value={inputs.originPort}
                onChange={(e) => {
                  const port = OVERSEAS_ORIGIN_PORTS.find(p => p.name === e.target.value);
                  onChange({
                    ...inputs,
                    originPort: e.target.value,
                    originCountry: port ? port.country : inputs.originCountry,
                  });
                }}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium"
              >
                {OVERSEAS_ORIGIN_PORTS.map((p) => (
                  <option key={p.id} value={p.name}>
                    {p.name} ({p.country})
                  </option>
                ))}
              </select>

              <div className="mt-2.5 grid grid-cols-3 gap-2 text-center text-[11px]">
                <div className="p-1.5 bg-white rounded border border-slate-200">
                  <span className="text-slate-400 block">Max Draft</span>
                  <strong className="text-slate-800 font-mono">{selectedOrigin.maxDraft}m</strong>
                </div>
                <div className="p-1.5 bg-white rounded border border-slate-200">
                  <span className="text-slate-400 block">Max LOA</span>
                  <strong className="text-slate-800 font-mono">{selectedOrigin.maxLOA}m</strong>
                </div>
                <div className="p-1.5 bg-white rounded border border-slate-200">
                  <span className="text-slate-400 block">Load Rate</span>
                  <strong className="text-slate-800 font-mono">{(selectedOrigin.handlingRateMTPerDay / 1000).toFixed(0)}k MT/d</strong>
                </div>
              </div>
            </div>

            {/* Destination */}
            <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/70">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">East Coast India Port</span>
                <span className="text-[11px] font-medium px-2 py-0.5 bg-amber-100 text-amber-800 rounded">
                  India (Discharge)
                </span>
              </div>
              <select
                value={inputs.dischargePort}
                onChange={(e) => onChange({ ...inputs, dischargePort: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium"
              >
                {INDIAN_EAST_COAST_PORTS.map((p) => (
                  <option key={p.id} value={p.name}>
                    {p.name} (Draft: {p.maxDraft}m)
                  </option>
                ))}
              </select>

              <div className="mt-2.5 grid grid-cols-3 gap-2 text-center text-[11px]">
                <div className="p-1.5 bg-white rounded border border-slate-200">
                  <span className="text-slate-400 block">Berth Draft</span>
                  <strong className={`font-mono ${selectedDestination.maxDraft < 10 ? 'text-rose-600' : 'text-slate-800'}`}>
                    {selectedDestination.maxDraft}m
                  </strong>
                </div>
                <div className="p-1.5 bg-white rounded border border-slate-200">
                  <span className="text-slate-400 block">Max LOA</span>
                  <strong className="text-slate-800 font-mono">{selectedDestination.maxLOA}m</strong>
                </div>
                <div className="p-1.5 bg-white rounded border border-slate-200">
                  <span className="text-slate-400 block">Discharge Rate</span>
                  <strong className="text-slate-800 font-mono">{(selectedDestination.handlingRateMTPerDay / 1000).toFixed(0)}k MT/d</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Trade Lane Distance Badge */}
          <div className="mt-3 px-3.5 py-2 rounded-lg bg-indigo-50/70 border border-indigo-100 flex flex-wrap items-center justify-between gap-3 text-xs text-indigo-900">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-indigo-600" />
              <span>
                Estimated Sailing Distance: <strong className="font-mono">{tradeLaneInfo.distanceNM.toLocaleString()} nautical miles</strong>
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span>
                Transit Time (@ 13.0 kts): <strong className="font-mono">{tradeLaneInfo.daysSteamAt13Knots.toFixed(1)} days</strong>
              </span>
              {selectedDestination.maxDraft < 10 && (
                <span className="text-rose-700 font-semibold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Haldia draft constraint active (require handy or offshore lightening)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Section 3: Laycan & Contract Duration Strategy */}
        <div className="pt-4 border-t border-slate-100">
          <label className="block text-sm font-semibold text-slate-800 mb-3">
            3. Laycan Window & Charter Contract Strategy
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Laycan Start Date
              </label>
              <input
                type="date"
                value={inputs.laycanStart}
                onChange={(e) => onChange({ ...inputs, laycanStart: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Laycan End Date (Cancelling Date)
              </label>
              <input
                type="date"
                value={inputs.laycanEnd}
                onChange={(e) => onChange({ ...inputs, laycanEnd: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Contract Model to Evaluate
              </label>
              <select
                value={inputs.contractType}
                onChange={(e) => onChange({ ...inputs, contractType: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium"
              >
                <option value="3-Month Consecutive Voyage Contract (COA)">3-Month Consecutive Voyage COA (Recommended)</option>
                <option value="6-Month Multiple Voyage Charter (Index Discounted)">6-Month Multiple Voyage COA</option>
                <option value="12-Month Period Time Charter with BAF Clause">12-Month Period Charter (Bunker Protected)</option>
                <option value="Single Spot Market Fixture (Baseline Comparison)">Single Spot Voyage (Reactive Daily Market)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 4: Economic Parameters & Bunker Benchmarks */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-semibold text-slate-800">
              4. Freight Benchmarks & Bunker Fuel Parameters
            </label>
            <span className="text-xs text-slate-400">Used for ton-mile voyage calculation and BAF indexing</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center gap-1">
                <DollarSign className="w-3 h-3 text-slate-400" />
                Current Spot Freight ($/MT)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-sm text-slate-400">$</span>
                <input
                  type="number"
                  step="0.1"
                  value={inputs.currentSpotFreightPerMT}
                  onChange={(e) => onChange({ ...inputs, currentSpotFreightPerMT: Number(e.target.value) })}
                  className="w-full pl-7 pr-3 py-1.5 text-sm bg-white border border-slate-300 rounded-lg font-mono font-medium focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center gap-1">
                <Fuel className="w-3 h-3 text-slate-400" />
                VLSFO Bunker Price ($/MT)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-sm text-slate-400">$</span>
                <input
                  type="number"
                  step="5"
                  value={inputs.bunkerPricePerMT}
                  onChange={(e) => onChange({ ...inputs, bunkerPricePerMT: Number(e.target.value) })}
                  className="w-full pl-7 pr-3 py-1.5 text-sm bg-white border border-slate-300 rounded-lg font-mono font-medium focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                Demurrage Penalty ($/Day)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-sm text-slate-400">$</span>
                <input
                  type="number"
                  step="1000"
                  value={inputs.demurrageRatePerDayUSD}
                  onChange={(e) => onChange({ ...inputs, demurrageRatePerDayUSD: Number(e.target.value) })}
                  className="w-full pl-7 pr-3 py-1.5 text-sm bg-white border border-slate-300 rounded-lg font-mono font-medium focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Seasonal Trade Profile
              </label>
              <select
                value={inputs.seasonalProfile}
                onChange={(e) => onChange({ ...inputs, seasonalProfile: e.target.value })}
                className="w-full px-3 py-1.5 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Pre-monsoon / Peak Asian restocking">Pre-monsoon / Peak Restocking</option>
                <option value="Southwest Monsoon Lull (Jun-Aug)">SW Monsoon Lull (Lower Congestion)</option>
                <option value="Post-monsoon Cyclone Risk Window (Sep-Nov)">Post-monsoon Cyclonic Weather Window</option>
                <option value="Q4 Atlantic Grain & Coal Push">Q4 Global Atlantic Peak Freight</option>
              </select>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Info className="w-4 h-4 text-indigo-600 flex-shrink-0" />
            <span>
              The AI model will run time-series forward rate bounds, cross-reference port draft clearances, and simulate short/mid-term contract cost savings.
            </span>
          </div>

          <button
            type="button"
            onClick={onSubmit}
            disabled={isLoading}
            className="w-full sm:w-auto px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Generating Forecast & Optimizing Charter...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Run Intelligent Freight Model</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
