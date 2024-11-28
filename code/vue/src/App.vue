<template>
  <Toaster />
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav class="flex items-center justify-between h-16">
          <!-- Lado Esquerdo: Links de Navegação -->
          <div class="space-x-8">
            <RouterLink
              to="/"
              class="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              active-class="text-blue-600 font-semibold"
            >
              Home
            </RouterLink>
            <RouterLink
              to="/testers/laravel"
              class="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              active-class="text-blue-600 font-semibold"
            >
              Laravel Tester
            </RouterLink>
            <RouterLink
              to="/testers/websocket"
              class="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              active-class="text-blue-600 font-semibold"
            >
              WebSockets Tester
            </RouterLink>
            <RouterLink
              to="/new-memory-game"
              class="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              active-class="text-blue-600 font-semibold"
            >
              Start Game
            </RouterLink>
          </div>

          <!-- Lado Direito: Exibir Imagem de Usuário ou Botão de Login -->
          <div>
            <template v-if="authStore.user">
              <button @click="handleUserClick" class="flex items-center space-x-2">
                <!-- Exibe a imagem do usuário (avatar) se existir -->
                <img
                  v-if="authStore.userAvatar"
                  :src="authStore.userAvatar"
                  alt="User Avatar"
                  class="h-8 w-8 rounded-full"
                />
                <span v-if="!authStore.userAvatar" class="text-gray-900 font-semibold">
                  {{ authStore.userName }}
                </span>
              </button>
            </template>
            <template v-else>
              <RouterLink
                to="/login"
                class="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                active-class="text-blue-600 font-semibold"
              >
                Login
              </RouterLink>
            </template>
          </div>
        </nav>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

// Função para manipular o clique no avatar do usuário
const handleUserClick = () => {
  router.push('/profile'); // exemplo de redirecionamento
};
</script>

<style scoped>
/* Estilos adicionais para o botão de avatar */
button {
  background: none;
  border: none;
  cursor: pointer;
}
button:hover {
  opacity: 0.8;
}
</style>
