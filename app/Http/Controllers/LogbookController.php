<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreLogbookRequest;
use App\Http\Requests\UpdateLogbookRequest;
use App\Models\Bimbingan;
use App\Models\Logbook;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class LogbookController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();
        return Inertia::render('Logbook/Index', [
            'logbooks' => Logbook::where('user_id', $user->id)->get(),
            'bimbingans' => Bimbingan::where('user_id', $user->id)->get(),
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
    public function store(StoreLogbookRequest $request)
    {
        $validated = $request->validated();
        $validated['user_id'] = Auth::id();
        
        $logbook = Logbook::create($validated);

        return redirect()->back()->with('success', 'Logbook entry created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Logbook $logbook)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Logbook $logbook)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateLogbookRequest $request, Logbook $logbook)
    {
        $logbook->update($request->validated());
        return redirect()->back()->with('success', 'Logbook entry updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Logbook $logbook)
    {
        $logbook->delete();
        return redirect()->back()->with('success', 'Logbook entry deleted successfully.');
    }
}
