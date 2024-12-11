<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\User;
use App\Services\PaymentGatewayService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class TransactionController extends Controller
{
    // Listar histórico do usuário autenticado
    public function index()
    {
        $user = Auth::user();
        
        if ($user->type === 'A') {
            // Administradores podem ver todas as transações
            $transactions = Transaction::with('user', 'game')->get();
        } else {
            // Usuários comuns veem apenas suas próprias transações
            $transactions = $user->transactions()->with('game')->get();
        }

        return response()->json($transactions);
    }

    // Comprar brain coins
    public function purchase(Request $request, PaymentGatewayService $paymentService)
    {
        $validated = $request->validate([
            'payment_type' => 'required|in:MBWAY,PAYPAL,IBAN,MB,VISA',
            'payment_reference' => 'required|string|max:255',
            'euros' => 'required|integer|min:1|max:100', // Apenas valores inteiros entre 1 e 100
        ]);

        $user = Auth::user();
        $brainCoins = $validated['euros'] * 10; // Conversão 1€ = 10 brain coins

        // Chamada para o serviço externo de pagamento
        $success = $paymentService->createDebit(
            $validated['payment_type'],
            $validated['payment_reference'],
            $validated['euros']
        );

        if (!$success) {
            Log::error('Falha no pagamento: Serviço de pagamento retornou falso.');
            return response()->json(['message' => 'Payment failed'], 422);
        }

        // Criar a transação
        $transaction = Transaction::create([
            'user_id' => $user->id,
            'type' => 'P', // Purchase
            'transaction_datetime' => now(),
            'euros' => $validated['euros'],
            'brain_coins' => $brainCoins,
            'payment_type' => $validated['payment_type'],
            'payment_reference' => $validated['payment_reference'],
        ]);

        // Atualizar o saldo de brain coins do usuário
        $user->update(['brain_coins_balance' => $user->brain_coins_balance + $brainCoins]);

        return response()->json(['message' => 'Purchase successful', 'transaction' => $transaction], 201);
    }

    // Mostrar transação específica
    public function show($id)
    {
        $transaction = Transaction::with('user', 'game')->find($id);

        if (!$transaction) {
            return response()->json(['message' => 'Transaction not found'], 404);
        }

        // Apenas administradores ou o dono da transação podem visualizar
        if (Auth::id() !== $transaction->user_id && Auth::user()->type !== 'A') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($transaction);
    }
}