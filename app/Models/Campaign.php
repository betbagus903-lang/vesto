<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Campaign extends Model
{
    protected $fillable = [
        'name',
        'description',
        'banner',
        'campaign_type',
        'start_date',
        'end_date',
        'status',
        'target_category_id',
        'target_collection_id',
        'target_products',
        'button_text',
        'button_url',
        'priority',
        'views',
        'clicks',
        'ctr',
    ];

    protected $casts = [
        'target_products' => 'array',
        'start_date' => 'date',
        'end_date' => 'date',
    ];
}
