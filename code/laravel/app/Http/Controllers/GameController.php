<?php

namespace App\Http\Controllers;

use App\Models\Game;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class GameController extends Controller
{
    /*public function index()
    {
        return response()->json(Game::with('creator', 'winner', 'board')->get());
    }*/

    public function index(Request $request)
{
    // Optional filtering for multiplayer or single player games
    $type = $request->input('type'); // 'S' or 'M'

    $query = Game::with('creator', 'winner', 'board');

    if ($type) {
        $query->where('type', $type);
    }

    return response()->json($query->get());
}
    /*
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
            'total_time' => 'numeric|min:0',
            'total_turns_winner' => 'integer|min:0',
            'winner_user_id' => 'integer|min:0',
            'began_at' => 'required|date',
            'ended_at' => 'date|after_or_equal:began_at',
        ]);

        $game = Game::create($validated);
        return response()->json($game, 201);
    }*/
/*
    public function index(Request $request)
{
    // Optional filtering for multiplayer or single player games
    $type = $request->input('type'); // 'S' or 'M'

    $query = Game::with('creator', 'winner', 'board');

    if ($type) {
        $query->where('type', $type);
    }

    return response()->json($query->get());
}
    */

public function store(Request $request)
{
    $userId = auth()->id();

    if (!$userId) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    $validated = $request->validate([
        'created_user_id' => 'required|exists:users,id',
        'type' => 'required|in:S,M', // Accept both single and multiplayer
        'status' => 'required|string|max:255',
        'board_id' => 'required|exists:boards,id',
        'total_time' => 'numeric|min:0',
        'total_turns_winner' => 'integer|min:0',
        'winner_user_id' => 'nullable|integer|min:0',
        'began_at' => 'required|date',
        'ended_at' => 'nullable|date|after_or_equal:began_at',
    ]);

    // For multiplayer games, you might want to add additional logic
    if ($validated['type'] === 'M') {
        $validated['status'] = $validated['status'] ?? 'PL';
    }

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

    public function update(Request $request, $game_id)
    {
        $validated = $request->validate([
            'status' => 'nullable|string|max:255',
            'total_time' => 'nullable|numeric|min:0',
            'winner_user_id' => 'integer|min:0',
            'total_turns_winner' => 'nullable|integer|min:0',
            'ended_at' => 'nullable|date',
        ]);

        $game = Game::findOrFail($game_id);
        $game->update($validated);

        return response()->json($game);  // Return the updated game
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

    public function globalScoreboard(Request $request)
{
    $sortBy = $request->input('sort_by', 'time'); // 'time' ou 'turns'
    $type = $request->input('type'); // 'S', 'M' ou null
    $boardSize = $request->input('board_size'); // Ex: '3x4'

    $query = Game::query()
        ->where('total_time', '>', 0)
        ->where('total_turns_winner', '>', 0);

    if ($type) {
        $query->where('type', $type);
    }

    if ($boardSize) {
        [$cols, $rows] = explode('x', $boardSize);
        $query->whereHas('board', function ($q) use ($cols, $rows) {
            $q->where('board_cols', $cols)->where('board_rows', $rows);
        });
    }

    $query->selectRaw('created_user_id, board_id, MIN(total_time) as best_time, MIN(total_turns_winner) as best_turns')
        ->groupBy('created_user_id', 'board_id')
        ->with(['creator', 'board']);

    // Ordenar
    if ($sortBy === 'time') {
        $query->orderBy('best_time');
    } else {
        $query->orderBy('best_turns');
    }

    $topPlayers = $query->limit(10)->get();

    return response()->json($topPlayers);
}

public function personalScoreboard(Request $request)
{
    $userId = auth()->id();

    if (!$userId) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    $type = $request->input('type'); // 'S', 'M' ou null
    $boardSize = $request->input('board_size'); // Ex: '3x4'
    $sortBy = $request->input('sort_by', 'total_time'); // Ordenar por: 'total_time' ou 'total_turns_winner'
    $sortOrder = $request->input('sort_order', 'asc'); // Ordem: 'asc' ou 'desc'

    $query = Game::query()
        ->where('created_user_id', $userId);

    // Filtrar por tipo de jogo
    if ($type) {
        $query->where('type', $type);
    }

    // Filtrar por tamanho do tabuleiro
    if ($boardSize) {
        [$cols, $rows] = explode('x', $boardSize);
        $query->whereHas('board', function ($q) use ($cols, $rows) {
            $q->where('board_cols', $cols)->where('board_rows', $rows);
        });
    }

    $query->selectRaw(
        'board_id, type, total_time, total_turns_winner, began_at, ended_at'
    )
        ->where('total_time', '>', 0)
        ->where('total_turns_winner', '>', 0)
        ->groupBy('board_id', 'type', 'total_time', 'total_turns_winner', 'began_at', 'ended_at')
        ->with(['board'])
        ->orderBy($sortBy, $sortOrder) // Ordenação dinâmica
        ->limit(10);

    $personalScores = $query->get();

    return response()->json($personalScores);
}



public function history(Request $request)
{
    $userId = auth()->id();

    if (!$userId) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    $games = Game::where('created_user_id', $userId)
        ->orWhere(function ($query) use ($userId) {
            $query->whereExists(function ($subQuery) use ($userId) {
                $subQuery->select(DB::raw(1))
                    ->from('users')
                    ->join('multiplayer_games_played', 'users.id', '=', 'multiplayer_games_played.user_id')
                    ->whereColumn('games.id', 'multiplayer_games_played.game_id')
                    ->where('users.id', $userId); // Explicitly qualify the ambiguous `id`
            });
        })
        ->with(['board', 'creator', 'winner'])
        ->limit(15)
        ->get();

    return response()->json($games);
}








/*
 //TAES!!!
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