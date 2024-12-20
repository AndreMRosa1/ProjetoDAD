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
import UserList from '@/components/users/UserList.vue'

//const routes = [
//  { path: '/login', name: 'login', component: Login },
//  { path: '/register', name: 'register', component: Register },
//  { path: '/', name: 'home', component: HomeComponent }
//]

import PurchaseBrainCoins from '@/components/coins/PurchaseBrainCoins.vue';
import TransactionsPage from '@/components/TransactionPage.vue';
import TransactionList from '@/components/transactions/TransactionList.vue';
import TransactionForm from '@/components/transactions/TransactionForm.vue';
import TransactionHistory from '@/components/transactions/TransactionHistory.vue';
import GlobalScoreboard from '@/components/scoreboards/GlobalScoreboard.vue';
import PersonalScoreboard from '@/components/scoreboards/PersonalScoreboard.vue';
import GameHistory from '@/components/GameHistory.vue';
import MultiPlayerGames from '@/components/multiplayer/MultiPlayerGames.vue'
import SinglePlayerGame from '@/components/singleplayer/SinglePlayerGame.vue'
import ChangePassword from '@/components/auth/ChangePassword.vue'
import EditProfile from '@/components/auth/EditProfile.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', name: 'login', component: Login },
  { path: '/register', name: 'register', component: Register },
  { path: '/', name: 'home', component: HomeComponent },
  { path: '/dashboard', name: 'dashboard', component: DashboardPage },
  { path: '/start-new-memory-game', name: 'start-new-memory-game', component: StartNewMemoryGame, meta: { requiresAuth: true, roles: ['player'] } },
  { path: '/scoreboards', name: 'scoreboards', component: ScoreboardsPage, meta: { requiresAuth: true, roles: ['player'] } },
  { path: '/statistics', name: 'statistics', component: StatisticsPage, meta: { requiresAuth: true, roles: ['player'] } },
  { path: '/users', name: 'user-list', component: UserList, meta: { requiresAuth: true, roles: ['admin'] } },
  { path: '/purchase-brain-coins', name: 'purchase-brain-coins', component: PurchaseBrainCoins, meta: { requiresAuth: true, roles: ['player'] } },
  { path: '/transactions', name: 'transactions', component: TransactionsPage, meta: { requiresAuth: true, roles: ['admin'] } },
  { path: '/transaction-list', name: 'transaction-list', component: TransactionList, meta: { requiresAuth: true, roles: ['admin'] } },
  { path: '/transaction-form', name: 'transaction-form', component: TransactionForm, meta: { requiresAuth: true, roles: ['admin'] } },
  { path: '/transaction-history', name: 'transaction-history', component: TransactionHistory, meta: { requiresAuth: true, roles: ['admin'] } },
  { path: '/global-scoreboard', name: 'global-scoreboard', component: GlobalScoreboard, meta: { requiresAuth: true, roles: ['player'] } },
  { path: '/personal-scoreboard', name: 'personal-scoreboard', component: PersonalScoreboard, meta: { requiresAuth: true, roles: ['player'] } },
  { path: '/game-history', name: 'game-history', component: GameHistory, meta: { requiresAuth: true, roles: ['player'] } },
  { path: '/multiplayer-games', name: 'multiplayer-games', component: MultiPlayerGames, meta: { requiresAuth: true, roles: ['player'] } },
  { path: '/single-player-game', name: 'single-player-game', component: SinglePlayerGame, meta: { requiresAuth: true, roles: ['player'] } },
  { path: '/change-password', name: 'change-password', component: ChangePassword, meta: { requiresAuth: true } },
  { path: '/edit-profile', name: 'edit-profile', component: EditProfile, meta: { requiresAuth: true } },
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