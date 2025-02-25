<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Auth;

class MultiModelController extends Controller
{
    protected $models;
    protected $invalidModels;

    public function __construct()
    {
        $modelsConfig = config('models');
        $this->models = $modelsConfig['valid'];
        $this->invalidModels = $modelsConfig['invalid'];
    }

    // Método para obtener el modelo basado en el tipo
    protected function getModel($type)
    {
        return isset($this->models[$type])
            ? new $this->models[$type]
            : abort(404, "Modelo no encontrado, hay un error desde la solicitud.");
    }

    // Listar todos los registros
    public function all($type)
    {
        $model = $this->getModel($type);
        $query = $model::query();
        $user = Auth::user();
        $allowed = Gate::allows('permisoUsuario', $user);

        if ($allowed) {
            if ($type == 'tickets') {
                $query->where('usuario_creacion', $user->id);
                return response()->json($query->get());
            }
        }

        if ($type == 'user' || $type=='historias') {
            $user = Auth::user(); // Obtiene el usuario autenticado
            $allowed = Gate::allows('permisoAdministrador', $user);
    
            if (!$allowed) {
                return response()->json(['message' => 'Unauthorized'], 401);
            }
        }

        if ($type == 'tickets') {
            $user = Auth::user(); // Obtiene el usuario autenticado
            $allowed = Gate::allows('permisoAdministradorYSoporte', $user);

            if (!$allowed) {
                return response()->json(['message' => 'Unauthorized'], 401);
            }
        }

        return response()->json($model::all());
    }

    // Paginación
    public function index(Request $request, $type)
    {
        $model = $this->getModel($type);
        $query = $model::query();
        $user = Auth::user();
        $allowed = Gate::allows('permisoUsuario', $user);

        if ($allowed) {
            if ($type == 'tickets') {
                $query->where('usuario_creacion', $user->id);
            }
        }

        if ($type == 'historias') {
            $query->orderBy('created_at', 'desc');
        }
        

        if ($request->has('search')) {
            $search = $request->input('search');
    
            // Condición según el tipo de tabla
            if ($type === 'tickets') {
                $query->where('titulo', 'like', "%{$search}%");
            } elseif ($type === 'users') {
                $query->where('name', 'like', "%{$search}%");
            }elseif ($type === 'historias') {
                $query->where('accion', 'like', "%{$search}%");
            }
        }

        return response()->json($query->paginate(5));
    }

    // Crear un nuevo registro
    public function store(Request $request, $type)
    {
        $model = $this->getModel($type);

        if ($type == 'user') {
            $user = Auth::user(); // Obtiene el usuario autenticado
            $allowed = Gate::allows('permisoAdministrador', $user);
    
            if (!$allowed) {
                return response()->json(['message' => 'Unauthorized'], 401);
            }
        }

        // Validar los datos con las reglas del modelo
        $validatedData = $request->validate($model::validationRules());

        // Verificar si el modelo es 'User' para hashear la contraseña
        if ($model instanceof \App\Models\User && isset($validatedData['password'])) {
            // dd("entramos en la tabla usuario");
            $validatedData['password'] = bcrypt($validatedData['password']);
        }

        // Crear el registro
        $instance = $model::create($validatedData);

        return response()->json([
            'message' => ucfirst($type) . ' creado con éxito',
            'data' => $instance
        ], 201);
    }

    // Mostrar un registro específico
    public function show($type, $id)
    {
        $model = $this->getModel($type);
        $instance = $model::findOrFail($id);
        return response()->json($instance);
    }

    //Actualizar un registro
    public function update(Request $request, $type, $id)
    {
        $model = $this->getModel($type);

        if ($type == 'user' || $type=='historias') {
            $user = Auth::user(); // Obtiene el usuario autenticado
            $allowed = Gate::allows('permisoAdministrador', $user);
    
            if (!$allowed) {
                return response()->json(['message' => 'Unauthorized'], 401);
            }
        }

        // if ($type == 'tickets') {
        //     $user = Auth::user(); // Obtiene el usuario autenticado
        //     $allowed = Gate::allows('permisoAdministradorYSoporte', $user);

        //     if (!$allowed) {
        //         return response()->json(['message' => 'Unauthorized'], 401);
        //     }
        // }

        $instance = $model::findOrFail($id);
        $validatedData = $request->validate($model::validationRules());
        $instance->update($validatedData);
        return response()->json($instance);
    }

    // Eliminar un registro
    public function destroy($type, $id)
    {
        $model = $this->getModel($type);

        if ($type == 'user' || $type=='historias') {
            $user = Auth::user(); // Obtiene el usuario autenticado
            $allowed = Gate::allows('permisoAdministrador', $user);
    
            if (!$allowed) {
                return response()->json(['message' => 'Estas inautorizado'], 401);
            }
        }

        if ($type == 'tickets') {
            $user = Auth::user(); // Obtiene el usuario autenticado
            $allowed = Gate::allows('permisoAdministradorYSoporte', $user);

            if (!$allowed) {
                return response()->json(['message' => 'Unauthorized'], 401);
            }
        }

        $instance = $model::findOrFail($id);
        $instance->delete();
        return response()->json(['message' => ucfirst($type) . ' eliminado con éxito']);
    }
    
}
