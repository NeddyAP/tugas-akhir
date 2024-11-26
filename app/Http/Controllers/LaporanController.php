<?php

namespace App\Http\Controllers;

use App\Models\Laporan;
use App\Models\DataKkl;
use App\Models\DataKkn;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class LaporanController extends Controller
{
    public function index(Request $request)
    {
        $type = $request->input('type', 'kkl');
        $user = Auth::user();

        $baseQuery = function ($query) use ($user) {
            $query->where('user_id', $user->id)
                ->with(['mahasiswa:id,name', 'pembimbing:id,name', 'laporan']);
        };

        $kklData = $type === 'kkl' ?
            DataKkl::when(true, $baseQuery)->latest()->paginate(10) : null;

        $kknData = $type === 'kkn' ?
            DataKkn::when(true, $baseQuery)->latest()->paginate(10) : null;

        return inertia('Front/Laporan/LaporanPage', [
            'type' => $type,
            'kklData' => $kklData,
            'kknData' => $kknData,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:kkl,kkn',
            'file' => 'required|file|mimes:pdf|max:10240',
            'keterangan' => 'nullable|string',
        ]);

        return DB::transaction(function () use ($validated, $request) {
            $laporan = Laporan::create([
                'user_id' => Auth::id(),
                'file' => $request->file('file')->store('laporans', 'private'),
                'keterangan' => $validated['keterangan'],
            ]);

            $model = $validated['type'] === 'kkl' ? DataKkl::class : DataKkn::class;
            $existingData = $model::where('user_id', Auth::id())
                ->whereNull('id_laporan')
                ->first();

            if ($existingData) {
                $existingData->update(['id_laporan' => $laporan->id]);
            }

            return redirect()->back()->with('flash', [
                'message' => 'Laporan berhasil diunggah.',
                'type' => 'success'
            ]);
        });
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'type' => 'required|in:kkl,kkn',
            'file' => 'nullable|file|mimes:pdf|max:10240',
            'keterangan' => 'nullable|string',
        ]);

        return DB::transaction(function () use ($validated, $id, $request) {
            $model = $validated['type'] === 'kkl' ? DataKkl::class : DataKkn::class;
            $data = $model::with('laporan')
                ->where('user_id', Auth::id())
                ->where('id', $id)
                ->firstOrFail();

            if (!$data->laporan) {
                // Create new laporan if it doesn't exist
                $laporan = Laporan::create([
                    'user_id' => Auth::id(),
                    'file' => $request->hasFile('file') ? 
                        $request->file('file')->store('laporans', 'private') : null,
                    'keterangan' => $validated['keterangan'] ?? null,
                ]);
                
                $data->update(['id_laporan' => $laporan->id]);
            } else {
                // Update existing laporan
                $updateData = [];

                if ($request->hasFile('file')) {
                    // Delete old file if exists
                    if ($data->laporan->file) {
                        Storage::disk('private')->delete($data->laporan->file);
                    }
                    $updateData['file'] = $request->file('file')->store('laporans', 'private');
                }

                if (isset($validated['keterangan'])) {
                    $updateData['keterangan'] = $validated['keterangan'];
                }

                if (!empty($updateData)) {
                    $data->laporan->update($updateData);
                }
            }

            return redirect()->back()->with('flash', [
                'message' => 'Laporan berhasil diperbarui.',
                'type' => 'success'
            ]);
        });
    }

    public function destroy($id)
    {
        return DB::transaction(function () use ($id) {
            $laporan = Laporan::where('user_id', Auth::id())->findOrFail($id);

            if ($laporan->file) {
                Storage::disk('private')->delete($laporan->file);
            }

            $laporan->delete();

            return redirect()->back()->with('flash', [
                'message' => 'Laporan berhasil dihapus.',
                'type' => 'success'
            ]);
        });
    }
}
