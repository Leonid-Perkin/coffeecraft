import React from 'react';

export interface RadarAxis {
  key: string;
  label: string;
}

interface RadarChartProps {
  data: Record<string, number>;
  axes?: RadarAxis[];
  size?: number;
  editable?: boolean;
  theme?: 'coffee' | 'tea';
  onChange?: (key: string, val: number) => void;
}

const DEFAULT_COFFEE_AXES: RadarAxis[] = [
  { key: 'acidity', label: 'Кислотность' },
  { key: 'sweetness', label: 'Сладость' },
  { key: 'clarity', label: 'Чистота' },
  { key: 'aftertaste', label: 'Послевкусие' },
  { key: 'body', label: 'Тело' },
  { key: 'bitterness', label: 'Горечь' },
];

export const RadarChart: React.FC<RadarChartProps> = ({
  data,
  axes = DEFAULT_COFFEE_AXES,
  size = 280,
  editable = false,
  theme = 'coffee',
  onChange,
}) => {
  const center = size / 2;
  const radius = center * 0.70;
  const totalAxes = axes.length;

  const isTea = theme === 'tea';
  const polygonFill = isTea ? 'rgba(52, 211, 153, 0.35)' : 'rgba(212, 139, 70, 0.38)';
  const strokeColor = isTea ? '#34d399' : '#f5be7e';
  const pointFill = isTea ? '#6ee7b7' : '#d48b46';
  const labelFill = isTea ? '#d1fae5' : '#eedbc5';
  const gridStroke = isTea ? 'rgba(52, 211, 153, 0.22)' : 'rgba(212, 139, 70, 0.25)';

  const getCoordinates = (value: number, index: number) => {
    const angle = (Math.PI * 2 / totalAxes) * index - Math.PI / 2;
    const r = (value / 10) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  const getLabelCoordinates = (index: number) => {
    const angle = (Math.PI * 2 / totalAxes) * index - Math.PI / 2;
    const r = radius + 24;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  // Polygon points
  const pointsString = axes.map((axis, i) => {
    const coords = getCoordinates(data[axis.key] || 1, i);
    return `${coords.x},${coords.y}`;
  }).join(' ');

  // Grid levels (20%, 40%, 60%, 80%, 100%)
  const gridLevels = [2, 4, 6, 8, 10];

  return (
    <div className="relative flex flex-col items-center select-none">
      <svg width={size} height={size} className="overflow-visible">
        {/* Background Grids */}
        {gridLevels.map((lvl) => {
          const gridPoints = axes.map((_, i) => {
            const coords = getCoordinates(lvl, i);
            return `${coords.x},${coords.y}`;
          }).join(' ');
          return (
            <polygon
              key={lvl}
              points={gridPoints}
              fill={lvl === 10 ? (isTea ? 'rgba(16, 40, 25, 0.5)' : 'rgba(44, 26, 17, 0.45)') : 'none'}
              stroke={gridStroke}
              strokeWidth="1"
              strokeDasharray={lvl % 4 === 0 ? undefined : '2,2'}
            />
          );
        })}

        {/* Axis Spokes */}
        {axes.map((_, i) => {
          const spokeEnd = getCoordinates(10, i);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={spokeEnd.x}
              y2={spokeEnd.y}
              stroke={gridStroke}
              strokeWidth="1.2"
            />
          );
        })}

        {/* Filled Data Polygon */}
        <polygon
          points={pointsString}
          fill={polygonFill}
          stroke={strokeColor}
          strokeWidth="2.5"
          className="transition-all duration-300 ease-out"
        />

        {/* Data Vertices */}
        {axes.map((axis, i) => {
          const val = data[axis.key] || 1;
          const coords = getCoordinates(val, i);
          return (
            <g key={axis.key}>
              <circle
                cx={coords.x}
                cy={coords.y}
                r={editable ? 6 : 4}
                className={`transition-all duration-200 ${
                  editable ? 'cursor-pointer hover:r-8' : ''
                }`}
                fill={pointFill}
                stroke={isTea ? '#0e2417' : '#140c08'}
                strokeWidth="2"
              />
            </g>
          );
        })}

        {/* Axis Labels */}
        {axes.map((axis, i) => {
          const labelCoords = getLabelCoordinates(i);
          const val = data[axis.key] || 1;
          return (
            <text
              key={axis.key}
              x={labelCoords.x}
              y={labelCoords.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-[11px] font-medium tracking-wide"
              fill={labelFill}
            >
              {axis.label} ({val})
            </text>
          );
        })}
      </svg>

      {editable && onChange && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-4 w-full">
          {axes.map((axis) => (
            <div
              key={axis.key}
              className={`border rounded-xl p-2.5 shadow-sm ${
                isTea
                  ? 'bg-[#122418] border-[#25462e]'
                  : 'bg-[#1c120c] border-[#3e2618]'
              }`}
            >
              <div
                className={`flex justify-between text-xs mb-1 font-medium ${
                  isTea ? 'text-[#a7f3d0]' : 'text-[#caa890]'
                }`}
              >
                <span>{axis.label}</span>
                <span className={`font-bold font-mono ${isTea ? 'text-[#34d399]' : 'text-[#f5be7e]'}`}>
                  {data[axis.key] || 1}/10
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={data[axis.key] || 1}
                onChange={(e) => onChange(axis.key, parseInt(e.target.value, 10))}
                className={`w-full h-1.5 rounded-lg cursor-pointer ${
                  isTea ? 'accent-[#34d399] bg-[#1a3824]' : 'accent-[#d48b46] bg-[#2a1a11]'
                }`}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
