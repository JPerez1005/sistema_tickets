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
        Schema::create('historias', function (Blueprint $table) {
            $table->id();
            $table->enum('accion', ['creacion', 'cambio_estado', 'modificacion']);
            $table->string('descripcion');
            $table->enum('entidad_afectada', ['usuarios', 'tickets']);
            
            $table->integer('usuario_modificado_id')->nullable(); // Permitir valores nulos
            $table->unsignedBigInteger('tickets_id')->nullable(); // Tickets_id también permite nulos
            $table->foreign('tickets_id')->references('id')->on('tickets')->nullOnDelete();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('historias');
    }
};
