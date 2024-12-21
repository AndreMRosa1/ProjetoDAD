<template>
  <div class="p-6 bg-white rounded-lg max-w-4xl mx-auto shadow-lg">
    <h1 class="text-3xl font-semibold text-center text-gray-800 mb-3">
      <span class="mr-2">👥</span> Users List
    </h1>

    <!-- Filters -->
    <div class="filters mb-4 flex flex-wrap justify-between gap-4">
      <div>
        <label for="sort-id" class="block text-sm font-medium text-gray-700">Sort by ID:</label>
        <select id="sort-id" v-model="filters.sortOrder" @change="applyFilters"
          class="w-full px-3 py-2 border rounded-md">
          <option value="">None</option>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      <div>
        <label for="filter-type" class="block text-sm font-medium text-gray-700">Filter by Type:</label>
        <select id="filter-type" v-model="filters.type" @change="applyFilters"
          class="w-full px-3 py-2 border rounded-md">
          <option value="">All</option>
          <option value="A">Admin</option>
          <option value="P">Player</option>
        </select>
      </div>

      <div>
        <label for="filter-email" class="block text-sm font-medium text-gray-700">Filter by Email:</label>
        <input id="filter-email" v-model="filters.email" @input="applyFilters" type="text"
          class="w-full px-3 py-2 border rounded-md" />
      </div>

      <div>
        <label for="filter-name" class="block text-sm font-medium text-gray-700">Filter by Name:</label>
        <input id="filter-name" v-model="filters.name" @input="applyFilters" type="text"
          class="w-full px-3 py-2 border rounded-md" />
      </div>

      <button class="bg-red-500 text-white px-4 py-1 rounded-md hover:bg-red-600 focus:outline-none"
        @click="resetFilters">
        Reset Filters
      </button>
    </div>

    <button class="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 focus:outline-none mb-4"
      @click="createUser">
      Create New User
    </button>

    <!-- Table -->
    <div class="overflow-x-auto bg-gray-50 rounded-lg">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-green-600 text-white font-semibold">
            <th class="p-2">ID</th>
            <th class="p-2">Name</th>
            <th class="p-2">Email</th>
            <th class="p-2">Type</th>
            <th class="p-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in paginatedUsers" :key="user.id" class="hover:bg-green-100 border-b last:border-b-0">
            <td class="p-2">{{ user.id }}</td>
            <td class="p-2">{{ user.name }}</td>
            <td class="p-2">{{ user.email }}</td>
            <td class="p-2">{{ user.type }}</td>
            <td v-if="user.id != authStore.user.id" class="p-2 text-center">
              <button v-if="user.blocked" @click="unblockUser(user.id)"
                class="mr-1 bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600">
                Unblock
              </button>
              <button v-else @click="blockUser(user.id)"
                class="mr-1 bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">
                Block
              </button>
              <button v-if="!user.deleted_at" @click="deleteUser(user.id)"
                class="mr-1 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">
                Delete
              </button>

              <!-- Make/Remove Admin Button -->
              <button v-if="user.type !== 'A'" @click="updateAdmin(user.id, 'A')"
                class="mt-1 bg-purple-500 text-white px-2 py-1 rounded hover:bg-purple-600">
                Make Admin
              </button>
              <button v-else @click="updateAdmin(user.id, 'P')"
                class="mt-1 bg-orange-500 text-white px-2 py-1 rounded hover:bg-orange-600">
                Remove Admin
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="flex justify-center items-center mt-6 gap-4">
      <button class="whitespace-nowrap px-6 py-2 bg-gray-200 text-black rounded-md hover:bg-gray-300 focus:outline-none"
        :class="{ 'bg-gray-300': currentPage === 1, 'bg-gray-200': currentPage !== 1 }" :disabled="currentPage === 1"
        @click="prevPage" :style="{ cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }">
        Previous
      </button>

      <!-- Page Number Input -->
      <div class="flex items-center gap-2">
        <input type="number" v-model="inputPage" min="1" :max="totalPages"
          class="text-center px-1 py-2 border rounded-md w-16" @blur="onPageInputBlur" @keydown.enter="handlePageInput"
          :disabled="paginatedUsers.length === 0" />
        <span class="text-lg">of {{ totalPages }}</span>
      </div>

      <button class="whitespace-nowrap px-6 py-2 bg-gray-200 text-black rounded-md hover:bg-gray-300 focus:outline-none"
        :class="{ 'bg-gray-300': currentPage === totalPages, 'bg-gray-200': currentPage !== totalPages }"
        :disabled="currentPage === totalPages" @click="nextPage"
        :style="{ cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }">
        Next
      </button>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import axios from 'axios';
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();
const users = ref([]);
const currentPage = ref(1);
const itemsPerPage = 10;
const inputPage = ref(1);
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
    console.error(error);
  }
};

const deleteUser = async (userId) => {
  try {
    await axios.delete(`/users/${userId}`);
    users.value = users.value.filter(user => user.id !== userId);
  } catch (error) {
    console.error(error);
  }
};

const blockUser = async (userId) => {
  try {
    await axios.post(`/users/${userId}/block`);
    fetchUsers();
  } catch (error) {
    console.error(error);
  }
};

const unblockUser = async (userId) => {
  try {
    await axios.post(`/users/${userId}/unblock`);
    fetchUsers();
  } catch (error) {
    console.error(error);
  }
};

const updateAdmin = async (userId, newType) => {
  try {
    await axios.put(`/users/${userId}/updateAdmin`, { type: newType });
    fetchUsers(); // Re-fetch users after the update
  } catch (error) {
    console.error(error);
  }
};

const applyFilters = () => {
  currentPage.value = 1;
};

const resetFilters = () => {
  filters.value = {
    sortOrder: '',
    type: '',
    email: '',
    name: ''
  };
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
    filteredUsers = filteredUsers.sort((a, b) =>
      filters.value.sortOrder === 'asc' ? a.id - b.id : b.id - a.id
    );
  }

  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredUsers.slice(start, end);
});

const totalPages = computed(() => Math.ceil(users.value.length / itemsPerPage));

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    inputPage.value = currentPage.value;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    inputPage.value = currentPage.value;
  }
};

const handlePageInput = () => {
  const newPage = Number(inputPage.value);
  if (newPage >= 1 && newPage <= totalPages.value) {
    currentPage.value = newPage;
  } else {
    inputPage.value = currentPage.value;
  }
};

const onPageInputBlur = () => {
  inputPage.value = currentPage.value;
};

onMounted(() => {
  fetchUsers();
});
</script>
