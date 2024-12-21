<template>
  <div class="cursor-pointer m-0.5" @click="gamesStore.play(props.card, props.index, memoryGameStore.board, id)"
    style="aspect-ratio: 2 / 3;">
    <img :style="{ height: cardSizeCalc }" v-if="card.state === 'paired' || card.state === 'flipped'"
      :src="typeof card.face === 'string' ? card.face : card.face.default" :alt="card.state">
    <img :style="{ height: cardSizeCalc }" v-else src="../../assets/images/semFace.png" alt="Card back">
  </div>
</template>

<script setup>
import { useMemorygameStore } from '@/stores/memorygame';
import { ref, defineProps, defineEmits, computed } from 'vue';
import { useGamesStore } from '@/stores/games';
import { useLobbyStore } from '@/stores/lobby';

const memoryGameStore = useMemorygameStore();
const props = defineProps(['card', 'index']);
const emit = defineEmits(['play']);

const gamesStore = useGamesStore();
const lobbyStore = useLobbyStore();

const cardSizeCalc = computed(() => {
  let height;

  if (gamesStore.gameSize === 12) {
    height = `calc(82vh / 3)`;
  } else if (gamesStore.gameSize === 16) {
    height = `calc(82vh / 4)`;
  } else if (gamesStore.gameSize === 36) {
    height = `calc(82vh / 6)`;
  }

  return height;
});

const id = ref([Number(new URLSearchParams(window.location.search).get('id'))]);

/*const play = () => {
  console.log('Carta clicada:', props.index);
  emit('play', props.index);
  console.log("emiti alguma coisa")
};*/
</script>