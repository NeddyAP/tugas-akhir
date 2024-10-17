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
        'user_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
