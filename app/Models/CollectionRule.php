<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CollectionRule extends Model
{
    protected $fillable = [
        'collection_id',
        'field',
        'operator',
        'value',
        'logical_operator',
        'parent_id',
        'sort_order',
    ];

    protected $casts = [
        'value' => 'array',
    ];

    public function collection(): BelongsTo
    {
        return $this->belongsTo(Collection::class);
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(CollectionRule::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(CollectionRule::class, 'parent_id')->orderBy('sort_order');
    }
}
