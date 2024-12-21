<template>
  <div>
    <h1>Statistics</h1>
    <!-- Content for Statistics -->
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const updateTypeResponse = ref(null);

const updateUserType = async () => {
  try {
    updateTypeResponse.value = await axios.get('/users/getAll');
    console.log(updateTypeResponse.value);
  } catch (error) {
    console.error('Error updating user type:', error);
  }
};

onMounted(() => {
  updateUserType();
});
</script>

<style scoped>
.container {
  max-width: 1200px;
}
</style>
