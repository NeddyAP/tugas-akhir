<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\AdminProfile;
use App\Models\DosenProfile;
use App\Models\MahasiswaProfile;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Create SuperAdmin with profile
        $superAdminProfile = AdminProfile::create([
            'phone' => fake()->phoneNumber(),
            'address' => fake()->address(),
        ]);

        User::create([
            'name' => 'Super Admin',
            'email' => 'superadmin@gmail.com',
            'role' => 'superadmin',
            'password' => Hash::make('admin'),
            'email_verified_at' => now(),
            'profilable_type' => AdminProfile::class,
            'profilable_id' => $superAdminProfile->id,
        ]);

        // Create Admins
        for ($i = 1; $i <= 3; $i++) {
            $profile = AdminProfile::create([
                'phone' => fake()->phoneNumber(),
                'address' => fake()->address(),
            ]);

            User::create([
                'name' => fake()->name(),
                'email' => "admin{$i}@gmail.com",
                'role' => 'admin',
                'password' => Hash::make('admin'),
                'email_verified_at' => now(),
                'profilable_type' => AdminProfile::class,
                'profilable_id' => $profile->id,
            ]);
        }

        // Create Dosen
        for ($i = 1; $i <= 15; $i++) {
            $profile = DosenProfile::create([
                'nip' => fake()->unique()->numerify('##################'),
                'phone' => fake()->phoneNumber(),
                'address' => fake()->address(),
            ]);

            User::create([
                'name' => fake()->name(),
                'email' => "dosen{$i}@gmail.com",
                'role' => 'dosen',
                'password' => Hash::make('admin'),
                'email_verified_at' => now(),
                'profilable_type' => DosenProfile::class,
                'profilable_id' => $profile->id,
            ]);
        }

        // Create Mahasiswa
        for ($i = 1; $i <= 20; $i++) {
            $profile = MahasiswaProfile::create([
                'nim' => fake()->unique()->numerify('##########'),
                'phone' => fake()->phoneNumber(),
                'address' => fake()->address(),
            ]);

            User::create([
                'name' => fake()->name(),
                'email' => "mahasiswa{$i}@gmail.com",
                'role' => 'mahasiswa',
                'password' => Hash::make('admin'),
                'email_verified_at' => now(),
                'profilable_type' => MahasiswaProfile::class,
                'profilable_id' => $profile->id,
            ]);
        }
    }
}