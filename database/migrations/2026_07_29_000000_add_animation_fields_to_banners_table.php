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
            $table->enum('animation_type', ['none', 'slide', 'fade', 'zoom', 'flip', 'bounce'])->default('none')->after('image');
            $table->integer('animation_duration')->default(3000)->after('animation_type');
            $table->string('background_color')->nullable()->after('animation_duration');
            $table->string('product_image')->nullable()->after('background_color');
            $table->string('animation_easing')->default('ease-in-out')->after('product_image');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('banners', function (Blueprint $table) {
            $table->dropColumn([
                'animation_type',
                'animation_duration',
                'background_color',
                'product_image',
                'animation_easing',
            ]);
        });
    }
};
