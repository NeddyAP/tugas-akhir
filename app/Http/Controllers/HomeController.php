<?php

namespace App\Http\Controllers;

use App\Models\Panduan;
use App\Models\Question;
use App\Models\Tutorial;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;

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
        $path = 'laporans/'.$filename;
        abort_unless(Storage::disk('private')->exists($path), 404);

        return response()->file(storage_path('app/private/'.$path));
    }
}
