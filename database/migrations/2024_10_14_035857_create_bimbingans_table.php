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
        Schema::create('bimbingans', function (Blueprint $table) {
            $table->id();
            $table->date('tanggal');
            $table->text('keterangan');
            $table->string('type')->nullable();
            $table->boolean('status')->default(false);
            $table->foreignId('user_id')->constrained('users');
            $table->foreignId('id_kkl')->nullable()->constrained('data_kkls')->nullOnDelete();
            $table->foreignId('id_kkn')->nullable()->constrained('data_kkns')->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bimbingans');
    }
};
