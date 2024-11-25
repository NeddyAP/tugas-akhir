<?php

use App\Http\Controllers\Admin\BimbinganController as AdminBimbinganController;
use App\Http\Controllers\Admin\ExportController as AdminExportController;
use App\Http\Controllers\Admin\InformationController as AdminInformationController;
use App\Http\Controllers\Admin\LaporanController as AdminLaporanController;
use App\Http\Controllers\Admin\LogbookController as AdminLogbookController;
use App\Http\Controllers\BimbinganController;
use App\Http\Controllers\LaporanController;
use App\Http\Controllers\LogbookController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use App\Http\Middleware\AdminMiddleware;
use App\Models\Panduan;
use App\Models\Question;
use App\Models\Tutorial;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

Route::inertia('/', 'Front/Home/HomePage', [
    'canLogin' => Route::has('login'),
    'tutorial' => Tutorial::select('title', 'description', 'link')->latest()->first(),
    'faqs' => Question::select('question', 'answer')->get(),
])->name('home');
Route::inertia('/pedomans', 'Front/Pedoman/PedomanPage', [
    'canLogin' => Route::has('login'),
    'panduans' => Panduan::select('title', 'description', 'file')->latest()->get(),
])->name('pedomans.index');

Route::get('files/laporan/{filename}', function ($filename) {
    $path = 'laporans/'.$filename;
    if (! Storage::disk('private')->exists($path)) {
        abort(404);
    }

    return response()->file(storage_path('app/private/'.$path));
})->name('files.laporan')->middleware('auth');

Route::middleware('auth')->group(function () {

    Route::resource('bimbingans', BimbinganController::class);
    Route::resource('logbooks', LogbookController::class);
    Route::resource('laporans', LaporanController::class);

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
