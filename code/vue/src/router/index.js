import HomeComponent from '@/components/HomeComponent.vue'
import LaravelTester from '@/components/LaravelTester.vue'
import MemoryGame from '@/components/MemoryGame.vue'
import StartNewMemoryGame from '@/components/StartNewMemoryGame.vue'
import WebSocketTester from '@/components/WebSocketTester.vue'
import { createRouter, createWebHistory } from 'vue-router'

import Login from '@/components/auth/Login.vue'
import Register from '@/components/auth/Register.vue'

//const routes = [
//  { path: '/login', name: 'login', component: Login },
//  { path: '/register', name: 'register', component: Register },
//  { path: '/', name: 'home', component: HomeComponent }
//]


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeComponent
    },
    {
      path: '/testers',
      children: [
        {
          path: 'laravel',
          component: LaravelTester
        },
        {
          path: 'websocket',
          component: WebSocketTester
        },
        { path: '/login', name: 'login', component: Login },
        { path: '/register', name: 'register', component: Register },
        { path: '/', name: 'home', component: HomeComponent }
      ]
    },
    {
      path: '/new-memory-game',
      component: StartNewMemoryGame
    },
    {
      path: '/memory-game',
      name: 'game',
      component: MemoryGame
    }
  ]
})

export default router
