import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TaxMeta, TaxDetail } from '@/types/pajak';

interface Props {
  taxList: TaxMeta[];
}

interface TargetItem {
  name: string;
  target: number;
  percentage: number;
  color: string;
}

export const TaxTargetPieChart: React.FC<Props> = ({ taxList }) => {
  const [items, setItems] = useState<TargetItem[]>([]);
  const [totalTarget, setTotalTarget] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const requests = taxList
      .filter((tax) => tax.target)
      .map((tax) =>
        axios
          .post<{ status: string; data: TaxDetail }>(tax.endpoint)
          .then((res) => {
            const rawTarget = res.data?.data?.target;
            const parsedTarget = typeof rawTarget === 'number' 
              ? rawTarget 
              : parseFloat(String(rawTarget || 0).replace(/[^0-9.]/g, '')) || 0;

            return {
              name: tax.name,
              target: parsedTarget,
              color: tax.color || '#2563EB',
            };
          })
          .catch(() => ({ 
            name: tax.name, 
            target: 0, 
            color: tax.color || '#2563EB' 
          }))
      );

    Promise.all(requests).then((results) => {
      if (!isMounted) return;

      const validItems = results.filter((item) => item.target > 0);
      const sum = validItems.reduce((acc, curr) => acc + Number(curr.target), 0);

      const calculatedItems: TargetItem[] = validItems.map((item) => ({
        name: item.name,
        target: item.target,
        percentage: sum > 0 ? (item.target / sum) * 100 : 0,
        color: item.color,
      }));

      setTotalTarget(sum);
      setItems(calculatedItems);
      setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [taxList]);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const formatShortRupiah = (val: number) => {
    if (val >= 1_000_000_000_000) return `Rp ${(val / 1_000_000_000_000).toFixed(2)} T`;
    if (val >= 1_000_000_000) return `Rp ${(val / 1_000_000_000).toFixed(2)} M`;
    if (val >= 1_000_000) return `Rp ${(val / 1_000_000).toFixed(0)} Jt`;
    return formatRupiah(val);
  };

  let currentDegree = 0;
  const conicStops = items.map((item) => {
    const deg = (item.percentage / 100) * 360;
    const stop = `${item.color} ${currentDegree}deg ${currentDegree + deg}deg`;
    currentDegree += deg;
    return stop;
  });

  const donutStyle = {
    background: conicStops.length > 0 ? `conic-gradient(${conicStops.join(', ')})` : '#E2E8F0',
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm transition-all">
      {/* Header Judul */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
          Target Pajak dan Retribusi Daerah
        </h2>
        <p className="text-sm font-semibold text-slate-400 mt-1">
          Alokasi Keseluruhan Target Penerimaan Tahun 2026
        </p>
      </div>

      {loading ? (
        /* SKELETON LOADING UNTUK TAX TARGET PIE CHART */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-pulse">
          {/* Skeleton Donut Left */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <div className="w-56 h-56 md:w-64 md:h-64 rounded-full border-[20px] border-slate-100 flex items-center justify-center">
              <div className="h-6 bg-slate-100 rounded w-24"></div>
            </div>
          </div>
          {/* Skeleton Grid Right */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="p-3 rounded-2xl border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3.5 h-3.5 rounded-full bg-slate-100 shrink-0"></div>
                    <div className="space-y-1">
                      <div className="h-3 bg-slate-100 rounded w-16"></div>
                      <div className="h-2 bg-slate-100 rounded w-8"></div>
                    </div>
                  </div>
                  <div className="h-4 bg-slate-100 rounded w-16"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : items.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-slate-400 font-medium">
          Tidak ada data target.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* KOLOM KIRI: DONUT CHART */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="relative w-56 h-56 md:w-64 md:h-64 flex items-center justify-center">
              
              {/* Outer Donut Circle */}
              <div
                className="w-full h-full rounded-full transition-all duration-300 shadow-inner"
                style={donutStyle}
              ></div>

              {/* Inner Hole Circle */}
              <div className="absolute inset-5 bg-white rounded-full shadow-sm flex flex-col items-center justify-center text-center p-4">
                {activeIndex !== null ? (
                  <>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      {items[activeIndex].name}
                    </span>
                    <span className="text-base font-extrabold text-slate-900 tracking-tight mt-0.5">
                      {formatShortRupiah(items[activeIndex].target)}
                    </span>
                    <span 
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full mt-1"
                      style={{
                        backgroundColor: `${items[activeIndex].color}14`,
                        color: items[activeIndex].color,
                      }}
                    >
                      {items[activeIndex].percentage.toFixed(1)}% Dari Total
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      TOTAL TARGET
                    </span>
                    <span className="text-xl font-black text-slate-900 tracking-tight mt-0.5">
                      {formatShortRupiah(totalTarget)}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400 mt-0.5">
                      {items.length} Jenis Pajak
                    </span>
                  </>
                )}
              </div>

            </div>
          </div>

          {/* KOLOM KANAN: Grid Legend Detail Target */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto pr-1">
              {items.map((item, idx) => (
                <div
                  key={item.name}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onMouseLeave={() => setActiveIndex(null)}
                  className={`p-3 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between ${
                    activeIndex === idx
                      ? 'bg-slate-50 border-slate-300 shadow-sm translate-x-1'
                      : 'bg-white border-slate-100 hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-3.5 h-3.5 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    ></span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        {item.name}
                      </h4>
                      <p className="text-[11px] font-semibold text-slate-500 mt-0.5">
                        {item.percentage.toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-black text-slate-900 tabular-nums">
                      {formatShortRupiah(item.target)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
};