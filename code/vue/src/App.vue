<script setup>
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { useChatStore } from '@/stores/chat'
import { ref, useTemplateRef, provide, inject } from 'vue'
import Toaster from '@/components/ui/toast/Toaster.vue'
import GlobalAlertDialog from '@/components/common/GlobalAlertDialog.vue'
import GlobalInputDialog from './components/common/GlobalInputDialog.vue'

const storeChat = useChatStore()
const socket = inject('socket')

const authStore = useAuthStore();
const router = useRouter();
const showDropdown = ref(false);

const alertDialog = useTemplateRef('alert-dialog')
provide('alertDialog', alertDialog)

const inputDialog = useTemplateRef('input-dialog')
provide('inputDialog', inputDialog)

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

const handleWebsocketsTester = () => {
  showDropdown.value = false;
  router.push('/testers/websocket');
};

const handleLaravelTester = () => {
  showDropdown.value = false;
  router.push('/testers/laravel');
};

let userDestination = null
socket.on('privateMessage', (messageObj) => {
  userDestination = messageObj.user
  inputDialog.value.open(
    handleMessageFromInputDialog,
    'Message from ' + messageObj.user.name,
    `This is a private message sent by ${messageObj?.user?.name}!`,
    'Reply Message', '',
    'Close', 'Reply',
    messageObj.message
  )
})

const handleMessageFromInputDialog = (message) => {
  storeChat.sendPrivateMessageToUser(userDestination, message)
}

const logoutConfirmed = () => {
  storeAuth.logout()
}

const logout = () => {
  alertDialog.value.open(logoutConfirmed, 'Logout confirmation?', 'Cancel', `Yes, I want to log out`,
    `Are you sure you want to log out? You can still access your account later with your credentials.`)
}
</script>

<template>
  <Toaster />
  <GlobalAlertDialog ref="alert-dialog"></GlobalAlertDialog>
  <GlobalInputDialog ref="input-dialog"></GlobalInputDialog>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav class="flex items-center justify-between h-16">
          <!-- Lado Esquerdo: Links de Navegação -->
          <div class="space-x-8">
            <RouterLink to="/"
              class="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              active-class="text-blue-600 font-semibold">
              Home
            </RouterLink>
            <RouterLink to="/dashboard"
              class="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              active-class="text-blue-600 font-semibold" v-if="authStore.user">
              Dashboard
            </RouterLink>
            <RouterLink to="/shop"
              class="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              active-class="text-blue-600 font-semibold" v-if="authStore.user">
              Shop
            </RouterLink>
          </div>
          <div v-if="authStore.user">
            Coins: {{ authStore.user.brain_coins_balance }}
          </div>

          <!-- Lado Direito: Exibir Imagem de Usuário ou Botão de Login -->
          <div>
            <template v-if="authStore.user">
              <button @click="toggleDropdown" class="flex items-center space-x-2">
                <img :src="authStore.userAvatar" alt="User Avatar" class="h-10 w-10 rounded-full" />
                <span class="text-gray-900 font-semibold">
                  {{ authStore.userName }}
                </span>
              </button>
              <div v-if="showDropdown"
                class="absolute mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                <div class="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                  <a @click="handleEditProfile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem">Edit Profile</a>
                  <a @click="handleChangePassword" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem">Change Password</a>
                  <a @click="handleWebsocketsTester" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem" v-if="authStore.user && authStore.user.type == 'A'">Websockets Tester</a>
                  <a @click="handleLaravelTester" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem" v-if="authStore.user && authStore.user.type == 'A'">Laravel Tester</a>
                  <a @click="handleLogout" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem">Logout</a>
                </div>
              </div>

            </template>
            <template v-else>
              <RouterLink to="/login"
                class="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                active-class="text-blue-600 font-semibold">
                Login
              </RouterLink>
              <RouterLink to="/register"
                class="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                active-class="text-blue-600 font-semibold">
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
