import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TaxDetail } from '@/types/pajak';

interface Props {
  title: string;
  endpoint: string;
  accentClass?: string;
}

export const TaxProgressCard: React.FC<Props> = ({ title, endpoint, accentClass = 'bg-blue-500' }) => {
  const [data, setData] = useState<TaxDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    axios.post<{ status: string; data: TaxDetail }>(endpoint)
      .then((res) => {
        if (isMounted) setData(res.data.data);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [endpoint]);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID').format(val);
  };

  const percentage = data && data.target > 0 
    ? Math.min(Math.round((data.realisasi / data.target) * 100), 100)
    : 0;

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 relative overflow-hidden flex flex-col justify-between transition-all duration-200 hover:shadow-md">
      {/* Accent Line Kiri */}
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${accentClass}`}></div>

      {loading ? (
        <div className="space-y-3 animate-pulse pl-2">
          <div className="h-6 bg-gray-100 rounded-md w-2/3"></div>
          <div className="h-2.5 bg-gray-100 rounded-full w-full"></div>
          <div className="h-3 bg-gray-100 rounded-md w-1/3"></div>
        </div>
      ) : (
        <div className="pl-2 space-y-3">
          {/* Header Nominal & Judul Pajak */}
          <div className="flex justify-between items-baseline gap-2">
            <h4 className="text-xl font-extrabold text-gray-900 tracking-tight tabular-nums">
              {data ? formatRupiah(data.realisasi) : '0'}
            </h4>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider shrink-0">
              {title}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full ${accentClass} transition-all duration-1000 ease-out`}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>

          {/* Footer Target & Persentase */}
          <div className="flex justify-between items-center text-xs font-semibold">
            <span className="text-gray-400 tabular-nums">
              {data ? formatRupiah(data.target) : '0'}
            </span>
            <span className="text-gray-700 font-extrabold bg-gray-100 px-2 py-0.5 rounded-md text-[11px]">
              {percentage}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
};