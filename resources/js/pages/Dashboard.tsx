import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { TaxMeta } from '@/types/pajak';
import { TaxStatCard } from '@/Components/TaxStatCard';
import { TaxRevenueCard } from '@/Components/TaxRevenueCard';
import { TaxTargetPieChart } from '@/Components/TaxTargetPieChart';
import { QrisModal } from '@/Components/QrisModal'; // 1. Impor komponen modal

export default function Dashboard() {
  const [taxList, setTaxList] = useState<TaxMeta[]>([]);
  const [loadingList, setLoadingList] = useState<boolean>(true);
  
  // 2. State kontrol Modal QRIS
  const [isQrisModalOpen, setIsQrisModalOpen] = useState<boolean>(false);

  useEffect(() => {
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
      <Head title="Pajak Online" />

      {/* 3. Komponen Modal dipasang di luar layout utama */}
      <QrisModal
        isOpen={isQrisModalOpen}
        onClose={() => setIsQrisModalOpen(false)}
      />

      <div className="min-h-screen bg-gray-50 p-6 md:p-8 font-sans">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header Dashboard */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Pajak Online
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Pantau realisasi pendapatan daerah secara real-time dan terintegrasi
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* 4. Tombol Pemicu Modal QRIS */}
              <button
                onClick={() => setIsQrisModalOpen(true)}
                className="inline-flex cursor-pointer items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition active:scale-95"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
                QRIS
              </button>

              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                Sistem Online
              </span>
            </div>
          </div>

          {/* Rest of Dashboard code... */}
          {loadingList ? (
            <div className="p-12 text-center text-slate-400 animate-pulse font-medium">
              Menyiapkan widget realisasi...
            </div>
          ) : (
            <>
              {/* SECTION 1 */}
              <div className="space-y-3">
                <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest px-1">
                  Persentase Realisasi Pajak
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-8 gap-4">
                  {taxList
                    .filter((tax) => tax.persentase)
                    .map((tax, index) => (
                      <TaxStatCard
                        key={index}
                        title={tax.name}
                        endpoint={tax.endpoint}
                        color={tax.color}
                      />
                    ))}
                </div>
              </div>

              {/* SECTION 2 */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-8 sticky top-6">
                  <TaxTargetPieChart taxList={taxList} />
                </div>

                <div className="lg:col-span-4 space-y-4">
                  <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest px-1">
                    Rincian Realisasi Nominal
                  </h2>
                  
                  <div className="space-y-4 overflow-y-auto pr-1">
                    {taxList
                      .filter((tax) => tax.realisasi)
                      .map((tax, index) => (
                        <TaxRevenueCard
                          key={index}
                          title={tax.name}
                          endpoint={tax.endpoint}
                          color={tax.color}
                        />
                      ))}
                  </div>
                </div>
              </div>
            </>
          )}

        </div>
      </div>
    </>
  );
}