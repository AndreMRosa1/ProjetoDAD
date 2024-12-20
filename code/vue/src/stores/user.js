import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { useErrorStore } from '@/stores/error'

export const useUserStore = defineStore('user', () => {
  const storeError = useErrorStore()
  const users = ref([])

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/users');
      users.value = response.data;
    } catch (error) {
      console.log(error);
    }
  }

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

  const blockUser = async (userId) => {
    storeError.resetMessages()
    try {
      const response = await axios.put(`/users/${userId}/block`);
      const userIndex = users.value.findIndex(user => user.id === userId);
      if (userIndex !== -1) {
        users.value[userIndex].blocked = response.data.blocked;
      }
    } catch (e) {
      storeError.setErrorMessages(
        e.response.data.message, e.response.data.errors, e.response.status, 'Block User Error!'
      )
    }
  }

  return {
    users,
    fetchUsers,
    deleteUser,
    blockUser
  }
})