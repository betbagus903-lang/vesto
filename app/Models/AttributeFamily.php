<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AttributeFamily extends Model
{
    protected $fillable = [
        'code',
        'name',
        'status',
        'is_user_defined',
    ];

    protected $casts = [
        'status' => 'boolean',
        'is_user_defined' => 'boolean',
    ];

    public function groups(): HasMany
    {
        return $this->hasMany(AttributeGroup::class, 'attribute_family_id')->orderBy('position');
    }

    /**
     * Helper to get all custom attributes associated with this family
     */
    public function custom_attributes()
    {
        return Attribute::join('attribute_group_mappings', 'attributes.id', '=', 'attribute_group_mappings.attribute_id')
            ->join('attribute_groups', 'attribute_group_mappings.attribute_group_id', '=', 'attribute_groups.id')
            ->where('attribute_groups.attribute_family_id', $this->id)
            ->select('attributes.*', 'attribute_group_mappings.position as pivot_position')
            ->orderBy('attribute_groups.position')
            ->orderBy('attribute_group_mappings.position');
    }
}
