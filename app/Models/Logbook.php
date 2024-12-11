<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Logbook extends Model
{
    use HasFactory;

    protected $table = 'logbooks';

    protected $fillable = [
        'tanggal',
        'catatan',
        'keterangan',
        'type',
        'id_kkl',
        'id_kkn',
        'user_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function kkl()
    {
        return $this->belongsTo(DataKkl::class, 'id_kkl');
    }

    public function kkn()
    {
        return $this->belongsTo(DataKkn::class, 'id_kkn');
    }

    // Helper method to determine the type
    public function getTypeAttribute()
    {
        if ($this->id_kkl) {
            return 'KKL';
        }
        if ($this->id_kkn) {
            return 'KKN';
        }

        return 'Undefined';
    }
}
