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

        return Inertia::render('Front/Logbook/Index', [
            'logbooks' => Logbook::where('user_id', $user->id)->select(
                'tanggal',
                'catatan',
                'keterangan',
            )->paginate(10),
            'bimbingans' => Bimbingan::where('user_id', $user->id)->select(
                'tanggal',
                'keterangan',
                'status',
            )->paginate(10),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
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
        $logbook->update($request->validated());

        return redirect()->back()->with('flash', ['message' => 'Logbook berhasil diubah.', 'type' => 'success']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Logbook $logbook)
    {
        $logbook->delete();

        return redirect()->back()->with('flash', ['message' => 'Logbook berhasil dihapus.', 'type' => 'success']);
    }
}
