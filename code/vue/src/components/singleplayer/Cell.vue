<template>
    <div class="card" @click="play">
        <img v-if="card.state !== 'hidden'" :src="card.face" :alt="card.state" class="card-img">
        <img v-else src="../../assets/images/semFace.png" alt="Card back" class="card-img">
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

<style scoped>
.card {
    cursor: pointer;
    overflow: hidden;
    border-radius: 0.5rem;
}

.card:hover {
    transform: scale(1.05);
}

.card-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: 0.5rem;
}
</style>
