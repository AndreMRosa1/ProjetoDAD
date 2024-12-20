<?php

namespace App\Http;

use Illuminate\Foundation\Http\Kernel as HttpKernel;

class Kernel extends HttpKernel
{
    protected $routeMiddleware = [
        // ...existing code...
        'block.admin.from.games' => \App\Http\Middleware\BlockAdminFromGames::class,
        'is.admin' => \App\Http\Middleware\IsAdmin::class,
    ];
}
