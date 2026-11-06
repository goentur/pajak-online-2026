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
                'color' => '#2563EB',
                'repository' => PbbRepository::class,
                'persentase' => true,
                'target' => true,
                'realisasi' => true,
            ],
            'bphtb' => [
                'name' => 'BPHTB',
                'color' => '#7C3AED',
                'repository' => BphtbRepository::class,
                'persentase' => true,
                'target' => true,
                'realisasi' => true,
            ],
            'pbjt' => [
                'name' => 'PBJT',
                'color' => '#4F46E5',
                'repository' => PbjtRepository::class,
                'persentase' => true,
                'target' => false,
                'realisasi' => true,
            ],
            'hotel' => [
                'name' => 'HOTEL',
                'color' => '#059669',
                'repository' => HotelRepository::class,
                'persentase' => false,
                'target' => true,
                'realisasi' => true,
            ],
            'restoran' => [
                'name' => 'RESTORAN',
                'color' => '#0D9488',
                'repository' => RestoranRepository::class,
                'persentase' => false,
                'target' => true,
                'realisasi' => true,
            ],
            'hiburan' => [
                'name' => 'HIBURAN',
                'color' => '#0891B2',
                'repository' => HiburanRepository::class,
                'persentase' => false,
                'target' => true,
                'realisasi' => true,
            ],
            'ppj' => [
                'name' => 'PPJ',
                'color' => '#D97706',
                'repository' => PpjRepository::class,
                'persentase' => false,
                'target' => true,
                'realisasi' => true,
            ],
            'parkir' => [
                'name' => 'PARKIR',
                'color' => '#EA580C',
                'repository' => ParkirRepository::class,
                'persentase' => false,
                'target' => true,
                'realisasi' => true,
            ],
            'reklame' => [
                'name' => 'REKLAME',
                'color' => '#E11D48',
                'repository' => ReklameRepository::class,
                'persentase' => true,
                'target' => true,
                'realisasi' => true,
            ],
            'air_tanah' => [
                'name' => 'AIR TANAH',
                'color' => '#DB2777',
                'repository' => AirTanahRepository::class,
                'persentase' => true,
                'target' => true,
                'realisasi' => true,
            ],
            'retribusi' => [
                'name' => 'RETRIBUSI',
                'color' => '#9333EA',
                'repository' => RetribusiRepository::class,
                'persentase' => true,
                'target' => true,
                'realisasi' => true,
            ],
            'opsen_pkb' => [
                'name' => 'OPS PKB',
                'color' => '#0284C7',
                'repository' => OpsenPkbRepository::class,
                'persentase' => true,
                'target' => true,
                'realisasi' => true,
            ],
            'opsen_bbnkb' => [
                'name' => 'OPS BBNKB',
                'color' => '#475569',
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
                'color' => $config['color'],
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
            'target' => $config['target'] || $config['realisasi'] ? (int) $repo->getTarget() : 0,
            'realisasi' => $config['realisasi'] ? (int) $repo->getRealisasi() : 0,
        ];
    }
}
