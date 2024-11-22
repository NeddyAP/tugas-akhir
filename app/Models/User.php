<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    // Role constants
    const ROLE_SUPERADMIN = 'superadmin';

    const ROLE_ADMIN = 'admin';

    const ROLE_MAHASISWA = 'mahasiswa';

    const ROLE_DOSEN = 'dosen';

    // Role checker methods
    public function isSuperAdmin()
    {
        return $this->role === self::ROLE_SUPERADMIN;
    }

    public function isAdmin()
    {
        return $this->role === self::ROLE_ADMIN;
    }

    public function isMahasiswa()
    {
        return $this->role === self::ROLE_MAHASISWA;
    }

    public function isDosen()
    {
        return $this->role === self::ROLE_DOSEN;
    }

    // Scope untuk filter berdasarkan role
    public function scopeMahasiswa($query)
    {
        return $query->where('role', self::ROLE_MAHASISWA)
                    ->with('profilable');
    }

    public function scopeDosen($query)
    {
        return $query->where('role', self::ROLE_DOSEN)
                    ->with('profilable');
    }

    public function scopeAdmin($query)
    {
        return $query->whereIn('role', [self::ROLE_ADMIN, self::ROLE_SUPERADMIN])
                    ->with('profilable');
    }

    public function logbook()
    {
        return $this->hasMany(Logbook::class);
    }

    public function laporan()
    {
        return $this->hasMany(Laporan::class);
    }

    public function bimbingan()
    {
        return $this->hasMany(Bimbingan::class);
    }

    public function dataKkl()
    {
        return $this->hasOne(DataKkl::class);
    }

    public function dataKkn()
    {
        return $this->hasOne(DataKkn::class);
    }

    public function profilable(): MorphTo
    {
        return $this->morphTo();
    }
}
