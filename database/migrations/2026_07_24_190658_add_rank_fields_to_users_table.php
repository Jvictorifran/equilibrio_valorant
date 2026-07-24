<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('rank_tier')->nullable()->after('email');
            $table->decimal('kd', 4, 2)->nullable()->after('rank_tier');
            $table->decimal('win_rate', 5, 2)->nullable()->after('kd');
            $table->decimal('hs_percentage', 5, 2)->nullable()->after('win_rate');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['rank_tier', 'kd', 'win_rate', 'hs_percentage']);
        });
    }
};
