<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductAttributeValue extends Model
{
    protected $table = 'product_attribute_values';

    protected $fillable = [
        'product_id',
        'attribute_id',
        'text_value',
        'boolean_value',
        'integer_value',
        'float_value',
        'datetime_value',
        'date_value',
        'json_value',
    ];

    protected $casts = [
        'boolean_value' => 'boolean',
        'integer_value' => 'integer',
        'float_value' => 'float',
        'datetime_value' => 'datetime',
        'date_value' => 'date',
        'json_value' => 'array',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function attribute(): BelongsTo
    {
        return $this->belongsTo(Attribute::class);
    }

    public static function buildPayload($attribute, $rawValue)
    {
        $payload = [
            'text_value' => null,
            'boolean_value' => null,
            'integer_value' => null,
            'float_value' => null,
            'datetime_value' => null,
            'date_value' => null,
            'json_value' => null,
        ];

        if (is_null($rawValue) || $rawValue === '') {
            return $payload;
        }

        switch ($attribute->type) {
            case 'boolean':
                $payload['boolean_value'] = filter_var($rawValue, FILTER_VALIDATE_BOOLEAN);
                break;
            case 'integer':
                $payload['integer_value'] = (int)$rawValue;
                break;
            case 'price':
                $payload['float_value'] = (float)$rawValue;
                break;
            case 'date':
                $payload['date_value'] = $rawValue;
                break;
            case 'datetime':
                $payload['datetime_value'] = $rawValue;
                break;
            case 'select':
                // Options are integer IDs
                $payload['integer_value'] = is_numeric($rawValue) ? (int)$rawValue : null;
                $payload['text_value'] = !is_numeric($rawValue) ? $rawValue : null;
                break;
            case 'multiselect':
                $payload['json_value'] = is_array($rawValue) ? $rawValue : (json_decode($rawValue, true) ?? [$rawValue]);
                break;
            default:
                $payload['text_value'] = $rawValue;
                break;
        }

        return $payload;
    }

    public function getValue($type = 'text')
    {
        switch ($type) {
            case 'boolean':
                return (bool)$this->boolean_value;
            case 'integer':
            case 'select':
                return $this->integer_value;
            case 'price':
                return $this->float_value;
            case 'date':
                return $this->date_value ? ($this->date_value instanceof \Carbon\Carbon ? $this->date_value->format('Y-m-d') : $this->date_value) : null;
            case 'datetime':
                return $this->datetime_value ? ($this->datetime_value instanceof \Carbon\Carbon ? $this->datetime_value->format('Y-m-d H:i:s') : $this->datetime_value) : null;
            case 'multiselect':
                return $this->json_value ?? [];
            default:
                return $this->text_value;
        }
    }
}
