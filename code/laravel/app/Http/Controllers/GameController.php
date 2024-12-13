<?php

namespace App\Http\Controllers;

use App\Models\Game;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class GameController extends Controller
{
    public function index()
    {
        return response()->json(Game::with('creator', 'winner', 'board')->get());
    }

    public function store(Request $request)
    {

        $userId = auth()->id();

        if (!$userId) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $validated = $request->validate([
            'created_user_id' => 'required|exists:users,id',
            'type' => 'required|in:S,M',
            'status' => 'required|string|max:255',
            'board_id' => 'required|exists:boards,id',
            'total_time' => 'required|numeric|min:0',
            'total_turns_winner' => 'required|integer|min:0',
            'winner_user_id' => 'required|integer|min:0',
            'began_at' => 'required|date',
            'ended_at' => 'required|date|after_or_equal:began_at',
        ]);

        $game = Game::create($validated);
        return response()->json($game, 201);
    }

    public function show($id)
    {
        $game = Game::find($id);
        if (!$game) {
            return response()->json(['message' => 'Game not found'], 404);
        }
        return response()->json($game);
    }

    public function update(Request $request, $id)
    {
        $game = Game::find($id);
        if (!$game) {
            return response()->json(['message' => 'Game not found'], 404);
        }

        $game->update($request->all());
        return response()->json($game);
    }

    public function destroy($id)
    {
        $game = Game::find($id);
        if (!$game) {
            return response()->json(['message' => 'Game not found'], 404);
        }

        $game->delete();
        return response()->json(['message' => 'Game deleted successfully']);
    }

    public function personalScoreboard()
{
    $user = auth()->user();
    if (!$user) {
        return response()->json(['message' => 'User not found'], 404);
    }

    // Obter as melhores performances do usuário por tipo de tabuleiro
    $boardSizes = [
        ['cols' => 3, 'rows' => 4],
        ['cols' => 4, 'rows' => 4],
        ['cols' => 6, 'rows' => 6]
    ];

    $bestPerformances = [];

    foreach ($boardSizes as $size) {
        $performances = Game::where('created_user_id', $user->id)
            ->whereHas('board', function ($query) use ($size) {
                $query->where('board_cols', $size['cols'])
                      ->where('board_rows', $size['rows']);
            })
            ->where('total_time', '>', 0)
            ->where('total_turns_winner', '>', 0)
            ->selectRaw('board_id, total_time as best_time, total_turns_winner as best_turns')
            ->with('board')
            ->orderBy('best_time')
            ->orderBy('best_turns')
            ->limit(3)
            ->get();

        $bestPerformances = array_merge($bestPerformances, $performances->toArray());
    }

    return response()->json($bestPerformances);
}

public function globalScoreboard()
{
    // Obter os melhores jogadores com base nos melhores tempos e menor número de turnos por tipo de tabuleiro
    $boardSizes = [
        ['cols' => 3, 'rows' => 4],
        ['cols' => 4, 'rows' => 4],
        ['cols' => 6, 'rows' => 6]
    ];

    $topPlayers = [];

    foreach ($boardSizes as $size) {
        $players = Game::whereHas('board', function ($query) use ($size) {
                $query->where('board_cols', $size['cols'])
                      ->where('board_rows', $size['rows']);
            })
            ->where('total_time', '>', 0)
            ->where('total_turns_winner', '>', 0)
            ->selectRaw('created_user_id, board_id, MIN(total_time) as best_time, MIN(total_turns_winner) as best_turns')
            ->groupBy('created_user_id', 'board_id')
            ->with(['creator', 'board'])
            ->orderBy('best_time')
            ->orderBy('best_turns')
            ->limit(3)
            ->get();

        $topPlayers = array_merge($topPlayers, $players->toArray());
    }

    return response()->json($topPlayers);
}


//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!O QUE ESTA EM COMENTARIO É PARA TAES!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
public function storeGame(Request $request)
{
    // Obter o ID do usuário autenticado
    $userId = auth()->id();

    if (!$userId) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    // Validar os outros campos
    $validated = $request->validate([
        'type' => 'required|in:S,M',
        'status' => 'required|string|max:255',
        'board_id' => 'required|exists:boards,id',
    ]);

    // Criar o jogo usando o usuário autenticado
    $game = Game::create([
        'created_user_id' => $userId,
        'type' => $validated['type'],
        'status' => $validated['status'],
        'board_id' => $validated['board_id'],
    ]);

    return response()->json(['message' => 'Game created successfully', 'game' => $game], 201);
}

/*

public function updateGameStatus(Request $request, $id)
{
    $game = Game::find($id);
    if (!$game) {
        return response()->json(['message' => 'Game not found'], 404);
    }

    $validated = $request->validate([
        'status' => 'nullable|string|max:255',
        'total_time' => 'nullable|numeric|min:0',
        'total_turns_winner' => 'nullable|integer|min:0',
    ]);

    $game->update($validated);

    // Verificar se o jogo está no top 3
    $isGlobalRecord = $this->checkIfTop3Global($game);

    return response()->json([
        'message' => 'Game status updated successfully',
        'game' => $game,
        'is_global_record' => $isGlobalRecord
    ]);
}

private function checkIfTop3Global(Game $game)
{
    // Obter as melhores 3 performances do tabuleiro
    $topPerformances = Game::where('board_id', $game->board_id)
        ->where('total_time', '>', 0)
        ->where('total_turns_winner', '>', 0)
        ->orderBy('total_time')
        ->orderBy('total_turns_winner')
        ->limit(3)
        ->get();

    // Verificar se o jogo atual está no top 3
    foreach ($topPerformances as $performance) {
        if ($performance->id === $game->id) {
            return true; // É um recorde global
        }
    }

    return false; // Não é um recorde global
}

public function checkIfTop3(Request $request, $id)
{
    try {
        $game = Game::find($id);
        if (!$game) {
            return response()->json(['message' => 'Game not found'], 404);
        }

        // Verificar se o jogo está no top 3
        $isTop3 = $this->checkIfTop3Global($game);

        return response()->json(['is_top_3' => $isTop3]);
    } catch (\Exception $e) {
        // Trate a exceção e retorne uma resposta JSON com o erro
        return response()->json(['error' => $e->getMessage()], 500);
    }
}


public function checkIfPersonalRecord(Request $request, $id)
{
    $game = Game::find($id);
    if (!$game) {
        return response()->json(['message' => 'Game not found'], 404);
    }

    // Verificar se o jogo atual é um recorde pessoal
    $isPersonalRecord = $this->checkIfPersonalRecordGlobal($game);

    return response()->json(['is_personal_record' => $isPersonalRecord]);
}

private function checkIfPersonalRecordGlobal(Game $game)
{
    // Obter os jogos anteriores do usuário com o mesmo tabuleiro
    $userGames = Game::where('created_user_id', $game->created_user_id)
        ->where('board_id', $game->board_id)
        ->where('total_time', '>', 0) // Excluindo valores nulos ou 0
        ->where('total_turns_winner', '>', 0) // Excluindo valores nulos ou 0
        ->get();

    // Inicializar variáveis para encontrar os recordes pessoais
    $lowestTime = null;
    $lowestTurns = null;

    foreach ($userGames as $userGame) {
        if ($lowestTime === null || $userGame->total_time < $lowestTime) {
            $lowestTime = $userGame->total_time;
        }

        if ($lowestTurns === null || $userGame->total_turns_winner < $lowestTurns) {
            $lowestTurns = $userGame->total_turns_winner;
        }
    }

    // Verificar se o jogo atual bate os recordes
    if (($game->total_time === $lowestTime && $lowestTime !== null) ||
        ($game->total_turns_winner === $lowestTurns && $lowestTurns !== null)) {
        return true;
    }

    return false;
}


public function listPersonalRecords()
{
    $user = auth()->user();
    if (!$user) {
        return response()->json(['message' => 'User not found'], 404);
    }

    // Obter todos os jogos válidos do usuário
    $userGames = Game::where('created_user_id', $user->id)
        ->where('total_time', '>', 0)
        ->where('total_turns_winner', '>', 0)
        ->get()
        ->groupBy('board_id');

    $records = [];

    foreach ($userGames as $boardId => $games) {
        $lowestTime = $games->min('total_time');
        $lowestTurns = $games->min('total_turns_winner');

        $recordGames = $games->filter(function ($game) use ($lowestTime, $lowestTurns) {
            return $game->total_time === $lowestTime || $game->total_turns_winner === $lowestTurns;
        });

        $records = array_merge($records, $recordGames->toArray());
    }

    return response()->json($records);
}

*/
}