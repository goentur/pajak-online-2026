<?php

use App\Http\Controllers\BerandaController;
use App\Http\Controllers\QrisController;
use Illuminate\Support\Facades\Route;

Route::get('/', [BerandaController::class, 'index'])->name('index');

Route::prefix('qris')->name('qris.')->controller(QrisController::class)->group(function () {
     Route::get('pbb/{id}', 'pbb')->name('pbb');
     Route::get('etax/{id}', 'etax')->name('etax');
     Route::get('/', 'index')->name('index');
});
