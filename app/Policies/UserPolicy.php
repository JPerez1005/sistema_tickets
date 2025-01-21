<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{

    public function permisoAdministrador(User $user): bool
    {
        return $user->hasRole('administrador');
    }

    public function permisoSoporte(User $user): bool
    {
        return $user->hasRole('soporte');
    }

    public function permisoUsuario(User $user): bool
    {
        return $user->hasRole('usuario');
    }

    public function permisoAdministradorYSoporte(User $user): bool
    {
        return $user->hasRole('administrador') || $user->hasRole('soporte');
    }
}
