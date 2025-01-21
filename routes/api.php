<?php

use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\MultiModelController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
// use App\Http\Controllers\Api\UserController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::middleware('auth:sanctum')->post('/user/logout', [UserController::class, 'logout']);
Route::post('/user/login',[UserController::class,'login']);

Route::prefix('{type}')->middleware('auth:sanctum')->group(function () {
    Route::get('/all', [MultiModelController::class, 'all']);
    Route::get('/paginate', [MultiModelController::class, 'index']);
    Route::post('/', [MultiModelController::class, 'store']);
    Route::get('/{id}', [MultiModelController::class, 'show']);
    Route::put('/{id}', [MultiModelController::class, 'update']);
    Route::delete('/{id}', [MultiModelController::class, 'destroy']);
});
