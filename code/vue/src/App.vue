<script setup>
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { useChatStore } from '@/stores/chat';
import { ref, useTemplateRef, provide, inject } from 'vue';
import Toaster from '@/components/ui/toast/Toaster.vue';
import GlobalAlertDialog from '@/components/common/GlobalAlertDialog.vue';
import GlobalInputDialog from './components/common/GlobalInputDialog.vue';

const storeChat = useChatStore();
const socket = inject('socket');

const authStore = useAuthStore();
const router = useRouter();
const showDropdown = ref(false);
const showDropdownPlay = ref(false);

const alertDialog = useTemplateRef('alert-dialog');
provide('alertDialog', alertDialog);

const inputDialog = useTemplateRef('input-dialog');
provide('inputDialog', inputDialog);

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

const toggleDropdownPlay = () => {
  showDropdownPlay.value = !showDropdownPlay.value;
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

let userDestination = null;
socket.on('privateMessage', (messageObj) => {
  userDestination = messageObj.user;
  inputDialog.value.open(
    handleMessageFromInputDialog,
    'Message from ' + messageObj.user.name,
    `This is a private message sent by ${messageObj?.user?.name}!`,
    'Reply Message',
    '',
    'Close',
    'Reply',
    messageObj.message
  );
});

const handleMessageFromInputDialog = (message) => {
  storeChat.sendPrivateMessageToUser(userDestination, message);
};
</script>

<template>
  <Toaster />
  <GlobalAlertDialog ref="alert-dialog" />
  <GlobalInputDialog ref="input-dialog" />
  <div class="bg-gray-50 min-h-screen">
    <header class="bg-white shadow-sm">
      <div class="w-full px-4">
        <nav class="flex items-center justify-between h-16">
          <!-- Left Side Navigation Links -->
          <div class="flex space-x-4">
            <RouterLink to="/"
              class="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              active-class="text-blue-600 font-semibold">
              Home
            </RouterLink>
            <RouterLink to="/dashboard" @click="toggleDropdownPlay"
              class="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              active-class="text-blue-600 font-semibold" v-if="authStore.user && authStore.user.type==='P'">
              Play

              <div v-if="showDropdownPlay" class="absolute mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                <div class="py-1" role
                  
                    
                  <h2>Single Player Game</h2>  
                  
                  <a @click="toggleDropdownPlay" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem">
                    Multiplayer Game
                  </a>
                </div>
              </div>

            </RouterLink>
            <RouterLink to="/shop"
              class="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              active-class="text-blue-600 font-semibold" v-if="authStore.user">
              Shop
            </RouterLink>
            <RouterLink to="/history"
              class="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              active-class="text-blue-600 font-semibold" v-if="authStore.user && authStore.user.type==='P'">
              Game History
            </RouterLink>
            <RouterLink to="/scoreboards"
              class="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              active-class="text-blue-600 font-semibold" v-if="authStore.user && authStore.user.type==='P'">
              Scoreboards
            </RouterLink>
            <RouterLink to="/statistics"
              class="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              active-class="text-blue-600 font-semibold" v-if="authStore.user">
              Statistics
            </RouterLink>
          </div>
          <div v-if="authStore.user && authStore.user.type==='P'" class="flex items-center justify-between text-sm">
            <img class="h-12 mr-3" src="../src/assets/icon.png">
            Coins: {{ authStore.user.brain_coins_balance }}
          </div>

          <!-- Right Side: User Avatar or Login Button -->
          <div class="relative">
            <template v-if="authStore.user">
              <button @click="toggleDropdown"
                class="flex items-center space-x-2 bg-white hover:opacity-80 hover:bg-gray-300">
                <img :src="authStore.userAvatar" alt="User Avatar" class="h-10 w-10 rounded-full" />
                <span class="text-gray-900 font-semibold">
                  {{ authStore.userName }} 
                </span>
              </button>
              <div v-if="showDropdown"
                class="absolute mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                <div class="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                  <a @click="handleEditProfile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem">
                    Edit Profile
                  </a>
                  <a @click="handleChangePassword" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem">
                    Change Password
                  </a>
                  <a @click="handleLogout" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem">
                    Logout
                  </a>
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

    <main class="w-full px-4 py-8">
      <RouterView />
    </main>
  </div>
</template>
