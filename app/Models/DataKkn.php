<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DataKkn extends Model
{
    protected $table = 'data_kkns';

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
}
