<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Review extends Model
{
    protected $fillable = [
        'user_id',
        'product_id',
        'variant_id',
        'order_id',
        'rating',
        'title',
        'comment',
        'images',
        'status',
    ];

    protected $casts = [
        'rating' => 'integer',
        'images' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function variant(): BelongsTo
    {
        return $this->belongsTo(ProductVariant::class);
    }

    public function replies()
    {
        return $this->hasMany(ReviewReply::class);
    }

    public function helpfulLikes()
    {
        return $this->hasMany(\App\Models\ReviewHelpfulLike::class);
    }
}
