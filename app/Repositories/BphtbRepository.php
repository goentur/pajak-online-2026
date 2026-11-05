<?php

namespace App\Repositories;

use App\Services\ClientDataService;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class BphtbRepository extends ClientDataService
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
            ->select('bphtb')
            ->where('tahun', now()->year)
            ->orderByDesc('tgl')
            ->first();

        return $result ? $result->bphtb : 0;
    }

    protected function getRealisasiValue()
    {
        $result = DB::connection('sismiop')
            ->table('bphtb.sspd')
            ->selectRaw('sum(JML_SSPD_YG_DIBAYAR) total')
            ->where(DB::raw('extract(year from tgl_pembayaran_sspd)'), now()->year)
            ->first();

        return $result ? $result->total : 0;
    }
}
