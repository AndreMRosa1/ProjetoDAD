import { ref, computed, inject } from 'vue'
import { defineStore } from 'pinia'
import { useErrorStore } from '@/stores/error'
import { useAuthStore } from '@/stores/auth'

export const useChatStore = defineStore('chat', () => {
    const storeAuth = useAuthStore()
    const storeError = useErrorStore()

    const socket = inject('socket')

    const messages = ref([
        {
            user: { id: 1, name: 'John Doe' },
            message: 'Welcome to the chat!'
        },
        {
            user: { id: 2, name: 'Jane Doe' },
            message: 'Welcome!'
        },
        {
            user: { id: 13, name: 'Paulo Gonçalves' },
            message: 'A message that will occupy a lot of space in the chat! At least three lines of text!'
        },
        {
            user: null,
            message: 'An anonymous user can also say something!'
        },        
    ])

    const totalMessages = computed(() => messages.value.length)

    const addMessageToArray = (messageObj) => {
        if (totalMessages.value >= 10) {
            messages.value.shift();
        }
        messages.value.push(messageObj)
    }

    socket.on('chatMessage', (messageObj) => {
        addMessageToArray(messageObj)
    })
    
    const sendMessageToChat = (message) => {
        storeError.resetMessages()
        socket.emit('chatMessage', message)
        // Send the message to the Websocket server
        // Payload format:
        //     'text message to send'
    }

    const sendPrivateMessageToUser = (destinationUser, message) => {
        storeError.resetMessages()
        socket.emit(
            'privateMessage',
            {
                destinationUser: destinationUser,
                message: message
            },
            (response) => webSocketServerResponseHasError(response)
        )
    }

    const webSocketServerResponseHasError = (response) => {
        if (response.errorCode) {
        storeError.setErrorMessages(response.errorMessage, [], response.errorCode)
        return true
        }
        return false
        }

    return {
        messages, totalMessages, sendMessageToChat, sendPrivateMessageToUser
    }
})
