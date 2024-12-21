<script setup>
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button';
import { onMounted, ref } from 'vue'
import ListGamesLobby from './ListGamesLobby.vue'
import { useLobbyStore } from '@/stores/lobby'

const storeLobby = useLobbyStore()

// Variável para controlar a seleção do tamanho do grid
const gridSize = ref('4x4');

onMounted(() => {
    storeLobby.fetchGames()
})

// Função para criar um jogo com o grid selecionado
const createGame = () => {
    console.log(`Creating game with grid size: ${gridSize.value}`);
    storeLobby.addGame(gridSize.value);
}
</script>

<template>
    <Card class="my-8 py-2 px-1">
        <CardHeader class="pb-0">
            <CardTitle>Lobby</CardTitle>
            <CardDescription>{{ storeLobby.totalGames == 1 ? '1 game' : storeLobby.totalGames + ' games'}} waiting.</CardDescription>
        </CardHeader>
        <CardContent class="p-4">
            <div class="py-2 flex flex-col gap-4">
                <!-- Dropdown para selecionar tamanho do grid -->
                <div>
                    <label for="gridSize" class="block text-sm font-medium">Select grid size</label>
                    <select
                        id="gridSize"
                        v-model="gridSize"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                        <option value="4x4">4x4</option>
                        <option value="6x6">6x6</option>
                    </select>
                </div>

                <!-- Botão para criar novo jogo -->
                <Button @click="createGame">
                    New Game
                </Button>
            </div>
            <div v-if="storeLobby.totalGames > 0">
                <ListGamesLobby></ListGamesLobby> 
            </div>
            <div v-else>
                <h2 class="text-xl">The lobby is empty!</h2>
            </div>
        </CardContent>
    </Card>
</template>
