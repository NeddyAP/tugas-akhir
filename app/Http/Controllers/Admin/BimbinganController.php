<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Bimbingan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BimbinganController extends Controller
{
    public function index(Request $request)
    {
        $query = Bimbingan::with('user');

        if ($request->has('search')) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->whereHas('user', function ($q) use ($searchTerm) {
                    $q->where('name', 'like', "%{$searchTerm}%");
                })
                    ->orWhere('keterangan', 'like', "%{$searchTerm}%")
                    ->orWhere('status', 'like', "%{$searchTerm}%");
            });
        }

        $bimbingans = $query->latest()->paginate($request->input('per_page', 10));

        return Inertia::render('Admin/Table/BimbinganPage', [
            'bimbingans' => $bimbingans,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'tanggal' => 'required|date',
            'keterangan' => 'required|string',
            'status' => 'required|string|in:pending,approved,rejected',
            'user_id' => 'required|exists:users,id',
        ]);

        Bimbingan::create($validated);

        return redirect()->back()->with('flash', ['message' => 'Bimbingan berhasil ditambahkan.', 'type' => 'success']);
    }

    public function update(Request $request, Bimbingan $bimbingan)
    {
        $validated = $request->validate([
            'tanggal' => 'required|date',
            'keterangan' => 'required|string',
            'status' => 'required|string|in:pending,approved,rejected',
        ]);

        $bimbingan->update($validated);

        return redirect()->back()->with('flash', ['message' => 'Bimbingan berhasil diperbarui.', 'type' => 'success']);
    }

    public function destroy(Bimbingan $bimbingan)
    {
        $bimbingan->delete();

        return redirect()->back()->with('flash', ['message' => 'Bimbingan berhasil dihapus.', 'type' => 'success']);
    }
}
