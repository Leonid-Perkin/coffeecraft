import React from 'react';

interface RadarChartProps {
  data: {
    acidity: number; // 1-10
    sweetness: number;
    bitterness: number;
    body: number;
    aftertaste: number;
    clarity: number;
  };
  size?: number;
  editable?: boolean;
  onChange?: (key: keyof RadarChartProps['data'], val: number) => void;
}

const AXES: { key: keyof RadarChartProps['data']; label: string }[] = [
  { key: 'acidity', label: 'Кислотность' },
  { key: 'sweetness', label: 'Сладость' },
  { key: 'clarity', label: 'Чистота' },
  { key: 'aftertaste', label: 'Послевкусие' },
  { key: 'body', label: 'Тело' },
  { key: 'bitterness', label: 'Горечь' },
];

export const RadarChart: React.FC<RadarChartProps> = ({
  data,
  size = 280,
  editable = false,
  onChange,
}) => {
  const center = size / 2;
  const radius = center * 0.70;
  const totalAxes = AXES.length;

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
  const pointsString = AXES.map((axis, i) => {
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
          const gridPoints = AXES.map((_, i) => {
            const coords = getCoordinates(lvl, i);
            return `${coords.x},${coords.y}`;
          }).join(' ');
          return (
            <polygon
              key={lvl}
              points={gridPoints}
              fill={lvl === 10 ? 'rgba(44, 26, 17, 0.45)' : 'none'}
              stroke="rgba(212, 139, 70, 0.25)"
              strokeWidth="1"
              strokeDasharray={lvl % 4 === 0 ? undefined : '2,2'}
            />
          );
        })}

        {/* Axis Spokes */}
        {AXES.map((_, i) => {
          const spokeEnd = getCoordinates(10, i);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={spokeEnd.x}
              y2={spokeEnd.y}
              stroke="rgba(212, 139, 70, 0.35)"
              strokeWidth="1.2"
            />
          );
        })}

        {/* Filled Data Polygon */}
        <polygon
          points={pointsString}
          fill="rgba(212, 139, 70, 0.38)"
          stroke="#f5be7e"
          strokeWidth="2.5"
          className="transition-all duration-300 ease-out"
        />

        {/* Data Vertices */}
        {AXES.map((axis, i) => {
          const val = data[axis.key] || 1;
          const coords = getCoordinates(val, i);
          return (
            <g key={axis.key}>
              <circle
                cx={coords.x}
                cy={coords.y}
                r={editable ? 6 : 4}
                className={`transition-all duration-200 ${
                  editable ? 'cursor-pointer hover:r-8 fill-[#f5be7e]' : 'fill-[#d48b46]'
                }`}
                stroke="#140c08"
                strokeWidth="2"
              />
            </g>
          );
        })}

        {/* Axis Labels */}
        {AXES.map((axis, i) => {
          const labelCoords = getLabelCoordinates(i);
          const val = data[axis.key];
          return (
            <text
              key={axis.key}
              x={labelCoords.x}
              y={labelCoords.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-[11px] font-medium fill-[#eedbc5] tracking-wide"
            >
              {axis.label} ({val})
            </text>
          );
        })}
      </svg>

      {editable && onChange && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-4 w-full">
          {AXES.map((axis) => (
            <div key={axis.key} className="bg-[#1c120c] border border-[#3e2618] rounded-xl p-2.5 shadow-sm">
              <div className="flex justify-between text-xs text-[#caa890] mb-1 font-medium">
                <span>{axis.label}</span>
                <span className="font-bold text-[#f5be7e] font-mono">{data[axis.key]}/10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={data[axis.key]}
                onChange={(e) => onChange(axis.key, parseInt(e.target.value, 10))}
                className="w-full accent-[#d48b46] h-1.5 bg-[#2a1a11] rounded-lg cursor-pointer"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
