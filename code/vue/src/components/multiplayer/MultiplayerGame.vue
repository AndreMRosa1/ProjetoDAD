<template>
  <div class="flex gap-8 max-w-full">
    <div class="flex flex-col gap-3 ">

      <div>
        
        <div class="text-lg">Turns: {{ memorygame.turnCounter }}</div>
        <div class="text-lg">Pairs: {{ memorygame.pairCounter }}</div>
        <div class="text-lg">Timer: {{ memorygame.timer }}s</div>
      </div>

      <RouterLink to="/new-memory-game" class="nav-link">
        <button class="whitespace-nowrap px-8">Go Back</button>
      </RouterLink>


      <Board ref="boardComponent" :size="size" :id="id" @game-started="gameStarted = true" @game-ended="gameStarted = false" />
    </div>

    
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import Board from './Board.vue';
import { useMemorygameStore } from '../../stores/memorygame';



const authStore = useAuthStore();
const gameStarted = ref(false);
const boardComponent = ref(null);


const size = ref(Number(new URLSearchParams(window.location.search).get('size')));
const id = ref([Array(new URLSearchParams(window.location.search).get('id'))]);
//console.log(size.value + 'SIZE')
const memorygame = useMemorygameStore();

</script>
