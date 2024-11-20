<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Panduan extends Model
{
    protected $table = 'panduans';

    protected $fillable = [
        'title',
        'description',
        'file',
    ];
}
