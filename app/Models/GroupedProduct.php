<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GroupedProduct extends Model
{
    protected $fillable = [
        'parent_product_id',
        'associated_product_id',
        'quantity',
        'position',
    ];

    public function parentProduct(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'parent_product_id');
    }

    public function associatedProduct(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'associated_product_id');
    }
}
