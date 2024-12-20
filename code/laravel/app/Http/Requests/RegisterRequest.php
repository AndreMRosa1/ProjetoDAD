<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; //Permite que qualquer pessoa use esta requisição
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'nickname' => 'required|string|unique:users,nickname',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:3|confirmed',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'O nome é obrigatório.',
            'nickname.required' => 'O apelido é obrigatório.',
            'nickname.unique' => 'Este apelido já está em uso.',
            'email.required' => 'O email é obrigatório.',
            'email.unique' => 'Este email já está registrado.',
            'password.required' => 'A senha é obrigatória.',
            'password.confirmed' => 'As senhas não coincidem.',
        ];
    }
}
