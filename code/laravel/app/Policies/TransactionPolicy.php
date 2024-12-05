<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Transaction;

class TransactionPolicy
{
    /**
     * Determine se o usuário pode visualizar todas as transações (apenas administradores).
     */
    public function viewAny(User $user)
    {
        return $user->type === 'A'; // 'A' representa Administradores no seu sistema.
    }
}

