import { PortDetails, VesselSpecs, ProcurementInputs, ForecastResultData, VesselClass } from '../types';

export const INDIAN_EAST_COAST_PORTS: PortDetails[] = [
  {
    id: 'paradip',
    name: 'Paradip Port',
    country: 'India',
    region: 'East Coast India',
    maxDraft: 14.5,
    maxLOA: 260,
    maxBeam: 45.0,
    handlingRateMTPerDay: 30000,
    currentCongestionDays: 3.5,
    description: 'Major all-weather deep water port in Odisha. Dedicated mechanized coal berths up to 16.0m draft; general berths 14.5m draft. Can accommodate Panamax and geared Supramax easily.',
    terminalNames: ['Kalinga Coal Terminal', 'Paradip Deep Water Berth', 'Essar Bulk Terminal', 'Iron Ore Berth']
  },
  {
    id: 'vizag-outer',
    name: 'Visakhapatnam (Outer Harbour)',
    country: 'India',
    region: 'East Coast India',
    maxDraft: 18.1,
    maxLOA: 300,
    maxBeam: 50.0,
    handlingRateMTPerDay: 48000,
    currentCongestionDays: 1.8,
    description: 'Deep-water natural harbour in Andhra Pradesh. Can berth fully laden Capesize vessels up to 200,000 DWT. Rapid automated unloader cranes with direct rail dispatch.',
    terminalNames: ['Vizag General Cargo Berth (VGCB)', 'Outer Coal Berth', 'Offshore Tanker / Bulk Jetty']
  },
  {
    id: 'vizag-inner',
    name: 'Visakhapatnam (Inner Harbour)',
    country: 'India',
    region: 'East Coast India',
    maxDraft: 14.5,
    maxLOA: 230,
    maxBeam: 32.5,
    handlingRateMTPerDay: 20000,
    currentCongestionDays: 2.2,
    description: 'Restricted by narrow entrance channel and 14.5m permissible draft. Handysize and Panamax / Kamsarmax vessels with beam under 32.5m only.',
    terminalNames: ['EQ-1 to EQ-7 Berths', 'WQ Multipurpose Berths']
  },
  {
    id: 'gangavaram',
    name: 'Gangavaram Port',
    country: 'India',
    region: 'East Coast India',
    maxDraft: 20.2,
    maxLOA: 320,
    maxBeam: 54.0,
    handlingRateMTPerDay: 55000,
    currentCongestionDays: 1.2,
    description: 'Premier modern ultra-deepwater private port adjoining Visakhapatnam. Accommodates fully laden Capesize / Newcastlemax up to 200,000 DWT. Highest discharge rate on the East Coast.',
    terminalNames: ['Gangavaram Deep Coal Berth 1', 'Cape Ore Berth', 'General Cargo Berth']
  },
  {
    id: 'dhamra',
    name: 'Dhamra Port (DPCL)',
    country: 'India',
    region: 'East Coast India',
    maxDraft: 18.0,
    maxLOA: 315,
    maxBeam: 50.0,
    handlingRateMTPerDay: 45000,
    currentCongestionDays: 2.0,
    description: 'Deep-water all-weather port in northern Odisha. Capesize accessible up to 180,000 DWT. High mechanized conveyor capacity for coking coal and thermal coal imports.',
    terminalNames: ['Berth 1 Bulk Mechanized', 'Berth 2 Cape Berth', 'Berth 3 LNG / Bulk']
  },
  {
    id: 'gopalpur',
    name: 'Gopalpur Port',
    country: 'India',
    region: 'East Coast India',
    maxDraft: 13.0,
    maxLOA: 225,
    maxBeam: 32.2,
    handlingRateMTPerDay: 18000,
    currentCongestionDays: 1.5,
    description: 'Deep sea port in southern Odisha. Draft ranges from 12.5m to 13.5m. Geared Supramax and Ultramax vessels preferred; swell sensitive during southwest monsoon season.',
    terminalNames: ['Gopalpur Multipurpose Berth 1', 'Berth 2 Coal & Flux']
  },
  {
    id: 'haldia',
    name: 'Haldia Dock Complex (HDC)',
    country: 'India',
    region: 'East Coast India',
    maxDraft: 8.2,
    maxLOA: 230,
    maxBeam: 32.26,
    handlingRateMTPerDay: 14000,
    tidalWindowRequired: true,
    currentCongestionDays: 4.2,
    description: 'Riverine port on the Hooghly River (Syama Prasad Mookerjee Port). Severely draft-constrained (7.5m - 8.5m depending on tide bars). Requires Handysize vessels or offshore parcel lightening.',
    terminalNames: ['HDC Berth 4A', 'HDC Berth 2 Mechanized', 'HDC Shore Crane Berth 8']
  },
  {
    id: 'sandheads',
    name: 'Sagar Island / Sandheads (Transshipment)',
    country: 'India',
    region: 'East Coast India',
    maxDraft: 15.0,
    maxLOA: 300,
    maxBeam: 48.0,
    handlingRateMTPerDay: 22000,
    gearedVesselRequired: true,
    currentCongestionDays: 2.0,
    description: 'Offshore deepwater anchorage at the mouth of the Bay of Bengal. Used for mid-sea parcel lightening of Capesize & Panamax bulk vessels onto daughter barges before sailing into Haldia.',
    terminalNames: ['Sandheads Anchorage Lightening Zone', 'Sagar Island Floating Crane Station']
  }
];

