import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TaxDetail } from '@/types/pajak';

interface Props {
  title: string;
  endpoint: string;
  colorClass?: string;
}

export const TaxCircleCard: React.FC<Props> = ({ title, endpoint, colorClass = 'text-blue-500' }) => {
  const [data, setData] = useState<TaxDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    axios.post<{ status: string; data: TaxDetail }>(endpoint)
      .then((res) => {
        if (isMounted) setData(res.data.data);
      })
      .catch(() => {
        if (isMounted) setError(true);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [endpoint]);

  const percentage = data && data.target > 0 
    ? Math.min(data.persentase , 100)
    : 0;

  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col items-center justify-between min-w-30 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
      {/* Title dengan Style Uppercase & Font Clean */}
      <span className="text-[16px] font-bold text-gray-600 mt-3 mb-4 uppercase text-center truncate max-w-full">
        {title}
      </span>
      
      {loading ? (
        <div className="w-30 h-30 rounded-full border-3 border-gray-100 border-t-blue-500 animate-spin my-2"></div>
      ) : error ? (
        <div className="w-30 h-30 rounded-full bg-red-50 flex items-center justify-center text-red-500 text-[10px] font-semibold my-2">
          Error
        </div>
      ) : (
        <div className="relative w-30 h-30 flex items-center justify-center my-2">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 90 90">
            <circle
              cx="45"
              cy="45"
              r={radius}
              className="stroke-gray-100"
              strokeWidth="3"
              fill="transparent"
            />
            <circle
              cx="45"
              cy="45"
              r={radius}
              className={`stroke-current ${colorClass} transition-all duration-1000 ease-out`}
              strokeWidth="3"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          {/* Typo Angka Persentase */}
          <span className="absolute text-[22px] font-medium text-gray-600">
            {percentage}%
          </span>
        </div>
      )}
    </div>
  );
};