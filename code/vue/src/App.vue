<script setup>
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { useChatStore } from '@/stores/chat';
import { ref, useTemplateRef, provide, inject, onMounted, onUnmounted } from 'vue';
import Toaster from '@/components/ui/toast/Toaster.vue';
import GlobalAlertDialog from '@/components/common/GlobalAlertDialog.vue';
import GlobalInputDialog from './components/common/GlobalInputDialog.vue';

const storeChat = useChatStore();
const socket = inject('socket');

const authStore = useAuthStore();
const router = useRouter();
const showDropdown = ref(false);
const showDropdownPlay = ref(false);
const showDropdownScoreboard = ref(false);

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

const toggleDropdownScoreboard = () => {
  showDropdownScoreboard.value = !showDropdownScoreboard.value;
};

const handleClickOutside = (event) => {
  // Close Play Dropdown if clicking outside
  if (!event.target.closest('.play-dropdown') && !event.target.closest('.play-button')) {
    showDropdownPlay.value = false;
  }
  // Close User Dropdown if clicking outside
  if (!event.target.closest('.user-dropdown') && !event.target.closest('.user-button')) {
    showDropdown.value = false;
  }
  // Close Scoreboard Dropdown if clicking outside
  if (!event.target.closest('.scoreboard-dropdown') && !event.target.closest('.scoreboard-button')) {
    showDropdownScoreboard.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

const handleEditProfile = () => {
  showDropdown.value = false;
  router.push('/edit-profile');
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
    <header class="bg-white shadow-sm sticky top-0 z-50">
      <div class="w-full px-4">
        <nav class="flex items-center justify-between h-16">
          <!-- Left Side Navigation Links -->
          <div class="flex space-x-4">
            <RouterLink to="/"
              class="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              active-class="text-blue-600 font-semibold">
              Home
            </RouterLink>
            <div v-if="authStore.user && authStore.user.type === 'P'" class="relative">
              <button @click="toggleDropdownPlay"
                class="play-button w-max text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Play
              </button>
              <div v-show="showDropdownPlay"
                class="cursor-pointer play-dropdown absolute mt-2 w-max rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                <div class="py-1">
                  <RouterLink to="/new-memory-game">
                    <a @click="toggleDropdownPlay" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Single Player Game
                    </a>
                  </RouterLink>
                  <RouterLink to="/multiplayer">
                    <a @click="toggleDropdownPlay" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Multiplayer Game
                    </a>
                  </RouterLink>
                </div>
              </div>
            </div>
            <RouterLink to="/shop"
              class="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              active-class="text-blue-600 font-semibold" v-if="authStore.user && authStore.user.type === 'P'">
              Shop
            </RouterLink>
            <RouterLink to="/history"
              class="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              active-class="text-blue-600 font-semibold" v-if="authStore.user">
              Game History
            </RouterLink>
            <div v-if="authStore.user && authStore.user.type === 'P'" class="relative">
              <button @click="toggleDropdownScoreboard"
                class="scoreboard-button w-max text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Scoreboards
              </button>
              <div v-show="showDropdownScoreboard"
                class="cursor-pointer scoreboard-dropdown absolute mt-2 w-max rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                <div class="py-1">
                  <RouterLink to="/scoreboards/personal">
                    <a @click="toggleDropdownScoreboard"
                      class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Personal
                    </a>
                  </RouterLink>
                  <RouterLink to="/scoreboards/global">
                    <a @click="toggleDropdownScoreboard"
                      class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Global
                    </a>
                  </RouterLink>
                </div>
              </div>
            </div>
            <RouterLink to="/scoreboards/global"
              class="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              active-class="text-blue-600 font-semibold" v-if="!authStore.user">
              Global Scoreboard
            </RouterLink>
            <RouterLink to="/statistics"
              class="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              active-class="text-blue-600 font-semibold" v-if="authStore.user">
              Statistics
            </RouterLink>
            <RouterLink to="/users"
              class="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              active-class="text-blue-600 font-semibold" v-if="authStore.user && authStore.user.type === 'A'">
              Users
            </RouterLink>
            <RouterLink to="/transactions/history"
              class="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              active-class="text-blue-600 font-semibold" v-if="authStore.user && authStore.user.type === 'A'">
              Transaction History
            </RouterLink>
          </div>
          <div v-if="authStore.user && authStore.user.type === 'P'" class="flex items-center text-sm">
            <img class="h-12 mr-3" src="../src/assets/icon.png" />
            Coins: {{ authStore.user.brain_coins_balance }}
          </div>
          <!-- Right Side: User Avatar or Login Button -->
          <div class="relative">
            <template v-if="authStore.user">
              <button @click="toggleDropdown"
                class="pr-3 user-button flex items-center space-x-2 bg-white hover:opacity-80 hover:bg-gray-300 rounded-md hover:rounded-full transition-all duration-200">
                <img :src="authStore.userAvatar" alt="User Avatar" class="h-10 w-10 rounded-full" />
                <span class="text-gray-900 font-semibold">
                  {{ authStore.userName }}
                </span>
              </button>
              <div v-if="showDropdown"
                class="cursor-pointer right-0 user-dropdown absolute w-max rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-100">
                <div class="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                  <a @click="handleEditProfile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Edit Profile
                  </a>
                  <a @click="handleChangePassword" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Change Password
                  </a>
                  <RouterLink v-if="authStore.user.type != 'A'" to="/transactions/history"><a
                      class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Transaction History
                    </a></RouterLink>

                  <a @click="handleLogout" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
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
