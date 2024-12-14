<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Game;

class GameHistoryController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // Administradores veem o histórico de todos os jogos
        if ($user->type === 'A') {
            $games = Game::with(['creator', 'winner', 'board'])->get();
        } else {
            // Users veem apenas os próprios jogos
            $games = Game::with(['creator', 'winner', 'board'])
                         ->where('created_user_id', $user->id)
                         ->orWhereHas('players', function ($query) use ($user) {
                             $query->where('user_id', $user->id);
                         })->get();
        }

        return response()->json($games);
    }
}