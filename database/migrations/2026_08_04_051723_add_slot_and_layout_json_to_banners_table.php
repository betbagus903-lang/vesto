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
            $table->string('slot')->nullable()->after('type')->comment('Slot identifier for where banner is displayed (e.g., home_hero, shop_top, promo_1)');
            $table->json('layout_json')->nullable()->after('collection_id')->comment('Block-based layout configuration');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('banners', function (Blueprint $table) {
            $table->dropColumn(['slot', 'layout_json']);
        });
    }
};
