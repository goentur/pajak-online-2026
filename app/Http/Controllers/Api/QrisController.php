<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Qris;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class QrisController extends Controller
{
    public function generate(Request $request, Qris $qrisService)
    {
        // Validasi simpel: hanya tab, nop (atau idBilling), dan tahun_pajak jika PBB
        $request->validate([
            'tab' => 'required|in:pbb,lainnya',
            'nop' => [
                'required',
                'string',
                Rule::when($request->input('tab') === 'pbb', ['max:24']),
                Rule::when($request->input('tab') !== 'pbb', ['min:16', 'max:17']),
            ],
            'tahun_pajak' => 'required_if:tab,pbb|nullable|string|size:4',
        ]);

        try {
            $tab = $request->input('tab');
            $inputNop = $request->input('nop');

            $qris = $qrisService->make();

            if ($tab === 'pbb') {
                // 1. Ambil 18 digit murni NOP (hilangkan . dan -)
                $cleanNop = preg_replace('/[^0-9]/', '', $inputNop);

                // 2. Ambil 2 digit terakhir tahun pajak (contoh: 2025 -> 25)
                $tahun = $request->input('tahun_pajak');
                $shortYear = substr($tahun, -2);

                // 3. Gabungkan NOP + 2 Digit Tahun (20 Digit ID Billing PBB)
                $idBilling = $cleanNop . $shortYear;

                // Panggil method pbb() di Service
                $qrisResponse = $qris->pbb($idBilling)->send();
            } else {
                // Untuk Pajak Lainnya, langsung gunakan ID Billing yang dimasukkan
                $idBilling = $inputNop;

                // Panggil method etax() di Service (otomatis diberi prefix '70' oleh service)
                $qrisResponse = $qris->etax($idBilling)->send();
            }

            $qrDataRaw = data_get($qrisResponse, 'data');
            return response()->json([
                'status' => 'success',
                'data' => [
                    'qr_string' => is_string($qrDataRaw) ? $qrDataRaw : null,
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('QRIS Generation Error: ' . $e->getMessage());

            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage() ?: 'Gagal membuat QRIS. Silakan periksa NOP/ID Billing Anda.',
            ], 400);
        }
    }
}
