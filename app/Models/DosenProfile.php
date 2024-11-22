<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DosenProfile extends Model
{
    use SoftDeletes;

    protected $fillable = ['nip', 'phone', 'address'];

    public function user()
    {
        return $this->morphOne(User::class, 'profilable');
    }
}
