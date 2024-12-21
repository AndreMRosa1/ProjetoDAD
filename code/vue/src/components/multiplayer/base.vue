<template>
    <div class="start-new-game">
        <div class="flex flex-wrap justify-start space-x-4">
            <Chat class="w-72"></Chat>
            <Lobby v-if="storeAuth.user" class="w-72"></Lobby>
            <!--- <Games v-if="storeAuth.user" class="flex-1 min-w-96"></Games> -->
        </div>

        <!---<div class="button-container">
            <button @click="startGame(16)">4x4 (16 cards)</button>
            <button @click="startGame(36)">6x6 (36 cards)</button>
        </div>-->
    </div>
</template>



<script setup>
import { useRouter } from 'vue-router';
import Lobby from './Lobby.vue'
//import Games from './Games.vue'
import Chat from '@/components/chat/Chat.vue'
import { useAuthStore} from '@/stores/auth'

const storeAuth = useAuthStore()

const router = useRouter();

// Function to navigate to the MemoryGame component with the selected size
const startGame = (size) => {
    // Navigate to the 'start' route of 'memory-game', passing size as a query parameter
    router.push({ name: 'gamemultiplayer', query: { size } });
};
</script>

<style scoped>
.button-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

button {
    padding: 10px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

button:hover {
    background-color: #45a049;
}
</style>