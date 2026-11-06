import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TaxDetail } from '@/types/pajak';

interface Props {
  title: string;
  endpoint: string;
  color?: string;
}

export const TaxStatCard: React.FC<Props> = ({ title, endpoint, color = '#2563EB' }) => {
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

  const percentage = data && data.persentase > 0 
    ? Math.min(data.persentase, 100)
    : 0;

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between min-h-[110px] relative overflow-hidden">
      {/* ACCENT LINE DI BAGIAN ATAS KARTU */}
      <div 
        className="absolute top-0 left-0 right-0 h-1"
        style={{ backgroundColor: color }}
      ></div>

      {loading ? (
        <div className="space-y-3 animate-pulse pt-1">
          <div className="h-3 bg-slate-100 rounded w-2/3"></div>
          <div className="flex justify-between items-center pt-1">
            <div className="h-7 bg-slate-100 rounded w-12"></div>
            <div className="w-8 h-8 rounded-full bg-slate-100"></div>
          </div>
        </div>
      ) : (
        <div className="pt-1 flex flex-col justify-between h-full">
          {/* 1. Header: Judul Pajak */}
          <div className="flex justify-between items-center gap-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider truncate" title={title}>
              {title}
            </span>
          </div>

          {/* 2. Middle: Angka Persentase & Mini Ring Circle */}
          <div className="my-2 flex items-center justify-between">
            <span className="text-2xl font-black text-slate-800 tracking-tight">
              {percentage}%
            </span>

            <div className="relative w-8 h-8 shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-100"
                  strokeWidth="4"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  stroke={color}
                  strokeDasharray={`${percentage}, 100`}
                  strokeWidth="4"
                  strokeLinecap="round"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};