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

    public function list(): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'data'   => $this->dataService->getMetadataList()
        ]);
    }

    public function show(string $jenis): JsonResponse
    {
        $data = $this->dataService->getDataByHash($jenis);
        if (!$data) {
            return response()->json([
                'status'  => 'error',
                'message' => "Jenis pajak tidak ditemukan."
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data'   => $data
        ]);
    }
}
