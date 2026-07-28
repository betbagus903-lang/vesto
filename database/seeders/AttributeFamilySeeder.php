<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\AttributeFamily;

class AttributeFamilySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $families = [
            [
                'name' => 'Default',
                'code' => 'default',
                'attributes' => ['color', 'size', 'brand', 'material'],
                'is_user_defined' => false,
            ],
            [
                'name' => 'Clothing',
                'code' => 'clothing',
                'attributes' => ['color', 'size', 'brand', 'material', 'sleeve', 'neck', 'pattern'],
                'is_user_defined' => false,
            ],
            [
                'name' => 'Electronics',
                'code' => 'electronics',
                'attributes' => ['brand', 'model', 'color', 'storage', 'screen_size'],
                'is_user_defined' => false,
            ],
            [
                'name' => 'Accessories',
                'code' => 'accessories',
                'attributes' => ['color', 'size', 'brand', 'material', 'style'],
                'is_user_defined' => false,
            ],
        ];

        foreach ($families as $family) {
            AttributeFamily::firstOrCreate(
                ['code' => $family['code']],
                $family
            );
        }
    }
}
