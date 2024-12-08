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
}
