<?php

namespace App\Policies;

use App\Models\{User, Logbook};

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
