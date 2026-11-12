<?php

namespace App\Services;

use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Facades\Http;
use Str;

class Qris
{
    const PREFIX = '70';

    /**
     * @var Http|PendingRequest
     */
    protected $http;

    protected $key;

    protected $token;

    protected $id;

    public function make()
    {
        $this->http = Http::baseUrl(Str::finish(config('services.qris.url'), '/'))
            ->withBasicAuth(config('services.qris.username'), config('services.qris.password'))
            ->withoutVerifying();

        return $this;
    }

    public function etax($id)
    {
        $this->key = config('services.qris.key_etax');
        $this->id = self::PREFIX . $id;

        return $this;
    }

    public function pbb($id)
    {
        $this->key = config('services.qris.key_pbb');
        $this->id = $id;

        return $this;
    }

    public function send()
    {
        $this->token = $this->requestToken($this->id);

        $response = $this->http->asJson()->post('getLink', [
            'token' => $this->token,
            'timeStamps' => \Carbon\Carbon::parse(now())->format('mdHis'),
        ]);
        if (! $response->ok()) {
            throw new \Exception('Error! QRIS failed', 0, $response->body());
        }

        $data = (array) $response->json();

        if (data_get($data, 'errCode') != '00') {
            throw new \Exception('Error! QRIS not found');
        }

        return $data;
    }

    public function  requestToken($id)
    {
        $response = $this->http->asJson()->post('getToken', [
            'idBilling' => $id,
            'key' => $this->key
        ]);

        if (! $response->ok()) {
            throw new \Exception('Error! Token failed', 0, $response->body());
        }

        $data = (array) $response->json();

        if (data_get($data, 'errCode') != '00') {
            throw new \Exception('Error! Token not found');
        }

        return data_get($data, 'token');
    }
}
