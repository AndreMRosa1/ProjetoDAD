<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\GameController;
use App\Http\Controllers\MultiplayerGamePlayedController;
use App\Http\Controllers\BoardController;


//ROTA PARA TAES!!!!
Route::get('/scoreboards/globals', [GameController::class, 'globalScoreboard']);


// Autenticação
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);


Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::post('/auth/refreshtoken', [AuthController::class, 'refreshToken']);
    Route::get('/users/me/games', [UserController::class, 'getUserGames']);
    Route::get('/users/me', function (Request $request) {
        return $request->user();
    });

    //ROTAS APENAS PARA TAES!!!!!!!!!!!!!!
    Route::patch('/users/me/reduce-coins', [UserController::class, 'reduceCoins']);
    Route::patch('/users/me/add-coins', [UserController::class, 'addCoins']);
    // Scoreboards TAES
    Route::get('/scoreboards/personal', [UserController::class, 'personalScoreboard']);
    
    // Rotas de Jogo
    Route::post('/games', [GameController::class, 'storeGame']); // Criar um novo jogo
    Route::patch('/games/{id}', [GameController::class, 'updateGame']); // Atualizar jogo existente
    
    Route::patch('/games/{id}/status', [GameController::class, 'updateGameStatus']);
    Route::get('/games/{gameId}/check-top3', [GameController::class, 'checkIfTop3']);
    //Personal
    Route::get('/games/{gameId}/check-personal-record', [GameController::class, 'checkIfPersonalRecord']);
    Route::post('/transactions/purchase', [TransactionController::class, 'purchase']);
    

    
        
    
    

    // Transações
    Route::get('/transactions', [TransactionController::class, 'index']);
    Route::post('/transactions/purchase', [TransactionController::class, 'purchase']);
    Route::get('/transactions/{id}', [TransactionController::class, 'show']);

    // Jogos
    Route::get('/games/single-player', [GameController::class, 'indexSinglePlayer']);
    Route::post('/games/single-player', [GameController::class, 'store']);
    Route::get('/games/multiplayer', [GameController::class, 'indexMultiplayer']);
    Route::post('/games/multiplayer', [GameController::class, 'storeMultiplayer']);

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

// Rotas de Administrador
Route::middleware(['auth:sanctum', 'is_admin'])->group(function () {
    Route::get('/admin/transactions', [TransactionController::class, 'index']);
    Route::resource('users', UserController::class)->except(['create', 'edit']);
    Route::get('/admin/games', [GameController::class, 'index']);
    Route::get('/admin/statistics', [GameController::class, 'detailedStatistics']);
});

// Recursos básicos
Route::resource('boards', BoardController::class);
