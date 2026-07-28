<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class AttributeUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $attributeId = $this->route('attribute') ?? $this->route('id');

        return [
            'code' => 'required|string|max:255|unique:attributes,code,' . $attributeId,
            'admin_name' => 'required|string|max:255',
            'type' => 'required|string|in:text,textarea,boolean,select,multiselect,price,date,datetime,image',
            'validation' => 'nullable|string',
            'position' => 'nullable|integer',
            'is_required' => 'boolean',
            'is_unique' => 'boolean',
            'value_per_locale' => 'boolean',
            'value_per_channel' => 'boolean',
            'is_filterable' => 'boolean',
            'is_configurable' => 'boolean',
            'is_visible_on_front' => 'boolean',
            'is_comparable' => 'boolean',
            'options' => 'required_if:type,select,multiselect|array',
            'options.*.id' => 'nullable',
            'options.*.admin_name' => 'required_with:options|string|max:255',
            'options.*.sort_order' => 'nullable|integer',
        ];
    }
}
