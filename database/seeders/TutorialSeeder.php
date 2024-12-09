<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TutorialSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('tutorials')->insert([
            'title' => 'Pengenalan Laravel',
            'description' => 'Pelajari dasar-dasar framework Laravel termasuk routing, controller, dan model',
            'link' => 'Mrdsg_8CU1Q',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
