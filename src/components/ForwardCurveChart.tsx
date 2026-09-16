import React, { useState } from 'react';
import { RateCurvePoint } from '../types';
import { TrendingUp, Clock, AlertCircle, CheckCircle2, ChevronRight } from 'lucide-react';

interface ForwardCurveChartProps {
  curveData: RateCurvePoint[];
  recommendedWindow: string;
  currentSpot: number;
}

export const ForwardCurveChart: React.FC<ForwardCurveChartProps> = ({
  curveData,
  recommendedWindow,
  currentSpot,
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<RateCurvePoint | null>(null);

  if (!curveData || curveData.length === 0) {
    return null;
  }

  // Calculate SVG scales safely
  const allRates = curveData
    .flatMap((d) => [Number(d.rate), Number(d.lowBound), Number(d.highBound)])
    .filter((v) => Number.isFinite(v));
  const safeRates = allRates.length > 0 ? allRates : [15, 18];
  const minRate = Math.floor(Math.min(...safeRates) * 0.95);
  const maxRate = Math.ceil(Math.max(...safeRates) * 1.05);

  const width = 640;
  const height = 240;
  const paddingX = 50;
  const paddingY = 30;

  const getX = (index: number) => {
    if (curveData.length <= 1) return width / 2;
    return paddingX + (index * (width - 2 * paddingX)) / (curveData.length - 1);
  };

  const getY = (val: number) => {
    const num = Number.isFinite(Number(val)) ? Number(val) : minRate;
    const range = maxRate - minRate || 1;
    return height - paddingY - ((num - minRate) / range) * (height - 2 * paddingY);
  };

  // Build polygon points for upper and lower confidence band
  const upperPoints = curveData.map((d, i) => `${getX(i)},${getY(d.highBound)}`);
  const lowerPoints = curveData
    .slice()
    .reverse()
    .map((d, i) => `${getX(curveData.length - 1 - i)},${getY(d.lowBound)}`);
  const confidencePolygon = [...upperPoints, ...lowerPoints].join(' ');

  // Main line points
  const linePoints = curveData.map((d, i) => `${getX(i)},${getY(d.rate)}`).join(' ');

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      {/* Header with recommended window */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">Forward Freight Rate Curve & Confidence Bounds</h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Econometric & ML projection of dry bulk freight rates ($/MT) with confidence interval
          </p>
        </div>

        {/* Optimal Market Entry Recommendation Pill */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs">
          <Clock className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <div>
            <span className="font-semibold block text-[11px] text-emerald-700 uppercase tracking-wide">
              Optimal Entry Window
            </span>
            <strong className="text-xs text-emerald-950 font-medium">{recommendedWindow}</strong>
          </div>
        </div>
      </div>

      {/* SVG Chart */}
      <div className="relative mt-4">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-56 overflow-visible"
        >
          <defs>
            <linearGradient id="bandGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#818cf8" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#c7d2fe" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#4f46e5" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
          </defs>

          {/* Horizontal grid lines & Y-axis labels */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const val = minRate + ratio * (maxRate - minRate);
            const y = getY(val);
            return (
              <g key={ratio}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="#f1f5f9"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <text
                  x={paddingX - 8}
                  y={y + 4}
                  textAnchor="end"
                  className="text-[10px] fill-slate-400 font-mono"
                >
                  ${val.toFixed(1)}
                </text>
              </g>
            );
          })}

          {/* Confidence interval band polygon */}
          <polygon points={confidencePolygon} fill="url(#bandGradient)" />

          {/* Forecast main line */}
          <polyline
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={linePoints}
          />

          {/* Data Points */}
          {curveData.map((point, index) => {
            const cx = getX(index);
            const cy = getY(point.rate);
            const isHovered = hoveredPoint?.period === point.period;

            return (
              <g
                key={point.period}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredPoint(point)}
                onMouseLeave={() => setHoveredPoint(null)}
              >
                {/* Upper and lower bound ticks */}
                <line
                  x1={cx}
                  y1={getY(point.lowBound)}
                  x2={cx}
                  y2={getY(point.highBound)}
                  stroke="#94a3b8"
                  strokeWidth="1.5"
                  strokeDasharray="2 2"
                />

                {/* Point circle */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={isHovered ? 6 : 4.5}
                  className={`${
                    point.signal === 'Optimal Buy'
                      ? 'fill-emerald-500 stroke-emerald-100'
                      : point.signal === 'Bullish'
                      ? 'fill-rose-500 stroke-rose-100'
                      : 'fill-indigo-600 stroke-indigo-100'
                  } transition-all`}
                  strokeWidth={isHovered ? 4 : 2}
                />

                {/* Rate label above dot */}
                <text
                  x={cx}
                  y={cy - 12}
                  textAnchor="middle"
                  className={`text-[11px] font-mono font-bold ${
                    point.signal === 'Optimal Buy' ? 'fill-emerald-700' : 'fill-slate-800'
                  }`}
                >
                  ${point.rate.toFixed(2)}
                </text>

                {/* Period X-axis label */}
                <text
                  x={cx}
                  y={height - 8}
                  textAnchor="middle"
                  className="text-[10px] fill-slate-500 font-medium"
                >
                  {point.period}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover info tooltip box */}
        {hoveredPoint && (
          <div className="absolute top-2 right-4 bg-slate-900/95 text-white text-xs p-2.5 rounded-lg shadow-lg border border-slate-700 pointer-events-none z-10 space-y-1">
            <div className="font-semibold text-slate-200">{hoveredPoint.period}</div>
            <div className="flex items-center gap-2 font-mono">
              <span>Forecast: <strong className="text-white">${hoveredPoint.rate.toFixed(2)}/MT</strong></span>
              <span className="text-slate-400">({hoveredPoint.lowBound} - {hoveredPoint.highBound})</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px]">
              <span className="text-slate-400">Market Signal:</span>
              <span
                className={`px-1.5 py-0.2 rounded text-[10px] font-semibold ${
                  hoveredPoint.signal === 'Optimal Buy'
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : hoveredPoint.signal === 'Bullish'
                    ? 'bg-rose-500/20 text-rose-300'
                    : 'bg-slate-700 text-slate-300'
                }`}
              >
                {hoveredPoint.signal}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Trajectory legend & Signal breakdown */}
      <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {curveData.map((d) => (
          <div
            key={d.period}
            className={`p-2.5 rounded-lg border text-xs ${
              d.signal === 'Optimal Buy'
                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                : d.signal === 'Bullish'
                ? 'bg-rose-50/50 border-rose-200 text-rose-950'
                : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}
          >
            <div className="flex items-center justify-between font-medium">
              <span className="truncate">{d.period}</span>
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  d.signal === 'Optimal Buy'
                    ? 'bg-emerald-200 text-emerald-800'
                    : d.signal === 'Bullish'
                    ? 'bg-rose-200 text-rose-800'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {d.signal}
              </span>
            </div>
            <div className="mt-1 flex items-baseline justify-between font-mono">
              <span className="text-sm font-bold">${d.rate.toFixed(2)}</span>
              <span className="text-[10px] text-slate-500">
                Range: ${d.lowBound}-${d.highBound}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
