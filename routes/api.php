<?php

use App\Http\Controllers\Api\DataController;
use Illuminate\Support\Facades\Route;

Route::post('/pajak/{jenis}', [DataController::class, 'show']);
