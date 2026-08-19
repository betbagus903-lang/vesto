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
        Schema::table('collections', function (Blueprint $table) {
            // Add new premium fields
            $table->text('cover_image')->nullable()->after('end_date');
            $table->enum('badge', ['new', 'summer', 'trending', 'limited', 'luxury', 'exclusive'])->nullable()->after('cover_image');
            $table->string('color_theme')->default('#4F6BFF')->after('badge');
            $table->enum('visibility', ['homepage', 'category', 'search', 'featured'])->default('homepage')->after('color_theme');
            $table->enum('publish_status', ['draft', 'scheduled', 'published'])->default('draft')->after('visibility');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('collections', function (Blueprint $table) {
            $table->dropColumn(['cover_image', 'badge', 'color_theme', 'visibility', 'publish_status']);
        });
    }
};
