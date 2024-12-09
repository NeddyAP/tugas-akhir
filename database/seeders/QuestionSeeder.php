<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class QuestionSeeder extends Seeder
{
    public function run(): void
    {
        $questions = [
            [
                'question' => 'Apa itu Laravel?',
                'answer' => 'Laravel adalah framework PHP open-source yang gratis.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'question' => 'Apa itu MVC?',
                'answer' => 'MVC adalah Model-View-Controller, pola arsitektur yang memisahkan aplikasi menjadi tiga komponen utama.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'question' => 'Apa itu Artisan?',
                'answer' => 'Artisan adalah antarmuka command-line yang disertakan dengan Laravel.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'question' => 'Apa itu Migration?',
                'answer' => 'Migration adalah cara untuk mengontrol versi perubahan skema database.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'question' => 'Apa itu Eloquent?',
                'answer' => 'Eloquent adalah ORM (Object-Relational Mapping) bawaan Laravel.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('questions')->insert($questions);
    }
}
