<?php

namespace App\Policies;

use App\Models\Bimbingan;
use App\Models\User;

class BimbinganPolicy
{
    public function update(User $user, Bimbingan $bimbingan): bool
    {
        return $user->id === $bimbingan->user_id;
    }

    public function delete(User $user, Bimbingan $bimbingan): bool
    {
        return $user->id === $bimbingan->user_id;
    }
}