export const OVERSEAS_ORIGIN_PORTS: PortDetails[] = [
  // Australia
  {
    id: 'hay-point',
    name: 'Hay Point / Dalrymple Bay (DBCT)',
    country: 'Australia',
    region: 'Australia',
    maxDraft: 19.5,
    maxLOA: 345,
    maxBeam: 55.0,
    handlingRateMTPerDay: 75000,
    currentCongestionDays: 2.5,
    description: 'World leading coking coal export terminal in Queensland. Capesize and Newcastlemax optimized.',
    terminalNames: ['DBCT Berth 1-4', 'Hay Point Coal Terminal']
  },
  {
    id: 'newcastle-au',
    name: 'Newcastle (PWCS / NCIG)',
    country: 'Australia',
    region: 'Australia',
    maxDraft: 15.2,
    maxLOA: 300,
    maxBeam: 50.0,
    handlingRateMTPerDay: 65000,
    currentCongestionDays: 3.8,
    description: 'Major coal export hub in New South Wales. Panamax & Capesize (high tide departure).',
    terminalNames: ['Carrington', 'Kooragang Island', 'NCIG Terminal']
  },
  {
    id: 'gladstone',
    name: 'Gladstone (RGT / Barney Point)',
    country: 'Australia',
    region: 'Australia',
    maxDraft: 17.5,
    maxLOA: 315,
    maxBeam: 50.0,
    handlingRateMTPerDay: 60000,
    currentCongestionDays: 2.1,
    description: 'Queensland deepwater coal and bauxite export hub.',
    terminalNames: ['RG Tanna Coal Terminal', 'Barney Point Berth']
  },
  // Indonesia
  {
    id: 'taboneo',
    name: 'Taboneo Anchorage',
    country: 'Indonesia',
    region: 'Indonesia',
    maxDraft: 13.5,
    maxLOA: 240,
    maxBeam: 36.0,
    handlingRateMTPerDay: 24000,
    gearedVesselRequired: true,
    currentCongestionDays: 4.5,
    description: 'South Kalimantan open sea anchorage. Loading thermal coal via floating cranes and geared barges. High swell risk during monsoons.',
    terminalNames: ['Taboneo Outer Anchorage', 'Barito River Mouth Transfer Zone']
  },
  {
    id: 'muara-satui',
    name: 'Muara Satui Anchorage',
    country: 'Indonesia',
    region: 'Indonesia',
    maxDraft: 14.0,
    maxLOA: 240,
    maxBeam: 36.0,
    handlingRateMTPerDay: 26000,
    gearedVesselRequired: true,
    currentCongestionDays: 3.2,
    description: 'Kalimantan midstream transshipment hub for Indonesian steam coal.',
    terminalNames: ['Muara Satui Floating Rig 1 & 2']
  },
  {
    id: 'balikpapan',
    name: 'Balikpapan (Balikpapan Coal Terminal)',
    country: 'Indonesia',
    region: 'Indonesia',
    maxDraft: 15.0,
    maxLOA: 260,
    maxBeam: 40.0,
    handlingRateMTPerDay: 35000,
    currentCongestionDays: 2.0,
    description: 'East Kalimantan sheltered terminal handling geared Supramax and Panamax vessels.',
    terminalNames: ['BCT Jetty 1', 'BCT Jetty 2']
  },
  // Mozambique
  {
    id: 'maputo',
    name: 'Maputo / Matola Coal Terminal',
    country: 'Mozambique',
    region: 'Mozambique',
    maxDraft: 14.2,
    maxLOA: 235,
    maxBeam: 36.0,
    handlingRateMTPerDay: 28000,
    currentCongestionDays: 3.0,
    description: 'Primary outlet for South African & Mozambican metallurgical and thermal coal to India. Panamax compatible.',
    terminalNames: ['TCM Coal Quay', 'Matola Bulk Berth']
  },
  {
    id: 'nacala',
    name: 'Nacala Port',
    country: 'Mozambique',
    region: 'Mozambique',
    maxDraft: 19.0,
    maxLOA: 320,
    maxBeam: 52.0,
    handlingRateMTPerDay: 50000,
    currentCongestionDays: 1.5,
    description: 'Natural deepwater port in northern Mozambique linked by rail to Moatize coking coal mines. Capesize capable.',
    terminalNames: ['Nacala-a-Velha Coal Terminal']
  },
  // United States
  {
    id: 'norfolk-us',
    name: 'Norfolk / Hampton Roads (Lamberts Point)',
    country: 'United States',
    region: 'United States',
    maxDraft: 15.2,
    maxLOA: 300,
    maxBeam: 48.0,
    handlingRateMTPerDay: 50000,
    currentCongestionDays: 3.2,
    description: 'Premier US East Coast met coal loading port. Panamax & Capesize (subject to 50ft draft channel). Long haul around Cape of Good Hope.',
    terminalNames: ['Pier 6 Lamberts Point', 'Pier IX Newport News', 'DTA Pier']
  },
  {
    id: 'baltimore-us',
    name: 'Baltimore (Curtis Bay / CNX)',
    country: 'United States',
    region: 'United States',
    maxDraft: 14.5,
    maxLOA: 280,
    maxBeam: 43.0,
    handlingRateMTPerDay: 40000,
    currentCongestionDays: 2.8,
    description: 'Appalachian coal export gateway. Panamax and baby Capesize compatible.',
    terminalNames: ['CNX Marine Terminal', 'CSX Curtis Bay Coal Pier']
  },
  // Russia
  {
    id: 'taman-ru',
    name: 'Taman Bulk Terminal (Black Sea)',
    country: 'Russia',
    region: 'Russia',
    maxDraft: 18.0,
    maxLOA: 310,
    maxBeam: 50.0,
    handlingRateMTPerDay: 55000,
    currentCongestionDays: 4.0,
    description: 'Deepwater Black Sea coal and sulfur export terminal. Handles Capesize directly for India voyages.',
    terminalNames: ['Taman Berth 1 & 2 Cape Berths']
  },
  {
    id: 'vostochny-ru',
    name: 'Vostochny (Far East)',
    country: 'Russia',
    region: 'Russia',
    maxDraft: 16.5,
    maxLOA: 300,
    maxBeam: 48.0,
    handlingRateMTPerDay: 48000,
    currentCongestionDays: 3.1,
    description: 'Russian Pacific deepwater coal gateway. Shorter transit to India than Baltic/Black Sea routes.',
    terminalNames: ['Vostochny Port Coal Production Complex']
  }
];

