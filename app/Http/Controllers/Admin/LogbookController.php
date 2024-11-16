<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Logbook;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LogbookController extends Controller
{
    public function index(Request $request)
    {
        $query = Logbook::with('user');

        // Handle search from DataTable
        if ($request->has('search')) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->whereHas('user', function ($q) use ($searchTerm) {
                    $q->where('name', 'like', "%{$searchTerm}%");
                })
                    ->orWhere('catatan', 'like', "%{$searchTerm}%")
                    ->orWhere('keterangan', 'like', "%{$searchTerm}%");
            });
        }

        // Get paginated results
        $logbooks = $query->latest()->paginate($request->input('per_page', 10));

        return Inertia::render('Admin/Logbook/LogbookPage', [
            'logbooks' => $logbooks,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'tanggal' => 'required|date',
            'catatan' => 'required|string',
            'keterangan' => 'required|string',
        ]);

        $validated['user_id'] = auth()->id();

        Logbook::create($validated);

        return redirect()->back()->with('flash', ['message' => 'Logbook berhasil ditambahkan.', 'type' => 'success']);
    }

    public function update(Request $request, Logbook $logbook)
    {
        $validated = $request->validate([
            'tanggal' => 'required|date',
            'catatan' => 'required|string',
            'keterangan' => 'required|string',
        ]);
        $validated['updated_at'] = now();

        $logbook->update($validated);

        return redirect()->back()->with('flash', ['message' => 'Logbook berhasil diperbarui.', 'type' => 'success']);
    }

    public function destroy(Logbook $logbook)
    {
        $logbook->delete();

        return redirect()->back()->with('flash', ['message' => 'Logbook berhasil dihapus.', 'type' => 'success']);
    }
}
