<?php

namespace App\Http\Controllers;

use App\Models\MultiplayerGamePlayed;
use App\Models\Game;
use App\Models\User;
use Illuminate\Http\Request;

class MultiplayerGamePlayedController extends Controller
{
    // Display a list of all multiplayer games played
    public function index()
    {
        return response()->json(MultiplayerGamePlayed::with('user', 'game')->get());
    }

    // Store a new multiplayer game played record
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'game_id' => 'required|exists:games,id',
            'player_won' => 'required|boolean',
            'pairs_discovered' => 'required|integer',
        ]);

        $multiplayerGamePlayed = MultiplayerGamePlayed::create($validated);
        return response()->json($multiplayerGamePlayed, 201);
    }

    // Show a specific multiplayer game played record
    public function show($id)
    {
        $multiplayerGamePlayed = MultiplayerGamePlayed::with('user', 'game')->find($id);

        if (!$multiplayerGamePlayed) {
            return response()->json(['message' => 'Multiplayer game played not found'], 404);
        }

        return response()->json($multiplayerGamePlayed);
    }

    // Update a multiplayer game played record
    public function update(Request $request, $id)
    {
        $multiplayerGamePlayed = MultiplayerGamePlayed::find($id);
        if (!$multiplayerGamePlayed) {
            return response()->json(['message' => 'Multiplayer game played not found'], 404);
        }

        $multiplayerGamePlayed->update($request->all());
        return response()->json($multiplayerGamePlayed);
    }

    // Delete a multiplayer game played record
    public function destroy($id)
    {
        $multiplayerGamePlayed = MultiplayerGamePlayed::find($id);
        if (!$multiplayerGamePlayed) {
            return response()->json(['message' => 'Multiplayer game played not found'], 404);
        }

        $multiplayerGamePlayed->delete();
        return response()->json(['message' => 'Multiplayer game played deleted successfully']);
    }
}
