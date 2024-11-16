<?php

use App\Http\Controllers\Admin\LogbookController as AdminLogbookController;
use App\Http\Controllers\Admin\BimbinganController as AdminBimbinganController;
use App\Http\Controllers\BimbinganController;
use App\Http\Controllers\LaporanController;
use App\Http\Controllers\LogbookController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use App\Http\Middleware\AdminMiddleware;
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
    Route::prefix('admin')->as('admin.')->middleware(AdminMiddleware::class)->group(function () {
        Route::get('/dashboard', function () {
            return Inertia::render('Admin/Dashboard');
        })->name('dashboard');

        Route::resource('users', UserController::class);
        Route::resource('logbooks', AdminLogbookController::class);
        Route::resource('bimbingans', AdminBimbinganController::class);
        Route::get('/laporans', [LaporanController::class, 'index'])->name('laporans.index');
    });
});

require __DIR__ . '/auth.php';
