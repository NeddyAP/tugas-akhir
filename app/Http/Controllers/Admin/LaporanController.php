<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DataKkl;
use App\Models\DataKkn;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class LaporanController extends Controller
{
    public function index(Request $request)
    {
        $type = $request->input('type', 'kkl');
        $perPage = $request->input('per_page', 10);
        $filters = $request->only(['pembimbing', 'status', 'angkatan']);
        $search = $request->input('search');

        // Base query for both KKL and KKN
        $query = $type === 'kkl' ? DataKkl::query() : DataKkn::query();

        // Eager load relationships with specific fields
        $query->with([
            'mahasiswa' => function ($query) {
                $query->select('id', 'name', 'email', 'profilable_id', 'profilable_type')
                    ->with('profilable');
            },
            'pembimbing:id,name',
            'laporan:id,file,keterangan',
        ]);

        // Add search functionality
        if ($search) {
            $query->where(function ($query) use ($search) {
                $query->whereHas('mahasiswa', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhereHas('profilable', function ($q) use ($search) {
                            $q->where('nim', 'like', "%{$search}%");
                        });
                })
                    ->orWhereHas('pembimbing', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    });
            });
        }

        // Apply filters
        if (! empty($filters['pembimbing'])) {
            $query->where('dosen_id', $filters['pembimbing']);
        }

        if (! empty($filters['status'])) {
            if ($filters['status'] === 'submitted') {
                $query->whereNotNull('id_laporan');
            } elseif ($filters['status'] === 'null') {
                $query->whereNull('id_laporan');
            }
        }

        if (! empty($filters['angkatan'])) {
            $query->whereHas('mahasiswa.profilable', function ($query) use ($filters) {
                $query->where('angkatan', $filters['angkatan']);
            });
        }

        // Get paginated results
        $laporans = $query->latest()->paginate($perPage)->through(function ($item) {
            $mahasiswaData = $item->mahasiswa;

            // Ensure we have the profilable data before accessing it
            $mahasiswaProfile = $mahasiswaData?->profilable;

            return [
                'id' => $item->id,
                'user_id' => $item->user_id,
                'dosen_id' => $item->dosen_id,
                'mahasiswa' => [
                    'id' => $mahasiswaData?->id,
                    'name' => $mahasiswaData?->name,
                    'email' => $mahasiswaData?->email,
                    'nim' => $mahasiswaProfile?->nim ?? 'N/A',
                    'angkatan' => $mahasiswaProfile?->angkatan ?? 'N/A',
                ],
                'pembimbing' => $item->pembimbing,
                'status' => $item->status,
                'tanggal_mulai' => $item->tanggal_mulai,
                'tanggal_selesai' => $item->tanggal_selesai,
                'laporan' => $item->laporan,
            ];
        });

        // Get all laporans for checking duplicates
        $allLaporans = DB::table('data_kkls')
            ->select('user_id', DB::raw("'kkl' as type"))
            ->union(
                DB::table('data_kkns')
                    ->select('user_id', DB::raw("'kkn' as type"))
            )
            ->get();

        // Get mahasiswa options for select
        $mahasiswas = User::mahasiswa()
            ->with('profilable:id,nim,angkatan')
            ->get()
            ->map(function ($user) {
                return [
                    'value' => $user->id,
                    'label' => "{$user->name} ({$user->profilable->nim})",
                ];
            });

        // Get dosen options for select
        $dosens = User::dosen()
            ->with('profilable:id,nip')
            ->get()
            ->map(function ($user) {
                return [
                    'value' => $user->id,
                    'label' => $user->name,
                ];
            });

        // Calculate grouped statistics
        $groupedStats = $this->calculateGroupedStats($type, $filters);

        return Inertia::render('Admin/Laporan/LaporanPage', [
            'type' => $type,
            'kklData' => $type === 'kkl' ? $laporans : null,
            'kknData' => $type === 'kkn' ? $laporans : null,
            'allLaporansData' => $allLaporans,
            'mahasiswas' => $mahasiswas,
            'dosens' => $dosens,
            'filters' => $filters,
            'groupedStats' => $groupedStats,
        ]);
    }

    private function calculateGroupedStats($type, $filters)
    {
        $query = $type === 'kkl' ? DataKkl::query() : DataKkn::query();

        // Apply existing filters except status
        if (! empty($filters['pembimbing'])) {
            $query->where('dosen_id', $filters['pembimbing']);
        }

        if (! empty($filters['angkatan'])) {
            $query->whereHas('mahasiswa.profilable', function ($query) use ($filters) {
                $query->where('angkatan', $filters['angkatan']);
            });
        }

        $stats = [
            'Total' => [
                'count' => $query->count(),
                'submitted' => $query->clone()->whereNotNull('id_laporan')->count(),
                'not_submitted' => $query->clone()->whereNull('id_laporan')->count(),
            ],
        ];

        return $stats;
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:kkl,kkn',
            'user_id' => 'required|exists:users,id',
            'dosen_id' => 'required|exists:users,id',
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'required|date|after:tanggal_mulai',
            'status' => 'required|in:pending,approved,rejected',
        ]);

        $model = $validated['type'] === 'kkl' ? DataKkl::class : DataKkn::class;
        $model::create([
            'user_id' => $validated['user_id'],
            'dosen_id' => $validated['dosen_id'],
            'tanggal_mulai' => $validated['tanggal_mulai'],
            'tanggal_selesai' => $validated['tanggal_selesai'],
            'status' => $validated['status'],
        ]);

        return redirect()->back()->with('flash', ['message' => 'Data '.$validated['type'].' berhasil ditambahkan.', 'type' => 'success']);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'type' => 'required|in:kkl,kkn',
            'user_id' => 'required|exists:users,id',
            'dosen_id' => 'required|exists:users,id',
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'required|date|after:tanggal_mulai',
            'status' => 'required|in:pending,approved,rejected',
        ]);

        $model = $validated['type'] === 'kkl' ? DataKkl::class : DataKkn::class;
        $data = $model::findOrFail($id);

        $data->update([
            'user_id' => $validated['user_id'],
            'dosen_id' => $validated['dosen_id'],
            'tanggal_mulai' => $validated['tanggal_mulai'],
            'tanggal_selesai' => $validated['tanggal_selesai'],
            'status' => $validated['status'],
            'updated_at' => now(),
        ]);

        return redirect()->back()->with('flash', [
            'message' => 'Data '.$validated['type'].' berhasil diperbarui.',
            'type' => 'success',
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

            return redirect()->back()->with('flash', ['message' => 'Data '.$type.' berhasil dihapus.', 'type' => 'success']);
        });
    }

    // Add new bulk update method
    public function bulkUpdate(Request $request)
    {
        try {
            $validated = $request->validate([
                'type' => 'required|in:kkl,kkn',
                'ids' => 'required|array',
                'ids.*' => 'required|integer',
                'data' => 'required|array',
                'data.status' => ['sometimes', Rule::in(['pending', 'approved', 'rejected'])],
                'data.dosen_id' => 'sometimes|exists:users,id',
            ]);

            $model = $validated['type'] === 'kkl' ? DataKkl::class : DataKkn::class;

            DB::beginTransaction();

            // Update only allowed fields
            $updateData = array_intersect_key($validated['data'], array_flip(['status', 'dosen_id']));

            // Add updated_at timestamp
            $updateData['updated_at'] = now();

            $updated = $model::whereIn('id', $validated['ids'])->update($updateData);

            DB::commit();

            if ($updated) {
                return redirect()->back()->with('flash', [
                    'message' => $updated.' data berhasil diperbarui.',
                    'type' => 'success',
                ]);
            }

            return redirect()->back()->with('flash', [
                'message' => 'Tidak ada data yang diperbarui.',
                'type' => 'info',
            ]);
        } catch (\Exception $e) {
            DB::rollBack();

            return redirect()->back()->with('flash', [
                'message' => 'Gagal memperbarui data: '.$e->getMessage(),
                'type' => 'error',
            ]);
        }
    }
}
