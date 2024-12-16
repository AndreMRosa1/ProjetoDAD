<template>
    <div class="cursor-pointer overflow-hidden rounded-lg" @click="play" style="aspect-ratio: 2 / 3;" :disabled="disabled">
      <img v-if="card.state !== 'hidden'" :src="card.face" :alt="card.state" class="w-full h-full object-contain">
      <img v-else src="../../assets/images/semFace.png" alt="Card back" class="w-full h-full object-contain">
    </div>
  </template>
  
  <script setup>
  import { defineProps, defineEmits } from 'vue';
  
  const props = defineProps(['card', 'index', 'disabled']);
  const emit = defineEmits(['play']);
  
  const play = () => {
    if (!props.disabled) {
      emit('play', props.index);
    }
  };
  </script>
  