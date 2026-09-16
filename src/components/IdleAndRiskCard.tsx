import React from 'react';
import {
  Compass,
  AlertTriangle,
  RotateCcw,
  CheckCircle,
  Clock,
  Navigation,
  CheckCircle2,
  Shield
} from 'lucide-react';
import { RiskAlert } from '../types';

interface IdleAndRiskCardProps {
  idleManagement: {
    estimatedTurnaroundDays: number;
    expectedPortCongestionDays: number;
    deadheadMitigationStrategy: string;
    backhaulOpportunity: string;
  };
  riskAlerts: RiskAlert[];
  executiveDirectives: string[];
}

export const IdleAndRiskCard: React.FC<IdleAndRiskCardProps> = ({
  idleManagement,
  riskAlerts,
  executiveDirectives,
}) => {
  const turnaroundDays = Number(idleManagement?.estimatedTurnaroundDays) || 4;
  const congestionDays = Number(idleManagement?.expectedPortCongestionDays) || 2;
  const deadheadStrategy =
    idleManagement?.deadheadMitigationStrategy ||
    'Coordinate with pool operators for regional backhaul positioning.';
  const backhaul =
    idleManagement?.backhaulOpportunity ||
    'Explore coastal iron ore/pellet or clinker movement on return ballast leg.';
  const safeRiskAlerts = Array.isArray(riskAlerts) && riskAlerts.length > 0 ? riskAlerts : [];
  const safeDirectives = Array.isArray(executiveDirectives) && executiveDirectives.length > 0 ? executiveDirectives : [];

  return (
    <div className="space-y-6">
      {/* 1. Idle Scenario & Deadheading Mitigation */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <RotateCcw className="w-5 h-5 text-indigo-600" />
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Idle Scenario Management & Ballast / Repositioning Optimization
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Strategies to minimize vessel idle days, turnaround lag, and deadhead ballast legs
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-semibold text-slate-600">Discharge Turnaround Period</span>
              <span className="font-mono font-bold text-slate-900 text-sm">
                ~{turnaroundDays} days
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Total estimated berthing, discharge, and departure clearance timeline.
            </p>
          </div>

          <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-semibold text-slate-600">Expected Pre-Berthing Waiting</span>
              <span className="font-mono font-bold text-amber-700 text-sm">
                ~{congestionDays} days
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Average anchorage congestion queue for deep-draft bulk berths.
            </p>
          </div>
        </div>

        <div className="space-y-3 pt-1">
          <div className="p-3.5 rounded-lg bg-indigo-50/60 border border-indigo-100 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-indigo-900 mb-1">
              <Navigation className="w-3.5 h-3.5 text-indigo-600" />
              Deadhead Mitigation & Repositioning Strategy:
            </div>
            <p className="text-slate-700 leading-relaxed">{deadheadStrategy}</p>
          </div>

          <div className="p-3.5 rounded-lg bg-emerald-50/60 border border-emerald-100 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-emerald-900 mb-1">
              <RotateCcw className="w-3.5 h-3.5 text-emerald-600" />
              Triangular Trade & Backhaul Cargo Opportunity:
            </div>
            <p className="text-slate-700 leading-relaxed">{backhaul}</p>
          </div>
        </div>
      </div>

      {/* 2. Risk Mitigation Radar */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Market Early Warning & Operational Risk Radar
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Real-time monitoring of port congestion, seasonal weather cycles, and bunker volatility
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {safeRiskAlerts.map((alert, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-lg border text-xs flex flex-col justify-between ${
                alert.severity === 'High'
                  ? 'bg-rose-50/70 border-rose-200 text-rose-950'
                  : alert.severity === 'Medium'
                  ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                  : 'bg-blue-50/60 border-blue-200 text-blue-950'
              }`}
            >
              <div>
                <div className="flex items-center justify-between font-bold mb-1.5">
                  <span className="uppercase text-[11px] tracking-wider">{alert.category} Alert</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                      alert.severity === 'High'
                        ? 'bg-rose-200 text-rose-800'
                        : alert.severity === 'Medium'
                        ? 'bg-amber-200 text-amber-800'
                        : 'bg-blue-200 text-blue-800'
                    }`}
                  >
                    {alert.severity} Risk
                  </span>
                </div>
                <p className="text-slate-700 leading-relaxed text-[11px]">{alert.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Executive Chartering Directives */}
      <div className="bg-slate-900 text-white rounded-xl p-6 shadow-sm space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
          <Shield className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-bold tracking-wide uppercase text-slate-100">
            Executive Chartering Directives for Logistics Procurement
          </h3>
        </div>

        <div className="space-y-2 text-xs text-slate-300">
          {safeDirectives.map((directive, idx) => (
            <div key={idx} className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span className="leading-relaxed">{directive}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
