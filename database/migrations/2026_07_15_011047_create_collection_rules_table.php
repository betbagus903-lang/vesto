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
        Schema::create('collection_rules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('collection_id')->constrained()->onDelete('cascade');
            $table->string('field'); // category, product_type, brand, attribute, price, discount, stock, status, created_date, etc.
            $table->string('operator'); // =, !=, >, <, >=, <=, contains, in, not_in, etc.
            $table->text('value')->nullable(); // JSON or string value
            $table->enum('logical_operator', ['AND', 'OR'])->default('AND');
            $table->foreignId('parent_id')->nullable()->constrained('collection_rules')->onDelete('cascade');
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('collection_rules');
    }
};
