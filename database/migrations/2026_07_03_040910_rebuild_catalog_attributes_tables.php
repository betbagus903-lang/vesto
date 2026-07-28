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
        // 1. Drop existing foreign keys and tables safely
        Schema::table('category_attribute', function (Blueprint $table) {
            $table->dropForeign(['attribute_id']);
            $table->dropForeign(['category_id']);
        });

        Schema::table('products', function (Blueprint $table) {
            $table->dropForeign(['attribute_family_id']);
        });

        Schema::dropIfExists('category_attribute');
        Schema::dropIfExists('attributes');
        Schema::dropIfExists('attribute_families');

        // 2. Recreate attribute_families
        Schema::create('attribute_families', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('name');
            $table->boolean('status')->default(1);
            $table->boolean('is_user_defined')->default(1);
            $table->timestamps();
        });

        // 3. Recreate attributes
        Schema::create('attributes', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('admin_name');
            $table->string('type'); // text, textarea, price, boolean, select, multiselect, datetime, date, image, file
            $table->string('validation')->nullable(); // numeric, email, decimal, url
            $table->integer('position')->nullable();
            $table->boolean('is_required')->default(0);
            $table->boolean('is_unique')->default(0);
            $table->boolean('value_per_locale')->default(0);
            $table->boolean('value_per_channel')->default(0);
            $table->boolean('is_filterable')->default(0);
            $table->boolean('is_configurable')->default(0);
            $table->boolean('is_user_defined')->default(1);
            $table->boolean('is_visible_on_front')->default(0);
            $table->boolean('is_comparable')->default(0);
            $table->timestamps();
        });

        // 4. Create attribute_options
        Schema::create('attribute_options', function (Blueprint $table) {
            $table->id();
            $table->string('admin_name');
            $table->integer('sort_order')->nullable();
            $table->foreignId('attribute_id')->constrained('attributes')->cascadeOnDelete();
            $table->timestamps();
        });

        // 5. Create attribute_groups
        Schema::create('attribute_groups', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->integer('position')->default(1);
            $table->boolean('is_user_defined')->default(1);
            $table->foreignId('attribute_family_id')->constrained('attribute_families')->cascadeOnDelete();
            $table->timestamps();
        });

        // 6. Create attribute_group_mappings (Pivot)
        Schema::create('attribute_group_mappings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('attribute_id')->constrained('attributes')->cascadeOnDelete();
            $table->foreignId('attribute_group_id')->constrained('attribute_groups')->cascadeOnDelete();
            $table->integer('position')->nullable();
            $table->timestamps();
        });

        // 7. Re-add foreign key to products
        Schema::table('products', function (Blueprint $table) {
            $table->foreign('attribute_family_id')->references('id')->on('attribute_families')->onDelete('set null');
        });

        // 8. Re-add category_attribute pivot table
        Schema::create('category_attribute', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained('categories')->cascadeOnDelete();
            $table->foreignId('attribute_id')->constrained('attributes')->cascadeOnDelete();
            $table->timestamps();
        });

        // 9. Product Attribute Values
        Schema::create('product_attribute_values', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
            $table->foreignId('attribute_id')->constrained('attributes')->cascadeOnDelete();
            $table->text('text_value')->nullable();
            $table->boolean('boolean_value')->nullable();
            $table->integer('integer_value')->nullable();
            $table->decimal('float_value', 12, 4)->nullable();
            $table->dateTime('datetime_value')->nullable();
            $table->date('date_value')->nullable();
            $table->json('json_value')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropForeign(['attribute_family_id']);
        });

        Schema::dropIfExists('product_attribute_values');
        Schema::dropIfExists('category_attribute');
        Schema::dropIfExists('attribute_group_mappings');
        Schema::dropIfExists('attribute_groups');
        Schema::dropIfExists('attribute_options');
        Schema::dropIfExists('attributes');
        Schema::dropIfExists('attribute_families');
    }
};
