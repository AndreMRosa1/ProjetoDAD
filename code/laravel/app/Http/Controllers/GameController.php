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
}

