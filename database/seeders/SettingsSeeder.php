<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Setting;

class SettingsSeeder extends Seeder
{
    public function run(): void
    {
        Setting::create([
            'language' => 'id',
            'contact_info' => [
                'Jl. Tol Ciawi No. 1, Ciawi-Bogor, Jawa Barat, Indonesia.',
                'info@example.com',
                '+62 123 4567 890',
            ],
            'sistem_online' => [
                'Pendaftaran Online' => 'https://siakad.example.com',
                'E-Learning' => 'https://elearning.example.com',
                'Jurnal' => 'https://library.example.com',
                'Jurnal Internasional' => 'https://library.example.com',
            ],
            'social_links' => [
                'Facebook' => 'https://facebook.com/PmbUnida',
                'Twitter' => 'https://twitter.com/PMBUnidaBogor',
                'Instagram' => 'https://www.instagram.com/faipgunida',
                'Youtube' => 'https://www.youtube.com/channel/UC9EKxYOSyg0QtOs8sAXTceQ',
                'LinkedIn' => 'https://www.linkedin.com/in/universitas-djuanda-bogor-a97702172'
            ]
        ]);
    }
}
