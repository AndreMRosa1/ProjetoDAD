<template>
  <div class="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
    <h1 class="text-2xl font-bold mb-6 text-center">Register</h1>
    <form @submit.prevent="handleRegister" class="space-y-4">
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700">Name:</label>
        <input v-model="name" id="name" placeholder="Name" required
          :class="{ 'border-red-500': errorStore.fieldMessage('name') }"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        <span v-if="errorStore.fieldMessage('name')" class="text-sm text-red-500">
          {{ errorStore.fieldMessage('name') }}
        </span>
      </div>

      <div>
        <label for="nickname" class="block text-sm font-medium text-gray-700">Nickname:</label>
        <input v-model="nickname" id="nickname" placeholder="Nickname" required
          :class="{ 'border-red-500': errorStore.fieldMessage('nickname') }"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        <span v-if="errorStore.fieldMessage('nickname')" class="text-sm text-red-500">
          {{ errorStore.fieldMessage('nickname') }}
        </span>
      </div>

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
        <label for="password" class="block text-sm font-medium text-gray-700">Password:</label>
        <input v-model="password" id="password" type="password" placeholder="Password" required
          :class="{ 'border-red-500': errorStore.fieldMessage('password') }"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        <span v-if="errorStore.fieldMessage('password')" class="text-sm text-red-500">
          {{ errorStore.fieldMessage('password') }}
        </span>
      </div>

      <div>
        <label for="password_confirmation" class="block text-sm font-medium text-gray-700">Confirm Password:</label>
        <input v-model="password_confirmation" id="password_confirmation" type="password" placeholder="Confirm Password"
          required :class="{ 'border-red-500': errorStore.fieldMessage('password_confirmation') }"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        <span v-if="errorStore.fieldMessage('password_confirmation')" class="text-sm text-red-500">
          {{ errorStore.fieldMessage('password_confirmation') }}
        </span>
      </div>

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

const handleRegister = async () => {
  const success = await authStore.register({
    name: name.value,
    nickname: nickname.value,
    email: email.value,
    password: password.value,
    password_confirmation: password_confirmation.value,
  });

  if (success) {
    alert('Registration successful!');
    await router.push('/'); // Redirects to the home page
  } else {
    // Errors are handled by the error store and displayed via the template
  }
};
</script>
