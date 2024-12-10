<?php

namespace App\Services;

use App\Models\Bimbingan;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class BimbinganService
{
    public function getUserBimbingans(int $userId, int $perPage = 10): LengthAwarePaginator
    {
        return Bimbingan::where('user_id', $userId)
            ->latest()
            ->paginate($perPage);
    }

    public function getDosenMahasiswaBimbingans(int $dosenId, ?string $search = null, ?string $type = null, int $perPage = 10): LengthAwarePaginator
    {
        return Bimbingan::with(['user'])
            ->where(function ($query) use ($dosenId, $type) {
                if ($type === 'KKL') {
                    $query->whereExists(function ($q) use ($dosenId) {
                        $q->select(DB::raw(1))
                            ->from('data_kkls')
                            ->whereColumn('data_kkls.id_bimbingan', 'bimbingans.id')
                            ->where('data_kkls.dosen_id', $dosenId);
                    });
                } elseif ($type === 'KKN') {
                    $query->whereExists(function ($q) use ($dosenId) {
                        $q->select(DB::raw(1))
                            ->from('data_kkns')
                            ->whereColumn('data_kkns.id_bimbingan', 'bimbingans.id')
                            ->where('data_kkns.dosen_id', $dosenId);
                    });
                } else {
                    $query->where(function ($q) use ($dosenId) {
                        $q->whereExists(function ($subQ) use ($dosenId) {
                            $subQ->select(DB::raw(1))
                                ->from('data_kkls')
                                ->whereColumn('data_kkls.id_bimbingan', 'bimbingans.id')
                                ->where('data_kkls.dosen_id', $dosenId);
                        })->orWhereExists(function ($subQ) use ($dosenId) {
                            $subQ->select(DB::raw(1))
                                ->from('data_kkns')
                                ->whereColumn('data_kkns.id_bimbingan', 'bimbingans.id')
                                ->where('data_kkns.dosen_id', $dosenId);
                        });
                    });
                }
            })
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->whereHas('user', fn($q) => $q->where('name', 'like', "%{$search}%"))
                        ->orWhere('keterangan', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate($perPage);
    }

    public function create(array $data): Bimbingan
    {
        return Bimbingan::create($data + ['user_id' => auth()->id()]);
    }

    public function update(Bimbingan $bimbingan, array $data): bool
    {
        return $bimbingan->update($data);
    }

    public function delete(Bimbingan $bimbingan): bool
    {
        return $bimbingan->delete();
    }

    public function checkUserOwnership(Bimbingan $bimbingan, int $userId): bool
    {
        return $bimbingan->user_id === $userId;
    }
}
