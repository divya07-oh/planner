import React from 'react';

// --- Helper Types for Chart Data ---
interface ChartDataPoint {
  label: string;
  value: number;
  value2?: number; // Optional second value for multi-metric charts
}

interface ChartProps {
  data: ChartDataPoint[];
  height?: number;
}

// 1. PRODUCTIVITY TREND CHART (Line Chart with Area Gradient)
export const ProductivityLineChart: React.FC<ChartProps> = ({ data, height = 200 }) => {
  const width = 500;
  const paddingX = 40;
  const paddingY = 25;

  const maxVal = Math.max(...data.map(d => d.value), 100);

  // Compute points
  const points = data.map((d, i) => {
    const x = paddingX + (i * (width - 2 * paddingX)) / (data.length - 1);
    const y = height - paddingY - (d.value / maxVal) * (height - 2 * paddingY);
    return { x, y, val: d.value, label: d.label };
  });

  const pathD = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  // For gradient area under line
  const areaD = points.length > 0 
    ? `${pathD} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`
    : '';

  return (
    <div className="w-full bg-white rounded-xl">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full overflow-visible">
        <defs>
          <linearGradient id="prodGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Grid lines (horizontal) */}
        {[0, 25, 50, 75, 100].map((tick) => {
          const y = height - paddingY - (tick / 100) * (height - 2 * paddingY);
          return (
            <g key={tick} className="opacity-80">
              <line
                x1={paddingX}
                y1={y}
                x2={width - paddingX}
                y2={y}
                stroke="#E2E8F0"
                strokeWidth="0.8"
                strokeDasharray="4 4"
              />
              <text
                x={paddingX - 10}
                y={y + 3.5}
                textAnchor="end"
                className="text-[9px] font-bold fill-slate-400"
              >
                {tick}%
              </text>
            </g>
          );
        })}

        {/* Area */}
        {areaD && (
          <path d={areaD} fill="url(#prodGradient)" className="transition-all duration-550 ease-in-out" />
        )}

        {/* Line */}
        {pathD && (
          <path
            d={pathD}
            fill="none"
            stroke="#2563EB"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-all duration-550 ease-in-out"
          />
        )}

        {/* Dots & Labels */}
        {points.map((p, i) => (
          <g key={i} className="group cursor-pointer">
            <circle
              cx={p.x}
              cy={p.y}
              r="4.5"
              fill="#FFFFFF"
              stroke="#2563EB"
              strokeWidth="2.5"
              className="hover:r-6 hover:stroke-[3.5] transition-all duration-150"
            />
            {/* Tooltip on hover */}
            <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              <rect
                x={p.x - 24}
                y={p.y - 28}
                width="48"
                height="18"
                rx="6"
                fill="#0F172A"
              />
              <text
                x={p.x}
                y={p.y - 16}
                textAnchor="middle"
                fill="#FFFFFF"
                className="text-[9px] font-bold"
              >
                {p.val}%
              </text>
            </g>
            {/* X-axis labels */}
            <text
              x={p.x}
              y={height - 6}
              textAnchor="middle"
              className="text-[9px] font-bold fill-slate-400"
            >
              {p.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

// 2. TASK COMPLETION CHART (Dual Bar Chart: Completed vs Pending)
export const TaskCompletionBarChart: React.FC<ChartProps> = ({ data, height = 200 }) => {
  const width = 500;
  const paddingX = 40;
  const paddingY = 25;

  const maxVal = Math.max(...data.map(d => Math.max(d.value, d.value2 || 0)), 5);

  const barWidth = 12;
  const barGap = 4;
  const chartWidth = width - 2 * paddingX;
  const categoryWidth = chartWidth / data.length;

  return (
    <div className="w-full bg-white rounded-xl">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full overflow-visible">
        {/* Grid lines (horizontal) */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
          const tickVal = Math.round(pct * maxVal);
          const y = height - paddingY - (tickVal / maxVal) * (height - 2 * paddingY);
          return (
            <g key={idx} className="opacity-80">
              <line
                x1={paddingX}
                y1={y}
                x2={width - paddingX}
                y2={y}
                stroke="#E2E8F0"
                strokeWidth="0.8"
              />
              <text
                x={paddingX - 10}
                y={y + 3.5}
                textAnchor="end"
                className="text-[9px] font-bold fill-slate-400"
              >
                {tickVal}
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {data.map((d, i) => {
          const categoryCenterX = paddingX + i * categoryWidth + categoryWidth / 2;
          
          // Completed Bar (Value 1)
          const bar1Height = (d.value / maxVal) * (height - 2 * paddingY);
          const bar1X = categoryCenterX - barWidth - barGap / 2;
          const bar1Y = height - paddingY - bar1Height;

          // Pending Bar (Value 2)
          const bar2Height = ((d.value2 || 0) / maxVal) * (height - 2 * paddingY);
          const bar2X = categoryCenterX + barGap / 2;
          const bar2Y = height - paddingY - bar2Height;

          return (
            <g key={i} className="group">
              {/* Completed Bar */}
              <rect
                x={bar1X}
                y={bar1Y}
                width={barWidth}
                height={Math.max(bar1Height, 1)}
                rx="4"
                fill="#22C55E"
                className="transition-all duration-500 ease-out hover:opacity-90 cursor-pointer"
              />
              {/* Tooltip 1 */}
              <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                <rect
                  x={bar1X - 12}
                  y={bar1Y - 22}
                  width="36"
                  height="16"
                  rx="4"
                  fill="#0F172A"
                />
                <text
                  x={bar1X + barWidth / 2}
                  y={bar1Y - 11}
                  textAnchor="middle"
                  fill="#FFFFFF"
                  className="text-[8px] font-bold"
                >
                  {d.value} Done
                </text>
              </g>

              {/* Pending Bar */}
              <rect
                x={bar2X}
                y={bar2Y}
                width={barWidth}
                height={Math.max(bar2Height, 1)}
                rx="4"
                fill="#F59E0B"
                className="transition-all duration-500 ease-out hover:opacity-90 cursor-pointer"
              />
              {/* Tooltip 2 */}
              <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                <rect
                  x={bar2X - 12}
                  y={bar2Y - 22}
                  width="36"
                  height="16"
                  rx="4"
                  fill="#0F172A"
                />
                <text
                  x={bar2X + barWidth / 2}
                  y={bar2Y - 11}
                  textAnchor="middle"
                  fill="#FFFFFF"
                  className="text-[8px] font-bold"
                >
                  {d.value2} Todo
                </text>
              </g>

              {/* Axis Label */}
              <text
                x={categoryCenterX}
                y={height - 6}
                textAnchor="middle"
                className="text-[9px] font-bold fill-slate-400"
              >
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// 3. HABIT CONSISTENCY CHART (Line Chart with Accent Color)
export const HabitConsistencyChart: React.FC<ChartProps> = ({ data, height = 200 }) => {
  const width = 500;
  const paddingX = 40;
  const paddingY = 25;

  const maxVal = 100;

  // Compute points
  const points = data.map((d, i) => {
    const x = paddingX + (i * (width - 2 * paddingX)) / (data.length - 1);
    const y = height - paddingY - (d.value / maxVal) * (height - 2 * paddingY);
    return { x, y, val: d.value, label: d.label };
  });

  const pathD = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  return (
    <div className="w-full bg-white rounded-xl">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full overflow-visible">
        {/* Grid lines (horizontal) */}
        {[0, 25, 50, 75, 100].map((tick) => {
          const y = height - paddingY - (tick / 100) * (height - 2 * paddingY);
          return (
            <g key={tick} className="opacity-80">
              <line
                x1={paddingX}
                y1={y}
                x2={width - paddingX}
                y2={y}
                stroke="#E2E8F0"
                strokeWidth="0.8"
                strokeDasharray="4 4"
              />
              <text
                x={paddingX - 10}
                y={y + 3.5}
                textAnchor="end"
                className="text-[9px] font-bold fill-slate-400"
              >
                {tick}%
              </text>
            </g>
          );
        })}

        {/* Line */}
        {pathD && (
          <path
            d={pathD}
            fill="none"
            stroke="#4F46E5"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-all duration-555 ease-in-out"
          />
        )}

        {/* Dots */}
        {points.map((p, i) => (
          <g key={i} className="group cursor-pointer">
            <circle
              cx={p.x}
              cy={p.y}
              r="4.5"
              fill="#FFFFFF"
              stroke="#4F46E5"
              strokeWidth="2.5"
              className="hover:r-6 hover:stroke-[3.5] transition-all duration-150"
            />
            {/* Tooltip */}
            <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              <rect
                x={p.x - 24}
                y={p.y - 28}
                width="48"
                height="18"
                rx="6"
                fill="#0F172A"
              />
              <text
                x={p.x}
                y={p.y - 16}
                textAnchor="middle"
                fill="#FFFFFF"
                className="text-[9px] font-bold"
              >
                {p.val}%
              </text>
            </g>
            {/* Label */}
            <text
              x={p.x}
              y={height - 6}
              textAnchor="middle"
              className="text-[9px] font-bold fill-slate-400"
            >
              {p.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

// 4. FOCUS HOURS TREND CHART (Smooth Curved Area Chart)
export const FocusHoursAreaChart: React.FC<ChartProps> = ({ data, height = 200 }) => {
  const width = 500;
  const paddingX = 40;
  const paddingY = 25;

  const values = data.map(d => d.value);
  const maxVal = Math.max(...values, 4); // minimum ceiling of 4 hours

  // Compute points
  const points = data.map((d, i) => {
    const x = paddingX + (i * (width - 2 * paddingX)) / (data.length - 1);
    const y = height - paddingY - (d.value / maxVal) * (height - 2 * paddingY);
    return { x, y, val: d.value, label: d.label };
  });

  // Calculate curve points using SVG bezier controls
  let pathD = '';
  if (points.length > 0) {
    pathD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cpX1 = p0.x + (p1.x - p0.x) / 2;
      const cpY1 = p0.y;
      const cpX2 = p0.x + (p1.x - p0.x) / 2;
      const cpY2 = p1.y;
      pathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
    }
  }

  const areaD = points.length > 0
    ? `${pathD} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`
    : '';

  return (
    <div className="w-full bg-white rounded-xl">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full overflow-visible">
        <defs>
          <linearGradient id="focusGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Grid lines (horizontal) */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
          const tickVal = Number((pct * maxVal).toFixed(1));
          const y = height - paddingY - (pct) * (height - 2 * paddingY);
          return (
            <g key={idx} className="opacity-80">
              <line
                x1={paddingX}
                y1={y}
                x2={width - paddingX}
                y2={y}
                stroke="#E2E8F0"
                strokeWidth="0.8"
                strokeDasharray="4 4"
              />
              <text
                x={paddingX - 10}
                y={y + 3.5}
                textAnchor="end"
                className="text-[9px] font-bold fill-slate-400"
              >
                {tickVal}h
              </text>
            </g>
          );
        })}

        {/* Area */}
        {areaD && (
          <path d={areaD} fill="url(#focusGradient)" className="transition-all duration-555 ease-in-out" />
        )}

        {/* Line */}
        {pathD && (
          <path
            d={pathD}
            fill="none"
            stroke="#38BDF8"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-all duration-555 ease-in-out"
          />
        )}

        {/* Dots */}
        {points.map((p, i) => (
          <g key={i} className="group cursor-pointer">
            <circle
              cx={p.x}
              cy={p.y}
              r="4.5"
              fill="#FFFFFF"
              stroke="#38BDF8"
              strokeWidth="2.5"
              className="hover:r-6 hover:stroke-[3.5] transition-all duration-150"
            />
            {/* Tooltip */}
            <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              <rect
                x={p.x - 24}
                y={p.y - 28}
                width="48"
                height="18"
                rx="6"
                fill="#0F172A"
              />
              <text
                x={p.x}
                y={p.y - 16}
                textAnchor="middle"
                fill="#FFFFFF"
                className="text-[9px] font-bold"
              >
                {p.val} hrs
              </text>
            </g>
            {/* Label */}
            <text
              x={p.x}
              y={height - 6}
              textAnchor="middle"
              className="text-[9px] font-bold fill-slate-400"
            >
              {p.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};
