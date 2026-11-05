<?php

use App\Http\Controllers\Api\DataController;
use Illuminate\Support\Facades\Route;

Route::post('list', [DataController::class, 'list']);
Route::post('data/{jenis}', [DataController::class, 'show']);
