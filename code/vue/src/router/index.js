import HomeComponent from '@/components/HomeComponent.vue'
import LaravelTester from '@/components/LaravelTester.vue'
import MemoryGame from '@/components/MemoryGame.vue'
import WebSocketTester from '@/components/WebSocketTester.vue'
import { createRouter, createWebHistory } from 'vue-router'

import Login from '@/components/auth/Login.vue'
import Register from '@/components/auth/Register.vue'
import DashboardPage from '@/components/DashboardPage.vue'
import StartNewMemoryGame from '@/components/StartNewMemoryGame.vue'
import MultiplayerGame from '@/components/MultiplayerGame.vue';
import GameHistory from '@/components/GameHistory.vue';
import ScoreboardsPage from '@/components/ScoreboardsPage.vue';
import StatisticsPage from '@/components/StatisticsPage.vue';

//const routes = [
//  { path: '/login', name: 'login', component: Login },
//  { path: '/register', name: 'register', component: Register },
//  { path: '/', name: 'home', component: HomeComponent }
//]

import TransactionsPage from '@/components/TransactionPage.vue';
import TransactionList from '@/components/transactions/TransactionList.vue';
import TransactionForm from '@/components/transactions/TransactionForm.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeComponent,
    },
    {
      path: '/testers',
      children: [
        {
          path: 'laravel',
          component: LaravelTester,
        },
        {
          path: 'websocket',
          component: WebSocketTester,
        },
        { path: '/login', name: 'login', component: Login },
        { path: '/register', name: 'register', component: Register },
        { path: '/', name: 'home', component: HomeComponent },
      ],
    },
    {
      path: '/new-memory-game',
      component: StartNewMemoryGame,
    },
    {
      path: '/memory-game',
      name: 'game',
      component: MemoryGame,
    },
    {
      path: '/dashboard',
      component: DashboardPage,
      children: [
        { path: 'new-memory-game', component: StartNewMemoryGame },
        { path: 'multiplayer', component: MultiplayerGame },
        { path: 'history', component: GameHistory },
        { path: 'scoreboards', component: ScoreboardsPage },
        { path: 'statistics', component: StatisticsPage },
        {
          path: 'transactions',
          name: 'transactions',
          component: TransactionsPage,
          children: [
            {
              path: '',
              name: 'transaction-list',
              component: TransactionList,
            },
            {
              path: 'new',
              name: 'transaction-form',
              component: TransactionForm,
            },
          ],
        },        
      ],
    },
  ],
});

export default router;
