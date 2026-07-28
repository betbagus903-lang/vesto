<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class AttributeFamilyUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $familyId = $this->route('attribute_family') ?? $this->route('id');

        return [
            'code' => 'required|string|max:255|unique:attribute_families,code,' . $familyId,
            'name' => 'required|string|max:255',
            'status' => 'boolean',
            'groups' => 'required|array|min:1',
            'groups.*.id' => 'nullable',
            'groups.*.name' => 'required|string|max:255',
            'groups.*.position' => 'required|integer',
            'groups.*.attribute_ids' => 'nullable|array',
            'groups.*.attribute_ids.*' => 'required|exists:attributes,id',
        ];
    }
}