export const VESSEL_CLASSES: VesselSpecs[] = [
  {
    class: 'Handysize',
    typicalDWT: '28,000 - 39,000 DWT',
    dwtCapacityMin: 28000,
    dwtCapacityMax: 39000,
    typicalDraft: 10.0,
    typicalLOA: 180,
    typicalBeam: 28.5,
    hasOwnGear: true,
    typicalDailySpeedKnots: 13.0,
    bunkerConsumptionSeaMTPerDay: 19.5,
    marketDescription: 'Equipped with 4x30T ship cranes & grabs. Crucial for shallow draft ports like Haldia (7.8m-8.2m) and regional small parcel discharge. Highest freight per ton.'
  },
  {
    class: 'Supramax',
    typicalDWT: '52,000 - 64,000 DWT (Ultramax)',
    dwtCapacityMin: 52000,
    dwtCapacityMax: 64000,
    typicalDraft: 12.8,
    typicalLOA: 199,
    typicalBeam: 32.2,
    hasOwnGear: true,
    typicalDailySpeedKnots: 13.5,
    bunkerConsumptionSeaMTPerDay: 25.0,
    marketDescription: 'Self-discharging 4x35T cranes with grab buckets. Ideal for Indonesian anchorages (Taboneo, Muara Satui), Gopalpur, Vizag Inner, and lightering operations at Sandheads.'
  },
  {
    class: 'Panamax',
    typicalDWT: '72,000 - 85,000 DWT (Kamsarmax)',
    dwtCapacityMin: 72000,
    dwtCapacityMax: 85000,
    typicalDraft: 14.5,
    typicalLOA: 229,
    typicalBeam: 32.26,
    hasOwnGear: false,
    typicalDailySpeedKnots: 13.8,
    bunkerConsumptionSeaMTPerDay: 30.0,
    marketDescription: 'Workhorse of global coal and grain trades. High efficiency gearless vessel suited for Paradip, Vizag, Gangavaram, Dhamra, Newcastle, and Maputo.'
  },
  {
    class: 'Capesize',
    typicalDWT: '160,000 - 210,000 DWT (Newcastlemax)',
    dwtCapacityMin: 160000,
    dwtCapacityMax: 210000,
    typicalDraft: 18.2,
    typicalLOA: 295,
    typicalBeam: 46.0,
    hasOwnGear: false,
    typicalDailySpeedKnots: 14.2,
    bunkerConsumptionSeaMTPerDay: 44.0,
    marketDescription: 'Massive scale offering the lowest ton-mile freight $/MT. Requires deep-draft berths (Gangavaram 20m, Dhamra 18m, Vizag Outer 18.1m) or offshore transshipment at Sandheads.'
  }
];

