<?php

use App\Http\Controllers\Api\DataController;
use App\Http\Controllers\Api\QrisController;
use Illuminate\Support\Facades\Route;

Route::post('list', [DataController::class, 'list']);
Route::post('data/{jenis}', [DataController::class, 'show']);
Route::post('qris/generate', [QrisController::class, 'generate']);
