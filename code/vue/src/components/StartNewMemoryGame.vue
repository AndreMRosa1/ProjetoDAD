<template>
    <div class="start-new-game flex justify-center items-center h-[calc(100vh-5rem-50px)]">
        <div class="button-container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4 w-full h-full">
            <!-- Card for 3x4 -->
            <div @click="startGame(12)"
                class="relative w-full h-full bg-white rounded-lg shadow-lg flex flex-col hover:cursor-pointer">
                <img src="/3x4.png" alt="3x4 (12 cards)" class="h-48 object-cover flex-grow mx-auto rounded-t-lg">
                <div class="p-4 text-center bg-gray-900 text-white text-lg font-bold rounded-b-lg">
                    3x4 (12 cards)
                </div>
            </div>

            <!-- Card for 4x4 -->
            <div @click="startGame(16)"
                class="relative w-full h-full bg-white rounded-lg shadow-lg flex flex-col hover:cursor-pointer">
                <img src="/4x4.png" alt="4x4 (16 cards)" class="h-48 object-cover flex-grow mx-auto rounded-t-lg">
                <div class="p-4 text-center bg-gray-900 text-white text-lg font-bold rounded-b-lg">
                    4x4 (16 cards)
                </div>
            </div>

            <!-- Card for 6x6 -->
            <div @click="startGame(36)"
                class="relative w-full h-full bg-white rounded-lg shadow-lg flex flex-col hover:cursor-pointer">
                <img src="/6x6.png" alt="6x6 (36 cards)" class="h-48 object-cover flex-grow mx-auto rounded-t-lg">
                <div class="p-4 text-center bg-gray-900 text-white text-lg font-bold rounded-b-lg">
                    6x6 (36 cards)
                </div>
            </div>

            <!-- Card for BACK -->
            <div @click="startGame(36)"
                class="relative w-full h-full bg-white rounded-lg shadow-lg flex flex-col hover:cursor-pointer">
                <img src="/6x6.png" alt="6x6 (36 cards)" class="h-48 object-cover flex-grow mx-auto rounded-t-lg">
                <div class="p-4 text-center bg-gray-900 text-white text-lg font-bold rounded-b-lg">
                    Back
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const startGame = (size) => {
    router.push({ name: 'game', query: { size } });
};
</script>
