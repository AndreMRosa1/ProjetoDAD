<?php

use Illuminate\Http\Request;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\GameController;
use App\Http\Controllers\MultiplayerGamePlayedController;
use App\Http\Controllers\BoardController;

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

Route::resource('users', UserController::class);
Route::resource('transactions', TransactionController::class);
Route::resource('games', GameController::class);
Route::resource('multiplayer-games-played', MultiplayerGamePlayedController::class);
Route::resource('boards', BoardController::class);
