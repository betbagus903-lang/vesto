<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Achievement extends Model
{
    protected $fillable = [
        'month_year',
        'target_amount',
        'current_revenue',
        'progress_percentage',
        'target_achieved',
        'processed',
    ];
}
