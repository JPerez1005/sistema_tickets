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
        Schema::create('tickets', function (Blueprint $table) {
            $table->id();
            $table->string('titulo');
            $table->string('descripcion');
            $table->string('respuesta')->nullable();
            $table->integer('usuario_creacion')->nullable();
            $table->integer('usuario_respuesta')->nullable();
            $table->timestamp('fecha_respuesta')->nullable();
            $table->enum('estado', ['abierto', 'en_proceso', 'cerrado', 'cancelado']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tickets');
    }
};
