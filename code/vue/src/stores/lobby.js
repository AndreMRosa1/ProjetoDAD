import { ref, computed, inject } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { useErrorStore } from '@/stores/error'
import { useAuthStore } from '@/stores/auth'


export const useLobbyStore = defineStore('lobby', () => {
    const storeAuth = useAuthStore()
    const storeError = useErrorStore()

    const games = ref([
            {
                id: 7,
                created_at: 1732802912368,
                player1: {
                    id: 3,
                    name: "John Doe",
                    email: "john@mail.pt"
                },
             },
            {
                id: 8,
                created_at: 1732802912438,
                player1: {
                    id: 4,
                    name: "Jane Doe",
                    email: "jane@mail.pt"
                },
            },
            {
                id: 9,
                created_at: 1732802912444,
                player1: {
                    id: 13,
                    name: "Paulo Gonçalves",
                    email: "paulo@mail.pt"
                },
            }                        
    ])

    const totalGames = computed(() => games.value.length)

    // fetch lobby games from the Websocket server
    const fetchGames = () => {
        storeError.resetMessages()
        // send a "fetchGames" message to the Websocket server
    }

    // add a game to the lobby
    const addGame = () => {
        storeError.resetMessages()
        // send a "addGame" message to the Websocket server
    }

    // remove a game from the lobby
    const removeGame = (id) => {
        storeError.resetMessages()
        // send a "removeGame" message to the Websocket server
    }

    // Whether the current user can remove a specific game from the lobby
    const canRemoveGame = (game) => {
        return game.player1.id === storeAuth.userId
    }
    
    // join a game of the lobby
    const joinGame = (id) => {
        storeError.resetMessages()
        // send a "joinGame" message to the Websocket server
    }

    // Whether the current user can join a specific game from the lobby
    const canJoinGame = (game) => {
        return storeAuth.user && game.player1.id !== storeAuth.userId
    }

    return {
        games, totalGames, fetchGames, addGame, joinGame, canJoinGame, removeGame, canRemoveGame
    }
})