export const COMMODITY_OPTIONS = [
  { id: 'coking-coal', name: 'Met Coking Coal (Australia/US/Mozambique)', density: 0.85, typicalParcelMT: 75000 },
  { id: 'thermal-coal', name: 'Thermal / Steam Coal (Indonesia/Australia/Russia)', density: 0.82, typicalParcelMT: 70000 },
  { id: 'pci-coal', name: 'PCI Coal (Pulverized Coal Injection)', density: 0.84, typicalParcelMT: 65000 },
  { id: 'iron-ore', name: 'Iron Ore Fines / Pellets', density: 2.4, typicalParcelMT: 150000 },
  { id: 'bauxite', name: 'Bauxite Bulk', density: 1.3, typicalParcelMT: 55000 },
  { id: 'limestone', name: 'Limestone & Dolomite Flux', density: 1.45, typicalParcelMT: 58000 },
  { id: 'petcoke', name: 'Petroleum Coke (US Gulf / Saudi)', density: 0.78, typicalParcelMT: 52000 }
];

// Matrix of nautical distances (nm) from origins to Paradip / Vizag
export const TRADE_LANE_DISTANCES: Record<string, { distanceNM: number; daysSteamAt13Knots: number }> = {
  'hay-point': { distanceNM: 4850, daysSteamAt13Knots: 15.5 },
  'newcastle-au': { distanceNM: 5200, daysSteamAt13Knots: 16.6 },
  'gladstone': { distanceNM: 4950, daysSteamAt13Knots: 15.8 },
  'taboneo': { distanceNM: 2100, daysSteamAt13Knots: 6.7 },
  'muara-satui': { distanceNM: 2250, daysSteamAt13Knots: 7.2 },
  'balikpapan': { distanceNM: 2380, daysSteamAt13Knots: 7.6 },
  'maputo': { distanceNM: 4300, daysSteamAt13Knots: 13.8 },
  'nacala': { distanceNM: 3820, daysSteamAt13Knots: 12.2 },
  'norfolk-us': { distanceNM: 8450, daysSteamAt13Knots: 27.0 },
  'baltimore-us': { distanceNM: 8550, daysSteamAt13Knots: 27.4 },
  'taman-ru': { distanceNM: 4900, daysSteamAt13Knots: 15.7 },
  'vostochny-ru': { distanceNM: 5150, daysSteamAt13Knots: 16.5 },
};

export interface VesselSizingEvaluation {
  vesselClass: 'Handysize' | 'Supramax' | 'Panamax' | 'Capesize';
  subtypeName: string;
  typicalDWT: string;
  maxPayloadMT: number;
  voyagesRequired: number;
  intakeUtilizationPct: number;
  cargoIntakeStatus: 'Optimal 100% Fit' | 'Capacity Shortfall' | 'Multi-Voyage Required' | 'Excess Capacity / Deadfreight';
  statusBadgeColor: 'emerald' | 'amber' | 'rose' | 'slate';
  intakeSummary: string;
  isRecommendedForVolume: boolean;
  draftStatus: 'Compliant' | 'Draft Restricted' | 'Lightering Required';
  draftNotes: string;
  estimatedRateUSDPerMT: number;
  totalFreightCostUSD: number;
  deadfreightCostUSD: number;
  turnaroundDays: number;
  operationalStrategy: string;
  gearSummary: string;
}

