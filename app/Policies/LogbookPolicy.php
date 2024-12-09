<?php

namespace App\Policies;

use App\Models\Logbook;
use App\Models\User;

class LogbookPolicy
{
    public function update(User $user, Logbook $logbook): bool
    {
        return $user->id === $logbook->user_id;
    }

    public function delete(User $user, Logbook $logbook): bool
    {
        return $user->id === $logbook->user_id;
    }
}
