import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { useErrorStore } from '@/stores/error'
import { useAuthStore } from '@/stores/auth'

export const useGamesStore = defineStore('games', () => {
    const storeAuth = useAuthStore()
    const storeError = useErrorStore()

    const games = ref([
        {
            id: 768,
            status: 'playing',
            player1_id: 3,
            player2_id: 4,
            winner_id: null,
            player1_name: 'John Doe',
            player2_name: 'Jane Doe',
            winner_name: null,
            gameStatus: 0,
            currentPlayer: 2,
            board: [ 1, 2, 0, 1, 0, 0, 0, 0, 0 ]
        },
        {
            id: 769,
            status: 'playing',
            player1_id: 3,
            player2_id: 13,
            winner_id: null,
            player1_name: 'John Doe',
            player2_name: 'Paulo Gonçalves',
            winner_name: null,
            gameStatus: 0,
            currentPlayer: 1,
            board: [ 0, 0, 0, 0, 0, 2, 1, 0, 0]
        }
    ])

    const totalGames = computed(() => games.value.length)

    // Use this function to update the game object in the games array
    const updateGame = (game) => {
        const gameIndex = games.value.findIndex((g) => g.id === game.id);
        if (gameIndex !== -1) {
            games.value[gameIndex] = { ...game } // shallow copy
        }
    }

    const playerNumberOfCurrentUser = (game) => {
        if (game.player1_id === storeAuth.userId) {
            return 1
        }
        if (game.player2_id === storeAuth.userId) {
            return 2
        }
        return null
    }  

    // fetch playing games from the Websocket server
    const fetchPlayingGames = () => {
        storeError.resetMessages()
        // send a "fetchPlayingGames" message to the Websocket server
    }

    const play = (game, idx) => {
        storeError.resetMessages()
        // send a "play" message to the Websocket server
        // payload object format:
        // {
        //         index: idx,
        //         gameId: game.id
        // }
    }
    
    return {
            games, totalGames, playerNumberOfCurrentUser, fetchPlayingGames, play
    }
})
