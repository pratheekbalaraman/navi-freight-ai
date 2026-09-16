import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ProcurementInputForm } from './components/ProcurementInputForm';
import { ForwardCurveChart } from './components/ForwardCurveChart';
import { VesselOptimizationCard } from './components/VesselOptimizationCard';
import { ContractSavingsCard } from './components/ContractSavingsCard';
import { IdleAndRiskCard } from './components/IdleAndRiskCard';
import { PortMatrixView } from './components/PortMatrixView';
import { ContractEconomicsView } from './components/ContractEconomicsView';
import { AICopilotDrawer } from './components/AICopilotDrawer';
import { VendorProcurementView } from './components/VendorProcurementView';
import { ProcurementInputs, ForecastResultData, VesselClass } from './types';
import { calculateVesselSizingMatrix, generateClientEconometricForecast } from './data/maritimeData';
import { Sparkles, Download, RefreshCw, FileText, CheckCircle2 } from 'lucide-react';

const INITIAL_INPUTS: ProcurementInputs = {
  commodity: 'Met Coking Coal (Australia/US/Mozambique)',
  cargoVolumeMT: 75000,
  originCountry: 'Australia',
  originPort: 'Hay Point / Dalrymple Bay (DBCT)',
  dischargePort: 'Paradip Port',
  laycanStart: '2026-10-15',
  laycanEnd: '2026-10-25',
  contractType: '3-Month Consecutive Voyage Contract (COA)',
  currentSpotFreightPerMT: 16.8,
  bunkerPricePerMT: 625,
  seasonalProfile: 'Pre-monsoon / Peak Asian restocking',
  demurrageRatePerDayUSD: 28000,
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'forecasting' | 'vendors' | 'ports' | 'contracts' | 'copilot'>('forecasting');
  const [inputs, setInputs] = useState<ProcurementInputs>(INITIAL_INPUTS);
  const [forecastResult, setForecastResult] = useState<ForecastResultData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasApiKey, setHasApiKey] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<string>('algorithmic-model');

  // Check health on startup
  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        if (data.hasApiKey) {
          setHasApiKey(true);
        }
      })
      .catch((err) => console.log('Health check failed:', err));
  }, []);

  // Run initial forecast on mount
  useEffect(() => {
    runForecast(INITIAL_INPUTS);
  }, []);

  const runForecast = async (currentInputs: ProcurementInputs) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/forecast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentInputs),
      });
      const data = await res.json();
      if (data.data) {
        const resultData = data.data;
        if (resultData.vesselRecommendation && !resultData.vesselRecommendation.aiRecommendedClass) {
          resultData.vesselRecommendation.aiRecommendedClass = resultData.vesselRecommendation.recommendedClass;
          resultData.vesselRecommendation.selectedClass = resultData.vesselRecommendation.recommendedClass;
        }
        setForecastResult(resultData);
        setDataSource(data.source || 'algorithmic-model');
      } else {
        const fallback = generateClientEconometricForecast(currentInputs);
        if (fallback.vesselRecommendation && !fallback.vesselRecommendation.aiRecommendedClass) {
          fallback.vesselRecommendation.aiRecommendedClass = fallback.vesselRecommendation.recommendedClass;
          fallback.vesselRecommendation.selectedClass = fallback.vesselRecommendation.recommendedClass;
        }
        setForecastResult(fallback);
        setDataSource('algorithmic-model');
      }
    } catch (err) {
      console.warn('Forecast request error, utilizing client econometric model:', err);
      const fallback = generateClientEconometricForecast(currentInputs);
      if (fallback.vesselRecommendation && !fallback.vesselRecommendation.aiRecommendedClass) {
        fallback.vesselRecommendation.aiRecommendedClass = fallback.vesselRecommendation.recommendedClass;
        fallback.vesselRecommendation.selectedClass = fallback.vesselRecommendation.recommendedClass;
      }
      setForecastResult(fallback);
      setDataSource('algorithmic-model');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectVesselClass = (selectedClass: VesselClass) => {
    if (!forecastResult) return;
    // Guard: For large 140,000+ MT stems, Capesize is fixed and non-overridable
    if (inputs.cargoVolumeMT >= 140000) return;

    const sizingData = calculateVesselSizingMatrix(
      inputs.cargoVolumeMT,
      inputs.dischargePort,
      inputs.currentSpotFreightPerMT
    );
    const chosenEval = sizingData[selectedClass];
    if (!chosenEval) return;

    const newEstimatedRate = chosenEval.estimatedRateUSDPerMT;
    const newTotalCost = chosenEval.totalFreightCostUSD;
    const spotTotal = Math.round(inputs.cargoVolumeMT * inputs.currentSpotFreightPerMT);
    const newSavings = Math.max(0, spotTotal - newTotalCost);
    const newSavingsPct = spotTotal > 0 ? Number(((newSavings / spotTotal) * 100).toFixed(1)) : 11.5;

    const aiOriginalClass =
      forecastResult.vesselRecommendation.aiRecommendedClass ||
      forecastResult.vesselRecommendation.recommendedClass;

    setForecastResult({
      ...forecastResult,
      vesselRecommendation: {
        ...forecastResult.vesselRecommendation,
        aiRecommendedClass: aiOriginalClass,
        selectedClass: selectedClass,
        recommendedClass: selectedClass,
        estimatedFreightRateUSDPerMT: newEstimatedRate,
        totalFreightCostUSD: newTotalCost,
        rationale: `Selected Vessel: ${selectedClass} (${chosenEval.typicalDWT}) for ${inputs.cargoVolumeMT.toLocaleString()} MT parcel on ${inputs.originPort} → ${inputs.dischargePort}. AI original recommendation was ${aiOriginalClass}. ${chosenEval.intakeSummary} ${chosenEval.operationalStrategy}`,
        portFeasibility: {
          ...forecastResult.vesselRecommendation.portFeasibility,
          destinationStatus: chosenEval.draftStatus === 'Compliant' ? 'Optimal' : 'Draft Restricted',
          destinationNotes: chosenEval.draftNotes,
        },
      },
      contractComparison: {
        ...forecastResult.contractComparison,
        multipleVoyageCostUSD: newTotalCost,
        projectedSavingsUSD: newSavings,
        savingsPercentage: newSavingsPct,
      },
    });
  };

  // Scenario Presets
  const handleSelectPreset = (presetKey: string) => {
    let updated: ProcurementInputs = { ...inputs };
    if (presetKey === 'australia-paradip') {
      updated = {
        commodity: 'Met Coking Coal (Australia/US/Mozambique)',
        cargoVolumeMT: 75000,
        originCountry: 'Australia',
        originPort: 'Hay Point / Dalrymple Bay (DBCT)',
        dischargePort: 'Paradip Port',
        laycanStart: '2026-10-15',
        laycanEnd: '2026-10-25',
        contractType: '3-Month Consecutive Voyage Contract (COA)',
        currentSpotFreightPerMT: 16.8,
        bunkerPricePerMT: 625,
        seasonalProfile: 'Pre-monsoon / Peak Asian restocking',
        demurrageRatePerDayUSD: 28000,
      };
    } else if (presetKey === 'indonesia-haldia') {
      updated = {
        commodity: 'Thermal / Steam Coal (Indonesia/Australia/Russia)',
        cargoVolumeMT: 55000,
        originCountry: 'Indonesia',
        originPort: 'Taboneo Anchorage',
        dischargePort: 'Haldia Dock Complex (HDC)',
        laycanStart: '2026-11-01',
        laycanEnd: '2026-11-10',
        contractType: '3-Month Consecutive Voyage Contract (COA)',
        currentSpotFreightPerMT: 11.2,
        bunkerPricePerMT: 610,
        seasonalProfile: 'Southwest Monsoon Lull (Jun-Aug)',
        demurrageRatePerDayUSD: 24000,
      };
    } else if (presetKey === 'mozambique-vizag') {
      updated = {
        commodity: 'Met Coking Coal (Australia/US/Mozambique)',
        cargoVolumeMT: 80000,
        originCountry: 'Mozambique',
        originPort: 'Maputo / Matola Coal Terminal',
        dischargePort: 'Visakhapatnam (Outer Harbour)',
        laycanStart: '2026-10-20',
        laycanEnd: '2026-10-30',
        contractType: '6-Month Multiple Voyage Charter (Index Discounted)',
        currentSpotFreightPerMT: 18.4,
        bunkerPricePerMT: 630,
        seasonalProfile: 'Pre-monsoon / Peak Asian restocking',
        demurrageRatePerDayUSD: 27000,
      };
    } else if (presetKey === 'us-dhamra') {
      updated = {
        commodity: 'Met Coking Coal (Australia/US/Mozambique)',
        cargoVolumeMT: 140000,
        originCountry: 'United States',
        originPort: 'Norfolk / Hampton Roads (Lamberts Point)',
        dischargePort: 'Dhamra Port (DPCL)',
        laycanStart: '2026-11-10',
        laycanEnd: '2026-11-25',
        contractType: '6-Month Multiple Voyage Charter (Index Discounted)',
        currentSpotFreightPerMT: 28.5,
        bunkerPricePerMT: 640,
        seasonalProfile: 'Q4 Atlantic Grain & Coal Push',
        demurrageRatePerDayUSD: 35000,
      };
    }
    setInputs(updated);
    setActiveTab('forecasting');
    runForecast(updated);
  };

  // Export Executive Memo
  const handleExportBrief = () => {
    if (!forecastResult) return;
    const briefText = `=====================================================
NAVI-FREIGHT AI: EXECUTIVE CHARTERING & FREIGHT BRIEF
Date: ${new Date().toLocaleDateString()}
=====================================================

1. CARGO & PROCUREMENT PARAMETERS:
- Commodity: ${inputs.commodity}
- Volume: ${inputs.cargoVolumeMT.toLocaleString()} MT
- Origin: ${inputs.originPort} (${inputs.originCountry})
- Discharge Port: ${inputs.dischargePort} (India East Coast)
- Laycan Window: ${inputs.laycanStart} to ${inputs.laycanEnd}
- Target Strategy: ${inputs.contractType}

2. MARKET ENTRY TIMING & RECOMMENDATION:
- Optimal Buying Window: ${forecastResult.recommendedWindow}
- Recommended Vessel Class: ${forecastResult.vesselRecommendation.recommendedClass}
- Optimized Freight Rate: $${forecastResult.vesselRecommendation.estimatedFreightRateUSDPerMT.toFixed(2)} / MT
- Total Voyage Freight: $${forecastResult.vesselRecommendation.totalFreightCostUSD.toLocaleString()}

3. SPOT VS. MULTI-VOYAGE CONTRACT FINANCIAL IMPACT:
- Baseline Spot Market Freight Bill: $${forecastResult.contractComparison.spotTotalCostUSD.toLocaleString()}
- Multi-Voyage Contract Freight Bill: $${forecastResult.contractComparison.multipleVoyageCostUSD.toLocaleString()}
- Net Dollar Savings: $${forecastResult.contractComparison.projectedSavingsUSD.toLocaleString()} (${forecastResult.contractComparison.savingsPercentage}% reduction)
- Volatility Hedging Rating: ${forecastResult.contractComparison.volatilityHedgingScore}/100

4. PORT FEASIBILITY & DRAFT CLEARANCE:
- Loading Berth: ${forecastResult.vesselRecommendation.portFeasibility.originStatus} (${forecastResult.vesselRecommendation.portFeasibility.originNotes})
- Discharge Berth: ${forecastResult.vesselRecommendation.portFeasibility.destinationStatus} (${forecastResult.vesselRecommendation.portFeasibility.destinationNotes})
- Permissible Draft: ${forecastResult.vesselRecommendation.portFeasibility.draftClearanceMeters}m

5. IDLE SCENARIO & REPOSITIONING:
- Turnaround: ~${forecastResult.idleManagement.estimatedTurnaroundDays} days
- Deadhead Mitigation: ${forecastResult.idleManagement.deadheadMitigationStrategy}
- Backhaul Opportunity: ${forecastResult.idleManagement.backhaulOpportunity}

6. EXECUTIVE DIRECTIVES:
${forecastResult.executiveDirectives.map((d, i) => `${i + 1}. ${d}`).join('\n')}
=====================================================`;

    const blob = new Blob([briefText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Chartering_Brief_${inputs.dischargePort.replace(/\s+/g, '_')}_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSelectPreset={handleSelectPreset}
        hasApiKey={hasApiKey}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'forecasting' && (
          <div className="space-y-6">
            {/* Top Info Banner & Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-xs font-semibold text-slate-800">
                  Active Procurement Model: <strong className="text-indigo-700">{inputs.commodity}</strong> ({inputs.cargoVolumeMT.toLocaleString()} MT)
                </span>
                <span className="text-slate-300">|</span>
                <span className="text-xs text-slate-500">
                  Route: {inputs.originPort.split(' ')[0]} → {inputs.dischargePort}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportBrief}
                  disabled={!forecastResult}
                  className="text-xs px-3 py-1.5 rounded-md border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>Export Chartering Brief</span>
                </button>

                <button
                  onClick={() => runForecast(inputs)}
                  disabled={isLoading}
                  className="text-xs px-3 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>Re-run Model</span>
                </button>
              </div>
            </div>

            {/* Input Form */}
            <ProcurementInputForm
              inputs={inputs}
              onChange={setInputs}
              onSubmit={() => runForecast(inputs)}
              isLoading={isLoading}
            />

            {/* Live Forecast Results */}
            {forecastResult && (
              <div className="space-y-6">
                {/* 1. Forward Freight Rate Curve */}
                <ForwardCurveChart
                  curveData={forecastResult.forwardRateCurve}
                  recommendedWindow={forecastResult.recommendedWindow}
                  currentSpot={inputs.currentSpotFreightPerMT}
                />

                {/* 2. Vessel Type Optimization & Port Feasibility Check */}
                <VesselOptimizationCard
                  vesselRecommendation={forecastResult.vesselRecommendation}
                  cargoVolumeMT={inputs.cargoVolumeMT}
                  originPort={inputs.originPort}
                  dischargePort={inputs.dischargePort}
                  onSelectVesselClass={handleSelectVesselClass}
                />

                {/* 3. Spot vs Multi-Voyage Contract Financial Savings */}
                <ContractSavingsCard
                  contractComparison={forecastResult.contractComparison}
                  cargoVolumeMT={inputs.cargoVolumeMT}
                  contractType={inputs.contractType}
                />

                {/* 4. Idle Scenario Management & Operational Risk Radar */}
                <IdleAndRiskCard
                  idleManagement={forecastResult.idleManagement}
                  riskAlerts={forecastResult.riskAlerts}
                  executiveDirectives={forecastResult.executiveDirectives}
                />
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Ministry of Steel Vendor Procurement Engine */}
        {activeTab === 'vendors' && (
          <VendorProcurementView
            initialOrigin={inputs.originPort}
            initialDestination={inputs.dischargePort}
            initialCommodity={inputs.commodity.includes('Coal') ? 'Coking Coal' : 'Iron Ore'}
            initialTonnage={inputs.cargoVolumeMT}
          />
        )}

        {/* Tab 3: Port Infrastructure & Draft Clearance Matrix */}
        {activeTab === 'ports' && <PortMatrixView />}

        {/* Tab 3: Spot vs COA Contract Economics Calculator */}
        {activeTab === 'contracts' && <ContractEconomicsView />}

        {/* Tab 4: AI Chartering Advisor & Memo Drafter */}
        {activeTab === 'copilot' && (
          <AICopilotDrawer currentScenario={inputs} forecastResult={forecastResult} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">NAVI-FREIGHT AI</span>
            <span>—</span>
            <span>Intelligent Bulk Cargo Procurement & Chartering Optimizer for East Coast of India Ports</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400 text-[11px]">
            <span>Paradip • Vizag • Gangavaram • Gopalpur • Dhamra • Haldia • Sandheads</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
