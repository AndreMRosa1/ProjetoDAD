<template>
    <div class="game">
      <h3>{{ game.name }}</h3>
    </div>
  </template>
  
  <script setup>
  import { defineProps } from 'vue'
  
  const props = defineProps({
    game: {
      type: Object,
      required: true
    }
  })
</script>
  
<style scoped>
  .game {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
</style>