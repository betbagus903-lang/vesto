<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Shipment extends Model
{
    protected $fillable = [
        'shipment_number', 'order_id', 'status', 'carrier', 'tracking_number', 'notes',
    ];

    protected static function booted(): void
    {
        static::creating(function (Shipment $shipment) {
            if (empty($shipment->shipment_number)) {
                $shipment->shipment_number = 'SHP-' . strtoupper(uniqid());
            }
        });
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }
}
