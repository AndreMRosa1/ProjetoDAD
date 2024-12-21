import { ref, computed, inject } from 'vue'
import { defineStore } from 'pinia'
import { useErrorStore } from '@/stores/error'

export const useChatStore = defineStore('chat', () => {
    const storeError = useErrorStore()

    const socket = inject('socket')

    const messages = ref([])

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
