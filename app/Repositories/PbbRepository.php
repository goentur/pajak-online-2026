<?php

namespace App\Repositories;

use App\Services\ClientDataService;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class PbbRepository extends ClientDataService
{
    /**
     * Mendapatkan value dari target sesuai jenis pajak.
     *
     * @return int|mixed
     */
    public function getTarget()
    {
        return Cache::remember(__CLASS__ . __FUNCTION__, now()->addMinutes(), function () {
            return $this->getTargetValue();
        });
    }

    /**
     * Mendapatkan value dari target sesuai jenis pajak.
     *
     * @return int|mixed
     */
    public function getRealisasi()
    {
        return Cache::remember(__CLASS__ . __FUNCTION__, now()->addMinutes(), function () {
            return $this->getRealisasiValue();
        });
    }

    protected function getTargetValue()
    {
        $result = DB::connection('sismiop')
            ->table('pbb.target')
            ->select('pbb')
            ->where('tahun', now()->year)
            ->orderByDesc('tgl')
            ->first();

        return $result ? $result->pbb : 0;
    }

    protected function getRealisasiValue()
    {
        $result = DB::connection('sismiop')
            ->table('pbb.pembayaran_sppt')
            ->selectRaw('sum(jml_sppt_yg_dibayar - denda_sppt) total')
            ->where(DB::raw('extract(year from tgl_pembayaran_sppt)'), now()->year)
            ->first();

        return $result ? $result->total : 0;
    }
}
