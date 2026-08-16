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
        Schema::create('vip_plans', function (Blueprint $table) {
            $table->id();
            $table->string('level');
            $table->decimal('min_deposit', 10, 2);
            $table->decimal('daily_profit_percent', 5, 2);
            $table->integer('duration_days');
            $table->string('status')->default('Active');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vip_plans');
    }
};
