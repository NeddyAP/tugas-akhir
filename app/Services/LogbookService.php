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
                $q->whereHas('user', fn($q) => $q->where('name', 'like', "%{$search}%"))
                    ->orWhere('catatan', 'like', "%{$search}%")
                    ->orWhere('keterangan', 'like', "%{$search}%");
            });
        }

        return $query->latest()->paginate($perPage);
    }

    public function create(array $data): Logbook
    {
        $type = $data['type'] ?? null;
        unset($data['type']);

        $user = auth()->user();
        if ($type === 'KKL' && $user->kkl) {
            $data['id_kkl'] = $user->kkl->id;
        } elseif ($type === 'KKN' && $user->kkn) {
            $data['id_kkn'] = $user->kkn->id;
        }

        return Logbook::create($data + ['user_id' => $user->id]);
    }

    public function update(Logbook $logbook, array $data): bool
    {
        return $logbook->update($data + ['updated_at' => now()]);
    }

    public function delete(Logbook $logbook): bool
    {
        return $logbook->delete();
    }

    public function getUserLogbooks($userId, $search = null, $type = null)
    {
        $query = Logbook::where('user_id', $userId);

        if ($type === 'KKL') {
            $query->whereNotNull('id_kkl');
        } elseif ($type === 'KKN') {
            $query->whereNotNull('id_kkn');
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('catatan', 'like', "%{$search}%")
                    ->orWhere('keterangan', 'like', "%{$search}%");
            });
        }

        return $query->latest()->paginate(10);
    }

    public function checkUserOwnership(Logbook $logbook, int $userId): bool
    {
        return $logbook->user_id === $userId;
    }

    public function getDosenMahasiswaLogbooks(int $dosenId, ?string $search = null, ?string $type = null, int $perPage = 10): LengthAwarePaginator
    {
        return Logbook::with([
            'user.profilable',
            'kkl.mahasiswa.profilable',
            'kkn.mahasiswa.profilable'
        ])
            ->select('logbooks.*') // Ensure we get all fields
            ->where(function ($query) use ($dosenId, $type) {
                if ($type === 'KKL') {
                    $query->whereHas('kkl', fn($q) => $q->where('dosen_id', $dosenId));
                } elseif ($type === 'KKN') {
                    $query->whereHas('kkn', fn($q) => $q->where('dosen_id', $dosenId));
                } else {
                    $query->where(function ($q) use ($dosenId) {
                        $q->whereHas('kkl', fn($q) => $q->where('dosen_id', $dosenId))
                            ->orWhereHas('kkn', fn($q) => $q->where('dosen_id', $dosenId));
                    });
                }
            })
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->whereHas('user', fn($q) => $q->where('name', 'like', "%{$search}%"))
                        ->orWhere('catatan', 'like', "%{$search}%")
                        ->orWhere('keterangan', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate($perPage);
    }
}
