<?php

namespace Database\Seeders;

use App\Models\Bimbingan;
use App\Models\Laporan;
use App\Models\Logbook;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {

        User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@gmail.com',
            'role' => 'admin',
            'password' => Hash::make('admin'),
        ]);

        User::factory()->create([
            'name' => 'Super Admin',
            'email' => 'superadmin@gmail.com',
            'role' => 'superadmin',
            'password' => Hash::make('superadmin'),
        ]);

        User::factory()->create([
            'name' => 'Mahasiswa User',
            'email' => 'mahasiswa@gmail.com',
            'nim' => '123456789',
            'role' => 'mahasiswa',
            'password' => Hash::make('mahasiswa'),
        ]);

        User::factory()->create([
            'name' => 'Dosen User',
            'email' => 'dosen@gmail.com',
            'nip' => '987654321',
            'role' => 'dosen',
            'password' => Hash::make('dosen'),
        ]);

        Bimbingan::factory()->create([
            'user_id' => 1,
            'tanggal' => '2024-10-13',
            'keterangan' => 'Bimbingan kedua',
        ]);

        Laporan::factory()->create([
            'user_id' => 1,
            'tanggal' => '2024-10-13',
            'catatan' => 'Laporan kedua',
        ]);

        Logbook::factory()->create([
            'user_id' => 1,
            'tanggal' => '2024-10-13',
            'catatan' => 'Logbook kedua',
            'keterangan' => 'Logbook kedua',
        ]);
    }
}
