import React, { useState } from 'react';
import {
  ShieldCheck,
  TrendingDown,
  DollarSign,
  PieChart,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sliders,
  Layers,
  Sparkles,
  CloudSun,
  Wind,
  Compass,
  ArrowRight
} from 'lucide-react';
import { AiSpotForecastModal } from './AiSpotForecastModal';
import { AiVoyageWeatherModal } from './AiVoyageWeatherModal';

export const ContractEconomicsView: React.FC = () => {
  // Annual parameters
  const [annualVolumeMT, setAnnualVolumeMT] = useState<number>(1200000); // 1.2M MT/year
  const [coaSharePercent, setCoaSharePercent] = useState<number>(75); // 75% COA, 25% Spot
  const [baseSpotRate, setBaseSpotRate] = useState<number>(17.5); // $/MT
  const [coaDiscountPercent, setCoaDiscountPercent] = useState<number>(11.5); // 11.5% COA discount
  const [spotVolatilitySpike, setSpotVolatilitySpike] = useState<number>(25); // +25% seasonal surge risk
  const [demurrageDaysPerVoyage, setDemurrageDaysPerVoyage] = useState<number>(2.5); // avg delay at Paradip/Haldia
  const [isAiPredictorOpen, setIsAiPredictorOpen] = useState<boolean>(false);
  const [isAiWeatherModalOpen, setIsAiWeatherModalOpen] = useState<boolean>(false);
  const [appliedAiInsight, setAppliedAiInsight] = useState<{
    rate: number;
    surgePct: number;
    timestamp: string;
  } | null>(null);
  const [appliedWeatherMonth, setAppliedWeatherMonth] = useState<string | null>(null);

  // Calculations
  const spotRateWithSpike = baseSpotRate * (1 + spotVolatilitySpike / 100);
  const averageSpotRateExpected = (baseSpotRate + spotRateWithSpike) / 2;
  const coaFixedRate = baseSpotRate * (1 - coaDiscountPercent / 100);

  const averageParcelSize = 75000; // Panamax parcel
  const totalVoyagesPerYear = Math.ceil(annualVolumeMT / averageParcelSize);

  // Strategy A: 100% Spot Procurement
  const spotFreightOnly = annualVolumeMT * averageSpotRateExpected;
  const spotDemurrageCost = totalVoyagesPerYear * demurrageDaysPerVoyage * 28000; // $28k/day demurrage
  const totalCost100Spot = spotFreightOnly + spotDemurrageCost;

  // Strategy B: Transitioned Portfolio (COA Share + Spot Balance)
  const coaVolume = (annualVolumeMT * coaSharePercent) / 100;
  const spotVolume = annualVolumeMT - coaVolume;

  const coaFreightCost = coaVolume * coaFixedRate;
  const blendedSpotFreightCost = spotVolume * averageSpotRateExpected;
  // COA contracts allow reversible laytime and preferred berthing, cutting demurrage by 60%
  const coaDemurrageCost = totalVoyagesPerYear * demurrageDaysPerVoyage * 28000 * (1 - (coaSharePercent / 100) * 0.6);
  const totalCostOptimized = coaFreightCost + blendedSpotFreightCost + coaDemurrageCost;

  const totalAnnualSavingsUSD = totalCost100Spot - totalCostOptimized;
  const savingsPercent = (totalAnnualSavingsUSD / totalCost100Spot) * 100;
  const savingsINRinCrores = (totalAnnualSavingsUSD * 86.5) / 10000000; // 1 USD = 86.5 INR, 1 Cr = 10,000,000

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-bold text-slate-900">
                Spot vs. Short/Mid-Term Multiple Voyage COA Portfolio Simulator
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Financial modeling tool demonstrating the cost-reduction and risk-hedging impact of moving from spot fixtures to multi-voyage contracts
            </p>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold">
            <TrendingDown className="w-4 h-4 text-emerald-600" />
            <span>Target Annual Savings: {savingsPercent.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* Simulator Inputs Grid */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Sliders className="w-4 h-4 text-indigo-600" />
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
            Interactive Portfolio Sensitivity Variables
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Annual Procurement Volume */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-700">Annual Procurement Cargo Volume</label>
              <span className="text-xs font-mono font-bold text-indigo-700">
                {(annualVolumeMT / 1000000).toFixed(2)}M MT ({totalVoyagesPerYear} voyages)
              </span>
            </div>
            <input
              type="range"
              min="200000"
              max="5000000"
              step="100000"
              value={annualVolumeMT}
              onChange={(e) => setAnnualVolumeMT(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>0.2M MT</span>
              <span>2.5M MT</span>
              <span>5.0M MT</span>
            </div>
          </div>

          {/* Multiple Voyage COA Target Share */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-700">Contract Allocation (COA Share %)</label>
              <span className="text-xs font-mono font-bold text-emerald-700">
                {coaSharePercent}% COA / {100 - coaSharePercent}% Spot
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={coaSharePercent}
              onChange={(e) => setCoaSharePercent(Number(e.target.value))}
              className="w-full accent-emerald-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>0% (100% Spot)</span>
              <span>50% Balanced</span>
              <span>100% Secured</span>
            </div>
          </div>

          {/* COA Volume Discount % */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-700">COA Negotiated Volume Discount</label>
              <span className="text-xs font-mono font-bold text-slate-800">
                {coaDiscountPercent.toFixed(1)}% off Spot
              </span>
            </div>
            <input
              type="range"
              min="4"
              max="20"
              step="0.5"
              value={coaDiscountPercent}
              onChange={(e) => setCoaDiscountPercent(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>4% Min</span>
              <span>11.5% Standard</span>
              <span>20% Max Bulk</span>
            </div>
          </div>

          {/* Baseline Spot Rate */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-700">Baseline Spot Freight ($/MT)</label>
              <span className="text-xs font-mono font-bold text-slate-800">
                ${baseSpotRate.toFixed(2)}/MT
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="35"
              step="0.5"
              value={baseSpotRate}
              onChange={(e) => setBaseSpotRate(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>$10/MT</span>
              <span>$22/MT</span>
              <span>$35/MT</span>
            </div>
          </div>

          {/* Spot Market Volatility Surge */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-700">Spot Seasonal Volatility Surge</label>
              <span className="text-xs font-mono font-bold text-rose-600">
                +{spotVolatilitySpike}% peak spike
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="60"
              step="5"
              value={spotVolatilitySpike}
              onChange={(e) => {
                setSpotVolatilitySpike(Number(e.target.value));
                setAppliedAiInsight(null);
              }}
              className="w-full accent-rose-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>+5% Mild</span>
              <span>+30% Typical</span>
              <span>+60% Extreme</span>
            </div>
          </div>

          {/* Port Demurrage Waiting Days */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-700">Average Port Congestion Delay</label>
              <span className="text-xs font-mono font-bold text-amber-700">
                {demurrageDaysPerVoyage.toFixed(1)} days/voyage
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="7"
              step="0.5"
              value={demurrageDaysPerVoyage}
              onChange={(e) => setDemurrageDaysPerVoyage(Number(e.target.value))}
              className="w-full accent-amber-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>0 days</span>
              <span>3.5 days</span>
              <span>7 days</span>
            </div>
          </div>
        </div>

        {/* AI Predictive Intelligence Suite: Side-by-side Market & Maritime Weather Forecasts */}
        <div className="pt-4 border-t border-slate-200/80 grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Card 1: AI Market & Weather Spot Predictor */}
          <div className="p-3.5 bg-gradient-to-br from-indigo-50/90 via-slate-50 to-blue-50/70 rounded-xl border border-indigo-200/80 shadow-xs flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0 shadow-xs">
                    <Sparkles className="w-4 h-4 text-indigo-100" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-indigo-950 block leading-tight">
                      AI Market & Weather Spot Predictor
                    </span>
                    <span className="text-[10px] text-slate-500 block leading-tight">
                      Forecasts spot rate surge ($/MT) and seasonal volatility curves for user target months
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-indigo-100 text-indigo-800 border border-indigo-200">
                  Freight Rates
                </span>
              </div>

              {appliedAiInsight ? (
                <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200 text-xs flex items-center justify-between">
                  <div>
                    <span className="text-emerald-800 font-semibold block text-[11px]">
                      Predicted Spot Surge Active:
                    </span>
                    <span className="text-emerald-700 font-mono text-xs">
                      ${appliedAiInsight.rate.toFixed(2)}/MT (+{appliedAiInsight.surgePct}% volatility spike)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAiPredictorOpen(true)}
                    className="text-[10px] text-indigo-600 hover:text-indigo-800 font-semibold underline cursor-pointer"
                  >
                    Change Months
                  </button>
                </div>
              ) : (
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Query live AI models to evaluate cyclone risks (Bay of Bengal/Queensland), SW monsoon lull, and Baltic forward curves across target shipment months.
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={() => setIsAiPredictorOpen(true)}
              className="w-full py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
              <span>Predict Spot Rate by Weather & Market Months</span>
              <ArrowRight className="w-3.5 h-3.5 text-indigo-200" />
            </button>
          </div>

          {/* Card 2: AI Voyage Weather Analyst & Route Risk Forecaster */}
          <div className="p-3.5 bg-gradient-to-br from-sky-50/90 via-slate-50 to-cyan-50/70 rounded-xl border border-sky-200/80 shadow-xs flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-sky-600 flex items-center justify-center flex-shrink-0 shadow-xs">
                    <CloudSun className="w-4 h-4 text-sky-100" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-sky-950 block leading-tight">
                      AI Voyage Weather Analyst & Route Risk Forecaster
                    </span>
                    <span className="text-[10px] text-slate-500 block leading-tight">
                      Predicts departure-to-arrival route weather, flood warnings & suggests the optimal shipment month
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-sky-100 text-sky-800 border border-sky-200">
                  Meteorology
                </span>
              </div>

              {appliedWeatherMonth ? (
                <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200 text-xs flex items-center justify-between">
                  <div>
                    <span className="text-emerald-800 font-semibold block text-[11px]">
                      Optimal Window Adopted:
                    </span>
                    <span className="text-emerald-700 font-bold text-xs">
                      {appliedWeatherMonth}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAiWeatherModalOpen(true)}
                    className="text-[10px] text-sky-600 hover:text-sky-800 font-semibold underline cursor-pointer"
                  >
                    View Hazards
                  </button>
                </div>
              ) : (
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Weather analyst predicts wave swell, tropical cyclone alerts & river floods (Mahanadi/Hooghly/Queensland) between chosen departure & arrival ports.
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={() => setIsAiWeatherModalOpen(true)}
              className="w-full py-2 px-3 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
            >
              <CloudSun className="w-3.5 h-3.5 text-sky-200" />
              <span>Analyze Route Weather, Flood Warnings & Best Month</span>
              <ArrowRight className="w-3.5 h-3.5 text-sky-200" />
            </button>
          </div>
        </div>
      </div>

      {/* Financial Results Scoreboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Strategy 1: 100% Spot */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Current Status Quo (100% Spot Fixtures)
          </div>
          <div className="text-2xl font-mono font-bold text-slate-900">
            ${(totalCost100Spot / 1000000).toFixed(2)}M <span className="text-xs font-normal text-slate-500">/ yr</span>
          </div>

          <div className="space-y-1.5 text-xs pt-2 border-t border-slate-100">
            <div className="flex justify-between text-slate-600">
              <span>Avg Spot Freight Bill:</span>
              <span className="font-mono">${(spotFreightOnly / 1000000).toFixed(2)}M</span>
            </div>
            <div className="flex justify-between text-rose-600">
              <span>Demurrage Penalties:</span>
              <span className="font-mono">+${(spotDemurrageCost / 1000000).toFixed(2)}M</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Effective $/MT:</span>
              <span className="font-mono font-bold">${(totalCost100Spot / annualVolumeMT).toFixed(2)}/MT</span>
            </div>
          </div>

          <div className="p-2.5 bg-rose-50 rounded text-[11px] text-rose-800 leading-snug">
            ⚠️ 100% exposed to daily market price hikes, high spot demurrage charges, and inability to secure prompt vessels during port peak congestion.
          </div>
        </div>

        {/* Strategy 2: Transitioned Portfolio */}
        <div className="bg-indigo-50/50 rounded-xl border border-indigo-200 p-5 shadow-sm space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-indigo-700">
            Optimized Strategy ({coaSharePercent}% Multi-Voyage COA)
          </div>
          <div className="text-2xl font-mono font-bold text-indigo-950">
            ${(totalCostOptimized / 1000000).toFixed(2)}M <span className="text-xs font-normal text-indigo-600">/ yr</span>
          </div>

          <div className="space-y-1.5 text-xs pt-2 border-t border-indigo-100">
            <div className="flex justify-between text-indigo-900">
              <span>Secured COA Volume:</span>
              <span className="font-mono">{((annualVolumeMT * coaSharePercent) / 100000000).toFixed(2)}M MT</span>
            </div>
            <div className="flex justify-between text-indigo-900">
              <span>COA Negotiated Rate:</span>
              <span className="font-mono font-bold">${coaFixedRate.toFixed(2)}/MT</span>
            </div>
            <div className="flex justify-between text-indigo-900">
              <span>Effective Blended $/MT:</span>
              <span className="font-mono font-bold text-indigo-700">${(totalCostOptimized / annualVolumeMT).toFixed(2)}/MT</span>
            </div>
          </div>

          <div className="p-2.5 bg-indigo-100/70 rounded text-[11px] text-indigo-900 leading-snug">
            ✓ Guaranteed laycan slots, preferred berthing windows at Paradip/Dhamra, reversible laytime netting, and predictable landed raw material pricing.
          </div>
        </div>

        {/* Total Annual Value Creation */}
        <div className="bg-emerald-600 text-white rounded-xl p-5 shadow-sm space-y-3 flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-200">
              Projected Annual Net Savings
            </div>
            <div className="text-3xl font-mono font-bold text-white mt-1">
              +${(totalAnnualSavingsUSD / 1000000).toFixed(2)}M
            </div>
            <div className="text-sm font-semibold text-emerald-100 mt-0.5">
              ≈ ₹{savingsINRinCrores.toFixed(1)} Crores INR / year
            </div>
          </div>

          <div className="space-y-2 text-xs pt-3 border-t border-emerald-500/50">
            <div className="flex justify-between text-emerald-100">
              <span>Total Cost Reduction:</span>
              <span className="font-bold text-white font-mono">{savingsPercent.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between text-emerald-100">
              <span>Per Ton Savings:</span>
              <span className="font-bold text-white font-mono">+${(totalAnnualSavingsUSD / annualVolumeMT).toFixed(2)}/MT</span>
            </div>
            <div className="flex justify-between text-emerald-100">
              <span>Demurrage Reduction:</span>
              <span className="font-bold text-white font-mono">-${((spotDemurrageCost - coaDemurrageCost) / 1000).toFixed(0)}k</span>
            </div>
          </div>

          <div className="p-2.5 bg-emerald-700/60 rounded text-[11px] text-emerald-100 leading-tight">
            🎯 Strategic Recommendation: Enter tender for 3-month to 6-month COA packages covering {coaSharePercent}% of annual baseload volume.
          </div>
        </div>
      </div>

      {/* AI Market & Weather Spot Rate Predictor Modal */}
      <AiSpotForecastModal
        isOpen={isAiPredictorOpen}
        onClose={() => setIsAiPredictorOpen(false)}
        baseSpotRate={baseSpotRate}
        currentVolSurgePct={spotVolatilitySpike}
        onApplyPredictedRate={(predictedRate, surgePct) => {
          setSpotVolatilitySpike(surgePct);
          setAppliedAiInsight({
            rate: predictedRate,
            surgePct: surgePct,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          });
        }}
      />

      {/* AI Maritime Weather Analyst & Route Risk Modal */}
      <AiVoyageWeatherModal
        isOpen={isAiWeatherModalOpen}
        onClose={() => setIsAiWeatherModalOpen(false)}
        defaultOriginPort="Hay Point / Dalrymple Bay (DBCT)"
        defaultDestinationPort="Paradip Port"
        onAdoptOptimalMonth={(month) => {
          setAppliedWeatherMonth(month);
          // If user adopts a calm, optimal weather month, optimize demurrage delays down to 1.5 days
          setDemurrageDaysPerVoyage((prev) => Math.min(prev, 1.5));
        }}
      />
    </div>
  );
};
