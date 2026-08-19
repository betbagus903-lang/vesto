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
        Schema::create('achievements', function (Blueprint $table) {
            $table->id();
            $table->string('month_year', 7); // Format: YYYY-MM
            $table->decimal('target_amount', 15, 2)->default(0);
            $table->decimal('current_revenue', 15, 2)->default(0);
            $table->decimal('progress_percentage', 5, 2)->default(0);
            $table->boolean('target_achieved')->default(false);
            $table->boolean('processed')->default(false); // Whether this month has been processed for victories
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('achievements');
    }
};
