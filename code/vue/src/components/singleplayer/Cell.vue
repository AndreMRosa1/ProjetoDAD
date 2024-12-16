<template>
    <div class="cursor-pointer m-0.5" @click="play" style="aspect-ratio: 2 / 3;">
        <img v-if="card.state !== 'hidden'" :src="card.face" :alt="card.state">
        <img v-else src="../../assets/images/semFace.png" alt="Card back">
    </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps(['card', 'index']);
const emit = defineEmits(['play']);

const play = () => {
    emit('play', props.index);
};
</script>
