<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;


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
        $user = $this->findUserOrFail($id);
        return response()->json($user);
    }

    // Store a new user
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:3',
            'type' => 'required|string|in:A,P',
        ]);

        $validated['password'] = bcrypt($validated['password']);
        $user = User::create($validated);

        return response()->json($user, 201);
    }

    public function update(Request $request, $id)
    {
        $user = $this->findUserOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|max:255|unique:users,email,' . $id,
            'nickname' => 'sometimes|string|max:20|unique:users,nickname,' . $id,
            'password' => 'sometimes|string|min:3',
        ]);

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        $user->update($validated);

        return response()->json($user);
    }

    public function editProfile(Request $request)
    {
        $user = auth()->user();

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|max:255|unique:users,email,' . $user->id,
            'nickname' => 'sometimes|string|max:20|unique:users,nickname,' . $user->id,
        ]);

        $user->update($validated);
        return response()->json($user);
    }

    public function uploadPhoto(Request $request)
    {
        $user = auth()->user();

        $validated = $request->validate([
            'photo' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $path = $request->file('photo')->store('photos', 'public');

        $user->photo_filename = str_replace('photos/', '', $path);

        $user->save();

        return response()->json(['message' => 'Photo uploaded successfully!', 'photo_url' => Storage::url($path)]);
    }

    public function changePassword(Request $request)
    {
        $validated = $request->validate([
            'current_password' => 'required',
            'password' => 'required|min:3|confirmed',
        ]);

        $user = auth()->user();

        if (!Hash::check($validated['current_password'], $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['The provided password does not match your current password.'],
            ]);
        }

        $user->password = Hash::make($validated['password']);
        $user->save();

        return response()->json(['message' => 'Your password has been updated successfully.'], 200);
    }

    public function destroy($id)
    {
        $user = $this->findUserOrFail($id);
        $user->delete();

        return response()->json(['message' => 'User deleted successfully']);
    }

    public function deleteAccount(Request $request)
    {
        $request->validate([
            'password' => 'required|string',
        ]);

        $user = auth()->user();

        if (!Hash::check($request->password, $user->password)) {
            return response()->json(['errors' => ['password' => ['The provided password is incorrect.']]], 422);
        }

        $user->delete();

        return response()->json(['message' => 'User deleted successfully']);
    }

    public function reduceCoin(Request $request)
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

    return response()->json($games);
}

private function findUserOrFail($id)
{
    return User::findOrFail($id);
}

}

