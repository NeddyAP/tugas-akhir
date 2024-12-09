<?php

namespace App\Services;

use App\Models\Logbook;
use Illuminate\Pagination\LengthAwarePaginator;

class LogbookService
{
    public function getFilteredLogbooks(?string $search = null, int $perPage = 10): LengthAwarePaginator
    {
        $query = Logbook::with('user');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->whereHas('user', fn ($q) => $q->where('name', 'like', "%{$search}%"))
                    ->orWhere('catatan', 'like', "%{$search}%")
                    ->orWhere('keterangan', 'like', "%{$search}%");
            });
        }

        return $query->latest()->paginate($perPage);
    }

    public function create(array $data): Logbook
    {
        return Logbook::create($data + ['user_id' => auth()->id()]);
    }

    public function update(Logbook $logbook, array $data): bool
    {
        return $logbook->update($data + ['updated_at' => now()]);
    }

    public function delete(Logbook $logbook): bool
    {
        return $logbook->delete();
    }

    public function getUserLogbooks(int $userId, int $perPage = 10): LengthAwarePaginator
    {
        return Logbook::where('user_id', $userId)
            ->latest()
            ->paginate($perPage);
    }

    public function checkUserOwnership(Logbook $logbook, int $userId): bool
    {
        return $logbook->user_id === $userId;
    }
}
