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

        // User::factory()->create([
        //     'name' => 'Admin',
        //     'email' => 'admin@gmail.com',
        //     'password' => Hash::make('admin'),
        // ]);

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
