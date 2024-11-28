<template>
    <div class="auth-form">
      <h1>Login</h1>
      <form @submit.prevent="handleLogin">
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
  
        <button type="submit" class="btn">Login</button>
      </form>
      
      <!-- Botão Register -->
      <div class="register-link">
        <p>Don't have an account?</p>
        <RouterLink
          to="/register"
          class="btn-register"
        >
          Register
        </RouterLink>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useAuthStore } from '@/stores/auth';
  
  const authStore = useAuthStore();
  
  // Campos para captura dos dados do formulário
  const email = ref('');
  const password = ref('');
  
  const handleLogin = async () => {
    // Realiza o login usando o Pinia
    const success = await authStore.login({
      email: email.value,
      password: password.value,
    });
  
    if (success) {
      alert('Login successful!');
    } else {
      alert('Login failed. Please check your credentials and try again.');
    }
  };
  </script>
  
  <style scoped>
  /* Reutilizando o estilo da página de registro */
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
  
  .register-link {
    margin-top: 16px;
    text-align: center;
  }
  
  .btn-register {
    display: inline-block;
    padding: 8px 16px;
    margin-top: 10px;
    text-align: center;
    color: #007bff;
    text-decoration: none;
    border: 1px solid #007bff;
    border-radius: 4px;
  }
  
  .btn-register:hover {
    background-color: #007bff;
    color: white;
  }
  </style>
  