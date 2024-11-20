<?php

use App\Http\Controllers\Admin\BimbinganController as AdminBimbinganController;
use App\Http\Controllers\Admin\InformationController as AdminInformationController;
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

Route::middleware('auth')->group(function () {
    Route::resource('bimbingans', BimbinganController::class);
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

        Route::resource('informations', AdminInformationController::class);
    });
});

require __DIR__ . '/auth.php';
