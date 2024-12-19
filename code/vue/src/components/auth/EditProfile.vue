<template>
    <div class="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 class="text-2xl font-bold mb-6 text-center">Edit Profile</h1>
        <form @submit.prevent="submitForm" class="space-y-4">

            <!-- Name Input -->
            <div>
                <label for="name" class="block text-sm font-medium text-gray-700">Name:</label>
                <input v-model="form.name" id="name" type="text" placeholder="Name" required
                    :class="{ 'border-red-500': errorMessage }"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>

            <!-- Nickname Input -->
            <div>
                <label for="nickname" class="block text-sm font-medium text-gray-700">Nickname:</label>
                <input v-model="form.nickname" id="nickname" type="text" placeholder="Nickname" required
                    :class="{ 'border-red-500': errorMessage }"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>

            <!-- Email Input -->
            <div>
                <label for="email" class="block text-sm font-medium text-gray-700">Email:</label>
                <input v-model="form.email" id="email" type="email" placeholder="Email" required
                    :class="{ 'border-red-500': errorMessage }"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>

            <!-- Photo Input -->
            <div>
                <label for="photo" class="block text-sm font-medium text-gray-700">Profile Photo:</label>
                <input type="file" id="photo" @change="handleFileChange"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>

            <!-- Error Message -->
            <div v-if="errorMessage" class="text-sm text-red-500">
                {{ errorMessage }}
            </div>

            <!-- Save Changes Button -->
            <button type="submit"
                class="w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                Save Changes
            </button>
        </form>

    </div>
</template>

<script>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import axios from 'axios';

export default {
    name: 'EditProfile',
    setup() {
        const authStore = useAuthStore();
        const errorMessage = ref('');
        const uploadError = ref('');
        const isUploading = ref(false);
        const uploadedPhotoUrl = ref('');

        const form = ref({
            name: authStore.user?.name || '',
            nickname: authStore.user?.nickname || '',
            email: authStore.user?.email || '',
            photo_url: authStore.user?.photo_url || '',
        });

        const handleFileChange = async (event) => {
            const file = event.target.files[0];
            if (!file) return;

            // Reset states
            uploadError.value = '';
            isUploading.value = true;

            try {
                // Validate file type and size
                if (!file.type.match('image.*')) {
                    throw new Error('Please select an image file');
                }

                if (file.size > 2 * 1024 * 1024) { // 2MB limit
                    throw new Error('File size should not exceed 2MB');
                }

                // Create FormData
                const formData = new FormData();
                formData.append('photo', file);

                // Upload the photo
                const response = await axios.post('user/upload-photo', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                // Update the photo URL
                uploadedPhotoUrl.value = response.data.photo_url;
                form.value.photo_url = response.data.photo_url;

            } catch (error) {
                uploadError.value = error.response?.data?.message || error.message || 'Failed to upload photo';
            } finally {
                isUploading.value = false;
            }
        };

        const submitForm = async () => {
            try {
                errorMessage.value = '';
                const response = await axios.put('user/edit-profile', form.value);
                authStore.user = response.data;
                alert('Profile updated successfully!');
            } catch (error) {
                if (error.response) {
                    errorMessage.value = error.response.data.message || 'An error occurred';
                }
            }
        };

        return {
            form,
            submitForm,
            errorMessage,
            handleFileChange,
            isUploading,
            uploadError,
            uploadedPhotoUrl
        };
    },
};
</script>
