<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderAddress extends Model
{
    protected $fillable = [
        'order_id',
        'first_name',
        'last_name',
        'email',
        'phone',
        'address',
        'city',
        'province',
        'postal_code',
        'country',
        'address_type', // 'billing' or 'shipping'
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
