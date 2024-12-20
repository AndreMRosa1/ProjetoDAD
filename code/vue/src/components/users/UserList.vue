<template>
  <div>
    <h1>Users List</h1>
    <p>Total Users: {{ totalUsers }}</p>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import axios from 'axios';
import { ref, onMounted, computed } from 'vue';

const users = ref([]);

const totalUsers = computed(() => {
  return users.value.length
})

const fetchUsers = async () => {
  try {
    const response = await axios.get('/users')
    users.value = response.data.data

  } catch (error) {
    console.log(error)
  }
};

onMounted(() => {
  fetchUsers();
});
</script>

<style scoped>
/* Add your styles here */
table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
}

th {
  background-color: #f2f2f2;
  text-align: left;
}
</style>