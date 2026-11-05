<?php

namespace App\Repositories;

use App\Constants\JenisPajak;
use App\Repositories\Concerns\Simpatda;
use App\Services\ClientDataService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class OpsenBbnkbRepository extends ClientDataService
{
    use Simpatda;

    public const ID_JENIS_OBJEK = [JenisPajak::BBNKB];

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
            $total = DB::connection('simpatda')
                ->table('t_opsen')
                ->whereYear('tgl_transaksi', now()->year)
                ->selectRaw('COALESCE(SUM(opsen_bbnkb + denda_opsen_bbnkb), 0) as total')
                ->value('total');

            return $total ? $total : 0;
        });
    }

    /**
     * Mendapatkan value bulanan dari target sesuai jenis pajak.
     *
     * @return int|mixed
     */
    public function getRealisasiBulanan()
    {
        return Cache::remember(__CLASS__ . __FUNCTION__, now()->addMinutes(), function () {
            return null;
        });
    }
}
