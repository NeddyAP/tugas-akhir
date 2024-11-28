<?php

use App\Http\Controllers\Admin\BimbinganController as AdminBimbinganController;
use App\Http\Controllers\Admin\ExportController as AdminExportController;
use App\Http\Controllers\Admin\InformationController as AdminInformationController;
use App\Http\Controllers\Admin\LaporanController as AdminLaporanController;
use App\Http\Controllers\Admin\LogbookController as AdminLogbookController;
use App\Http\Controllers\BimbinganController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\LaporanController;
use App\Http\Controllers\LogbookController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use App\Http\Middleware\AdminMiddleware;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [HomeController::class, 'home'])->name('home');
Route::get('/pedoman', [HomeController::class, 'pedoman'])->name('pedoman');

Route::middleware('auth')->group(function () {

    Route::resource('bimbingan', BimbinganController::class);
    Route::resource('logbook', LogbookController::class);
    Route::resource('laporan', LaporanController::class);

    Route::get('files/laporan/{filename}', [HomeController::class, 'downloadLaporan'])
        ->name('files.laporan');

    Route::get('/export/logbook', [AdminExportController::class, 'exportLogbook'])->name('logbook.export');
    Route::get('/export/bimbingan', [AdminExportController::class, 'exportBimbingan'])->name('bimbingan.export');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Admin Page
    Route::prefix('admin')->as('admin.')->middleware(AdminMiddleware::class)->group(function () {
        Route::get('/dashboard', function () {
            return Inertia::render('Admin/Dashboard');
        })->name('dashboard');

        Route::resource('logbooks', AdminLogbookController::class);
        Route::resource('bimbingans', AdminBimbinganController::class);
        Route::resource('laporans', AdminLaporanController::class);

        Route::get('users/export', [AdminExportController::class, 'export'])
            ->name('users.export');
        Route::resource('users', UserController::class);

        Route::resource('informations', AdminInformationController::class);
    });
});

require __DIR__.'/auth.php';
