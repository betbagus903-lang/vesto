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
        Schema::table('products', function (Blueprint $table) {
            $table->unsignedBigInteger('attribute_family_id')->nullable()->after('id');
            $table->string('product_number')->nullable()->after('sku');
            $table->string('url_key')->nullable()->after('slug');
            $table->decimal('special_price', 10, 2)->nullable()->after('price');
            $table->timestamp('special_price_from')->nullable()->after('special_price');
            $table->timestamp('special_price_to')->nullable()->after('special_price_from');
            $table->decimal('cost_price', 10, 2)->nullable()->after('special_price_to');
            $table->decimal('weight', 10, 2)->nullable()->after('stock');
            $table->decimal('width', 10, 2)->nullable()->after('weight');
            $table->decimal('height', 10, 2)->nullable()->after('width');
            $table->decimal('length', 10, 2)->nullable()->after('height');
            $table->unsignedBigInteger('tax_category_id')->nullable()->after('length');
            $table->string('meta_title')->nullable()->after('description');
            $table->text('meta_keywords')->nullable()->after('meta_title');
            $table->text('meta_description')->nullable()->after('meta_keywords');
            $table->boolean('new')->default(false)->after('is_featured');
            $table->boolean('featured')->default(false)->after('new');
            $table->boolean('visible_individually')->default(true)->after('featured');
            $table->boolean('status')->default(true)->after('visible_individually');
            $table->boolean('guest_checkout')->default(true)->after('status');
            $table->boolean('allow_rma')->default(false)->after('guest_checkout');
            $table->text('rma_rules')->nullable()->after('allow_rma');
            $table->json('videos')->nullable()->after('image');
            
            $table->foreign('attribute_family_id')->references('id')->on('attribute_families')->onDelete('set null');
            $table->foreign('tax_category_id')->references('id')->on('tax_categories')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropForeign(['attribute_family_id']);
            $table->dropForeign(['tax_category_id']);
            $table->dropColumn([
                'attribute_family_id',
                'product_number',
                'url_key',
                'special_price',
                'special_price_from',
                'special_price_to',
                'cost_price',
                'weight',
                'width',
                'height',
                'length',
                'tax_category_id',
                'meta_title',
                'meta_keywords',
                'meta_description',
                'new',
                'featured',
                'visible_individually',
                'status',
                'guest_checkout',
                'allow_rma',
                'rma_rules',
                'videos',
            ]);
        });
    }
};
