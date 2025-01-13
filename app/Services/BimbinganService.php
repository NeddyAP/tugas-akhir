<?php

namespace App\Services;

use App\Models\Bimbingan;
use Illuminate\Pagination\LengthAwarePaginator;

class BimbinganService
{
    public function getUserBimbingans(int $userId, ?string $search = null, ?string $type = null, int $perPage = 10): LengthAwarePaginator
    {
        $query = Bimbingan::where('user_id', $userId);

        if ($type === 'KKL') {
            $query->whereNotNull('id_kkl');
        } elseif ($type === 'KKN') {
            $query->whereNotNull('id_kkn');
        }

        if ($search) {
            $query->where(function ($q) use ($search): void {
                $q->where('keterangan', 'like', "%{$search}%");
            });
        }

        return $query->latest()->paginate($perPage);
    }

    public function getDosenMahasiswaBimbingans(int $dosenId, ?string $search = null, ?string $type = null, int $perPage = 10): LengthAwarePaginator
    {
        return Bimbingan::with([
            'user.profilable',
            'kkl.mahasiswa.profilable',
            'kkn.mahasiswa.profilable',
        ])
            ->select('bimbingans.*')
            ->where(function ($query) use ($dosenId, $type): void {
                if ($type === 'KKL') {
                    $query->whereHas('kkl', fn ($q) => $q->where('dosen_id', $dosenId));
                } elseif ($type === 'KKN') {
                    $query->whereHas('kkn', fn ($q) => $q->where('dosen_id', $dosenId));
                } else {
                    $query->where(function ($q) use ($dosenId): void {
                        $q->whereHas('kkl', fn ($q) => $q->where('dosen_id', $dosenId))
                            ->orWhereHas('kkn', fn ($q) => $q->where('dosen_id', $dosenId));
                    });
                }
            })
            ->when($search, function ($query) use ($search): void {
                $query->where(function ($q) use ($search): void {
                    $q->whereHas('user', fn ($q) => $q->where('name', 'like', "%{$search}%"))
                        ->orWhere('keterangan', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate($perPage);
    }

    public function create(array $data): Bimbingan
    {
        $type = $data['type'] ?? null;
        unset($data['type']);

        $user = auth()->user();
        if ($type === 'KKL' && $user->kkl) {
            $data['id_kkl'] = $user->kkl->id;
        } elseif ($type === 'KKN' && $user->kkn) {
            $data['id_kkn'] = $user->kkn->id;
        }

        return Bimbingan::create($data + ['user_id' => $user->id]);
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
