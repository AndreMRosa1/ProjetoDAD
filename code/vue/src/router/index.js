import HomeComponent from '@/components/HomeComponent.vue'
//import LaravelTester from '@/components/LaravelTester.vue'
import MemoryGame from '@/components/MemoryGame.vue'
//import WebSocketTester from '@/components/WebSocketTester.vue'
import { createRouter, createWebHistory } from 'vue-router'

import Login from '@/components/auth/Login.vue'
import Register from '@/components/auth/Register.vue'
import DashboardPage from '@/components/DashboardPage.vue'
import StartNewMemoryGame from '@/components/StartNewMemoryGame.vue'
import MultiPlayerGame from '@/components/multiplayer/MultiplayerGame.vue';
import GameHistory from '@/components/GameHistory.vue';
import ScoreboardsPage from '@/components/ScoreboardsPage.vue';
import StatisticsPage from '@/components/StatisticsPage.vue';
import Chat from '@/components/chat/Chat.vue'
import { useAuthStore } from '@/stores/auth'

//const routes = [
//  { path: '/login', name: 'login', component: Login },
//  { path: '/register', name: 'register', component: Register },
//  { path: '/', name: 'home', component: HomeComponent }
//]

import PurchaseBrainCoins from '@/components/coins/PurchaseBrainCoins.vue';

import TransactionsPage from '@/components/TransactionPage.vue';
import TransactionList from '@/components/transactions/TransactionList.vue';
import TransactionForm from '@/components/transactions/TransactionForm.vue';
import GlobalScoreboard from '@/components/scoreboards/GlobalScoreboard.vue';
import PersonalScoreboard from '@/components/scoreboards/PersonalScoreboard.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/home',
      name: 'home',
      component: HomeComponent,
    },
    {
      path: '/testers',
      children: [
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
      path: '/scoreboards/global',
      name: 'scoreboardglobal',
      component: GlobalScoreboard,
    },
    {
      path: '/scoreboards/personal',
      name: 'scoreboardpersonal',
      component: PersonalScoreboard,
    },
    { path: '/new-memory-game', 
      name: 'newmemorygame',
      component: StartNewMemoryGame },
    { path: '/multiplayer', 
      name: 'multiplayer',
      component: MultiPlayerGame },
    { path: '/history', 
      name: 'history',
      component: GameHistory },
    { path: '/scoreboards',
      name: 'scoreboards',
      component: ScoreboardsPage },
    { path: '/statistics',
      name: 'statistics',
      component: StatisticsPage },
    { path: '/shop',
      name: 'shop',
      component: PurchaseBrainCoins },
    { path: '/chat',
      name: 'chat',
      component: Chat },
    {
      path: '/dashboard',
      component: DashboardPage,
      children: [
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

let handlingFirstRoute = true

router.beforeEach(async (to, from, next) => {
 const storeAuth = useAuthStore()
 if (handlingFirstRoute) {
  handlingFirstRoute = false
  await storeAuth.restoreToken()
 }
 next();
})

export default router;
