<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Banner extends Model
{
    protected $fillable = [
        'type',
        'slot',
        'title',
        'subtitle',
        'image',
        'video',
        'button_text',
        'button_link',
        'link_type',
        'link_id',
        'collection_id',
        'layout_json',
        'animations',
        'is_active',
        'featured',
        'open_in_new_tab',
        'sort_order',
        'start_date',
        'end_date',
        'cta_style',
        'text_alignment',
        'text_color',
        'display_devices',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'layout_json' => 'array',
        'animations' => 'array',
        'display_devices' => 'array',
    ];

    public function collection(): BelongsTo
    {
        return $this->belongsTo(Collection::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true)
            ->where(function ($q) {
                $q->whereNull('start_date')
                    ->orWhere('start_date', '<=', now());
            })
            ->where(function ($q) {
                $q->whereNull('end_date')
                    ->orWhere('end_date', '>=', now());
            });
    }

    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    public function scopeBySlot($query, $slot)
    {
        return $query->where('slot', $slot);
    }

    public function scopeSorted($query)
    {
        return $query->orderBy('sort_order')->orderBy('created_at', 'desc');
    }
}
