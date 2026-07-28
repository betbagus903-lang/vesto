<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Fix products table - remove old category_id column if it exists
        if (Schema::hasColumn('products', 'category_id')) {
            Schema::table('products', function (Blueprint $table) {
                $table->dropForeign(['category_id']);
                $table->dropColumn('category_id');
            });
        }

        // Ensure all necessary columns exist for products
        Schema::table('products', function (Blueprint $table) {
            // Add missing columns if they don't exist
            if (!Schema::hasColumn('products', 'compare_at_price')) {
                $table->decimal('compare_at_price', 12, 2)->nullable()->after('price');
            }
            
            if (!Schema::hasColumn('products', 'image')) {
                $table->string('image')->nullable()->after('stock');
            }
            
            if (!Schema::hasColumn('products', 'images')) {
                $table->json('images')->nullable()->after('image');
            }
        });

        // Fix categories table
        Schema::table('categories', function (Blueprint $table) {
            // Ensure all columns exist
            $columns = [
                'parent_id',
                'position',
                'display_mode',
                'visible_in_menu',
                'logo_path',
                'banner_path',
                'meta_title',
                'meta_keywords',
                'meta_description'
            ];
            
            foreach ($columns as $column) {
                if (!Schema::hasColumn('categories', $column)) {
                    $this->addCategoryColumn($table, $column);
                }
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Don't rollback these fixes
    }

    /**
     * Add category column based on name
     */
    private function addCategoryColumn(Blueprint $table, string $column): void
    {
        switch ($column) {
            case 'parent_id':
                $table->unsignedBigInteger('parent_id')->nullable()->after('id');
                $table->foreign('parent_id')->references('id')->on('categories')->onDelete('set null');
                break;
            case 'position':
                $table->integer('position')->default(0)->after('description');
                break;
            case 'display_mode':
                $table->string('display_mode')->default('products_and_description')->after('position');
                break;
            case 'visible_in_menu':
                $table->boolean('visible_in_menu')->default(true)->after('display_mode');
                break;
            case 'logo_path':
                $table->string('logo_path')->nullable()->after('visible_in_menu');
                break;
            case 'banner_path':
                $table->string('banner_path')->nullable()->after('logo_path');
                break;
            case 'meta_title':
                $table->string('meta_title')->nullable()->after('banner_path');
                break;
            case 'meta_keywords':
                $table->text('meta_keywords')->nullable()->after('meta_title');
                break;
            case 'meta_description':
                $table->text('meta_description')->nullable()->after('meta_keywords');
                break;
        }
    }
};