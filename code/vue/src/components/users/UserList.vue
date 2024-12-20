<template>
  <div>
    <h1 class="title">Users List</h1>
    <!-- Filters -->
    <div class="filters">
      <label for="sort-id">Sort by ID:</label>
      <select id="sort-id" v-model="filters.sortOrder" @change="applyFilters">
        <option value="">None</option>
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>

      <label for="filter-type">Filter by Type:</label>
      <select id="filter-type" v-model="filters.type" @change="applyFilters">
        <option value="">All</option>
        <option value="A">Admin</option>
        <option value="P">Player</option>
      </select>

      <label for="filter-email">Filter by Email:</label>
      <input id="filter-email" v-model="filters.email" @input="applyFilters" type="text" />

      <label for="filter-name">Filter by Name:</label>
      <input id="filter-name" v-model="filters.name" @input="applyFilters" type="text" />

      <button class="reset-button" @click="resetFilters">Reset Filters</button>
    </div>

    <button class="create-button" @click="createUser">Create New User</button>

    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Type</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in paginatedUsers" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.type }}</td>
          <td class="border px-4 py-2">
            <button @click="deleteUser(user.id)" class="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
        </td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination Controls -->
    <div class="pagination-controls">
      <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { useErrorStore } from '@/stores/error';

const storeUser = useUserStore()
const storeError = useErrorStore()

const router = useRouter();
const users = ref([]);
const currentPage = ref(1);
const itemsPerPage = 10;
const filters = ref({
  sortOrder: '',
  type: '',
  email: '',
  name: ''
});

const fetchUsers = async () => {
  try {
    const response = await axios.get('/users');
    users.value = response.data;
  } catch (error) {
    console.log(error);
  }
};

const deleteUser = async (userId) => {
    storeError.resetMessages()
    try {
      await axios.delete(`/users/${userId}`)
      users.value = users.value.filter(user => user.id !== userId)
    } catch (e) {
      storeError.setErrorMessages(
        e.response.data.message, e.response.data.errors, e.response.status, 'Delete User Error!'
      )
    }
  }
const applyFilters = () => {
  currentPage.value = 1;
};

const resetFilters = () => {
  filters.value.sortOrder = 'asc';
  filters.value.type = '';
  filters.value.email = '';
  filters.value.name = '';
  applyFilters();
};

const createUser = () => {
  router.push('/users/create');
};

const paginatedUsers = computed(() => {
  let filteredUsers = users.value;

  if (filters.value.type) {
    filteredUsers = filteredUsers.filter(user => user.type === filters.value.type);
  }

  if (filters.value.email) {
    filteredUsers = filteredUsers.filter(user => user.email.includes(filters.value.email));
  }

  if (filters.value.name) {
    filteredUsers = filteredUsers.filter(user => user.name.includes(filters.value.name));
  }

  if (filters.value.sortOrder) {
    filteredUsers = filteredUsers.sort((a, b) => {
      if (filters.value.sortOrder === 'asc') {
        return a.id - b.id;
      } else {
        return b.id - a.id;
      }
    });
  }

  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredUsers.slice(start, end);
});

const totalPages = computed(() => {
  let filteredUsers = users.value;

  if (filters.value.type) {
    filteredUsers = filteredUsers.filter(user => user.type === filters.value.type);
  }

  if (filters.value.email) {
    filteredUsers = filteredUsers.filter(user => user.email.includes(filters.value.email));
  }

  if (filters.value.name) {
    filteredUsers = filteredUsers.filter(user => user.name.includes(filters.value.name));
  }

  return Math.ceil(filteredUsers.length / itemsPerPage);
});

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

onMounted(() => {
  fetchUsers();
});
</script>

<style scoped>
.title {
  font-size: 2em;
  margin-bottom: 10px;
  text-align: center;
}

.total-users {
  font-size: 1.2em;
  margin-bottom: 20px;
  text-align: center;
}

.filters {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}

.filters label {
  margin-right: 10px;
}

.filters select,
.filters input {
  margin-right: 20px;
  padding: 5px;
}

.reset-button {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 5px;
}

.reset-button:hover {
  background-color: #d32f2f;
}

.create-button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 5px;
  margin-bottom: 20px;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.create-button:hover {
  background-color: #45a049;
}

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

.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.pagination-controls button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  margin: 0 5px;
  cursor: pointer;
  border-radius: 5px;
}

.pagination-controls button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.pagination-controls span {
  margin: 0 10px;
}
</style>