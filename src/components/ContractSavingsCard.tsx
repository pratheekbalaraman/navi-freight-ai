import React from 'react';
import { ShieldCheck, TrendingDown, DollarSign, Award, Clock, ArrowRight, Zap } from 'lucide-react';

interface ContractSavingsCardProps {
  contractComparison: {
    spotTotalCostUSD: number;
    multipleVoyageCostUSD: number;
    projectedSavingsUSD: number;
    savingsPercentage: number;
    volatilityHedgingScore: number;
    demurrageRiskScore: 'Low' | 'Moderate' | 'High' | 'Critical';
    strategicBenefit: string;
  };
  cargoVolumeMT: number;
  contractType: string;
}

export const ContractSavingsCard: React.FC<ContractSavingsCardProps> = ({
  contractComparison,
  cargoVolumeMT,
  contractType,
}) => {
  const spotTotalCostUSD = Number(contractComparison?.spotTotalCostUSD) || 0;
  const multipleVoyageCostUSD = Number(contractComparison?.multipleVoyageCostUSD) || 0;
  const projectedSavingsUSD = Number(contractComparison?.projectedSavingsUSD) || 0;
  const savingsPercentage = Number(contractComparison?.savingsPercentage) || 0;
  const volatilityHedgingScore = Number(contractComparison?.volatilityHedgingScore) || 85;
  const demurrageRiskScore = contractComparison?.demurrageRiskScore || 'Moderate';
  const strategicBenefit = contractComparison?.strategicBenefit || 'Optimizes rate certainty and volume security.';

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900">
              Contract Model Economic Comparison: Spot vs. Multi-Voyage COA
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Facilitating the transition from volatile daily spot fixtures to secured period contracts
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-semibold">
          <TrendingDown className="w-3.5 h-3.5 text-emerald-600" />
          <span>{savingsPercentage.toFixed(1)}% Direct Cost Reduction</span>
        </div>
      </div>

      {/* Main Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Spot Single Voyage Baseline */}
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold uppercase tracking-wider">Spot Fixture Baseline</span>
            <span className="text-rose-600 font-medium">Reactive Daily Market</span>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900">
            ${spotTotalCostUSD.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-500 mt-2 leading-tight">
            High exposure to unexpected market spikes, vessel unavailability, and spot demurrage penalties.
          </p>
        </div>

        {/* Multi-Voyage Contract */}
        <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/50">
          <div className="flex items-center justify-between text-xs text-indigo-700 mb-1">
            <span className="font-bold uppercase tracking-wider">Multi-Voyage COA Contract</span>
            <span className="text-indigo-600 font-medium">Secured Rate</span>
          </div>
          <div className="text-2xl font-bold font-mono text-indigo-900">
            ${multipleVoyageCostUSD.toLocaleString()}
          </div>
          <p className="text-[11px] text-indigo-700 mt-2 leading-tight">
            Volume discount, guaranteed laycan sequence, index-linked bunker formula, and preferred discharge slots.
          </p>
        </div>

        {/* Net Cost Savings */}
        <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/60">
          <div className="flex items-center justify-between text-xs text-emerald-800 mb-1">
            <span className="font-bold uppercase tracking-wider">Projected Dollar Savings</span>
            <span className="text-emerald-700 font-semibold">Net Direct Gain</span>
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-900">
            +${projectedSavingsUSD.toLocaleString()}
          </div>
          <p className="text-[11px] text-emerald-800 mt-2 leading-tight">
            Net procurement savings for {cargoVolumeMT.toLocaleString()} MT volume across contracted voyages.
          </p>
        </div>
      </div>

      {/* Strategic Hedging Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Volatility Hedging Score */}
        <div className="p-4 rounded-lg border border-slate-200 bg-white flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold font-mono text-lg flex-shrink-0">
            {volatilityHedgingScore}%
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
              <Award className="w-3.5 h-3.5 text-emerald-600" />
              Volatility Hedging Rating
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Protects against extreme freight rate surges during unexpected geopolitical or seasonal spikes.
            </p>
          </div>
        </div>

        {/* Demurrage Exposure */}
        <div className="p-4 rounded-lg border border-slate-200 bg-white flex items-center gap-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xs uppercase flex-shrink-0 ${
            demurrageRiskScore === 'High' || demurrageRiskScore === 'Critical'
              ? 'bg-rose-100 text-rose-800'
              : demurrageRiskScore === 'Moderate'
              ? 'bg-amber-100 text-amber-800'
              : 'bg-blue-100 text-blue-800'
          }`}>
            {demurrageRiskScore}
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
              <Clock className="w-3.5 h-3.5 text-slate-600" />
              Demurrage & Port Waiting Risk
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              COA agreements allow laytime averaging (reversible laytime) across consecutive voyages to eliminate single-port congestion fines.
            </p>
          </div>
        </div>
      </div>

      {/* Strategic Summary Box */}
      <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
        <strong className="text-slate-900 block mb-1">Strategic Procurement Benefit:</strong>
        {strategicBenefit}
      </div>
    </div>
  );
};
