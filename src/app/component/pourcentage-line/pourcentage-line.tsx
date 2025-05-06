import React from 'react';

interface PercentageLineProps {
  percentage: number; // 0 to 100
}

const PercentageLine: React.FC<PercentageLineProps> = ({ percentage}) => {
  const clamped = Math.max(0, Math.min(100, percentage));

  return (
    <div className="w-full">
      {/* Labels */}
      <div className="flex justify-between text-sm mb-1">
        <span className="text-green-600">{clamped}%</span>
        <span className="text-red-600">{(100 - clamped).toFixed(1)}%</span>
      </div>

      {/* Bar */}
      <div className={`flex h-[10px] w-full rounded-full overflow-hidden border border-gray-300`}>
        <div
          className="bg-green-600 transition-all duration-300"
          style={{ width: `${clamped}%` }}
        />
        <div
          className="bg-red-500 transition-all duration-300"
          style={{ width: `${(100 - clamped).toFixed(1)}%` }}
        />
      </div>
    </div>
  );
};

export default PercentageLine;
