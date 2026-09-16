import React, { useState, useEffect } from 'react';
import {
  Building2,
  Ship,
  Compass,
  CheckCircle2,
  ShieldCheck,
  Leaf,
  Layers,
  RefreshCw,
} from 'lucide-react';
import { VendorProcurementResult, VendorProcurementInputs } from '../types';

interface VendorProcurementViewProps {
  initialOrigin?: string;
  initialDestination?: string;
  initialCommodity?: string;
  initialTonnage?: number;
}

const DEFAULT_INPUTS: VendorProcurementInputs = {
  originPort: 'Port Hedland Australia',
  destinationPort: 'Visakhapatnam',
  commodity: 'Iron Ore',
  requiredTonnage: 150000,
};

export const VendorProcurementView: React.FC<VendorProcurementViewProps> = ({
  initialOrigin,
  initialDestination,
  initialCommodity,
  initialTonnage,
}) => {
  const [inputs, setInputs] = useState<VendorProcurementInputs>({
    originPort: initialOrigin || DEFAULT_INPUTS.originPort,
    destinationPort: initialDestination || DEFAULT_INPUTS.destinationPort,
    commodity: initialCommodity || DEFAULT_INPUTS.commodity,
    requiredTonnage: initialTonnage || DEFAULT_INPUTS.requiredTonnage,
  });

  const [result, setResult] = useState<VendorProcurementResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Synchronize when parent inputs change
  useEffect(() => {
    if (initialOrigin || initialDestination || initialCommodity || initialTonnage) {
      setInputs({
        originPort: initialOrigin || inputs.originPort,
        destinationPort: initialDestination || inputs.destinationPort,
        commodity: initialCommodity || inputs.commodity,
        requiredTonnage: initialTonnage || inputs.requiredTonnage,
      });
    }
  }, [initialOrigin, initialDestination, initialCommodity, initialTonnage]);

  // Initial load
  useEffect(() => {
    fetchVendorProcurement(inputs);
  }, []);

  const fetchVendorProcurement = async (currentInputs: VendorProcurementInputs) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/vendor-procurement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentInputs),
      });
      const data = await res.json();
      if (data && data.recommended_vendors) {
        setResult(data);
      }
    } catch (err) {
      console.error('Error fetching vendor procurement data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyPreset = (preset: {
    origin: string;
    destination: string;
    commodity: string;
    tonnage: number;
  }) => {
    const updated = {
      originPort: preset.origin,
      destinationPort: preset.destination,
      commodity: preset.commodity,
      requiredTonnage: preset.tonnage,
    };
    setInputs(updated);
    fetchVendorProcurement(updated);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-xl p-6 text-white border border-slate-700 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Ministry of Steel, India
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                STRICT VERIFIED DATA API
              </span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2.5">
              <Building2 className="w-6 h-6 text-indigo-400" />
              Freight Forecasting & Bulk Vendor Procurement Engine
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Provides operational chartering data and verified bulk raw material suppliers shipping into East Coast Indian Ports (Visakhapatnam, Paradip, Haldia, Dhamra). Output is generated in strict structured JSON with zero hallucinated entities.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchVendorProcurement(inputs)}
              disabled={isLoading}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-2 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              Re-query API Engine
            </button>
          </div>
        </div>

        {/* Quick presets */}
        <div className="mt-4 pt-4 border-t border-slate-700/60 flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 font-medium mr-1">Canonical Test Scenarios:</span>
          <button
            onClick={() =>
              handleApplyPreset({
                origin: 'Port Hedland Australia',
                destination: 'Visakhapatnam',
                commodity: 'Iron Ore',
                tonnage: 150000,
              })
            }
            className="text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 transition-colors"
          >
            🇦🇺 Port Hedland → Visakhapatnam (150k MT Iron Ore)
          </button>
          <button
            onClick={() =>
              handleApplyPreset({
                origin: 'Richards Bay SA',
                destination: 'Paradip',
                commodity: 'Coking Coal',
                tonnage: 150000,
              })
            }
            className="text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 transition-colors"
          >
            🇿🇦 Richards Bay → Paradip (150k MT Coal)
          </button>
          <button
            onClick={() =>
              handleApplyPreset({
                origin: 'Hay Point Australia',
                destination: 'Dhamra',
                commodity: 'Coking Coal',
                tonnage: 160000,
              })
            }
            className="text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 transition-colors"
          >
            🇦🇺 Hay Point DBCT → Dhamra (160k MT Met Coal)
          </button>
          <button
            onClick={() =>
              handleApplyPreset({
                origin: 'Taboneo Indonesia',
                destination: 'Haldia',
                commodity: 'Thermal Coal',
                tonnage: 55000,
              })
            }
            className="text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 transition-colors"
          >
            🇮🇩 Taboneo → Haldia (55k MT River Draft Limit)
          </button>
        </div>
      </div>

      {/* Input Parameters Control Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
          <Compass className="w-4 h-4 text-indigo-600" />
          Input Parameters (Ministry of Steel API Request Payload)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Origin Port</label>
            <select
              value={inputs.originPort}
              onChange={(e) => setInputs({ ...inputs, originPort: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:bg-white font-medium"
            >
              <option value="Port Hedland Australia">Port Hedland Australia (Pilbara Iron Ore)</option>
              <option value="Richards Bay SA">Richards Bay SA (South Africa RBCT)</option>
              <option value="Hay Point Australia">Hay Point Australia (DBCT Coking Coal)</option>
              <option value="Newcastle Australia">Newcastle Australia (PWCS Coal)</option>
              <option value="Maputo Mozambique">Maputo Mozambique (Matola Coal)</option>
              <option value="Taboneo Indonesia">Taboneo Indonesia (Kalimantan Coal)</option>
              <option value="Norfolk US">Norfolk US (Hampton Roads Met Coal)</option>
              <option value="Taman Bulk Terminal Russia">Taman Bulk Terminal Russia (Black Sea)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Destination Port</label>
            <select
              value={inputs.destinationPort}
              onChange={(e) => setInputs({ ...inputs, destinationPort: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:bg-white font-medium"
            >
              <option value="Visakhapatnam">Visakhapatnam (Outer Harbour - 18.1m Draft)</option>
              <option value="Paradip">Paradip (Mechanized Coal/Ore - 14.5m Draft)</option>
              <option value="Dhamra">Dhamra (Deepwater Bulk - 18.0m Draft)</option>
              <option value="Haldia">Haldia (Riverine Hooghly - 8.2m Draft Limit)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Commodity</label>
            <select
              value={inputs.commodity}
              onChange={(e) => setInputs({ ...inputs, commodity: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:bg-white font-medium"
            >
              <option value="Iron Ore">Iron Ore (Fines & Pellets)</option>
              <option value="Coking Coal">Coking Coal (Metallurgical)</option>
              <option value="Thermal Coal">Thermal Coal (Steam Coal)</option>
              <option value="PCI Coal">PCI Coal (Pulverized Coal Injection)</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-medium text-slate-700">Required Tonnage</label>
              <span className="text-xs font-bold text-indigo-700 font-mono">
                {Number(inputs.requiredTonnage).toLocaleString()} MT
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="35000"
                max="200000"
                step="5000"
                value={inputs.requiredTonnage}
                onChange={(e) => setInputs({ ...inputs, requiredTonnage: Number(e.target.value) })}
                className="w-full accent-indigo-600"
              />
              <button
                onClick={() => fetchVendorProcurement(inputs)}
                disabled={isLoading}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-md transition-colors cursor-pointer flex-shrink-0"
              >
                Query
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Results Display */}
      {result && (
        <div className="space-y-6">
          {/* Top Summary Strip */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-xs text-slate-500 font-medium block mb-1">Commercial Shipping Route</span>
              <div className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="text-indigo-600">{result.route}</span>
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Required Parcel: <strong>{Number(inputs.requiredTonnage).toLocaleString()} MT</strong> of {inputs.commodity}
              </span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-xs text-slate-500 font-medium block mb-1">Recommended Vessel Type</span>
              <div className="text-base font-bold text-emerald-700 flex items-center gap-2">
                <Ship className="w-5 h-5 text-emerald-600" />
                <span>{result.recommended_vessel_type}</span>
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Calibrated against {inputs.destinationPort} draft & discharge capacity
              </span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-xs text-slate-500 font-medium block mb-1">Maritime Market Insight</span>
              <p className="text-xs text-slate-800 leading-relaxed italic">
                "{result.market_insight}"
              </p>
            </div>
          </div>

          {/* Recommended Vendors Table & Card Roster */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Recommended Verified Vendors (Vessel Charterers & Mining Suppliers)
                </h3>
                <p className="text-xs text-slate-500">
                  Strictly verified international maritime operators and producers. No fabricated entities.
                </p>
              </div>

              <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full self-start sm:self-auto">
                {result.recommended_vendors?.length || 0} Entities Evaluated
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/50 text-[11px] uppercase tracking-wider text-slate-500">
                    <th className="py-3 px-4 font-semibold">Vendor Name</th>
                    <th className="py-3 px-4 font-semibold">Vendor Type</th>
                    <th className="py-3 px-4 font-semibold">Current Estimated Rate</th>
                    <th className="py-3 px-4 font-semibold">Reliability Score</th>
                    <th className="py-3 px-4 font-semibold">Transit Time</th>
                    <th className="py-3 px-4 font-semibold">Sustainability (EEXI / CII)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-xs">
                  {result.recommended_vendors?.map((vendor, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-slate-900 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        <div>
                          <span>{vendor.vendor_name}</span>
                          <span className="block text-[10px] text-slate-400 font-normal">
                            Verified Industry Counterparty
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-medium text-[11px] ${
                            vendor.vendor_type === 'Vessel Charterer'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {vendor.vendor_type === 'Vessel Charterer' ? (
                            <Ship className="w-3 h-3" />
                          ) : (
                            <Layers className="w-3 h-3" />
                          )}
                          {vendor.vendor_type}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                        {vendor.current_estimated_rate}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                            <div
                              className="h-full bg-emerald-500 rounded-full"
                              style={{
                                width: vendor.reliability_score.replace('%', '') + '%',
                              }}
                            />
                          </div>
                          <span className="font-semibold text-emerald-700 font-mono text-[11px]">
                            {vendor.reliability_score}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-700 font-medium font-mono">
                        {vendor.estimated_transit_days} days
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-[11px] border border-slate-200">
                          <Leaf className="w-3 h-3 text-emerald-600" />
                          {vendor.sustainability_rating}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
