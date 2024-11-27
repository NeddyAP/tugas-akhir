<?php

namespace App\Http\Controllers;

use App\Models\Laporan;
use App\Models\DataKkl;
use App\Models\DataKkn;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

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
        ]);

        return DB::transaction(function () use ($validated) {
            $laporan = Laporan::create([
                'user_id' => Auth::id(),
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
                'message' => 'Keterangan berhasil ditambahkan.',
                'type' => 'success'
            ]);
        });
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'type' => 'required|in:kkl,kkn',
            'keterangan' => 'nullable|string',
        ]);

        return DB::transaction(function () use ($validated, $request, $id) {
            $model = $validated['type'] === 'kkl' ? DataKkl::class : DataKkn::class;
            $data = $model::with('laporan')
                ->where('user_id', Auth::id())
                ->findOrFail($id);

            if (!$data->laporan) {
                $laporan = Laporan::create([
                    'user_id' => Auth::id(),
                    'keterangan' => $validated['keterangan'],
                ]);
                
                $data->update(['id_laporan' => $laporan->id]);
            } else {
                $data->laporan->update([
                    'keterangan' => $validated['keterangan']
                ]);
            }

            return redirect()->back()->with('flash', [
                'message' => 'Keterangan berhasil diperbarui.',
                'type' => 'success'
            ]);
        });
    }

    public function destroy($id)
    {
        return DB::transaction(function () use ($id) {
            $laporan = Laporan::where('user_id', Auth::id())->findOrFail($id);
            $laporan->delete();

            return redirect()->back()->with('flash', [
                'message' => 'Keterangan berhasil dihapus.',
                'type' => 'success'
            ]);
        });
    }
}
