import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TaxDetail } from '@/types/pajak';

interface Props {
  title: string;
  endpoint: string;
  color?: string; // Prop warna Hex dari sliceColors (Opsional)
}

export const TaxRevenueCard: React.FC<Props> = ({ title, endpoint, color = '#2563EB' }) => {
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

  // 1. Format Rupiah Utuh Penuh
  const formatFullRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID').format(val);
  };

  // 2. Format Singkatan Tanpa Pembulatan Ke Atas (Truncate 2 Digit Belakang Koma)
  const formatTruncatedRupiah = (val: number) => {
    if (val >= 1_000_000_000_000) {
      const truncated = Math.floor((val / 1_000_000_000_000) * 100) / 100;
      return `Rp ${truncated.toFixed(2)} T`;
    }
    if (val >= 1_000_000_000) {
      const truncated = Math.floor((val / 1_000_000_000) * 100) / 100;
      return `Rp ${truncated.toFixed(2)} M`;
    }
    if (val >= 1_000_000) {
      const truncated = Math.floor((val / 1_000_000) * 100) / 100;
      return `Rp ${truncated.toFixed(2)} Jt`;
    }
    return `Rp ${formatFullRupiah(val)}`;
  };

  const percentage = data && data.target > 0 ? Math.min(Math.round((data.realisasi / data.target) * 100), 100) : 0;

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between relative overflow-hidden">
      {/* Accent Line Kiri Kartu Mengikuti Prop Color */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-1.5"
        style={{ backgroundColor: color }}
      ></div>

      {loading ? (
        <div className="space-y-4 animate-pulse pl-2">
          <div className="h-4 bg-slate-100 rounded w-1/3"></div>
          <div className="h-7 bg-slate-100 rounded w-3/4"></div>
          <div className="h-3 bg-slate-100 rounded-full w-full"></div>
        </div>
      ) : (
        <div className="space-y-3 pl-2">
          {/* Header Card */}
          <div className="flex justify-between items-center border-b border-slate-50 pb-3">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-widest">
              {title}
            </span>
            {/* Badge Persentase Mengikuti Warna Color Palette */}
            <span 
              className="text-xs font-black px-2.5 py-1 rounded-lg text-white shadow-xs"
              style={{ backgroundColor: color }}
            >
              {percentage}%
            </span>
          </div>

          {/* Realisasi Main Number */}
          <div>
            <div className="text-xs font-semibold text-slate-400 mb-0.5">Realisasi Penerimaan</div>
            <div className="text-2xl font-black text-slate-900 tracking-tight tabular-nums" title={`Rp ${formatFullRupiah(data?.realisasi || 0)}`}>
              Rp {data ? formatFullRupiah(data.realisasi) : '0'}
            </div>
          </div>

          {/* Progress Bar Mengikuti Prop Color + Layer Shimmer */}
          <div className="space-y-1.5">
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden relative">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                style={{ 
                  width: `${percentage}%`,
                  backgroundColor: color 
                }}
              >
                {/* Layer Flash / Shimmer Bergerak */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full"></div>
              </div>
            </div>

            {/* Target & Keterangan Nominal */}
            <div className="flex justify-between items-center text-xs text-slate-400 font-medium pt-1">
              <span>
                Target: <strong className="text-slate-600 tabular-nums">Rp {data ? formatFullRupiah(data.target) : '0'}</strong>
              </span>
              <span 
                className="text-[11px] font-bold px-2 py-0.5 rounded border tabular-nums"
                style={{
                  backgroundColor: `${color}14`, // Soft transparent background
                  color: color,                   // Text color matching sliceColors
                  borderColor: `${color}40`,     // Border matching sliceColors
                }}
              >
                {data ? formatTruncatedRupiah(data.realisasi) : '0'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};