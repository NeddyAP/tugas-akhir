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
        'id_logbook',
        'id_bimbingan',
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

    public function logbook()
    {
        return $this->belongsTo(Logbook::class, 'id_logbook');
    }

    public function bimbingan()
    {
        return $this->belongsTo(Bimbingan::class, 'id_bimbingan');
    }
}
