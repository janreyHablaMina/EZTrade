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
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone')->nullable();
            $table->enum('role', ['User', 'Ambassador'])->default('User');
            $table->enum('status', ['Active', 'Inactive', 'Suspended'])->default('Active');
            $table->enum('kyc_status', ['Verified', 'Not Verified'])->default('Not Verified');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['phone', 'role', 'status', 'kyc_status']);
        });
    }
};
