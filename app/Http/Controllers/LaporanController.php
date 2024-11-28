<?php

namespace App\Http\Controllers;

use App\Models\DataKkl;
use App\Models\DataKkn;
use App\Models\Laporan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
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
            'kklData' => $kklData,
            'kknData' => $kknData,
            'type' => $type,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:kkl,kkn',
            'keterangan' => 'nullable|string',
            'file' => 'required|file|mimes:pdf,doc,docx|max:10240',
        ]);

        return DB::transaction(function () use ($validated, $request) {
            $model = $validated['type'] === 'kkl' ? DataKkl::class : DataKkn::class;
            $data = $model::where('user_id', Auth::id())
                ->whereNull('id_laporan')
                ->latest()
                ->firstOrFail();

            $laporan = Laporan::create([
                'user_id' => Auth::id(),
                'keterangan' => $validated['keterangan'],
                'file' => $request->file('file')->store('laporans', 'private'),
            ]);

            $data->update(['id_laporan' => $laporan->id]);

            return back()->with('flash', [
                'type' => 'success',
                'message' => 'Laporan berhasil ditambahkan',
            ]);
        });
    }

    public function destroy($id)
    {
        return DB::transaction(function () use ($id) {
            try {
                $laporan = Laporan::findOrFail($id);

                // Check if user owns this laporan
                if ($laporan->user_id !== Auth::id()) {
                    abort(403, 'Unauthorized action.');
                }

                // Delete file if exists
                if ($laporan->file) {
                    Storage::disk('private')->delete($laporan->file);
                }

                // Find and update the related KKL/KKN data
                $kklData = DataKkl::where('id_laporan', $id)->first();
                $kknData = DataKkn::where('id_laporan', $id)->first();

                if ($kklData) {
                    $kklData->update(['id_laporan' => null]);
                }
                if ($kknData) {
                    $kknData->update(['id_laporan' => null]);
                }

                $laporan->delete();

                return back()->with('flash', [
                    'type' => 'success',
                    'message' => 'Laporan berhasil dihapus',
                ]);
            } catch (\Exception $e) {
                return back()->with('flash', [
                    'type' => 'error',
                    'message' => 'Gagal menghapus laporan: '.$e->getMessage(),
                ]);
            }
        });
    }
}
