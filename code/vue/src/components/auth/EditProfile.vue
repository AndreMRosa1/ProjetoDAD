<template>
    <div class="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 class="text-2xl font-bold mb-6 text-center">Edit Profile</h1>
        <form @submit.prevent="submitForm" class="space-y-4">
            <!-- Name Input -->
            <div>
                <label for="name" class="block text-sm font-medium text-gray-700">Name:</label>
                <input v-model="form.name" id="name" type="text" placeholder="Name" required
                    :class="{ 'border-red-500': errorStore.fieldMessage('name') }"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                <span v-if="errorStore.fieldMessage('name')" class="text-sm text-red-500">
                    {{ errorStore.fieldMessage('name') }}
                </span>
            </div>

            <!-- Nickname Input -->
            <div>
                <label for="nickname" class="block text-sm font-medium text-gray-700">Nickname:</label>
                <input v-model="form.nickname" id="nickname" type="text" placeholder="Nickname" required
                    :class="{ 'border-red-500': errorStore.fieldMessage('nickname') }"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                <span v-if="errorStore.fieldMessage('nickname')" class="text-sm text-red-500">
                    {{ errorStore.fieldMessage('nickname') }}
                </span>
            </div>

            <!-- Email Input -->
            <div>
                <label for="email" class="block text-sm font-medium text-gray-700">Email:</label>
                <input v-model="form.email" id="email" type="email" placeholder="Email" required
                    :class="{ 'border-red-500': errorStore.fieldMessage('email') }"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                <span v-if="errorStore.fieldMessage('email')" class="text-sm text-red-500">
                    {{ errorStore.fieldMessage('email') }}
                </span>
            </div>

            <!-- Photo Input -->
            <div>
                <label for="photo" class="block text-sm font-medium text-gray-700">Profile Photo/Avatar:</label>
                <input type="file" id="photo" @change="onPhotoSelected"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>

            <!-- Save Changes Button -->
            <button type="submit"
                class="w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                Save Changes
            </button>
        </form>
        <div v-if="loggedIn && userRole === 'P'" class="mt-4">
            <!-- Delete Account Button -->
            <button @click="showDeleteModal = true"
                class="w-full mt-4 bg-red-600 text-white py-2 px-4 rounded-md shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                Delete Account
            </button>
        </div>

        <!-- Delete Account Modal -->
        <div v-if="showDeleteModal && userRole != 'A'"
            class="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
            <div class="bg-white p-6 rounded-lg shadow-lg max-w-sm">
                <h2 class="text-lg font-bold mb-4 text-center">Confirm Account Deletion</h2>
                <p class="text-sm text-gray-600 mb-4">Please enter your password to confirm account deletion.</p>
                <input v-model="password" type="password" placeholder="Password"
                    :class="{ 'border-red-500': errorStore.fieldMessage('password') }"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                <span v-if="errorStore.fieldMessage('password')" class="text-sm text-red-500">
                    {{ errorStore.fieldMessage('password') }}
                </span>
                <div class="flex justify-end mt-4 space-x-2">
                    <button @click="deleteAccount"
                        class="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                        Confirm
                    </button>
                    <button @click="showDeleteModal = false"
                        class="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import axios from 'axios';
import { useErrorStore } from '@/stores/error';
import router from '@/router';
import { CodeSquare } from 'lucide-vue-next';

export default {
    name: 'EditProfile',
    setup() {
        const authStore = useAuthStore();
        const loggedIn = ref(authStore.user);
        const errorStore = useErrorStore();
        const showDeleteModal = ref(false);
        const password = ref('');
        const userRole = authStore.user?.type || '';
        const form = ref({
            name: authStore.user?.name || '',
            nickname: authStore.user?.nickname || '',
            email: authStore.user?.email || '',
            photo_url: authStore.user?.photo_url || '',
        });

        const selectedPhoto = ref(null);

        const onPhotoSelected = (event) => {
            selectedPhoto.value = event.target.files[0];
        };

        const submitForm = async () => {
            try {
                if (selectedPhoto.value) {
                    const formData = new FormData();
                    formData.append('photo', selectedPhoto.value);

                    const photoResponse = await axios.post('/user/upload-photo', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });
                }

                await axios.put('user/edit-profile', form.value);
                authStore.user = { ...authStore.user, ...form.value }; // Update user data locally
                alert('Profile updated successfully!');
            } catch (error) {
                errorStore.setErrorMessages(error.response?.data?.errors || {});
            }
        };

        const deleteAccount = async () => {
            try {
                authStore.logout();
                await axios.post(`/user/me/delete`, { password: password.value });
                alert('Account deleted successfully');
                router.push('/');
            } catch (error) {
                errorStore.setErrorMessages(`Error deleting account. \n ${error}`);
            } finally {
                showDeleteModal.value = false;
            }
        };

        return {
            form,
            submitForm,
            onPhotoSelected,
            showDeleteModal,
            password,
            deleteAccount,
            errorStore,
            userRole,
            loggedIn,
        };
    },
};

</script>