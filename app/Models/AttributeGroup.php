<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class AttributeGroup extends Model
{
    protected $fillable = [
        'name',
        'position',
        'is_user_defined',
        'attribute_family_id',
    ];

    protected $casts = [
        'is_user_defined' => 'boolean',
    ];

    public function family(): BelongsTo
    {
        return $this->belongsTo(AttributeFamily::class, 'attribute_family_id');
    }

    public function custom_attributes(): BelongsToMany
    {
        return $this->belongsToMany(Attribute::class, 'attribute_group_mappings', 'attribute_group_id', 'attribute_id')
            ->withPivot('position')
            ->orderBy('pivot_position');
    }
}
