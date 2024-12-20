<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import StartNewMemoryGame from './StartNewMemoryGame.vue';
import ScoreboardsPage from './ScoreboardsPage.vue';
import { Globe, PersonStanding } from 'lucide-vue-next';
import GlobalScoreboard from './scoreboards/GlobalScoreboard.vue';
import PersonalScoreboard from './scoreboards/PersonalScoreboard.vue';
import Chat from './chat/Chat.vue';
import GameHistory from './GameHistory.vue';

const router = useRouter();
const authStore = useAuthStore();

const startGame = (size) => {
  router.push({ name: 'game', query: { size } });
};
</script>

<template>
  <div class="start-new-game flex justify-center items-center h-[calc(100vh-5rem-50px)]">
    <div class="button-container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 w-full h-full">
      <!-- Global Scoreboard on the left -->
      <div v-if="authStore.user"
        class="relative w-fit h-fit bg-white rounded-lg shadow-lg flex flex-col hover:cursor-pointer">
        <GlobalScoreboard></GlobalScoreboard>
      </div>

      <!-- Personal Scoreboard in the middle (only if logged in) -->
      <div v-if="authStore.user"
        class="relative w-fit h-fit bg-white rounded-lg shadow-lg flex flex-col hover:cursor-pointer">
        <PersonalScoreboard :context="'home'"></PersonalScoreboard>
      </div>

      <div v-if="!authStore.user" @click="startGame(90)"
        class="relative w-fit h-fit bg-white rounded-lg shadow-lg flex flex-col hover:cursor-pointer">
        <img src="/sp.png" alt="Home" class="h-48 object-cover flex-grow mx-auto rounded-t-lg">
        <div class="p-4 text-center bg-gray-900 text-white text-lg font-bold rounded-b-lg">
          New Singleplayer Game (Guest)
        </div>
      </div>

      <!-- Right side container for New Game and Chat -->
      <div v-if="authStore.user" class="relative w-full flex flex-col space-y-4">
        <!-- New Single Player and Multiplayer Game Buttons side by side -->
        <div class="flex space-x-4 justify-center">
          <RouterLink to="/new-memory-game" class="w-full sm:w-1/2">
            <div class="relative w-full h-full bg-white rounded-lg shadow-lg flex flex-col hover:cursor-pointer">
              <img src="/sp.png" alt="Home" class="h-48 object-cover flex-grow mx-auto rounded-t-lg">
              <div class="p-4 text-center bg-gray-900 text-white text-lg font-bold rounded-b-lg">
                New Singleplayer Game
              </div>
            </div>
          </RouterLink>

          <RouterLink to="/multiplayer" class="w-full sm:w-1/2">
            <div class="relative w-full h-full bg-white rounded-lg shadow-lg flex flex-col hover:cursor-pointer">
              <img src="/mp.png" alt="Home" class="h-48 object-cover flex-grow mx-auto rounded-t-lg">
              <div class="p-4 text-center bg-gray-900 text-white text-lg font-bold rounded-b-lg">
                New Multiplayer Game
              </div>
            </div>
          </RouterLink>
        </div>

        <!-- Chat under the New Game buttons -->
        <div class="relative rounded-lg flex flex-col hover:cursor-pointer">
          <Chat :message-limit="3"></Chat>
        </div>
      </div>
    </div>
  </div>
</template>
