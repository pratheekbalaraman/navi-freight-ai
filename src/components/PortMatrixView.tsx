import React, { useState } from 'react';
import { INDIAN_EAST_COAST_PORTS, OVERSEAS_ORIGIN_PORTS, VESSEL_CLASSES } from '../data/maritimeData';
import { Anchor, CheckCircle2, XCircle, AlertTriangle, Search, Filter, Info, ShieldCheck } from 'lucide-react';
import { VesselClass } from '../types';

export const PortMatrixView: React.FC = () => {
  const [selectedVesselClass, setSelectedVesselClass] = useState<VesselClass>('Panamax');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRegion, setActiveRegion] = useState<'all' | 'india' | 'overseas'>('all');

  const activeVessel = VESSEL_CLASSES.find((v) => v.class === selectedVesselClass) || VESSEL_CLASSES[2];

  const allPorts = [
    ...INDIAN_EAST_COAST_PORTS.map((p) => ({ ...p, isIndia: true })),
    ...OVERSEAS_ORIGIN_PORTS.map((p) => ({ ...p, isIndia: false })),
  ];

  const filteredPorts = allPorts.filter((port) => {
    if (activeRegion === 'india' && !port.isIndia) return false;
    if (activeRegion === 'overseas' && port.isIndia) return false;
    if (searchQuery.trim() === '') return true;
    return (
      port.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      port.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      port.region.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Anchor className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-slate-900">
                Port Infrastructure & Vessel Clearance Matrix
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Detailed technical specifications for East Coast Indian ports and global bulk origins (Draft, LOA, Beam, Daily Handling)
            </p>
          </div>

          {/* Vessel Sizing Selector */}
          <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-lg border border-slate-200">
            <span className="text-xs font-semibold text-slate-600 px-2">Simulate Vessel:</span>
            {VESSEL_CLASSES.map((v) => (
              <button
                key={v.class}
                onClick={() => setSelectedVesselClass(v.class)}
                className={`text-xs px-3 py-1.5 rounded-md font-medium transition-all ${
                  selectedVesselClass === v.class
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                {v.class} ({v.typicalDraft}m draft)
              </button>
            ))}
          </div>
        </div>

        {/* Vessel profile specs banner */}
        <div className="mt-4 p-3.5 rounded-lg bg-indigo-50/60 border border-indigo-100 flex flex-wrap items-center justify-between gap-4 text-xs text-indigo-900">
          <div>
            <span className="text-slate-500">Selected Class:</span>{' '}
            <strong className="font-bold text-indigo-950">{activeVessel.class}</strong> ({activeVessel.typicalDWT})
          </div>
          <div>
            <span className="text-slate-500">Fully Laden Draft:</span>{' '}
            <strong className="font-mono font-bold text-indigo-950">{activeVessel.typicalDraft} meters</strong>
          </div>
          <div>
            <span className="text-slate-500">Length Overall (LOA):</span>{' '}
            <strong className="font-mono font-bold text-indigo-950">{activeVessel.typicalLOA}m</strong>
          </div>
          <div>
            <span className="text-slate-500">Gear Type:</span>{' '}
            <strong className="font-semibold text-indigo-950">{activeVessel.hasOwnGear ? 'Geared (4x30-35T cranes)' : 'Gearless'}</strong>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveRegion('all')}
            className={`text-xs px-3 py-1.5 rounded-md font-semibold ${
              activeRegion === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            All Ports ({allPorts.length})
          </button>
          <button
            onClick={() => setActiveRegion('india')}
            className={`text-xs px-3 py-1.5 rounded-md font-semibold ${
              activeRegion === 'india'
                ? 'bg-amber-600 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            East Coast India Ports ({INDIAN_EAST_COAST_PORTS.length})
          </button>
          <button
            onClick={() => setActiveRegion('overseas')}
            className={`text-xs px-3 py-1.5 rounded-md font-semibold ${
              activeRegion === 'overseas'
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Overseas Loading Hubs ({OVERSEAS_ORIGIN_PORTS.length})
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search port or terminal..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Port Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPorts.map((port) => {
          const draftClearance = port.maxDraft - activeVessel.typicalDraft;
          const isDraftSafe = draftClearance >= 0.8;
          const isTidalMarginal = draftClearance >= 0 && draftClearance < 0.8;
          const isDraftRestricted = draftClearance < 0;

          const isLOASafe = port.maxLOA >= activeVessel.typicalLOA;
          const isGearCompliant = port.gearedVesselRequired ? activeVessel.hasOwnGear : true;

          return (
            <div
              key={port.id}
              className={`rounded-xl border p-5 bg-white shadow-xs transition-all flex flex-col justify-between ${
                isDraftRestricted
                  ? 'border-rose-200 bg-rose-50/20'
                  : isTidalMarginal
                  ? 'border-amber-200 bg-amber-50/20'
                  : 'border-slate-200 hover:border-indigo-300'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{port.name}</h3>
                    <span className="text-[11px] text-slate-500">{port.country} • {port.region}</span>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider flex-shrink-0 ${
                      port.isIndia
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {port.isIndia ? 'Discharge' : 'Loading'}
                  </span>
                </div>

                <p className="text-xs text-slate-600 mb-4 line-clamp-2 leading-relaxed">
                  {port.description}
                </p>

                {/* Key Port Limits */}
                <div className="grid grid-cols-3 gap-2 py-2.5 px-3 rounded-lg bg-slate-50 border border-slate-200 text-center text-xs mb-3">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block font-medium">Permissible Draft</span>
                    <strong className="font-mono text-slate-800 text-xs">{port.maxDraft}m</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block font-medium">Max LOA</span>
                    <strong className="font-mono text-slate-800 text-xs">{port.maxLOA}m</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block font-medium">Daily Rate</span>
                    <strong className="font-mono text-slate-800 text-xs">{(port.handlingRateMTPerDay / 1000).toFixed(0)}k MT/d</strong>
                  </div>
                </div>

                {/* Simulation Verdict for Selected Vessel */}
                <div className="space-y-1.5 text-xs pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Draft Compatibility:</span>
                    <span
                      className={`font-semibold flex items-center gap-1 ${
                        isDraftSafe
                          ? 'text-emerald-700'
                          : isTidalMarginal
                          ? 'text-amber-700'
                          : 'text-rose-700'
                      }`}
                    >
                      {isDraftSafe ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Safe (+{draftClearance.toFixed(1)}m under keel)
                        </>
                      ) : isTidalMarginal ? (
                        <>
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                          Tidal Window Only (+{draftClearance.toFixed(1)}m)
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5 text-rose-600" />
                          Restricted ({draftClearance.toFixed(1)}m deficit)
                        </>
                      )}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Berth LOA Clearance:</span>
                    <span className={isLOASafe ? 'text-emerald-700 font-medium' : 'text-rose-700 font-medium'}>
                      {isLOASafe ? `Accommodates (${port.maxLOA}m >= ${activeVessel.typicalLOA}m)` : `Exceeds max berth length`}
                    </span>
                  </div>

                  {port.gearedVesselRequired && (
                    <div className="flex items-center justify-between text-[11px] text-amber-700">
                      <span>Gear Requirement:</span>
                      <span>Requires Geared Cranes</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Terminals list */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>Avg Congestion: <strong className="text-slate-700 font-mono">{port.currentCongestionDays}d</strong></span>
                <span className="truncate max-w-[150px] text-right" title={port.terminalNames.join(', ')}>
                  {port.terminalNames[0]}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
