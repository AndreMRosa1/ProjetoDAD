<?php

use Illuminate\Http\Request;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::post('/auth/refreshtoken', [AuthController::class, 'refreshToken']);
    Route::get('/users/me', function (Request $request) {
        return $request->user();
    });
});



//Route::get('/users/me', function (Request $request) {
//    return $request->user();
//})->middleware('auth:sanctum');

//Route::post('/auth/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
//Route::post('/auth/login', [AuthController::class, 'login']);
//Route::post('/auth/register', [AuthController::class, 'register']);

//Route::post('/auth/refreshtoken', [AuthController::class, 'refreshToken']);
