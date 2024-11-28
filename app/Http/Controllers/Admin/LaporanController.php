<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DataKkl;
use App\Models\DataKkn;
use App\Models\Laporan;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class LaporanController extends Controller
{
    public function index(Request $request)
    {
        $type = $request->input('type', 'kkl');
        $search = $request->input('search');
        $perPage = $request->input('per_page', 10);

        $baseQuery = function ($query) use ($search) {
            $query->when($search, function ($q) use ($search) {
                $q->whereHas('mahasiswa', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhereHas(
                            'profilable',
                            fn($q) =>
                            $q->where('nim', 'like', "%{$search}%")
                        );
                })->orWhereHas('pembimbing', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhereHas(
                            'profilable',
                            fn($q) =>
                            $q->where('nip', 'like', "%{$search}%")
                        );
                });
            });
        };

        // Get all mahasiswa and dosen
        $mahasiswas = cache()->remember('mahasiswas', 3600, function () {
            return User::mahasiswa()
                ->select('id', 'name')
                ->get()
                ->map(fn($user) => [
                    'value' => $user->id,
                    'label' => $user->name
                ]);
        });

        $dosens = cache()->remember('dosens', 3600, function () {
            return User::dosen()
                ->select('id', 'name')
                ->get()
                ->map(fn($user) => [
                    'value' => $user->id,
                    'label' => $user->name
                ]);
        });

        // Fetch paginated KKL data
        $kklData = DataKkl::with(['mahasiswa:id,name', 'pembimbing:id,name', 'laporan'])
            ->when($type === 'kkl', $baseQuery)
            ->latest()
            ->paginate($perPage);

        // Fetch paginated KKN data
        $kknData = DataKkn::with(['mahasiswa:id,name', 'pembimbing:id,name', 'laporan'])
            ->when($type === 'kkn', $baseQuery)
            ->latest()
            ->paginate($perPage);

        // Fetch all KKL and KKN data without pagination for filtering
        $allKklData = DataKkl::select('user_id')
            ->get()
            ->map(fn($item) => ['user_id' => $item->user_id, 'type' => 'kkl']);

        $allKknData = DataKkn::select('user_id')
            ->get()
            ->map(fn($item) => ['user_id' => $item->user_id, 'type' => 'kkn']);

        // Combine all laporans data
        $allLaporansData = $allKklData->merge($allKknData)->values();

        return Inertia::render('Admin/Laporan/LaporanPage', [
            'type' => $type,
            'kklData' => $kklData,
            'kknData' => $kknData,
            'allLaporansData' => $allLaporansData,
            'mahasiswas' => $mahasiswas,
            'dosens' => $dosens,
            'filters' => ['search' => $search],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:kkl,kkn',
            'user_id' => 'required|exists:users,id',
            'dosen_id' => 'required|exists:users,id',
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'required|date|after:tanggal_mulai',
            'status' => 'required|in:pending,completed,rejected',
        ]);

        $model = $validated['type'] === 'kkl' ? DataKkl::class : DataKkn::class;
        $model::create([
            'user_id' => $validated['user_id'],
            'dosen_id' => $validated['dosen_id'],
            'tanggal_mulai' => $validated['tanggal_mulai'],
            'tanggal_selesai' => $validated['tanggal_selesai'],
            'status' => $validated['status'],
        ]);

        return redirect()->back()->with('flash', ['message' => 'Data ' . $validated['type'] . ' berhasil ditambahkan.', 'type' => 'success']);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'type' => 'required|in:kkl,kkn',
            'user_id' => 'required|exists:users,id',
            'dosen_id' => 'required|exists:users,id',
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'required|date|after:tanggal_mulai',
            'status' => 'required|in:pending,completed,rejected',
        ]);

        $model = $validated['type'] === 'kkl' ? DataKkl::class : DataKkn::class;
        $data = $model::findOrFail($id);

        $data->update([
            'user_id' => $validated['user_id'],
            'dosen_id' => $validated['dosen_id'],
            'tanggal_mulai' => $validated['tanggal_mulai'],
            'tanggal_selesai' => $validated['tanggal_selesai'],
            'status' => $validated['status'],
        ]);

        return redirect()->back()->with('flash', [
            'message' => 'Data ' . $validated['type'] . ' berhasil diperbarui.',
            'type' => 'success'
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $type = $request->query('type');
        if (! $type) {
            return redirect()->back()->with('flash', ['message' => 'Tipe data tidak valid.', 'type' => 'error']);
        }

        return DB::transaction(function () use ($id, $type) {
            $model = $type === 'kkl' ? DataKkl::class : DataKkn::class;
            $data = $model::with('laporan')->findOrFail($id);

            if ($data->laporan) {
                Storage::disk('private')->delete($data->laporan->file);
                $data->laporan->delete();
            }

            $data->delete();

            return redirect()->back()->with('flash', ['message' => 'Data ' . $type . ' berhasil dihapus.', 'type' => 'success']);
        });
    }
}
