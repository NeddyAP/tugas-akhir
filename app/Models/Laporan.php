<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Laporan extends Model
{
    use HasFactory;

    protected $table = 'laporans';

    protected $fillable = [
        'id',
        'user_id',
        'file',
        'keterangan',
    ];

    // Add accessor for file URL
    public function getFileUrlAttribute()
    {
        return $this->file ? Storage::url($this->file) : null;
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function dataKkl()
    {
        return $this->hasOne(DataKkl::class, 'id_laporan');
    }

    public function dataKkn()
    {
        return $this->hasOne(DataKkn::class, 'id_laporan');
    }
}
