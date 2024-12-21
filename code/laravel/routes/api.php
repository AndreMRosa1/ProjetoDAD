<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\GameController;
use App\Http\Controllers\BoardController;
use App\Models\User;

// Autenticação
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::post('/auth/refreshtoken', [AuthController::class, 'refreshToken']);

    Route::post('/user/me/delete', [UserController::class, 'deleteAccount']);

    Route::post('/user/change-password', [UserController::class, 'changePassword'])->middleware('auth:sanctum');
    Route::put('/user/edit-profile', [UserController::class, 'editProfile']);
    Route::put('users/{user}', [UserController::class, 'update'])
    ->middleware('can:update,user');
    Route::post('user/upload-photo', [UserController::class, 'uploadPhoto']);
    Route::post('users/{id}/change-photo', [UserController::class, 'changePhoto']);

    Route::get('/user/{user_id}', [UserController::class, 'show']);

    Route::get('/users/me', function (Request $request) {
        return $request->user();
    });

    Route::patch('users/{user_id}/blocked', [UserController::class, 'update_blocked']);

    Route::get('/users', [UserController::class, 'index']);
    Route::post('/users', [UserController::class, 'store']);

    Route::get('/history', [GameController::class, 'history']);

    Route::patch('/users/me/reduce-coin', [UserController::class, 'reduceCoin']);

    // Jogos
    //Route::get('/games/multiplayer', [GameController::class, 'indexMultiplayer']);
    //Route::post('/games/multiplayer', [GameController::class, 'storeMultiplayer']);

    //MULTIPLAYER!

    // Transações
    Route::get('/transactions', [TransactionController::class, 'index']);
    Route::post('/transactions', [TransactionController::class, 'store']);
    Route::get('/transactions/{id}', [TransactionController::class, 'show']);
    Route::post('/transactions/purchase', [TransactionController::class, 'purchase']); //ROTA TAES PODE SER UTIL PARA O PROJETO
    Route::get('/transactions/history', [TransactionController::class, 'index']);

    // Lobbies Multiplayer
    Route::get('/games/multiplayer/lobbies', [GameController::class, 'listLobbies']);
    Route::post('/games/multiplayer/lobbies', [GameController::class, 'createLobby']);
    Route::post('/games/multiplayer/lobbies/join/{id}', [GameController::class, 'joinLobby']);

    // Quadros de Líderes
    Route::get('/scoreboards/global', [GameController::class, 'globalScoreboard']);
    Route::get('/scoreboards/personal', [GameController::class, 'personalScoreboard']);

    // Estatísticas
    Route::get('/statistics/general', [GameController::class, 'generalStatistics']);
});

//Route::get('/users/{id}', [UserController::class, 'show']); //rota de taes

// Rotas de Administrador
Route::middleware(['auth:sanctum', 'is_admin'])->group(function () {
    Route::get('/admin/transactions', [TransactionController::class, 'index']);
    Route::resource('users', UserController::class)->except(['create', 'edit']);
    Route::post('users/{id}/block', [UserController::class, 'blockUser']);
    Route::get('/admin/games', [GameController::class, 'index']);
    Route::get('/admin/statistics', [GameController::class, 'detailedStatistics']);
});

// Recursos básicos
Route::resource('boards', BoardController::class);
