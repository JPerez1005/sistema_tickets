<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tickets extends Model
{
    
    public $timestamps = true;

    protected $fillable = ['titulo','descripcion','estado'];

    protected $table = 'tickets';

    public static function validationRules() {
        return [
            'titulo'=>'required|min:1|max:500',
            'descripcion'=>'nullable|min:1|max:500',
            'estado' => 'required|in:abierto,en_proceso,cerrado,cancelado',
        ];
    }

    function historias() {
        return $this->hasMany(Historias::class);
    }
}
