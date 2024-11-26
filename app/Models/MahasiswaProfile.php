<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MahasiswaProfile extends Model
{
    use SoftDeletes;

    protected $fillable = ['nim', 'phone', 'address', 'angkatan', 'prodi', 'fakultas'];

    public function user()
    {
        return $this->morphOne(User::class, 'profilable');
    }
}
