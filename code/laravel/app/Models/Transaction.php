<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Transaction extends Model
{
    use HasFactory;

    public $timestamps = false; // Desativar timestamps automáticos

    protected $fillable = [
        'user_id',
        'transaction_datetime',
        'game_id',
        'type',
        'euros',
        'brain_coins',
        'payment_type',
        'payment_reference',
        'transaction_datetime',
    ];

    protected $casts = [
        'transaction_datetime' => 'datetime',
    ];

    // Relações
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function game()
    {
        return $this->belongsTo(Game::class);
    }
}