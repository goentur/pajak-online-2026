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
    /**
     * Salt rahasia untuk memperkuat hashing
     */
    private string $salt = 'pajak_pekalongan_secret_salt_2026';

    public function __construct() {}

    /**
     * Helper untuk menghasilkan Hash Key berbasis SHA-256 dengan prefix tx_
     */
    private function generateHashKey(string $key): string
    {
        $hash = substr(hash('sha256', $this->salt . '_' . $key), 0, 32);
        return $hash;
    }

    /**
     * Konfigurasi Master Pajak dengan Hashed Key (SHA-256 + tx_)
     */
    public function getServicesConfig(): array
    {
        $rawItems = [
            'pbb' => [
                'name' => 'PBB',
                'repository' => PbbRepository::class,
                'persentase' => true,
                'target' => true,
                'realisasi' => true,
            ],
            'bphtb' => [
                'name' => 'BPHTB',
                'repository' => BphtbRepository::class,
                'persentase' => true,
                'target' => true,
                'realisasi' => true,
            ],
            'pbjt' => [
                'name' => 'PBJT',
                'repository' => PbjtRepository::class,
                'persentase' => true,
                'target' => true,
                'realisasi' => true,
            ],
            'hotel' => [
                'name' => 'HOTEL',
                'repository' => HotelRepository::class,
                'persentase' => false,
                'target' => true,
                'realisasi' => true,
            ],
            'restoran' => [
                'name' => 'RESTORAN',
                'repository' => RestoranRepository::class,
                'persentase' => false,
                'target' => true,
                'realisasi' => true,
            ],
            'hiburan' => [
                'name' => 'HIBURAN',
                'repository' => HiburanRepository::class,
                'persentase' => false,
                'target' => true,
                'realisasi' => true,
            ],
            'ppj' => [
                'name' => 'PPJ',
                'repository' => PpjRepository::class,
                'persentase' => false,
                'target' => true,
                'realisasi' => true,
            ],
            'parkir' => [
                'name' => 'PARKIR',
                'repository' => ParkirRepository::class,
                'persentase' => false,
                'target' => true,
                'realisasi' => true,
            ],
            'reklame' => [
                'name' => 'REKLAME',
                'repository' => ReklameRepository::class,
                'persentase' => true,
                'target' => true,
                'realisasi' => true,
            ],
            'air_tanah' => [
                'name' => 'AIR TANAH',
                'repository' => AirTanahRepository::class,
                'persentase' => true,
                'target' => true,
                'realisasi' => true,
            ],
            'retribusi' => [
                'name' => 'RETRIBUSI',
                'repository' => RetribusiRepository::class,
                'persentase' => true,
                'target' => true,
                'realisasi' => true,
            ],
            'opsen_pkb' => [
                'name' => 'OPS PKB',
                'repository' => OpsenPkbRepository::class,
                'persentase' => true,
                'target' => true,
                'realisasi' => true,
            ],
            'opsen_bbnkb' => [
                'name' => 'OPS BBNKB',
                'repository' => OpsenBbnkbRepository::class,
                'persentase' => true,
                'target' => true,
                'realisasi' => true,
            ],
        ];

        $hashedConfig = [];
        foreach ($rawItems as $key => $config) {
            $hashKey = $this->generateHashKey($key);
            $hashedConfig[$hashKey] = $config;
        }

        return $hashedConfig;
    }

    /**
     * Mengambil daftar metadata jenis pajak (Ringan, Tanpa Eksekusi Query DB)
     */
    public function getMetadataList(): array
    {
        $list = [];

        foreach ($this->getServicesConfig() as $hashKey => $config) {
            $list[] = [
                'name' => $config['name'],
                'persentase' => $config['persentase'],
                'realisasi' => $config['realisasi'],
                'target' => $config['target'],
                'endpoint' => url("/api/data/{$hashKey}"),
            ];
        }

        return $list;
    }

    /**
     * Mengambil data spesifik berdasarkan hash key (tx_xxx)
     * Menggunakan Lazy Loading agar HANYA repository terkait yang di-instansiasi
     */
    public function getDataByHash(string $hashKey): ?array
    {
        $configs = $this->getServicesConfig();

        if (!isset($configs[$hashKey])) {
            return null;
        }

        $config = $configs[$hashKey];

        // Lazy Loading via Laravel Container
        $repo = app()->make($config['repository']);

        return [
            'name' => $config['name'],
            'persentase' => $config['persentase'] ? $repo->getPersenRealisasi() : 0,
            'target' => $config['target'] ? $repo->getTarget() : 0,
            'realisasi' => $config['realisasi'] ? $repo->getRealisasi() : 0,
        ];
    }
}
