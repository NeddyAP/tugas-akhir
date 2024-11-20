<?php

namespace App\Http\Controllers;

use App\Models\Bimbingan;
use App\Models\Logbook;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class LogbookController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();

        return Inertia::render('Front/Logbook/LogbookPage', [
            'logbooks' => Logbook::where('user_id', $user->id)->paginate(10),
            'bimbingans' => Bimbingan::where('user_id', $user->id)->paginate(10),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'tanggal' => 'required',
            'catatan' => 'required',
            'keterangan' => 'required',
        ]);
        $validated['user_id'] = Auth::id();

        Logbook::create($validated);

        return redirect()->back()->with('flash', ['message' => 'Logbook baru berhasil ditambahkan.', 'type' => 'success']);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Logbook $logbook)
    {
        // Validate user owns this logbook
        if ($logbook->user_id !== Auth::id()) {
            abort(403);
        }

        $validated = $request->validate([
            'tanggal' => 'required|date',
            'catatan' => 'required|string',
            'keterangan' => 'required|string',
        ]);

        $logbook->update($validated);

        return redirect()->back()->with('flash', ['message' => 'Logbook berhasil diperbarui.', 'type' => 'success']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Logbook $logbook)
    {
        // Validate user owns this logbook
        if ($logbook->user_id !== Auth::id()) {
            abort(403);
        }

        $logbook->delete();

        return redirect()->back()->with('flash', ['message' => 'Logbook berhasil dihapus.', 'type' => 'success']);
    }
}
