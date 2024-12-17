import HomeComponent from '@/components/HomeComponent.vue'
//import LaravelTester from '@/components/LaravelTester.vue'
//import WebSocketTester from '@/components/WebSocketTester.vue'
import { createRouter, createWebHistory } from 'vue-router'

import Login from '@/components/auth/Login.vue'
import Register from '@/components/auth/Register.vue'
import DashboardPage from '@/components/DashboardPage.vue'
import StartNewMemoryGame from '@/components/StartNewMemoryGame.vue'
import ScoreboardsPage from '@/components/ScoreboardsPage.vue';
import StatisticsPage from '@/components/StatisticsPage.vue';
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
import GameHistory from '@/components/GameHistory.vue';
import MultiPlayerGames from '@/components/multiplayer/MultiPlayerGames.vue'
import SinglePlayerGame from '@/components/singleplayer/SinglePlayerGame.vue'
import ChangePassword from '@/components/auth/ChangePassword.vue'

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
        { path: '/change-password', name: 'changepassword', component: ChangePassword}
      ],
    },
    { 
      path: '/history',
      name: 'history',
      component: GameHistory 
    },
    {
      path: '/memory-game',
      name: 'game',
      component: SinglePlayerGame,
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
      component: MultiPlayerGames },
    { path: '/scoreboards',
      name: 'scoreboards',
      component: ScoreboardsPage },
    { path: '/statistics',
      name: 'statistics',
      component: StatisticsPage },
    { path: '/shop',
      name: 'shop',
      component: PurchaseBrainCoins },
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