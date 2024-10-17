<?php

namespace App\Http\Controllers;

use App\Models\Bimbingan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BimbinganController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'tanggal' => 'required',
            'keterangan' => 'required',
        ]);

        $validated['user_id'] = Auth::id();

        Bimbingan::create($validated);

        return redirect()->back()->with('flash', ['message' => 'Data bimbingan baru berhasil ditambahkan.', 'type' => 'success']);
    }
}
