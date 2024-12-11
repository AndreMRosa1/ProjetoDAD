<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    // Show all users
    public function index()
    {
        return response()->json(User::all());
    }

    // Show a specific user
    public function show($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }
        return response()->json($user);
    }

    // Store a new user
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);

        $validated['password'] = bcrypt($validated['password']);
        $user = User::create($validated);

        return response()->json($user, 201);
    }

    // Update a user
    public function update(Request $request, $id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $user->update($request->all());
        return response()->json($user);
    }

    // Delete a user
    public function destroy($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $user->delete();
        return response()->json(['message' => 'User deleted successfully']);
    }

    public function reduceCoins(Request $request)
{
    $user = auth()->user();
    if (!$user) {
        return response()->json(['message' => 'User not found'], 404);
    }

    // Reduzir 1 coin
    if ($user->brain_coins_balance < 1) {
        return response()->json(['message' => 'You have 0 coins!'], 400);
    }

    $user->brain_coins_balance -= 1;
    $user->save();

    return response()->json($user);
}

public function addCoins(Request $request)
{
    $user = auth()->user();
    if (!$user) {
        return response()->json(['message' => 'User not found'], 404);
    }

    // Adicionar 2 coins
    $user->brain_coins_balance += 2;
    $user->save();

    return response()->json($user);
}

public function getUserGames()
{
    $user = auth()->user();
    if (!$user) {
        return response()->json(['message' => 'User not found'], 404);
    }

    // Carregar os jogos criados pelo usuário
    $games = $user->createdGames()->with('board')->orderBy('created_at', 'desc')->get();

    // Log para verificar o que está retornando
    \Log::info('Jogos do usuário:', $games->toArray());

    return response()->json($games);
}

}

