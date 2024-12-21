<?php

namespace App\Http\Controllers;

use App\Models\Game;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class GameController extends Controller
{
    public function index()
    {
        return response()->json(Game::with('creator', 'winner', 'board')->orderby('created_at', 'desc')->paginate(10));
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
            'total_time' => 'numeric|min:0',
            'total_turns_winner' => 'integer|min:0',
            'winner_user_id' => 'integer|min:0',
            'began_at' => 'required|date',
            'ended_at' => 'date|after_or_equal:began_at',
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
                    ->where('users.id', $userId);
            });
        })
        ->with(['board', 'creator', 'winner'])
        ->orderby('created_at', 'desc')
        ->paginate(10);

    return response()->json($games);
}

public function useHint(Request $request)
{
    $userId = auth()->id();

    if (!$userId) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    $validated = $request->validate([
        'game_id' => 'required|exists:games,id',
        'coins_used' => 'required|integer|min:1',
        'hint_type' => 'required|string|max:255',
    ]);

    // Registrar transação para uso de dicas
    Transaction::create([
        'user_id' => $userId,
        'transaction_datetime' => now(),
        'game_id' => $validated['game_id'],
        'type' => 'H', // H = Hint
        'brain_coins' => $validated['coins_used'],
        'transaction_details' => [
            'hint_type' => $validated['hint_type'],
            'game_id' => $validated['game_id'],
        ],
    ]);

    return response()->json(['message' => 'Hint used successfully']);
}

}