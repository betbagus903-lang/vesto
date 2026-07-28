<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DownloadableProduct extends Model
{
    protected $fillable = [
        'product_id',
        'file_path',
        'sample_file_path',
        'download_limit',
        'downloads_used',
        'expiry_date',
    ];

    protected function casts(): array
    {
        return [
            'download_limit' => 'integer',
            'downloads_used' => 'integer',
            'expiry_date' => 'datetime',
        ];
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function getFileUrlAttribute(): ?string
    {
        return $this->file_path ? asset('storage/' . $this->file_path) : null;
    }

    public function getSampleFileUrlAttribute(): ?string
    {
        return $this->sample_file_path ? asset('storage/' . $this->sample_file_path) : null;
    }

    public function canDownload(): bool
    {
        if ($this->download_limit && $this->downloads_used >= $this->download_limit) {
            return false;
        }

        if ($this->expiry_date && now()->gt($this->expiry_date)) {
            return false;
        }

        return true;
    }
}
