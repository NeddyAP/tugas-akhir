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
                'filkom@unida.ac.id',
                '02518240773',
            ],
            'sistem_online' => [
                'Pendaftaran Online' => 'https://unida.ac.id/pmb',
                'E-Learning' => 'https://cool.unida.ac.id/',
                'Jurnal' => 'https://ojs.unida.ac.id/',
                'Jurnal Internasional' => 'https://iojs.unida.ac.id/',
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
