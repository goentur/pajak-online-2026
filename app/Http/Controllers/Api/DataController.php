<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\DataService;
use Illuminate\Http\JsonResponse;

class DataController extends Controller
{
    public function __construct(
        protected DataService $dataService
    ) {}

    /**
     * Menampilkan data pajak spesifik berdasarkan URL parameter {jenis}
     */
    public function show(string $jenis): JsonResponse
    {
        $data = $this->dataService->getDataByJenis($jenis);
        if (!$data) {
            return response()->json([
                'status'  => 'error',
                'message' => "Jenis pajak '{$jenis}' tidak ditemukan."
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data'   => $data
        ]);
    }
}
