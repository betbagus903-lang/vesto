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
        Schema::create('coupons', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->text('description')->nullable();
            $table->enum('discount_type', ['percentage', 'fixed', 'free_shipping', 'buy_x_get_y'])->default('percentage');
            $table->decimal('discount_value', 10, 2)->nullable();
            $table->decimal('minimum_order', 10, 2)->default(0);
            $table->decimal('maximum_discount', 10, 2)->nullable();
            $table->date('start_date')->nullable();
            $table->date('expire_date')->nullable();
            $table->integer('usage_limit')->nullable();
            $table->integer('per_customer_limit')->default(1);
            $table->integer('used_count')->default(0);
            $table->json('applicable_categories')->nullable();
            $table->json('applicable_products')->nullable();
            $table->json('customer_groups')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('coupons');
    }
};
