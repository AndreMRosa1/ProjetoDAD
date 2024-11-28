<template>
    <div class="auth-form">
      <h1>Register</h1>
      <form @submit.prevent="handleRegister">
        <label for="name">Name:</label>
        <input v-model="name" id="name" placeholder="Name" required />
  
        <label for="nickname">Nickname:</label>
        <input v-model="nickname" id="nickname" placeholder="Nickname" required />
  
        <label for="email">Email:</label>
        <input v-model="email" id="email" placeholder="Email" type="email" required />
  
        <label for="password">Password:</label>
        <input
          v-model="password"
          id="password"
          placeholder="Password"
          type="password"
          required
        />
  
        <label for="password_confirmation">Confirm Password:</label>
        <input
          v-model="password_confirmation"
          id="password_confirmation"
          placeholder="Confirm Password"
          type="password"
          required
        />
  
        <button type="submit" class="btn">Register</button>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useAuthStore } from '@/stores/auth';
  
  const authStore = useAuthStore();
  
  // Campos para captura dos dados do formulário
  const name = ref('');
  const nickname = ref('');
  const email = ref('');
  const password = ref('');
  const password_confirmation = ref('');
  
  const handleRegister = async () => {
    // Realiza o registro usando o Pinia
    const success = await authStore.register({
      name: name.value,
      nickname: nickname.value,
      email: email.value,
      password: password.value,
      password_confirmation: password_confirmation.value,
    });
  
    if (success) {
      alert('Registration successful!');
    } else {
      alert('Registration failed. Please check the errors and try again.');
    }
  };
  </script>
  
  <style>
  /* Estilos simples para a página */
  .auth-form {
    max-width: 400px;
    margin: auto;
    padding: 20px;
    background-color: #f8f9fa;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  label {
    display: block;
    margin: 8px 0 4px;
  }
  input {
    width: 100%;
    padding: 8px;
    margin-bottom: 16px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  button {
    width: 100%;
    padding: 10px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  button:hover {
    background-color: #0056b3;
  }
  </style>
  