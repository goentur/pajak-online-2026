import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { TaxMeta } from '@/types/pajak';
import { TaxCircleCard } from '@/Components/TaxCircleCard';
import { TaxProgressCard } from '@/Components/TaxProgressCard';

// Variasi warna border & progress bar agar persis seperti gambar
const colorPalette = [
  { circle: 'text-blue-500', bar: 'bg-blue-500' },
  { circle: 'text-purple-500', bar: 'bg-purple-500' },
  { circle: 'text-indigo-500', bar: 'bg-indigo-500' },
  { circle: 'text-teal-500', bar: 'bg-teal-500' },
  { circle: 'text-cyan-500', bar: 'bg-cyan-500' },
  { circle: 'text-emerald-500', bar: 'bg-emerald-500' },
  { circle: 'text-pink-500', bar: 'bg-pink-500' },
  { circle: 'text-violet-500', bar: 'bg-violet-500' },
];

export default function Dashboard() {
  const [taxList, setTaxList] = useState<TaxMeta[]>([]);
  const [loadingList, setLoadingList] = useState<boolean>(true);

  useEffect(() => {
    // Ambil list metadata hash key tx_...
    axios.post<{ status: string; data: TaxMeta[] }>('/api/list')
      .then((res) => {
        setTaxList(res.data.data);
      })
      .catch((err) => {
        console.error('Error fetching tax list:', err);
      })
      .finally(() => {
        setLoadingList(false);
      });
  }, []);

  return (
    <>
      <Head title="Dashboard Realisasi Pajak" />

      <div className="min-h-screen bg-gray-50 p-6 font-sans">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Section Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Target Pajak dan Retribusi</h1>
              <p className="text-sm text-gray-500">Realisasi Penerimaan Pajak Daerah</p>
            </div>
          </div>

          {loadingList ? (
            <div className="p-8 text-center text-gray-400 animate-pulse">
              Memuat konfigurasi widget...
            </div>
          ) : (
            <>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                  {taxList
                    .filter((tax) => tax.persentase)
                    .map((tax, index) => {
                      const palette = colorPalette[index % colorPalette.length];
                      return (
                        <TaxCircleCard
                          key={index}
                          title={tax.name}
                          endpoint={tax.endpoint}
                          colorClass={palette.circle}
                        />
                      );
                    })}
                </div>

              {/* SECTION 2: GRID UTAMA SISI KANAN (Progress Bar Cards) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {taxList.map((tax, index) => {
                  const palette = colorPalette[index % colorPalette.length];
                  return (
                    <TaxProgressCard
                      key={tax.hash_key}
                      title={tax.name}
                      endpoint={tax.endpoint}
                      accentClass={palette.bar}
                    />
                  );
                })}
              </div>
            </>
          )}

        </div>
      </div>
    </>
  );
}