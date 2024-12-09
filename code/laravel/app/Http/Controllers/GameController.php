<?php

namespace App\Http\Controllers;

use App\Models\Game;
use Illuminate\Http\Request;

class GameController extends Controller
{
    public function index()
    {
        return response()->json(Game::with('creator', 'winner', 'board')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'created_user_id' => 'required|exists:users,id',
            'type' => 'required|in:S,M',
            'status' => 'required|string|max:255',
            'board_id' => 'required|exists:boards,id',
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

public function storeGame(Request $request)
{
    $validated = $request->validate([
        'created_user_id' => 'required|exists:users,id',
        'type' => 'required|in:S,M',
        'status' => 'required|string|max:255',
        'board_id' => 'required|exists:boards,id',
    ]);

    $game = Game::create($validated);

    return response()->json(['message' => 'Game created successfully', 'game' => $game], 201);
}

public function updateGame(Request $request, $id)
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

    return response()->json(['message' => 'Game updated successfully', 'game' => $game]);
}

}