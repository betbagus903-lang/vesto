<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Victory extends Model
{
    protected $fillable = [
        'total_victories',
        'last_processed_month',
    ];
}
