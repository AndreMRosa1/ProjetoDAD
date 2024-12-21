<template>
  <div class="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
    <h1 class="text-2xl font-bold mb-6 text-center">Create New User</h1>
    <form @submit.prevent="handleRegister" class="space-y-4">
      <!-- Name Input -->
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700">Name:</label>
        <input v-model="name" id="name" placeholder="Name" required
          :class="{ 'border-red-500': errorStore.fieldMessage('name') }"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        <span v-if="errorStore.fieldMessage('name')" class="text-sm text-red-500">
          {{ errorStore.fieldMessage('name') }}
        </span>
      </div>

      <!-- Nickname Input -->
      <div>
        <label for="nickname" class="block text-sm font-medium text-gray-700">Nickname:</label>
        <input v-model="nickname" id="nickname" placeholder="Nickname" required
          :class="{ 'border-red-500': errorStore.fieldMessage('nickname') }"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        <span v-if="errorStore.fieldMessage('nickname')" class="text-sm text-red-500">
          {{ errorStore.fieldMessage('nickname') }}
        </span>
      </div>

      <!-- Email Input -->
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700">Email:</label>
        <input v-model="email" id="email" type="email" placeholder="Email" required
          :class="{ 'border-red-500': errorStore.fieldMessage('email') }"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        <span v-if="errorStore.fieldMessage('email')" class="text-sm text-red-500">
          {{ errorStore.fieldMessage('email') }}
        </span>
      </div>

      <div>
        <label for="user_type" class="block text-sm font-medium text-gray-700">User Type:</label>
        <select v-model="userType" id="user_type"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
          <option value="P">Regular User</option>
          <option value="A">Admin</option>
        </select>
      </div>

      <!-- Password Input -->
      <div>
        <label for="password" class="block text-sm font-medium text-gray-700">Password:</label>
        <input v-model="password" id="password" type="password" placeholder="Password" required
          :class="{ 'border-red-500': errorStore.fieldMessage('password') }"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        <span v-if="errorStore.fieldMessage('password')" class="text-sm text-red-500">
          {{ errorStore.fieldMessage('password') }}
        </span>
      </div>

      <!-- Confirm Password Input -->
      <div>
        <label for="password_confirmation" class="block text-sm font-medium text-gray-700">Confirm Password:</label>
        <input v-model="password_confirmation" id="password_confirmation" type="password" placeholder="Confirm Password"
          required :class="{ 'border-red-500': errorStore.fieldMessage('password_confirmation') }"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        <span v-if="errorStore.fieldMessage('password_confirmation')" class="text-sm text-red-500">
          {{ errorStore.fieldMessage('password_confirmation') }}
        </span>
      </div>

      <!-- Photo Upload Input -->
      <div>
        <label for="photo" class="block text-sm font-medium text-gray-700">Profile Photo:</label>
        <input type="file" id="photo" @change="handleFileChange"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
      </div>

      <!-- Submit Button -->
      <button type="submit"
        class="w-full bg-green-600 text-white py-2 px-4 rounded-md shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
        Create!
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useErrorStore } from '@/stores/error';
import { useRouter } from 'vue-router';
import axios from 'axios';

const authStore = useAuthStore();
const errorStore = useErrorStore();
const router = useRouter();

const name = ref('');
const nickname = ref('');
const email = ref('');
const password = ref('');
const password_confirmation = ref('');
const photo = ref(null); // For storing the photo file
const userType = ref('P'); // Default to Regular User

const handleFileChange = (event) => {
  photo.value = event.target.files[0]; // Save the selected file to the `photo` ref
};

const handleRegister = async () => {
  if (password.value !== password_confirmation.value) {
    errorStore.setErrorMessages({
      password_confirmation: ['Passwords do not match']
    });
    return;
  }

  const formData = new FormData();
  formData.append('name', name.value);
  formData.append('nickname', nickname.value);
  formData.append('email', email.value);
  formData.append('password', password.value);
  formData.append('password_confirmation', password_confirmation.value);


  if (photo.value) {
    formData.append('photo', photo.value);
  }

  const success = await authStore.register(formData);

  if (!success) {
    errorStore.setErrorMessages("Error registering user");
  }

  const userId = success.response.data.user.id;

  updateAdmin(userId);
};

const updateAdmin = async (userId) => {
  console.log('Update')
  console.log(userType)
  const success = await axios.put(`/users/${userId}/updateAdmin`, { type: userType.value });
  console.log(success)

  if (!success) {
    errorStore.setErrorMessages("Error updating user to admin");
  }
}
</script>