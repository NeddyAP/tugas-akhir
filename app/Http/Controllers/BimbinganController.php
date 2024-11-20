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

    public function update(Request $request, Bimbingan $bimbingan)
    {
        if ($bimbingan->user_id !== Auth::id()) {
            abort(403);
        }

        $validated = $request->validate([
            'tanggal' => 'required|date',
            'keterangan' => 'required|string',
        ]);

        $bimbingan->update($validated);

        return redirect()->back()->with('flash', ['message' => 'Data bimbingan berhasil diubah.', 'type' => 'success']);
    }

    public function destroy(Bimbingan $bimbingan)
    {
        if ($bimbingan->user_id !== Auth::id()) {
            abort(403);
        }

        $bimbingan->delete();

        return redirect()->back()->with('flash', ['message' => 'Data bimbingan berhasil dihapus.', 'type' => 'success']);
    }
}
