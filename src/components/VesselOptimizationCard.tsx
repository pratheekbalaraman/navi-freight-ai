import React, { useState } from 'react';
import {
  Ship,
  CheckCircle2,
  AlertTriangle,
  Anchor,
  ArrowRight,
  Gauge,
  Sliders,
  Sparkles,
  Info,
  DollarSign,
  AlertCircle,
  HelpCircle,
  TrendingDown
} from 'lucide-react';
import { VesselClass } from '../types';
import {
  VESSEL_CLASSES,
  calculateVesselSizingMatrix,
  VesselSizingEvaluation
} from '../data/maritimeData';

interface VesselOptimizationCardProps {
  vesselRecommendation: {
    recommendedClass: VesselClass | 'Dual-Parcel Split';
    aiRecommendedClass?: VesselClass | 'Dual-Parcel Split';
    selectedClass?: VesselClass | 'Dual-Parcel Split';
    rationale: string;
    portFeasibility: {
      originStatus: 'Compatible' | 'Restricted' | 'Optimal';
      originNotes: string;
      destinationStatus: 'Compatible' | 'Draft Restricted' | 'Optimal';
      destinationNotes: string;
      draftClearanceMeters: number;
      maxDischargeDays: number;
    };
    estimatedFreightRateUSDPerMT: number;
    totalFreightCostUSD: number;
  };
  cargoVolumeMT: number;
  originPort: string;
  dischargePort: string;
  onSelectVesselClass?: (vesselClass: VesselClass) => void;
}