export function calculateVesselSizingMatrix(
  cargoVolumeMT: number,
  dischargePort: string,
  baseSpotRate: number = 16.8
): Record<string, VesselSizingEvaluation> {
  const isHaldia = dischargePort.toLowerCase().includes('haldia');
  const isDeepPort = ['gangavaram', 'dhamra', 'visakhapatnam (outer harbour)', 'sagar island'].some(p =>
    dischargePort.toLowerCase().includes(p)
  );

  // 1. Handysize (~35,000 MT practical max intake)
  const handyMaxPayload = 35000;
  const handyVoyages = Math.max(1, Math.ceil(cargoVolumeMT / handyMaxPayload));
  const handyRate = Number((baseSpotRate * 1.22).toFixed(2));
  const handyTotal = Math.round(cargoVolumeMT * handyRate);
  const handyTurnaround = Number((2.5 * handyVoyages + 3.0).toFixed(1));

  const handyEvaluation: VesselSizingEvaluation = {
    vesselClass: 'Handysize',
    subtypeName: 'Handysize Bulker (35k)',
    typicalDWT: '28,000 - 39,000 DWT',
    maxPayloadMT: handyMaxPayload,
    voyagesRequired: handyVoyages,
    intakeUtilizationPct: cargoVolumeMT <= handyMaxPayload ? Math.round((cargoVolumeMT / handyMaxPayload) * 100) : 100,
    cargoIntakeStatus:
      cargoVolumeMT <= handyMaxPayload ? 'Optimal 100% Fit' : 'Multi-Voyage Required',
    statusBadgeColor: cargoVolumeMT <= handyMaxPayload ? 'emerald' : 'slate',
    intakeSummary:
      cargoVolumeMT <= handyMaxPayload
        ? `Full single-voyage intake (${cargoVolumeMT.toLocaleString()} MT).`
        : `Requires ${handyVoyages} separate voyages (lifts ${handyMaxPayload.toLocaleString()} MT max per lift; short by ${(cargoVolumeMT - handyMaxPayload).toLocaleString()} MT for single voyage).`,
    isRecommendedForVolume: cargoVolumeMT <= 42000 || isHaldia,
    draftStatus: 'Compliant',
    draftNotes: `10.0m laden draft is fully compatible with ${dischargePort} (including shallow riverine berths).`,
    estimatedRateUSDPerMT: handyRate,
    totalFreightCostUSD: handyTotal,
    deadfreightCostUSD: 0,
    turnaroundDays: handyTurnaround,
    operationalStrategy:
      cargoVolumeMT > 50000
        ? `Requires staging ${handyVoyages} separate fixtures. High cumulative port disbursement accounts (PDA) and extended discharge queue (~${handyTurnaround} days total).`
        : `Ideal for regional shallow berths. Onboard 4x30T ship cranes eliminate dependency on shore gantry equipment.`,
    gearSummary: '4x30T Cranes + Grabs (Geared)',
  };

  // 2. Supramax / Ultramax (~58,000 MT practical max intake)
  const supraMaxPayload = 58000;
  const supraVoyages = Math.max(1, Math.ceil(cargoVolumeMT / supraMaxPayload));
  const supraRate = Number((baseSpotRate * 1.04).toFixed(2));
  const supraTotal = Math.round(cargoVolumeMT * supraRate);
  const supraTurnaround = Number((3.5 * supraVoyages + 2.0).toFixed(1));

  const supraEvaluation: VesselSizingEvaluation = {
    vesselClass: 'Supramax',
    subtypeName: 'Supramax / Ultramax (60k)',
    typicalDWT: '52,000 - 64,000 DWT',
    maxPayloadMT: supraMaxPayload,
    voyagesRequired: supraVoyages,
    intakeUtilizationPct: cargoVolumeMT <= supraMaxPayload ? Math.round((cargoVolumeMT / supraMaxPayload) * 100) : 100,
    cargoIntakeStatus:
      cargoVolumeMT >= 45000 && cargoVolumeMT <= 62000
        ? 'Optimal 100% Fit'
        : cargoVolumeMT > supraMaxPayload
        ? 'Capacity Shortfall'
        : 'Optimal 100% Fit',
    statusBadgeColor:
      cargoVolumeMT >= 45000 && cargoVolumeMT <= 62000
        ? 'emerald'
        : cargoVolumeMT > supraMaxPayload
        ? 'amber'
        : 'slate',
    intakeSummary:
      cargoVolumeMT > supraMaxPayload
        ? `Lifts 58,000 MT max. Leaves ${(cargoVolumeMT - supraMaxPayload).toLocaleString()} MT short on a single voyage (${supraVoyages} voyages needed).`
        : `Single-voyage intake capacity utilized at ${Math.round((cargoVolumeMT / supraMaxPayload) * 100)}%.`,
    isRecommendedForVolume: cargoVolumeMT >= 45000 && cargoVolumeMT <= 64000 && !isHaldia,
    draftStatus: isHaldia ? 'Draft Restricted' : 'Compliant',
    draftNotes: isHaldia
      ? '12.8m draft exceeds Haldia Hooghly river limit (8.2m). Must lighter at Sandheads or short-load.'
      : `12.8m draft clears ${dischargePort} deep coal berths with >1.5m under-keel clearance (UKC).`,
    estimatedRateUSDPerMT: supraRate,
    totalFreightCostUSD: supraTotal,
    deadfreightCostUSD: 0,
    turnaroundDays: supraTurnaround,
    operationalStrategy:
      cargoVolumeMT > 64000
        ? `If Supramax is chartered for ${cargoVolumeMT.toLocaleString()} MT, charterer must contract 2 vessels (e.g. 2x 40k MT) or leave ${((cargoVolumeMT - supraMaxPayload) / 1000).toFixed(0)}k MT behind.`
        : `Standard geared bulk carrier with 4x35T cranes. Excellent flexibility across Indian intermediate ports.`,
    gearSummary: '4x35T Cranes + Grabs (Geared)',
  };

  // 3. Panamax / Kamsarmax (~82,500 MT practical max intake)
  const panamaxMaxPayload = 82500;
  const panamaxVoyages = Math.max(1, Math.ceil(cargoVolumeMT / panamaxMaxPayload));
  const panamaxRate = Number((baseSpotRate * 0.885).toFixed(2));
  const panamaxTotal = Math.round(cargoVolumeMT * panamaxRate);
  const panamaxTurnaround = Number((cargoVolumeMT / 28000 + 2.0).toFixed(1));
  const isPanamaxOptimal = cargoVolumeMT >= 65000 && cargoVolumeMT <= 88000 && !isHaldia;

  const panamaxEvaluation: VesselSizingEvaluation = {
    vesselClass: 'Panamax',
    subtypeName: 'Panamax / Kamsarmax (82k)',
    typicalDWT: '72,000 - 85,000 DWT',
    maxPayloadMT: panamaxMaxPayload,
    voyagesRequired: panamaxVoyages,
    intakeUtilizationPct: Math.min(100, Math.round((cargoVolumeMT / panamaxMaxPayload) * 100)),
    cargoIntakeStatus: isPanamaxOptimal ? 'Optimal 100% Fit' : cargoVolumeMT < 65000 ? 'Excess Capacity / Deadfreight' : 'Optimal 100% Fit',
    statusBadgeColor: isPanamaxOptimal ? 'emerald' : 'slate',
    intakeSummary:
      cargoVolumeMT >= 72000 && cargoVolumeMT <= 85000
        ? `★ Perfect 100% Single-Voyage Intake. Lifts entire ${cargoVolumeMT.toLocaleString()} MT parcel on 1 vessel with 0 MT deadfreight.`
        : cargoVolumeMT > panamaxMaxPayload
        ? `Lifts up to 82,500 MT. Excess ${(cargoVolumeMT - panamaxMaxPayload).toLocaleString()} MT requires parcel splitting.`
        : `Takes ${cargoVolumeMT.toLocaleString()} MT, but hold volume is under-utilized (${Math.round((cargoVolumeMT / panamaxMaxPayload) * 100)}% intake).`,
    isRecommendedForVolume: isPanamaxOptimal,
    draftStatus: isHaldia ? 'Draft Restricted' : 'Compliant',
    draftNotes: isHaldia
      ? '14.5m draft cannot berth directly at Haldia (8.2m limit). Requires offshore lightering at Sagar / Sandheads.'
      : `14.5m design arrival draft clears mechanized coal berths at ${dischargePort} comfortably.`,
    estimatedRateUSDPerMT: panamaxRate,
    totalFreightCostUSD: panamaxTotal,
    deadfreightCostUSD: 0,
    turnaroundDays: panamaxTurnaround,
    operationalStrategy:
      `Optimal workhorse for ${cargoVolumeMT.toLocaleString()} MT. 229m LOA and 32.26m beam complies with universal East Coast India discharge terminals. Highly liquid FFA freight hedging availability.`,
    gearSummary: 'Gearless (Discharge via shore automated gantry unloaders)',
  };

  // 4. Capesize / Newcastlemax (~175,000 MT practical max intake)
  const capeMaxPayload = 175000;
  const capeVoyages = 1;
  const capeIntakePct = Math.round((cargoVolumeMT / capeMaxPayload) * 100);
  const isCapeOptimal = cargoVolumeMT >= 120000 && isDeepPort;

  // If cargo is small (e.g. 80,000 MT), solo Cape charter pays deadfreight on unused hold
  let capeRate = Number((baseSpotRate * 0.78).toFixed(2));
  let capeDeadfreight = 0;
  if (cargoVolumeMT < 110000) {
    // Unutilized capacity penalty
    const unusedMT = Math.max(0, 150000 - cargoVolumeMT);
    capeDeadfreight = Math.round(unusedMT * (baseSpotRate * 0.45));
    capeRate = Number(((cargoVolumeMT * capeRate + capeDeadfreight) / cargoVolumeMT).toFixed(2));
  }
  const capeTotal = Math.round(cargoVolumeMT * capeRate);
  const capeTurnaround = Number((cargoVolumeMT / 45000 + 1.8).toFixed(1));

  const capeEvaluation: VesselSizingEvaluation = {
    vesselClass: 'Capesize',
    subtypeName: 'Capesize / Newcastlemax (180k)',
    typicalDWT: '160,000 - 210,000 DWT',
    maxPayloadMT: capeMaxPayload,
    voyagesRequired: capeVoyages,
    intakeUtilizationPct: capeIntakePct,
    cargoIntakeStatus: isCapeOptimal ? 'Optimal 100% Fit' : 'Excess Capacity / Deadfreight',
    statusBadgeColor: isCapeOptimal ? 'emerald' : 'rose',
    intakeSummary:
      cargoVolumeMT < 110000
        ? `Severe deadfreight risk for solo charter (${cargoVolumeMT.toLocaleString()} MT occupies only ${capeIntakePct}% of hold; ~${(capeMaxPayload - cargoVolumeMT).toLocaleString()} MT empty hold space).`
        : `Full-scale economies for deep draft terminals (${cargoVolumeMT.toLocaleString()} MT at lowest ton-mile rate).`,
    isRecommendedForVolume: isCapeOptimal,
    draftStatus: isDeepPort ? 'Compliant' : 'Draft Restricted',
    draftNotes: isDeepPort
      ? `18.2m draft compatible with deep-water berths at ${dischargePort}.`
      : `18.2m draft strictly barred at ${dischargePort}. Requires 18m+ deepwater port (Gangavaram/Dhamra/Vizag Outer) or offshore transshipment.`,
    estimatedRateUSDPerMT: capeRate,
    totalFreightCostUSD: capeTotal,
    deadfreightCostUSD: capeDeadfreight,
    turnaroundDays: capeTurnaround,
    operationalStrategy:
      cargoVolumeMT < 110000
        ? `For an ${cargoVolumeMT.toLocaleString()} MT parcel, chartering a dedicated Capesize incurs ~$${(capeDeadfreight / 1000).toFixed(0)}k in deadfreight penalties. Only consider if co-loading as part-cargo with another Indian steelmaker.`
        : `Maximum scale economies. High-speed discharge of 45,000+ MT/day with dedicated railhead conveyor connectivity.`,
    gearSummary: 'Gearless (Automated grab unloader bucket requirement)',
  };

  return {
    Handysize: handyEvaluation,
    Supramax: supraEvaluation,
    Panamax: panamaxEvaluation,
    Capesize: capeEvaluation,
  };
}

