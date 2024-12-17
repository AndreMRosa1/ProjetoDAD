<template>
  <div class="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
    <h1 class="text-2xl font-bold mb-6 text-center">Change Password</h1>
    <form @submit.prevent="handleChangePassword" class="space-y-4">
      <div>
        <label for="current_password" class="block text-sm font-medium text-gray-700">Current Password:</label>
        <input v-model="passwords.current_password" id="current_password" type="password" placeholder="Current Password"
          required :class="{ 'border-red-500': errorStore.fieldMessage('current_password') }"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        <span v-if="errorStore.fieldMessage('current_password')" class="text-sm text-red-500">
          {{ errorStore.fieldMessage('current_password') }}
        </span>
      </div>

      <div>
        <label for="password" class="block text-sm font-medium text-gray-700">New Password:</label>
        <input v-model="passwords.password" id="password" type="password" placeholder="New Password" required
          :class="{ 'border-red-500': errorStore.fieldMessage('password') }"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        <span v-if="errorStore.fieldMessage('password')" class="text-sm text-red-500">
          {{ errorStore.fieldMessage('password') }}
        </span>
      </div>

      <div>
        <label for="password_confirmation" class="block text-sm font-medium text-gray-700">Confirm New Password:</label>
        <input v-model="passwords.password_confirmation" id="password_confirmation" type="password"
          placeholder="Confirm New Password" required
          :class="{ 'border-red-500': errorStore.fieldMessage('password_confirmation') }"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        <span v-if="errorStore.fieldMessage('password_confirmation')" class="text-sm text-red-500">
          {{ errorStore.fieldMessage('password_confirmation') }}
        </span>
      </div>

      <button type="submit"
        class="w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
        Change Password
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

const passwords = ref({
  current_password: '',
  password: '',
  password_confirmation: ''
});

const handleChangePassword = async () => {
  const success = await authStore.changePassword({
    current_password: passwords.value.current_password,
    password: passwords.value.password,
    password_confirmation: passwords.value.password_confirmation,
  });

  if (success) {
    alert('Password successfully changed!');
    await router.push('/'); // Redirect after success
  } else {
    // Errors are handled by the error store and displayed via the template
  }
};
</script>
