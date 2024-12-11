<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DataKkl extends Model
{
    protected $table = 'data_kkls';

    protected $fillable = [
        'user_id',
        'dosen_id',
        'id_laporan',
        'tanggal_mulai',
        'tanggal_selesai',
        'status',
    ];

    public function mahasiswa()
    {
        return $this->belongsTo(User::class, 'user_id')
            ->where('role', User::ROLE_MAHASISWA);
    }

    public function pembimbing()
    {
        return $this->belongsTo(User::class, 'dosen_id')
            ->where('role', User::ROLE_DOSEN);
    }

    public function laporan()
    {
        return $this->belongsTo(Laporan::class, 'id_laporan');
    }

    public function logbooks()
    {
        return $this->hasMany(Logbook::class, 'id_kkl');
    }

    public function bimbingans()
    {
        return $this->hasMany(Bimbingan::class, 'id_kkl');
    }
}
