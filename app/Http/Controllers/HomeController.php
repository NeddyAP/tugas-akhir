<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use App\Models\{Tutorial, Question, Panduan};

class HomeController extends Controller
{
    public function home()
    {
        return inertia('Front/Home/HomePage', [
            'canLogin' => Route::has('login'),
            'tutorial' => Tutorial::latest()->first(),
            'faqs' => Question::all(),
        ]);
    }

    public function pedoman()
    {
        return inertia('Front/Pedoman/PedomanPage', [
            'canLogin' => Route::has('login'),
            'panduans' => Panduan::latest()->get(),
        ]);
    }

    public function downloadLaporan(string $filename)
    {
        $path = 'laporans/' . $filename;
        abort_unless(Storage::disk('private')->exists($path), 404);

        return response()->file(storage_path('app/private/' . $path));
    }
}
