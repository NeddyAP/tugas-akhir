<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $fillable = [
        'sistem_online',
        'related_links',
        'contact_info',
        'social_links',
    ];

    protected $casts = [
        'sistem_online' => 'array',
        'related_links' => 'array',
        'contact_info' => 'array',
        'social_links' => 'array',
    ];

    public static function get($key = null)
    {
        $settings = static::first();

        if (!$settings) {
            $settings = static::create();
        }

        return $key ? $settings->$key : $settings;
    }
}
