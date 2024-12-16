<template>
    <div class="cursor-pointer m-0.5" @click="play" style="width: fit-content;">
        <img :style="{ height: cardSizeCalc }" v-if="card.state !== 'hidden'" :src="card.face" :alt="card.state" />
        <img :style="{ height: cardSizeCalc }" v-else src="../../assets/images/semFace.png" alt="Card back" />
    </div>
</template>

<script setup>
import { defineProps, defineEmits, computed, ref } from 'vue';
import { useMemorygameStore } from '@/stores/memorygame';

const props = defineProps(['card', 'index']);
const emit = defineEmits(['play']);
const memorygame = useMemorygameStore();

const cardSizeCalc = computed(() => {
    let height;

    if (memorygame.gameSize === 12) {
        height = `calc(82vh / 3)`;
    } else if (memorygame.gameSize === 16) {
        height = `calc(82vh / 4)`;
    } else if (memorygame.gameSize === 36) {
        height = `calc(82vh / 6)`;
    }

    return height;
});

const play = () => {
    emit('play', props.index);
};
</script>
