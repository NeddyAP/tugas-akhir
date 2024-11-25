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

        $mahasiswas = User::mahasiswa()
            ->select('id', 'name')
            ->get();

        $dosens = User::dosen()
            ->select('id', 'name')
            ->get();

        $search = $request->input('search');

        $baseQuery = function ($query) use ($search) {
            if ($search) {
                $query->whereHas('mahasiswa', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhereHas('profilable', function ($q) use ($search) {
                            $q->where('nim', 'like', "%{$search}%");
                        });
                })->orWhereHas('pembimbing', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhereHas('profilable', function ($q) use ($search) {
                            $q->where('nip', 'like', "%{$search}%");
                        });
                });
            }
        };

        $kklData = $type === 'kkl' ?
            DataKkl::with(['mahasiswa:id,name', 'pembimbing:id,name', 'laporan'])
                ->when($search, $baseQuery)
                ->latest()
                ->paginate(10) : null;

        $kknData = $type === 'kkn' ?
            DataKkn::with(['mahasiswa:id,name', 'pembimbing:id,name', 'laporan'])
                ->when($search, $baseQuery)
                ->latest()
                ->paginate(10) : null;

        return Inertia::render('Admin/Laporan/LaporanPage', [
            'type' => $type,
            'kklData' => $kklData,
            'kknData' => $kknData,
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
            'file' => 'nullable|file|mimes:pdf|max:10240',
            'keterangan' => 'nullable|string',
        ]);

        return DB::transaction(function () use ($validated, $request) {

            $laporan = null;
            if ($request->hasFile('file')) {
                $laporan = Laporan::create([
                    'user_id' => $validated['user_id'],
                    'file' => $request->file('file')->store('laporans', 'private'),
                    'keterangan' => $validated['keterangan'],
                ]);
            }

            $data = [
                'user_id' => $validated['user_id'],
                'dosen_id' => $validated['dosen_id'],
                'tanggal_mulai' => $validated['tanggal_mulai'],
                'tanggal_selesai' => $validated['tanggal_selesai'],
                'status' => $validated['status'],
                'id_laporan' => $laporan ? $laporan->id : null,
            ];

            $model = $validated['type'] === 'kkl' ? DataKkl::class : DataKkn::class;
            $model::create($data);

            return redirect()->back()->with('flash', ['message' => 'Data '.$validated['type'].' berhasil ditambahkan.', 'type' => 'success']);
        });
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
            'file' => 'nullable|file|mimes:pdf|max:10240',
            'keterangan' => 'nullable|string',
        ]);

        return DB::transaction(function () use ($validated, $id, $request) {
            $model = $validated['type'] === 'kkl' ? DataKkl::class : DataKkn::class;
            $data = $model::findOrFail($id);

            if ($request->hasFile('file')) {
                if ($data->laporan) {
                    Storage::disk('private')->delete($data->laporan->file);
                    $data->laporan->update([
                        'file' => $request->file('file')->store('laporans', 'private'),
                        'keterangan' => $validated['keterangan'],
                    ]);
                } else {
                    $laporan = Laporan::create([
                        'user_id' => $validated['user_id'],
                        'file' => $request->file('file')->store('laporans', 'private'),
                        'keterangan' => $validated['keterangan'],
                    ]);
                    $data->id_laporan = $laporan->id;
                }
            } elseif ($data->laporan && isset($validated['keterangan'])) {
                $data->laporan->update(['keterangan' => $validated['keterangan']]);
            }

            $data->update([
                'user_id' => $validated['user_id'],
                'dosen_id' => $validated['dosen_id'],
                'tanggal_mulai' => $validated['tanggal_mulai'],
                'tanggal_selesai' => $validated['tanggal_selesai'],
                'status' => $validated['status'],
            ]);

            return redirect()->back()->with('flash', ['message' => 'Data '.$validated['type'].' berhasil diperbarui.', 'type' => 'success']);
        });
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
}
