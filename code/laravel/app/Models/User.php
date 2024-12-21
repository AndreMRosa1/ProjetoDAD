<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\SoftDeletes;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    protected $table = 'users';

    protected $fillable = [
        'name',
        'nickname',
        'email',
        'password',
        'brain_coins_balance',
        'type',
        'blocked',
        'photo_filename'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($user) {
            $user->brain_coins_balance = $user->brain_coins_balance ?? 10;
            $user->type = $user->type ?? 'P';
            $user->blocked = $user->blocked ?? false;
        });
    }

    //relations
    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    public function createdGames()
    {
        return $this->hasMany(Game::class, 'created_user_id');
    }

    public function wonGames()
    {
        return $this->hasMany(Game::class, 'winner_user_id');
    }

}
