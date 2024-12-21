<template>
  <div class="max-w-md mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
    <h1 class="text-2xl font-bold text-center mb-6">Login</h1>
    <form @submit.prevent="handleLogin" class="space-y-4">
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700">Email:</label>
        <input v-model="email" id="email" type="email" placeholder="Email"
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"
          required />
      </div>
      <div>
        <label for="password" class="block text-sm font-medium text-gray-700">Password:</label>
        <input v-model="password" id="password" type="password" placeholder="Password"
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"
          required />
      </div>

      <p v-if="errorMessage" class="text-sm text-red-500">{{ errorMessage }}</p>

      <button type="submit"
        class="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-500">
        Login
      </button>
    </form>

    <div class="mt-6 text-center">
      <p class="text-sm text-gray-600">Don't have an account?</p>
      <RouterLink to="/register"
        class="inline-block mt-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-600 hover:text-white">
        Register
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

const email = ref("");
const password = ref("");
const errorMessage = ref("");

const handleLogin = async () => {
  errorMessage.value = "";

  const success = await authStore.login({
    email: email.value,
    password: password.value,
  });

  if (success) {
    router.push("/");
  } else {
    errorMessage.value = "Invalid credentials. Please try again.";
  }
};
</script>
