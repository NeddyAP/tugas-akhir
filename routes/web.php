<?php

use App\Http\Controllers\BimbinganController;
use App\Http\Controllers\LaporanController;
use App\Http\Controllers\LogbookController;
use App\Http\Controllers\MahasiswaController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::inertia('/', 'Front/Home/Index', [
    'canLogin' => Route::has('login'),
])->name('home');
Route::inertia('/pedomans', 'Front/Pedoman/Index', [
    'canLogin' => Route::has('login'),
])->name('pedomans.index');

Route::middleware('auth')->group(function () {
    Route::post('bimbingans/store', [BimbinganController::class, 'store'])->name('bimbingans.store');
    Route::resource('logbooks', LogbookController::class);
    Route::resource('laporans', LaporanController::class);

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Admin Page
    Route::get('/dashboard', function () {
        return Inertia::render('Admin/Dashboard');
    })->middleware(['auth', 'verified'])->name('dashboard');
    Route::resource('mahasiswas', MahasiswaController::class);
});

require __DIR__.'/auth.php';
