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
            $table->string('title')->nullable()->change();
            $table->string('subtitle')->nullable()->change();
            $table->string('button_text')->nullable()->change();
            $table->string('button_link')->nullable()->change();
            $table->string('cta_style')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('banners', function (Blueprint $table) {
            $table->string('title')->nullable(false)->change();
            $table->string('subtitle')->nullable(false)->change();
            $table->string('button_text')->nullable(false)->change();
            $table->string('button_link')->nullable(false)->change();
            $table->string('cta_style')->nullable(false)->change();
        });
    }
};
