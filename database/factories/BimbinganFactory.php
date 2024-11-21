<?php

namespace Database\Factories;

use App\Models\Bimbingan;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Bimbingan>
 */
class BimbinganFactory extends Factory
{
    protected $model = Bimbingan::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'tanggal' => $this->faker->date(),
            'keterangan' => $this->faker->sentence(),
        ];
    }
}
