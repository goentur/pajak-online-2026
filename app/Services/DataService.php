<?php

namespace App\Services;

use App\Repositories\AirTanahRepository;
use App\Repositories\BphtbRepository;
use App\Repositories\HiburanRepository;
use App\Repositories\HotelRepository;
use App\Repositories\OpsenBbnkbRepository;
use App\Repositories\OpsenPkbRepository;
use App\Repositories\ParkirRepository;
use App\Repositories\PbbRepository;
use App\Repositories\PbjtRepository;
use App\Repositories\PpjRepository;
use App\Repositories\ReklameRepository;
use App\Repositories\RestoranRepository;
use App\Repositories\RetribusiRepository;

class DataService
{
    public function __construct(
        protected PbbRepository $pbbRepository,
        protected BphtbRepository $bphtbRepository,
        protected PbjtRepository $pbjtRepository,
        protected HotelRepository $hotelRepository,
        protected RestoranRepository $restoranRepository,
        protected HiburanRepository $hiburanRepository,
        protected PpjRepository $ppjRepository,
        protected ParkirRepository $parkirRepository,
        protected ReklameRepository $reklameRepository,
        protected AirTanahRepository $airTanahRepository,
        protected RetribusiRepository $retribusiRepository,
        protected OpsenPkbRepository $opsenPkbRepository,
        protected OpsenBbnkbRepository $opsenBbnkbRepository,
    ) {}

    /**
     * Mengambil daftar layanan beserta instansi repository & konfigurasinya
     */
    public function getServices(): array
    {
        return [
            [
                'key' => 'pbb',
                'name' => 'PBB',
                'repository' => $this->pbbRepository,
                'persentase' => true,
                'target' => true,
                'realisasi' => true,
                'target_realisasi_pajak' => true,
            ],
            [
                'key' => 'bphtb',
                'name' => 'BPHTB',
                'repository' => $this->bphtbRepository,
                'persentase' => true,
                'target' => true,
                'realisasi' => true,
                'target_realisasi_pajak' => true,
            ],
            [
                'key' => 'pbjt',
                'name' => 'PBJT',
                'repository' => $this->pbjtRepository,
                'persentase' => true,
                'target' => false,
                'realisasi' => true,
                'target_realisasi_pajak' => false,
            ],
            [
                'key' => 'hotel',
                'name' => 'HOTEL',
                'repository' => $this->hotelRepository,
                'persentase' => false,
                'target' => true,
                'realisasi' => true,
                'target_realisasi_pajak' => true,
            ],
            [
                'key' => 'restoran',
                'name' => 'RESTORAN',
                'repository' => $this->restoranRepository,
                'persentase' => false,
                'target' => true,
                'realisasi' => true,
                'target_realisasi_pajak' => true,
            ],
            [
                'key' => 'hiburan',
                'name' => 'HIBURAN',
                'repository' => $this->hiburanRepository,
                'persentase' => false,
                'target' => true,
                'realisasi' => true,
                'target_realisasi_pajak' => true,
            ],
            [
                'key' => 'ppj',
                'name' => 'PPJ',
                'repository' => $this->ppjRepository,
                'persentase' => false,
                'target' => true,
                'realisasi' => true,
                'target_realisasi_pajak' => true,
            ],
            [
                'key' => 'parkir',
                'name' => 'PARKIR',
                'repository' => $this->parkirRepository,
                'persentase' => false,
                'target' => true,
                'realisasi' => true,
                'target_realisasi_pajak' => true,
            ],
            [
                'key' => 'reklame',
                'name' => 'REKLAME',
                'repository' => $this->reklameRepository,
                'persentase' => true,
                'target' => true,
                'realisasi' => true,
                'target_realisasi_pajak' => true,
            ],
            [
                'key' => 'air-tanah',
                'name' => 'AIR TANAH',
                'repository' => $this->airTanahRepository,
                'persentase' => true,
                'target' => true,
                'realisasi' => true,
                'target_realisasi_pajak' => true,
            ],
            [
                'key' => 'retribusi',
                'name' => 'RETRIBUSI',
                'repository' => $this->retribusiRepository,
                'persentase' => true,
                'target' => true,
                'realisasi' => true,
                'target_realisasi_pajak' => false,
            ],
            [
                'key' => 'opsen-pkb',
                'name' => 'OPS PKB',
                'repository' => $this->opsenPkbRepository,
                'persentase' => true,
                'target' => true,
                'realisasi' => true,
                'target_realisasi_pajak' => false,
            ],
            [
                'key' => 'opsen-bbnkb',
                'name' => 'OPS BBNKB',
                'repository' => $this->opsenBbnkbRepository,
                'persentase' => true,
                'target' => true,
                'realisasi' => true,
                'target_realisasi_pajak' => false,
            ],
        ];
    }

    /**
     * Ambil data spesifik berdasarkan key jenis pajak secara dinamis
     */
    public function getDataByJenis(string $jenis): ?array
    {
        $services = collect($this->getServices());
        $service = $services->firstWhere('key', strtolower($jenis));

        if (!$service) {
            return null;
        }

        /** @var \App\Services\Contracts\DataServiceInterface $repo */
        $repo = $service['repository'];

        return [
            'name'       => $service['name'],
            'target'     => $service['target'] ? $repo->getTarget() : 0,
            'realisasi'  => $service['realisasi'] ? $repo->getRealisasi() : 0,
            'flags'      => [
                'persentase'             => $service['persentase'],
                'target_realisasi_pajak' => $service['target_realisasi_pajak'],
            ]
        ];
    }
}
