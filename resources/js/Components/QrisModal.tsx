import React, { useState } from 'react';
import axios from 'axios';

interface QrisModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface QrisResponse {
  qr_string: string;
  expired_at: string;
  referensi_id: string;
}

export const QrisModal: React.FC<QrisModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'pbb' | 'lainnya'>('pbb');

  // State Form
  const [nop, setNop] = useState<string>('');
  const [tahunPajak, setTahunPajak] = useState<string>(new Date().getFullYear().toString());
  const [idBilling, setIdBilling] = useState<string>('');

  // State UI & Response
  const [loading, setLoading] = useState<boolean>(false);
  const [qrisData, setQrisData] = useState<QrisResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Format NOP otomatis: XX.XX.XXX.XXX.XXX-XXXX.X
  const formatNOP = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 18);
    let formatted = digits;
    if (digits.length > 2) formatted = `${digits.slice(0, 2)}.${digits.slice(2)}`;
    if (digits.length > 4) formatted = `${formatted.slice(0, 5)}.${digits.slice(4)}`;
    if (digits.length > 7) formatted = `${formatted.slice(0, 9)}.${digits.slice(7)}`;
    if (digits.length > 10) formatted = `${formatted.slice(0, 13)}.${digits.slice(10)}`;
    if (digits.length > 13) formatted = `${formatted.slice(0, 17)}-${digits.slice(13)}`;
    if (digits.length > 17) formatted = `${formatted.slice(0, 22)}.${digits.slice(17)}`;
    return formatted;
  };

  const handleTabChange = (tab: 'pbb' | 'lainnya') => {
    setActiveTab(tab);
    setNop('');
    setIdBilling('');
    setErrorMessage(null);
  };

  const handleGenerateQris = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    const payload = {
      tab: activeTab,
      nop: activeTab === 'pbb' ? nop : idBilling,
      tahun_pajak: activeTab === 'pbb' ? tahunPajak : undefined,
    };

    axios.post<{ status: string; data: QrisResponse }>('/api/qris/generate', payload)
      .then((res) => {
        setQrisData(res.data.data);
      })
      .catch((err) => {
        setErrorMessage(err.response?.data?.message || 'Gagal membuat kode QRIS. Silakan periksa kembali data Anda.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // 1. Fungsi khusus untuk kembali ke Form (Clear QRIS tanpa menutup Modal)
  const backToForm = () => {
    setQrisData(null);
    setErrorMessage(null);
  };

  // 2. Fungsi untuk reset penuh & tutup Modal
  const handleCloseModal = () => {
    setQrisData(null);
    setNop('');
    setIdBilling('');
    setErrorMessage(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all">
        
        {/* Header Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            {/* Tombol Panah Kembali jika sedang di tampilan QRIS */}
            {qrisData ? (
              <button
                type="button"
                onClick={backToForm}
                className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition mr-1"
                title="Kembali ke Form"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            ) : (
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
              </div>
            )}
            <h3 className="text-base font-bold text-slate-800">
              {qrisData ? 'Kode Pembayaran QRIS' : 'Generate QRIS Pembayaran'}
            </h3>
          </div>
          
          <button
            onClick={handleCloseModal}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition"
            title="Tutup Modal"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        {!qrisData && (
          <div className="flex bg-slate-100/80 p-1.5 mx-6 mt-4 rounded-2xl border border-slate-200/60">
            <button
              type="button"
              onClick={() => handleTabChange('pbb')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
                activeTab === 'pbb'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              PBB-P2
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('lainnya')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
                activeTab === 'lainnya'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Pajak Lainnya / Retribusi
            </button>
          </div>
        )}

        {/* Body Modal */}
        <div className="p-6">
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl font-medium">
              {errorMessage}
            </div>
          )}

          {!qrisData ? (
            <form onSubmit={handleGenerateQris} className="space-y-4">
              
              {/* TAB 1: PBB-P2 */}
              {activeTab === 'pbb' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      NOP PBB (18 Digit)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="33.75.000.000.000-0000.0"
                      value={nop}
                      onChange={(e) => setNop(formatNOP(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition font-mono tracking-wide"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Tahun Pajak
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="2026"
                      value={tahunPajak}
                      onChange={(e) => setTahunPajak(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                    />
                  </div>
                </>
              )}

              {/* TAB 2: PAJAK LAINNYA */}
              {activeTab === 'lainnya' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ID Billing / Kode Billing
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Masukkan ID Billing / Kode Bayar"
                    value={idBilling}
                    onChange={(e) => setIdBilling(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition font-mono"
                  />
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Memproses QRIS...
                    </>
                  ) : (
                    `Generate QRIS ${activeTab === 'pbb' ? 'PBB' : 'Pajak'}`
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* Iframe Tampilan Halaman QRIS Bank Jateng */
            <div className="text-center space-y-4">
              <div className="relative w-full h-[460px] sm:h-[520px] overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-inner flex justify-center">
                <iframe
                  src={qrisData.qr_string}
                  title="QRIS Bank Jateng"
                  className="border-0 absolute top-2 sm:top-0 w-[550px] sm:w-full h-[650px] sm:h-full transform scale-[0.65] sm:scale-100 origin-top"
                />
              </div>
              {/* OPSI TOMBOL AKSI */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={backToForm}
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Kembali ke Form
                </button>

                <button
                  onClick={handleCloseModal}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition shadow-sm"
                >
                  Selesai / Tutup
                </button>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
};