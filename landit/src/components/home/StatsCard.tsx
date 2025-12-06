import React from "react";
import {StatsCardProps} from '../../types/index'

const StatsCard: React.FC<StatsCardProps> = ({ value, label, sublabel }) => {
  return (
    <div className="text-center">
      <div className="text-5xl md:text-6xl font-bold text-purple-600 dark:text-black mb-2">
        {value}
      </div>
      <div className="text-lg font-semibold text-gray-900 mb-1">
        {label}
      </div>
      {sublabel && (
        <div className="text-sm text-gray-700">
          {sublabel}
        </div>
      )}
    </div>
  );
};

export default StatsCard;
