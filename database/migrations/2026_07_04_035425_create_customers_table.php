<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email')->unique();
            $table->string('phone')->nullable();
            $table->string('gender')->nullable();          // male / female / other
            $table->date('date_of_birth')->nullable();
            $table->string('status')->default('active');   // active / inactive
            $table->string('channel')->default('default'); // default / mobile / marketplace
            $table->foreignId('customer_group_id')
                  ->nullable()
                  ->constrained('customer_groups')
                  ->nullOnDelete();
            $table->string('profile_pic')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('customers');
    }
};
