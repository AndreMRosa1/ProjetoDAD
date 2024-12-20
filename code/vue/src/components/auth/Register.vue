<template>
  <div class="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
    <h1 class="text-2xl font-bold mb-6 text-center">Register</h1>
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
        class="w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
        Register
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useErrorStore } from '@/stores/error';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const errorStore = useErrorStore();
const router = useRouter();

const name = ref('');
const nickname = ref('');
const email = ref('');
const password = ref('');
const password_confirmation = ref('');
const photo = ref(null); // For storing the photo file

const handleFileChange = (event) => {
  photo.value = event.target.files[0]; // Save the selected file to the `photo` ref
};

const handleRegister = async () => {
  // Validate that the passwords match
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

  // Only append the photo if it exists
  if (photo.value) {
    formData.append('photo', photo.value);
  }

  try {
    const success = await authStore.register(formData);
    if (success) {
      alert('Registration successful!');
      await router.push('/'); // Redirect to the home page
    } else {
      errorStore.setErrorMessages(authStore.errorMessages);
    }
  } catch (error) {
    errorStore.setErrorMessages(error.response?.data?.errors || {});
  }
};
</script>
