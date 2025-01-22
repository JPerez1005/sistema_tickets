<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tickets extends Model
{
    
    public $timestamps = true;

    protected $fillable = ['titulo','descripcion','estado','respuesta','usuario_creacion','usuario_respuesta','fecha_respuesta'];

    protected $table = 'tickets';

    public static function validationRules() {
        return [
            'titulo'=>'required|min:1|max:500',
            'descripcion'=>'required|min:1|max:500',
            'estado' => 'required|in:abierto,en_proceso,cerrado,cancelado',
            'respuesta' => 'nullable|string|max:1000',
            'usuario_creacion' => 'required|integer',
            'usuario_respuesta' => 'nullable|integer',
            'fecha_respuesta' => 'nullable|date',
        ];
    }

    function historias() {
        return $this->hasMany(Historias::class);
    }
}
