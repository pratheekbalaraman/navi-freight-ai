export type VesselClass = 'Handysize' | 'Supramax' | 'Panamax' | 'Capesize';

export interface PortDetails {
  id: string;
  name: string;
  country: string;
  region: 'East Coast India' | 'Australia' | 'Indonesia' | 'Mozambique' | 'United States' | 'Russia';
  maxDraft: number; // in meters
  maxLOA: number; // in meters
  maxBeam: number; // in meters
  handlingRateMTPerDay: number; // average daily loading/discharge
  airDraft?: number;
  tidalWindowRequired?: boolean;
  gearedVesselRequired?: boolean;
  currentCongestionDays: number;
  description: string;
  terminalNames: string[];
}

export interface VesselSpecs {
  class: VesselClass;
  typicalDWT: string;
  dwtCapacityMin: number;
  dwtCapacityMax: number;
  typicalDraft: number;
  typicalLOA: number;
  typicalBeam: number;
  hasOwnGear: boolean; // cranes / grabs
  typicalDailySpeedKnots: number;
  bunkerConsumptionSeaMTPerDay: number;
  marketDescription: string;
}

export interface ProcurementInputs {
  commodity: string;
  cargoVolumeMT: number;
  originCountry: string;
  originPort: string;
  dischargePort: string;
  laycanStart: string;
  laycanEnd: string;
  contractType: string;
  currentSpotFreightPerMT: number;
  bunkerPricePerMT: number;
  seasonalProfile: string;
  demurrageRatePerDayUSD: number;
}

export interface RateCurvePoint {
  period: string;
  rate: number;
  lowBound: number;
  highBound: number;
  signal: 'Optimal Buy' | 'Bullish' | 'Bearish' | 'Neutral';
}

export interface RiskAlert {
  category: 'Congestion' | 'Weather' | 'Bunker' | 'Geopolitical';
  severity: 'Low' | 'Medium' | 'High';
  description: string;
}

export interface RecommendedVendor {
  vendor_name: string;
  vendor_type: 'Vessel Charterer' | 'Material Supplier';
  current_estimated_rate: string;
  reliability_score: string;
  estimated_transit_days: number;
  sustainability_rating: string;
}

export interface VendorProcurementResult {
  route: string;
  recommended_vessel_type: string;
  recommended_vendors: RecommendedVendor[];
  market_insight: string;
}

export interface VendorProcurementInputs {
  originPort: string;
  destinationPort: string;
  commodity: string;
  requiredTonnage: number;
}

export interface ForecastResultData {
  recommendedWindow: string;
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
  forwardRateCurve: RateCurvePoint[];
  contractComparison: {
    spotTotalCostUSD: number;
    multipleVoyageCostUSD: number;
    projectedSavingsUSD: number;
    savingsPercentage: number;
    volatilityHedgingScore: number;
    demurrageRiskScore: 'Low' | 'Moderate' | 'High' | 'Critical';
    strategicBenefit: string;
  };
  idleManagement: {
    estimatedTurnaroundDays: number;
    expectedPortCongestionDays: number;
    deadheadMitigationStrategy: string;
    backhaulOpportunity: string;
  };
  riskAlerts: RiskAlert[];
  executiveDirectives: string[];
}

export interface MonthForecastPrediction {
  month: string; // e.g. "October 2026"
  predictedSpotRate: number; // e.g. 21.8
  predictedSpikePercentage: number; // e.g. +28%
  lowEstimate: number;
  highEstimate: number;
  confidenceScore: number; // 0-100%
  weatherFactor: {
    cycloneRisk: 'Low' | 'Moderate' | 'Elevated' | 'Severe';
    monsoonImpact: string;
    weatherSummary: string;
  };
  marketCatalysts: string[];
  recommendation: 'Fix Period COA Early' | 'Wait for Rate Dip' | 'Hedge With Index' | 'Lock Laycan Now';
}

export interface AiMarketWeatherForecastResult {
  route: string;
  baseSpotRate: number;
  analyzedCommodity: string;
  summaryRationale: string;
  keyMacroDrivers: string[];
  monthlyPredictions: MonthForecastPrediction[];
  overallVolatilityIndex: 'Low' | 'Moderate' | 'High' | 'Extreme';
  recommendedAction: string;
}

export interface PortWeatherCondition {
  portName: string;
  role: 'Departure' | 'Arrival';
  temperatureC: number;
  rainfallMm: number;
  windSpeedKnots: number;
  seaStateSwellMeters: number;
  floodRiskLevel: 'None' | 'Low' | 'Moderate' | 'Severe';
  floodWarningDetails: string;
  unfavorableConditions: string[];
}

export interface MonthlyWeatherPrediction {
  month: string;
  overallSafetyRating: 'Safe & Optimal' | 'Moderate Operational Risk' | 'Hazardous / Unfavorable';
  riskScore: number; // 0 (calm) to 100 (extreme cyclone/flood)
  departurePortWeather: PortWeatherCondition;
  arrivalPortWeather: PortWeatherCondition;
  voyageRouteHazards: {
    corridorName: string;
    waveHeightMeters: number;
    cycloneProbabilityPercent: number;
    cycloneAlertSummary: string;
    fogOrMonsoonSwell: string;
  };
  warnings: {
    floodWarning: string | null;
    severeStormOrCycloneWarning: string | null;
    operationalDelaysEstDays: number;
  };
  cargoSafetyStatus: 'Optimal' | 'Moisture/Liquefaction Risk' | 'Requires Hatches Closed';
  monthlyVerdict: string;
}

export interface MaritimeWeatherAnalystResult {
  originPort: string;
  destinationPort: string;
  voyageDistanceNm: number;
  estimatedTransitDays: number;
  commodity: string;
  monthsAnalyzed: string[];
  recommendedBestMonth: {
    month: string;
    rationale: string;
    weatherAdvantage: string;
    estimatedDemurrageSavingsDays: number;
  };
  cautionaryMonths: string[];
  generalSeasonalAssessment: string;
  monthlyForecasts: MonthlyWeatherPrediction[];
}

