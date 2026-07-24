<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('room_players', function (Blueprint $table) {
            $table->id();
            $table->foreignId('room_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('team')->nullable(); // A | B, set after the draw
            $table->timestamps();

            $table->unique(['room_id', 'user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('room_players');
    }
};
