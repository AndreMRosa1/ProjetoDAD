<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\GameController;
use App\Http\Controllers\BoardController;

// Autenticação
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::post('/auth/refreshtoken', [AuthController::class, 'refreshToken']);

    Route::post('/user/me/delete', [UserController::class, 'deleteAccount']);

    Route::post('/user/change-password', [UserController::class, 'changePassword'])->middleware('auth:sanctum');
    Route::put('/user/edit-profile', [UserController::class, 'editProfile']);
    Route::post('user/upload-photo', [UserController::class, 'uploadPhoto']);
    Route::post('users/{id}/change-photo', [UserController::class, 'changePhoto']);

    Route::get('/user/{user_id}', [UserController::class, 'show']);

    Route::get('/users/me', function (Request $request) {
        return $request->user();
    });

    Route::get('/users', [UserController::class, 'index']);
    Route::post('/users', [UserController::class, 'store']);

    Route::get('/history', [GameController::class, 'history']);

    Route::patch('/users/me/reduce-coin', [UserController::class, 'reduceCoin']);

    // Jogos
    Route::get('/games', [GameController::class, 'indexSinglePlayer']);
    Route::patch('/games/{game_id}', [GameController::class, 'update']);
    Route::post('/games', [GameController::class, 'store']);
    //Route::get('/games/multiplayer', [GameController::class, 'indexMultiplayer']);
    //Route::post('/games/multiplayer', [GameController::class, 'storeMultiplayer']);

    //MULTIPLAYER!
    Route::delete('/games/{gameId}', [GameController::class, 'destroy']);
    Route::post('/multiplayergames', [GameController::class, 'createMultiplayerGame']);
    Route::post('/multiplayergames/{gameId}/join', [GameController::class, 'joinMultiplayerGame']);
    Route::post('/multiplayergames/{gameId}/start', [GameController::class, 'startMultiplayerGame']);
    Route::get('/multiplayergames', [GameController::class, 'indexMultiplayerGames']);

    // Transações
    Route::get('/transactions', [TransactionController::class, 'index']);
    Route::post('/transactions/purchase', [TransactionController::class, 'purchase']); //ROTA TAES PODE SER UTIL PARA O PROJETO
    Route::get('/transactions/{id}', [TransactionController::class, 'show']);

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
    Route::get('/admin/games', [GameController::class, 'index']);
    Route::get('/admin/statistics', [GameController::class, 'detailedStatistics']);
});

// Recursos básicos
Route::resource('boards', BoardController::class);
