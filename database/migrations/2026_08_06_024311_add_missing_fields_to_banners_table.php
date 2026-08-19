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
        Schema::table('banners', function (Blueprint $table) {
            // Only add columns that don't exist yet
            if (!Schema::hasColumn('banners', 'cta_style')) {
                $table->string('cta_style')->nullable();
            }
            if (!Schema::hasColumn('banners', 'text_alignment')) {
                $table->string('text_alignment')->nullable();
            }
            if (!Schema::hasColumn('banners', 'text_color')) {
                $table->string('text_color')->nullable();
            }
            if (!Schema::hasColumn('banners', 'display_devices')) {
                $table->json('display_devices')->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('banners', function (Blueprint $table) {
            $table->dropColumn(['featured', 'open_in_new_tab', 'cta_style', 'text_alignment', 'text_color', 'display_devices']);
        });
    }
};
