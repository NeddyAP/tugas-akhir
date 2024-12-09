<?php

namespace App\Http\Controllers;

use App\Models\Panduan;
use App\Models\Question;
use App\Models\Tutorial;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;

class HomeController extends Controller
{
    public function home()
    {
        return inertia('Front/Home/HomePage', [
            'canLogin' => Route::has('login'),
            'tutorial' => Tutorial::latest()->first(),
            'faqs' => Question::get(),
        ]);
    }

    public function pedoman()
    {
        return inertia('Front/Pedoman/PedomanPage', [
            'canLogin' => Route::has('login'),
            'panduans' => Panduan::latest()->get(),
        ]);
    }

    public function downloadLaporan($filename)
    {
        $path = 'laporans/'.$filename;

        if (! Storage::disk('private')->exists($path)) {
            abort(404);
        }

        $file = Storage::disk('private')->get($path);
        $type = Storage::disk('private')->mimeType($path);

        $response = new Response($file, 200);
        $response->header('Content-Type', $type);

        // Set response to display in browser instead of downloading
        $response->header('Content-Disposition', 'inline; filename="'.$filename.'"');

        return $response;
    }
}
