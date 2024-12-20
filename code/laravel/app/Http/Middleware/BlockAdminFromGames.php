<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class BlockAdminFromGames
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        if ($request->user() && $request->user()->role == 'admin') {
            return response()->json(['error' => 'Admins cannot access game routes'], 403);
        }

        return $next($request);
    }
}