export function generateClientEconometricForecast(inputs: ProcurementInputs): ForecastResultData {
  const volume = inputs.cargoVolumeMT || 80000;
  const origin = inputs.originPort || 'Hay Point / Dalrymple Bay (DBCT)';
  const destination = inputs.dischargePort || 'Paradip Port';
  const commodity = inputs.commodity || 'Met Coking Coal';
  const spotRate = inputs.currentSpotFreightPerMT || 16.8;

  const sizing = calculateVesselSizingMatrix(volume, destination, spotRate);

  // Recommended hull selection logic
  let recClass: VesselClass | 'Dual-Parcel Split' = 'Panamax';
  let destStatus: 'Optimal' | 'Compatible' | 'Draft Restricted' = 'Optimal';
  let destNotes = `14.5m design draft accommodates Panamax/Kamsarmax at ${destination} mechanized berths.`;
  let draftClearance = 14.5;
  let rationale = `Panamax (82k DWT Kamsarmax) selected for ${volume.toLocaleString()} MT: provides 98% hold intake with 0 MT deadfreight penalty, clearing 14.5m draft at ${destination}.`;

  if (destination.toLowerCase().includes('haldia')) {
    recClass = volume > 45000 ? 'Dual-Parcel Split' : 'Handysize';
    destStatus = 'Draft Restricted';
    destNotes = 'Hooghly river draft constrained to 7.8m - 8.5m. Requires Handysize direct or offshore lightering at Sagar/Sandheads.';
    draftClearance = 8.2;
    rationale = `Due to Haldia's 8.2m river draft limit, an ${volume.toLocaleString()} MT parcel requires a Dual-Parcel Split (2x Handysize) or offshore lightering at Sagar Island / Sandheads.`;
  } else if (volume >= 120000 && (destination.toLowerCase().includes('gangavaram') || destination.toLowerCase().includes('dhamra') || destination.toLowerCase().includes('outer'))) {
    recClass = 'Capesize';
    destStatus = 'Optimal';
    destNotes = 'Deep water draft (18.0m - 20.2m) allows full Capesize loading without lightening.';
    draftClearance = destination.toLowerCase().includes('gangavaram') ? 20.2 : 18.0;
    rationale = `Capesize 180,000 DWT provides lowest ton-mile rate for large ${volume.toLocaleString()} MT parcel at ${destination}.`;
  } else if (volume <= 42000) {
    recClass = 'Handysize';
    destStatus = 'Optimal';
    destNotes = `Handysize 35,000 DWT is ideal for smaller parcel of ${volume.toLocaleString()} MT.`;
    draftClearance = 10.0;
    rationale = `Handysize vessel provides complete hold fill for ${volume.toLocaleString()} MT parcel without deadfreight.`;
  } else if (volume <= 62000) {
    recClass = 'Supramax';
    destStatus = 'Optimal';
    destNotes = `Supramax 58,000 DWT accommodates parcel of ${volume.toLocaleString()} MT.`;
    draftClearance = 12.8;
    rationale = `Supramax bulk carrier lifts ${volume.toLocaleString()} MT parcel efficiently with 4x35T cranes.`;
  } else {
    // 70,000 - 95,000 MT (including 80,000 MT)
    recClass = 'Panamax';
    destStatus = 'Optimal';
    draftClearance = 14.5;
    rationale = `Panamax (82k DWT Kamsarmax) is the mathematically optimal choice for ${volume.toLocaleString()} MT: lifts 100% of cargo in a single voyage without splitting, zero deadfreight, and clears 14.5m draft at ${destination}.`;
  }

  const selectedEval = recClass === 'Dual-Parcel Split' ? sizing.Handysize : sizing[recClass];
  const ratePerMT = selectedEval.estimatedRateUSDPerMT;
  const totalCost = selectedEval.totalFreightCostUSD;
  const spotTotal = Math.round(volume * spotRate);
  const savings = Math.max(0, spotTotal - totalCost);
  const savingsPct = spotTotal > 0 ? Number(((savings / spotTotal) * 100).toFixed(1)) : 11.5;

  return {
    recommendedWindow: 'Next 12 to 18 calendar days (Prior to Q4 Atlantic grain & Asian thermal coal surge)',
    vesselRecommendation: {
      recommendedClass: recClass,
      rationale,
      portFeasibility: {
        originStatus: 'Optimal',
        originNotes: `Loading facilities at ${origin} operate automated high-speed conveyors compatible with ${recClass}.`,
        destinationStatus: destStatus,
        destinationNotes: destNotes,
        draftClearanceMeters: draftClearance,
        maxDischargeDays: selectedEval.turnaroundDays,
      },
      estimatedFreightRateUSDPerMT: ratePerMT,
      totalFreightCostUSD: totalCost,
    },
    forwardRateCurve: [
      { period: 'Spot Current', rate: spotRate, lowBound: Number((spotRate * 0.96).toFixed(1)), highBound: Number((spotRate * 1.05).toFixed(1)), signal: 'Neutral' },
      { period: 'Month 1 Forward', rate: Number((spotRate * 1.03).toFixed(1)), lowBound: Number((spotRate * 0.98).toFixed(1)), highBound: Number((spotRate * 1.08).toFixed(1)), signal: 'Optimal Buy' },
      { period: 'Month 2 Forward', rate: Number((spotRate * 1.07).toFixed(1)), lowBound: Number((spotRate * 1.01).toFixed(1)), highBound: Number((spotRate * 1.14).toFixed(1)), signal: 'Bullish' },
      { period: 'Month 3 Forward', rate: Number((spotRate * 1.11).toFixed(1)), lowBound: Number((spotRate * 1.04).toFixed(1)), highBound: Number((spotRate * 1.19).toFixed(1)), signal: 'Bullish' },
      { period: 'Month 6 Forward', rate: Number((spotRate * 1.04).toFixed(1)), lowBound: Number((spotRate * 0.95).toFixed(1)), highBound: Number((spotRate * 1.12).toFixed(1)), signal: 'Neutral' },
    ],
    contractComparison: {
      spotTotalCostUSD: spotTotal,
      multipleVoyageCostUSD: totalCost,
      projectedSavingsUSD: savings,
      savingsPercentage: savingsPct,
      volatilityHedgingScore: 88,
      demurrageRiskScore: destination.toLowerCase().includes('haldia') ? 'High' : destination.toLowerCase().includes('paradip') ? 'Moderate' : 'Low',
      strategicBenefit: 'Replacing standalone spot fixtures with consecutive voyages locks in index-discounted freight and guarantees laycan scheduling.',
    },
    idleManagement: {
      estimatedTurnaroundDays: selectedEval.turnaroundDays,
      expectedPortCongestionDays: destination.toLowerCase().includes('paradip') ? 3.5 : destination.toLowerCase().includes('haldia') ? 4.0 : 1.5,
      deadheadMitigationStrategy: 'Negotiate flexible discharge range (Paradip / Dhamra / Gangavaram option) to circumvent acute pre-berthing waiting times.',
      backhaulOpportunity: 'Ballast positioning can pair with coastal iron ore pellet movement or outbound bauxite to Southeast Asia.',
    },
    riskAlerts: [
      {
        category: 'Congestion',
        severity: destination.toLowerCase().includes('paradip') || destination.toLowerCase().includes('haldia') ? 'Medium' : 'Low',
        description: `Current average pre-berthing waiting time at ${destination} is 2.8 - 4.2 days. Include favorable laytime clauses (WIPON/WIBON) in charter party.`,
      },
      {
        category: 'Weather',
        severity: 'Low',
        description: 'Post-monsoon sea state favorable along Bay of Bengal routes; tropical cyclone tracking is clear for next 15 days.',
      },
      {
        category: 'Bunker',
        severity: 'Medium',
        description: 'Singapore VLSFO holding firm at $615-$630/MT. Incorporate standard BAF escalation formula tied to 0.5% LSFO index.',
      },
    ],
    executiveDirectives: [
      `Shift from spot market exploration to an immediate multiple-voyage consecutive tender for ${commodity} to lock in $${ratePerMT}/MT.`,
      `Enforce ${recClass} vessel parameters with ${destination} port trust draft clearance margin of at least 0.8m under keel.`,
      `Incorporate a 15-day laycan flexibility clause to hedge against loading port weather delays at ${origin}.`,
    ],
  };
}