export const VesselOptimizationCard: React.FC<VesselOptimizationCardProps> = ({
  vesselRecommendation,
  cargoVolumeMT,
  originPort,
  dischargePort,
  onSelectVesselClass,
}) => {
  const {
    recommendedClass,
    aiRecommendedClass,
    rationale,
    portFeasibility,
    estimatedFreightRateUSDPerMT,
    totalFreightCostUSD,
  } = vesselRecommendation;

  // AI Recommended benchmark class (always preserved)
  const aiClass: VesselClass =
    (aiRecommendedClass && aiRecommendedClass !== 'Dual-Parcel Split'
      ? (aiRecommendedClass as VesselClass)
      : (recommendedClass === 'Dual-Parcel Split' ? 'Panamax' : (recommendedClass as VesselClass)));

  // Track the inspected / active vessel in the matrix
  const initialClass: VesselClass =
    recommendedClass === 'Dual-Parcel Split' ? 'Panamax' : (recommendedClass as VesselClass);
  const [inspectedClass, setInspectedClass] = useState<VesselClass>(initialClass);

  React.useEffect(() => {
    setInspectedClass(initialClass);
  }, [initialClass]);

  // Calculate dynamic sizing evaluations for all 4 vessel classes
  const sizingMatrix = calculateVesselSizingMatrix(
    cargoVolumeMT,
    dischargePort,
    estimatedFreightRateUSDPerMT > 0 ? estimatedFreightRateUSDPerMT : 16.8
  );

  const inspectedEvaluation = sizingMatrix[inspectedClass] || sizingMatrix.Panamax;
  const recommendedEvaluation =
    sizingMatrix[initialClass] || sizingMatrix.Panamax;

  const handleCardClick = (vClass: VesselClass) => {
    setInspectedClass(vClass);
  };

  const handleApplyHull = (vClass: VesselClass) => {
    if (onSelectVesselClass) {
      onSelectVesselClass(vClass);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <Ship className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">
              Vessel Sizing & Infrastructure Matching
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Evaluating cargo displacement, draft envelopes, hold intake, and deadfreight exposure
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>AI Benchmark:</span>
            <span className="font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              <span>{aiClass}</span>
              <span className="text-[9px] bg-emerald-600 text-white px-1.5 py-0.2 rounded font-semibold uppercase">
                AI Recommended
              </span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>Active Fixture:</span>
            <span className="text-xs font-bold px-2.5 py-1 bg-indigo-600 text-white rounded-md uppercase tracking-wider shadow-xs flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {recommendedClass} (Selected)
            </span>
          </div>
        </div>
      </div>

      {/* Rationale and Economics */}
      <div className="p-4 rounded-lg bg-indigo-50/50 border border-indigo-100 text-slate-800 text-xs leading-relaxed">
        <div className="flex items-start gap-2.5">
          <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium text-slate-900">{rationale}</p>
            <div className="mt-2.5 pt-2 border-t border-indigo-100 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div>
                <span className="text-slate-500">Optimized Freight Rate: </span>
                <strong className="text-indigo-700 font-mono text-sm">
                  ${estimatedFreightRateUSDPerMT.toFixed(2)}/MT
                </strong>
              </div>
              <div>
                <span className="text-slate-500">Voyage Total Freight: </span>
                <strong className="text-indigo-900 font-mono text-sm">
                  ${totalFreightCostUSD.toLocaleString()}
                </strong>
              </div>
              <div>
                <span className="text-slate-500">Discharge Turnaround: </span>
                <strong className="text-emerald-700 font-mono text-sm">
                  ~{portFeasibility.maxDischargeDays} days
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Infrastructure Port Clearance Checkpoints */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Origin Port Clearance */}
        <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
              <Anchor className="w-3.5 h-3.5 text-blue-600" />
              Loading: {originPort}
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                portFeasibility.originStatus === 'Optimal'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {portFeasibility.originStatus}
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-normal">{portFeasibility.originNotes}</p>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 font-mono pt-2 border-t border-slate-200">
            <span>Berth Equipment: Mechanized Loaders</span>
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Berth Verified
            </span>
          </div>
        </div>

        {/* Destination Port Clearance */}
        <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
              <Anchor className="w-3.5 h-3.5 text-amber-600" />
              Discharge: {dischargePort}
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                portFeasibility.destinationStatus === 'Optimal'
                  ? 'bg-emerald-100 text-emerald-800'
                  : portFeasibility.destinationStatus === 'Draft Restricted'
                  ? 'bg-rose-100 text-rose-800'
                  : 'bg-blue-100 text-blue-800'
              }`}
            >
              {portFeasibility.destinationStatus}
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-normal">{portFeasibility.destinationNotes}</p>
          <div className="mt-3 flex items-center justify-between text-[11px] font-mono pt-2 border-t border-slate-200">
            <span className="text-slate-500">Permissible Draft:</span>
            <strong
              className={`${
                portFeasibility.draftClearanceMeters < 10 ? 'text-rose-600' : 'text-slate-800'
              }`}
            >
              {portFeasibility.draftClearanceMeters}m
            </strong>
          </div>
        </div>
      </div>

      {/* Interactive Vessel Class Sizing Matrix */}
      <div className="pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-3">
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <span>Vessel Class Sizing Matrix for {cargoVolumeMT.toLocaleString()} MT Cargo</span>
              <span className="text-[10px] lowercase font-normal text-slate-500 font-sans">
                {cargoVolumeMT >= 140000
                  ? '(Fixed Capesize recommendation for 140,000+ MT bulk stem)'
                  : '(Click any vessel class to inspect or switch selection)'}
              </span>
            </h4>
          </div>
          <span className="text-[11px] text-indigo-600 font-medium bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
            Target Parcel: {cargoVolumeMT.toLocaleString()} MT
          </span>
        </div>

        {/* 4-Column Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {VESSEL_CLASSES.map((spec) => {
            const vClass = spec.class;
            const evalData = sizingMatrix[vClass];
            const isInspected = vClass === inspectedClass;
            const isAiRecommended =
              vClass === aiClass ||
              (vesselRecommendation.aiRecommendedClass === 'Dual-Parcel Split' && vClass === 'Panamax');
            const isCurrentlySelected =
              vClass === recommendedClass ||
              (recommendedClass === 'Dual-Parcel Split' && vClass === 'Panamax');

            return (
              <div
                key={vClass}
                role="button"
                tabIndex={0}
                onClick={() => handleCardClick(vClass)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCardClick(vClass);
                  }
                }}
                className={`w-full text-left p-3.5 rounded-xl border transition-all relative flex flex-col justify-between cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  isInspected
                    ? 'bg-indigo-50/80 border-indigo-500 ring-2 ring-indigo-200 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60 shadow-2xs'
                }`}
              >
                <div>
                  {/* Top Bar: Class Name & Badges */}
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-slate-900 text-sm">{vClass}</span>
                      {isAiRecommended && (
                        <span className="text-[9px] bg-emerald-600 text-white px-1.5 py-0.5 rounded font-semibold tracking-wide flex items-center gap-1 shadow-2xs">
                          <Sparkles className="w-2.5 h-2.5 text-emerald-200" />
                          AI Recommended
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {isCurrentlySelected ? (
                        <span className="text-[10px] bg-indigo-600 text-white px-1.5 py-0.5 rounded font-medium flex items-center gap-0.5 shadow-2xs">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          Selected
                        </span>
                      ) : isInspected ? (
                        <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded font-medium">
                          Viewing
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-500 font-mono mb-2">
                    {evalData?.subtypeName || spec.typicalDWT}
                  </div>

                  {/* Sizing Intake Status Badge */}
                  <div className="mb-2.5">
                    <span
                      className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        evalData?.statusBadgeColor === 'emerald'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : evalData?.statusBadgeColor === 'amber'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : evalData?.statusBadgeColor === 'rose'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {evalData?.cargoIntakeStatus}
                    </span>
                  </div>

                  {/* Progress bar of cargo hold utilization */}
                  <div className="space-y-1 mb-3">
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>Hold Intake:</span>
                      <strong className="font-mono text-slate-800">
                        {evalData?.intakeUtilizationPct}%
                      </strong>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          evalData?.statusBadgeColor === 'emerald'
                            ? 'bg-emerald-500'
                            : evalData?.statusBadgeColor === 'amber'
                            ? 'bg-amber-500'
                            : evalData?.statusBadgeColor === 'rose'
                            ? 'bg-rose-500'
                            : 'bg-indigo-500'
                        }`}
                        style={{ width: `${Math.min(100, evalData?.intakeUtilizationPct || 0)}%` }}
                      />
                    </div>
                  </div>

                  {/* Key specs list */}
                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex justify-between text-slate-600">
                      <span className="text-slate-500">Voyages Needed:</span>
                      <strong className="font-mono font-semibold text-slate-800">
                        {evalData?.voyagesRequired}{' '}
                        {evalData?.voyagesRequired === 1 ? 'Voyage' : 'Voyages'}
                      </strong>
                    </div>

                    <div className="flex justify-between text-slate-600">
                      <span className="text-slate-500">Laden Draft:</span>
                      <span className="font-mono">{spec.typicalDraft}m</span>
                    </div>

                    <div className="flex justify-between text-slate-600">
                      <span className="text-slate-500">Port Discharge Fit:</span>
                      <span
                        className={`font-semibold ${
                          evalData?.draftStatus === 'Compliant'
                            ? 'text-emerald-600'
                            : 'text-rose-600'
                        }`}
                      >
                        {evalData?.draftStatus}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Pricing Indicator & Select Action */}
                <div className="mt-3 pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px]">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Estimated Rate:</span>
                    <span className="font-mono font-bold text-slate-900">
                      ${evalData?.estimatedRateUSDPerMT.toFixed(2)}/MT
                    </span>
                  </div>

                  {isCurrentlySelected ? (
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Selected
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setInspectedClass(vClass);
                        handleApplyHull(vClass);
                      }}
                      disabled={cargoVolumeMT >= 140000 && vClass !== 'Capesize'}
                      className="text-[11px] font-semibold text-indigo-600 hover:text-white hover:bg-indigo-600 border border-indigo-300 hover:border-indigo-600 px-2.5 py-0.5 rounded transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Select
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Vessel Deep-Dive Sizing Breakdown */}
        <div className="mt-4 p-4 rounded-xl border border-indigo-200 bg-linear-to-r from-indigo-50/70 to-slate-50/70">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-indigo-100">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-indigo-600 text-white text-xs font-bold uppercase tracking-wider">
                {inspectedClass}
              </span>
              <span className="text-xs font-bold text-slate-800">
                Sizing Fit & Operational Analysis for {cargoVolumeMT.toLocaleString()} MT
              </span>
            </div>

            {cargoVolumeMT >= 140000 ? (
              <span className="text-[11px] font-medium text-slate-500 bg-white border border-slate-200 px-2.5 py-1 rounded-md shadow-2xs flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Capesize Required for 140,000+ MT Bulk Stem</span>
              </span>
            ) : inspectedClass === recommendedClass ? (
              <div className="text-xs px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg font-semibold shadow-2xs flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Selected</span>
              </div>
            ) : onSelectVesselClass ? (
              <button
                type="button"
                onClick={() => handleApplyHull(inspectedClass)}
                className="text-xs px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Select {inspectedClass}</span>
              </button>
            ) : null}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-3.5">
            {/* Metric 1: Intake Feasibility */}
            <div className="p-3 bg-white rounded-lg border border-slate-200">
              <span className="text-[11px] text-slate-500 block mb-1">Hold Intake Sizing:</span>
              <strong className="text-xs text-slate-900 block font-semibold mb-1">
                {inspectedEvaluation.intakeSummary}
              </strong>
              <div className="text-[10px] text-slate-500">
                Max Lift: {inspectedEvaluation.maxPayloadMT.toLocaleString()} MT / voyage
              </div>
            </div>

            {/* Metric 2: Financial Voyage Exposure */}
            <div className="p-3 bg-white rounded-lg border border-slate-200">
              <span className="text-[11px] text-slate-500 block mb-1">Voyage Economics:</span>
              <div className="text-sm font-bold font-mono text-indigo-900">
                ${inspectedEvaluation.totalFreightCostUSD.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                ${inspectedEvaluation.estimatedRateUSDPerMT.toFixed(2)}/MT • {inspectedEvaluation.voyagesRequired}{' '}
                {inspectedEvaluation.voyagesRequired === 1 ? 'lift' : 'lifts'}
              </div>
              {inspectedEvaluation.deadfreightCostUSD > 0 && (
                <div className="text-[10px] font-semibold text-rose-600 mt-0.5">
                  Deadfreight Penalty: ~${(inspectedEvaluation.deadfreightCostUSD / 1000).toFixed(0)}k
                </div>
              )}
            </div>

            {/* Metric 3: Discharge & Berth Turnaround */}
            <div className="p-3 bg-white rounded-lg border border-slate-200">
              <span className="text-[11px] text-slate-500 block mb-1">Discharge & Laytime:</span>
              <div className="text-xs font-bold text-slate-900">
                ~{inspectedEvaluation.turnaroundDays} Days Total
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                Gear: {inspectedEvaluation.gearSummary}
              </div>
            </div>

            {/* Metric 4: Port Draft Compatibility */}
            <div className="p-3 bg-white rounded-lg border border-slate-200">
              <span className="text-[11px] text-slate-500 block mb-1">Navigation & Draft:</span>
              <div
                className={`text-xs font-bold ${
                  inspectedEvaluation.draftStatus === 'Compliant'
                    ? 'text-emerald-700'
                    : 'text-rose-700'
                }`}
              >
                {inspectedEvaluation.draftStatus}
              </div>
              <p className="text-[10px] text-slate-600 mt-1 leading-normal">
                {inspectedEvaluation.draftNotes}
              </p>
            </div>
          </div>

          {/* Operational Strategy Banner */}
          <div className="mt-3 p-3 bg-white/90 rounded-lg border border-indigo-100 text-xs text-slate-700 leading-relaxed flex items-start gap-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 font-semibold">
                Strategic Chartering Guidance ({inspectedClass}):{' '}
              </strong>
              <span>{inspectedEvaluation.operationalStrategy}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
