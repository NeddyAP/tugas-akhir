<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DataKkl;
use App\Models\DataKkn;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class LaporanController extends Controller
{
    public function index(Request $request)
    {
        $type = $request->input('type', 'kkl');
        $search = $request->input('search');
        $groupBy = $request->input('groupBy');
        $filters = $request->only(['pembimbing', 'status', 'angkatan']);
        $perPage = $request->input('per_page', 10);

        $baseQuery = function ($query) use ($search, $filters) {
            // Existing search logic
            $query->when($search, function ($q) use ($search) {
                $q->whereHas('mahasiswa', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhereHas(
                            'profilable',
                            fn($q) => $q->where('nim', 'like', "%{$search}%")
                        );
                })->orWhereHas('pembimbing', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhereHas(
                            'profilable',
                            fn($q) => $q->where('nip', 'like', "%{$search}%")
                        );
                });
            });

            // Supervisor filter
            $query->when($filters['pembimbing'] ?? null, function ($q) use ($filters) {
                $q->where('dosen_id', $filters['pembimbing']);
            });

            // Submission status filter
            $query->when($filters['status'] ?? null, function ($q) use ($filters) {
                if ($filters['status'] === 'submitted') {
                    $q->whereNotNull('id_laporan');
                } elseif ($filters['status'] === 'null') {
                    $q->whereNull('id_laporan');
                }
            });

            // Batch year filter
            $query->when($filters['angkatan'] ?? null, function ($q) use ($filters) {
                $q->whereHas('mahasiswa.profilable', function ($q) use ($filters) {
                    $q->where('angkatan', $filters['angkatan']);
                });
            });
        };

        // Get all mahasiswa and dosen
        $mahasiswas = cache()->remember('mahasiswas', 3600, function () {
            return User::mahasiswa()
                ->select('id', 'name')
                ->orderBy('name')
                ->get()
                ->map(fn($user) => [
                    'value' => $user->id,
                    'label' => $user->name,
                ]);
        });

        $dosens = cache()->remember('dosens', 3600, function () {
            return User::dosen()
                ->select('id', 'name')
                ->orderBy('name')  // Add this line to sort by name
                ->get()
                ->map(fn($user) => [
                    'value' => $user->id,
                    'label' => $user->name,
                ]);
        });

        // Modify the queries to include the necessary relations and sorting
        $with = [
            'mahasiswa:id,name',
            'mahasiswa.profilable:user_id,angkatan',
            'pembimbing:id,name',
            'laporan'
        ];

        // Get the appropriate model and data based on type
        $model = $type === 'kkl' ? DataKkl::class : DataKkn::class;
        $data = $model::with($with)
            ->when($type === $type, $baseQuery)
            ->join('users', 'users.id', '=', $type === 'kkl' ? 'data_kkls.user_id' : 'data_kkns.user_id')
            ->orderBy('users.name')
            ->select($type === 'kkl' ? 'data_kkls.*' : 'data_kkns.*');

        // Apply grouping if specified
        $groupedStats = null;
        if ($groupBy) {
            $groupedData = $data->get()->groupBy(function ($item) use ($groupBy) {
                switch ($groupBy) {
                    case 'pembimbing':
                        return $item->pembimbing->name ?? 'Unassigned';
                    case 'status':
                        return $item->id_laporan ? 'Submitted' : 'Not Submitted';
                    case 'angkatan':
                        return $item->mahasiswa->profilable->angkatan ?? 'Unknown';
                    default:
                        return 'Ungrouped';
                }
            });

            $groupedStats = $groupedData->map(function ($group) {
                return [
                    'count' => $group->count(),
                    'submitted' => $group->whereNotNull('id_laporan')->count(),
                    'not_submitted' => $group->whereNull('id_laporan')->count(),
                ];
            });
        }

        // Paginate the results
        $paginatedData = $data->paginate($perPage);

        // Set the appropriate data variable based on type
        $kklData = $type === 'kkl' ? $paginatedData : null;
        $kknData = $type === 'kkn' ? $paginatedData : null;

        return Inertia::render('Admin/Laporan/LaporanPage', [
            'type' => $type,
            'kklData' => $kklData,
            'kknData' => $kknData,
            'allLaporansData' => $allLaporansData ?? [],
            'mahasiswas' => $mahasiswas,
            'dosens' => $dosens,
            'filters' => array_merge($filters, [
                'search' => $search,
                'groupBy' => $groupBy
            ]),
            'groupedStats' => $groupedStats,
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
            'message' => 'Data ' . $validated['type'] . ' berhasil diperbarui.',
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

            return redirect()->back()->with('flash', ['message' => 'Data ' . $type . ' berhasil dihapus.', 'type' => 'success']);
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
                    'message' => $updated . ' data berhasil diperbarui.',
                    'type' => 'success'
                ]);
            }

            return redirect()->back()->with('flash', [
                'message' => 'Tidak ada data yang diperbarui.',
                'type' => 'info'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return redirect()->back()->with('flash', [
                'message' => 'Gagal memperbarui data: ' . $e->getMessage(),
                'type' => 'error'
            ]);
        }
    }
}
