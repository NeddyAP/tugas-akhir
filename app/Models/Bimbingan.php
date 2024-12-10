<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bimbingan extends Model
{
    use HasFactory;

    protected $table = 'bimbingans';

    protected $fillable = [
        'tanggal',
        'keterangan',
        'status',
        'user_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function kkl()
    {
        return $this->hasOne(DataKkl::class, 'id_bimbingan');
    }

    public function kkn()
    {
        return $this->hasOne(DataKkn::class, 'id_bimbingan');
    }

    // Helper method to determine the type
    public function getTypeAttribute()
    {
        if ($this->kkl) {
            return 'KKL';
        }
        if ($this->kkn) {
            return 'KKN';
        }

        return 'Undefined';
    }
}
