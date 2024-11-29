<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'game_id',
        'type',
        'euros',
        'brain_coins',
        'payment_type',
        'payment_reference',
    ];

    protected $casts = [
        'transaction_datetime' => 'datetime',
    ];

    //relations
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function game()
    {
        return $this->belongsTo(Game::class);
    }
}
