<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Attribute extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'admin_name',
        'type',
        'validation',
        'position',
        'is_required',
        'is_unique',
        'value_per_locale',
        'value_per_channel',
        'is_filterable',
        'is_configurable',
        'is_user_defined',
        'is_visible_on_front',
        'is_comparable',
    ];

    protected $casts = [
        'is_required'        => 'boolean',
        'is_unique'          => 'boolean',
        'value_per_locale'   => 'boolean',
        'value_per_channel'  => 'boolean',
        'is_filterable'      => 'boolean',
        'is_configurable'    => 'boolean',
        'is_user_defined'    => 'boolean',
        'is_visible_on_front'=> 'boolean',
        'is_comparable'      => 'boolean',
    ];

    /**
     * Attribute options (for select / multiselect types).
     */
    public function options(): HasMany
    {
        return $this->hasMany(AttributeOption::class)->orderBy('sort_order');
    }

    /**
     * Attribute groups that contain this attribute (via pivot).
     */
    public function attributeGroups(): BelongsToMany
    {
        return $this->belongsToMany(AttributeGroup::class, 'attribute_group_mappings')
                    ->withPivot('position')
                    ->withTimestamps();
    }

    /**
     * Whether the type requires options (select / multiselect).
     */
    public function hasOptions(): bool
    {
        return in_array($this->type, ['select', 'multiselect']);
    }
}
