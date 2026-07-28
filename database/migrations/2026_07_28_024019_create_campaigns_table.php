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
        Schema::create('campaigns', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('banner')->nullable();
            $table->enum('campaign_type', ['homepage', 'collection', 'category', 'product'])->default('homepage');
            $table->date('start_date');
            $table->date('end_date');
            $table->enum('status', ['draft', 'scheduled', 'active', 'expired', 'finished'])->default('draft');
            $table->unsignedBigInteger('target_category_id')->nullable();
            $table->unsignedBigInteger('target_collection_id')->nullable();
            $table->json('target_products')->nullable();
            $table->string('button_text')->nullable();
            $table->string('button_url')->nullable();
            $table->integer('priority')->default(1);
            $table->integer('views')->default(0);
            $table->integer('clicks')->default(0);
            $table->decimal('ctr', 5, 2)->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('campaigns');
    }
};
