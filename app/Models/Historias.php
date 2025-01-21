<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Historias extends Model
{
    public $timestamps = true;

    protected $fillable = ['accion','descripcion','entidad_afectada','usuario_modificado_id','tickets_id','user_id'];

    protected $table = 'historias';

    public static function validationRules() {
        return [
            'accion'=>'required|in:creacion,cambio_estado,modificacion,cambio_rol',
            'descripcion'=>'required',
            'entidad_afectada' => 'required',
            'usuario_modificado_id' => 'nullable|integer',  // Puede ser nulo
            'tickets_id' => 'nullable|exists:tickets,id',  // Puede ser nulo
            'user_id' => 'nullable|exists:users,id',  // Puede ser nulo
        ];
    }
    function tickets() {
        return $this->belongsTo(Tickets::class);
    }
}
