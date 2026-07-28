<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ReviewReply extends Model
{
    protected $fillable = [
        'review_id',
        'user_id',
        'parent_id',
        'comment',
        'is_admin',
    ];

    protected $casts = [
        'is_admin' => 'boolean',
    ];

    public function review(): BelongsTo
    {
        return $this->belongsTo(Review::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(ReviewReply::class, 'parent_id');
    }

    public function replies(): HasMany
    {
        return $this->hasMany(ReviewReply::class, 'parent_id');
    }
}
