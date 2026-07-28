<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class AttributeFamilyStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'code' => 'required|string|max:255|unique:attribute_families,code',
            'name' => 'required|string|max:255',
            'status' => 'boolean',
            'groups' => 'required|array|min:1',
            'groups.*.name' => 'required|string|max:255',
            'groups.*.position' => 'required|integer',
            'groups.*.attribute_ids' => 'nullable|array',
            'groups.*.attribute_ids.*' => 'required|exists:attributes,id',
        ];
    }
}
