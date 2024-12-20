<?php

namespace App\Http\Controllers;

use App\Http\Requests\RegisterRequest;
use App\Http\Requests\LoginRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use App\Models\User;

class AuthController extends Controller
{
    private function purgeExpiredTokens()
    {
        $dateTimetoPurge = now()->subHours(2);
        DB::table('personal_access_tokens')->where('expires_at', '<', $dateTimetoPurge)->delete();
    }

    private function revokeCurrentToken(User $user)
    {
        $currentTokenId = $user->currentAccessToken()->id;
        $user->tokens()->where('id', $currentTokenId)->delete();
    }

    public function register(RegisterRequest $request)
    {
        // Validate the request data
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'nickname' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:3|confirmed',
            'photo' => 'sometimes|image|mimes:jpeg,png,jpg,gif,svg|max:2048', // Validate photo field if present
        ]);

        // Hash the password before storing it
        $data['password'] = bcrypt($data['password']);

        // Handle file upload if the photo is present
        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('photos', 'public');
            $data['photo_filename'] = str_replace('photos/', '', $path); // Save filename (without the 'photos/' directory)
        }

        // Create the user with the validated data
        $user = User::create($data);

        // Return a success response with the created user
        return response()->json(['message' => 'User created successfully', 'user' => $user], 201);
    }

    public function login(LoginRequest $request)
    {
        $this->purgeExpiredTokens();
        $credentials = $request->validated();

        if (!Auth::attempt($credentials)) {
            return response()->json([
                'message' => 'Unauthorized',
                'errors' => ['email' => ['Invalid credentials']]
            ], 401);
        }

        $user = Auth::user();
        if ($user->blocked) {
            return response()->json([
                'message' => 'Account is blocked',
                'errors' => []
            ], 403);
        }

        $token = $user->createToken('authToken', ['*'], now()->addHours(2))->plainTextToken;
        return response()->json(['token' => $token]);
    }

    public function logout(Request $request)
    {
        $this->purgeExpiredTokens();
        $this->revokeCurrentToken($request->user());
        return response()->json(['message' => 'Logged out successfully'], 204);
    }

    public function refreshToken(Request $request)
    {
        $this->purgeExpiredTokens();
        $this->revokeCurrentToken($request->user());

        $token = $request->user()->createToken('authToken', ['*'], now()->addHours(2))->plainTextToken;
        return response()->json(['token' => $token]);
    }
}
