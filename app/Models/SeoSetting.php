<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SeoSetting extends Model
{
    protected $fillable = [
        'page_type',
        'page_id',
        'meta_title',
        'meta_description',
        'keywords',
        'og_image',
        'canonical_url',
        'auto_generate_meta',
        'auto_generate_slug',
        'auto_generate_keywords',
        'auto_generate_description',
        'robots_txt',
    ];

    protected $casts = [
        'auto_generate_meta' => 'boolean',
        'auto_generate_slug' => 'boolean',
        'auto_generate_keywords' => 'boolean',
        'auto_generate_description' => 'boolean',
    ];
}
