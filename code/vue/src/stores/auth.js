import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';
import { useErrorStore } from '@/stores/error';

export const useAuthStore = defineStore('auth', () => {
  const storeError = useErrorStore();

  const user = ref(null);
  const token = ref('');

  // Computed properties para obter o nome e e-mail do usuário
  const userName = computed(() => user.value?.name || '');
  const userEmail = computed(() => user.value?.email || '');
  const userAvatar = computed(() => user.value?.avatar || '');

  const clearUser = () => {
    resetIntervalToRefreshToken();
    user.value = null;
    axios.defaults.headers.common.Authorization = '';
  };

  const login = async (credentials) => {
    storeError.resetMessages();
    try {
      const responseLogin = await axios.post('auth/login', credentials);
      token.value = responseLogin.data.token;
      axios.defaults.headers.common.Authorization = `Bearer ${token.value}`;
      const responseUser = await axios.get('users/me');
      user.value = responseUser.data;
      repeatRefreshToken();
      return user.value;
    } catch (e) {
      clearUser();
      storeError.setErrorMessages(
        e.response.data.message,
        e.response.data.errors,
        e.response.status,
        'Authentication Error!'
      );
      return false;
    }
  };

  const register = async (userData) => {
    storeError.resetMessages();
    try {
      await axios.post('auth/register', userData);
      return true;
    } catch (e) {
      storeError.setErrorMessages(
        e.response.data.message,
        e.response.data.errors,
        e.response.status,
        'Registration Error!'
      );
      return false;
    }
  };

  const logout = async () => {
    storeError.resetMessages();
    try {
      await axios.post('auth/logout');
      clearUser();
      return true;
    } catch (e) {
      clearUser();
      storeError.setErrorMessages(
        e.response.data.message,
        [],
        e.response.status,
        'Logout Error!'
      );
      return false;
    }
  };

  let intervalToRefreshToken = null;

  const resetIntervalToRefreshToken = () => {
    if (intervalToRefreshToken) clearInterval(intervalToRefreshToken);
    intervalToRefreshToken = null;
  };

  const repeatRefreshToken = () => {
    if (intervalToRefreshToken) clearInterval(intervalToRefreshToken);
    intervalToRefreshToken = setInterval(async () => {
      try {
        const response = await axios.post('auth/refreshtoken');
        token.value = response.data.token;
        axios.defaults.headers.common.Authorization = `Bearer ${token.value}`;
      } catch (e) {
        clearUser();
        storeError.setErrorMessages(
          e.response.data.message,
          e.response.data.errors,
          e.response.status,
          'Session Error!'
        );
      }
    }, 1000 * 60 * 110);
  };

  return {
    user,
    userName,
    userEmail,
    userAvatar,
    login,
    register,
    logout,
  };
});
