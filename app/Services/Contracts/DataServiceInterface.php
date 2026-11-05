<?php

namespace App\Services\Contracts;

interface DataServiceInterface
{
    public function getTarget();

    public function getRealisasi();

    public function getPersenRealisasi();

    public function toArray();
}
