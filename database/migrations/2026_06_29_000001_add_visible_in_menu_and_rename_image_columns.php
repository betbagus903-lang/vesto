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
        Schema::table('categories', function (Blueprint $table) {
            // Add visible_in_menu column
            if (!Schema::hasColumn('categories', 'visible_in_menu')) {
                $table->boolean('visible_in_menu')->default(true)->after('display_mode');
            }
            
            // Rename logo_path to logo if it exists
            if (Schema::hasColumn('categories', 'logo_path')) {
                $table->renameColumn('logo_path', 'logo');
            }
            
            // Rename banner_path to banner if it exists
            if (Schema::hasColumn('categories', 'banner_path')) {
                $table->renameColumn('banner_path', 'banner');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            if (Schema::hasColumn('categories', 'visible_in_menu')) {
                $table->dropColumn('visible_in_menu');
            }
            
            if (Schema::hasColumn('categories', 'logo')) {
                $table->renameColumn('logo', 'logo_path');
            }
            
            if (Schema::hasColumn('categories', 'banner')) {
                $table->renameColumn('banner', 'banner_path');
            }
        });
    }
};
