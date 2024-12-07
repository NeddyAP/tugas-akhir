<?php

namespace App\Services;

use App\Http\Traits\ResponseTrait;
use Illuminate\Support\Facades\DB;

class ProfileService
{
    use ResponseTrait;

    public function updateProfile($user, array $data)
    {
        try {
            DB::transaction(function () use ($user, $data) {
                $user->update([
                    'name' => $data['name'],
                    'email' => $data['email'],
                ]);

                $profileData = $this->buildProfileData($user->role, $data);
                $user->profilable->update($profileData);
            });

            return [
                'status' => 'success',
                'message' => 'Profile berhasil diubah'
            ];
        } catch (\Exception $e) {
            return [
                'status' => 'error',
                'message' => 'Profile gagal diubah'
            ];
        }
    }

    private function buildProfileData(string $role, array $data): array
    {
        $profileData = [
            'phone' => $data['phone'],
            'address' => $data['address'],
        ];

        return match ($role) {
            'mahasiswa' => array_merge($profileData, [
                'nim' => $data['nim'],
                'angkatan' => $data['angkatan'],
                'prodi' => $data['prodi'],
                'fakultas' => $data['fakultas'],
            ]),
            'dosen' => array_merge($profileData, [
                'nip' => $data['nip']
            ]),
            default => $profileData
        };
    }
}
