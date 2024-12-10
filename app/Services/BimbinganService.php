<?php

namespace App\Services;

use App\Models\Bimbingan;
use Illuminate\Pagination\LengthAwarePaginator;

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
        return Bimbingan::with(['user.profilable', 'kkl', 'kkn'])
            ->whereHas('user', function ($query) use ($dosenId, $type) {
                $query->when($type === 'KKL', function ($q) use ($dosenId) {
                    $q->whereHas('kkl', fn ($q) => $q->where('dosen_id', $dosenId));
                })->when($type === 'KKN', function ($q) use ($dosenId) {
                    $q->whereHas('kkn', fn ($q) => $q->where('dosen_id', $dosenId));
                })->when(! $type, function ($q) use ($dosenId) {
                    $q->whereHas('kkl', fn ($q) => $q->where('dosen_id', $dosenId))
                        ->orWhereHas('kkn', fn ($q) => $q->where('dosen_id', $dosenId));
                });
            })
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->whereHas('user', fn ($q) => $q->where('name', 'like', "%{$search}%"))
                        ->orWhere('catatan', 'like', "%{$search}%")
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
