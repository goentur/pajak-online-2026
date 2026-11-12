<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Facades\Http;

class Recaptcha implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (empty($value)) {
            $fail('Silakan selesaikan verifikasi reCAPTCHA.');
            return;
        }

        // Gunakan withoutVerifying() HANYA jika sedang di environment local
        $http = app()->isLocal() ? Http::withoutVerifying() : Http::asForm();

        $response = $http->asForm()->post('https://www.google.com/recaptcha/api/siteverify', [
            'secret'   => config('services.recaptcha.secret_key'),
            'response' => $value,
            'remoteip' => request()->ip(),
        ]);

        if (!$response->successful() || !$response->json('success')) {
            $fail('Verifikasi reCAPTCHA gagal. Silakan coba lagi.');
        }
    }
}
