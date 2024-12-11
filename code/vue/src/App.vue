
<script setup>
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { ref } from 'vue';

const authStore = useAuthStore();
const router = useRouter();
const showDropdown = ref(false);

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

const handleEditProfile = () => {
  showDropdown.value = false;
  router.push('/profile');
};

const handleChangePassword = () => {
  showDropdown.value = false;
  router.push('/change-password');
};

const handleLogout = () => {
  showDropdown.value = false;
  authStore.logout();
  router.push('/');
};
</script>

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
              v-if="authStore.user && authStore.user.type == 'A'"
            >
              Laravel Tester
            </RouterLink>
            <RouterLink
              to="/testers/websocket"
              class="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              active-class="text-blue-600 font-semibold"
              v-if="authStore.user && authStore.user.type == 'A'"
            >
              WebSockets Tester
            </RouterLink>
            <RouterLink
            to="/dashboard"
            class="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            active-class="text-blue-600 font-semibold"
            v-if="authStore.user"
          >
            Dashboard
          </RouterLink>
          </div>

          <!-- Lado Direito: Exibir Imagem de Usuário ou Botão de Login -->
            <div>
              <template v-if="authStore.user">
                <button @click="toggleDropdown" class="flex items-center space-x-2">
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
                <div v-if="showDropdown" class="absolute mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div class="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                    <a @click="handleEditProfile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Edit Profile</a>
                    <a @click="handleChangePassword" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Change Password</a>
                    <a @click="handleLogout" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Logout</a>
                  </div>
                </div>
              </template>
              <template v-else>
                <RouterLink
                  to="/login"
                  class="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  active-class="text-blue-600 font-semibold"
                >
                  Login
                </RouterLink>
                <RouterLink
                  to="/register"
                  class="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  active-class="text-blue-600 font-semibold"
                >
                  Register
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
