import HomeComponent from '@/components/HomeComponent.vue'
//import LaravelTester from '@/components/LaravelTester.vue'
//import WebSocketTester from '@/components/WebSocketTester.vue'
import { createRouter, createWebHistory } from 'vue-router'

import Login from '@/components/auth/Login.vue'
import Register from '@/components/auth/Register.vue'
import StartNewMemoryGame from '@/components/singleplayer/StartNewMemoryGame.vue'
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
import TransactionList from '@/components/transactions/TransactionList.vue';
import TransactionHistory from '@/components/transactions/TransactionHistory.vue';
import GlobalScoreboard from '@/components/scoreboards/GlobalScoreboard.vue';
import PersonalScoreboard from '@/components/scoreboards/PersonalScoreboard.vue';
import GameHistory from '@/components/users/GameHistory.vue';
import MultiPlayerGames from '@/components/multiplayer/MultiPlayerGames.vue'
import SinglePlayerGame from '@/components/singleplayer/SinglePlayerGame.vue'
import ChangePassword from '@/components/auth/ChangePassword.vue'
import EditProfile from '@/components/auth/EditProfile.vue'
import NewUser from '@/components/users/NewUser.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/home',
      name: 'home',
      component: HomeComponent,
    },{ 
      path: '/login', 
      name: 'login', 
      component: Login 
    },
    { 
      path: '/register', 
      name: 'register', 
      component: Register 
    },
    { 
      path: '/', 
      name: 'home',
      component: HomeComponent
    },
    { 
      path: '/change-password', 
      name: 'changepassword', 
      component: ChangePassword
    },
    { 
      path: '/edit-profile', 
      name: 'editprofile', 
      component: EditProfile
    },
    { 
      path: '/users/create', 
      name: 'newuser', 
      component: NewUser,
      meta: { requiresAuth: true, allowedTypes: ['A'] }
    },
    { 
      path: '/history',
      name: 'history',
      component: GameHistory ,
      meta: { requiresAuth: true }
    },
    {
      path: '/memory-game',
      name: 'game',
      component: SinglePlayerGame,
      meta: { requiresAuth: true, allowedTypes: ['P'] }
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
      meta: { requiresAuth: true, allowedTypes: ['P'] }
    },
    { 
      path: '/new-memory-game',
      name: 'newmemorygame',
      component: StartNewMemoryGame,
      meta: { requiresAuth: true, allowedTypes: ['P'] }
    },
    { path: '/multiplayer', 
      name: 'multiplayer',
      component: MultiPlayerGames,
      meta: { requiresAuth: true, allowedTypes: ['P'] } 
    },
    { path: '/scoreboards',
      name: 'scoreboards',
      component: ScoreboardsPage 
    },
    { 
      path: '/statistics',
      name: 'statistics',
      component: StatisticsPage 
    },
    { 
      path: '/shop',
      name: 'shop',
      component: PurchaseBrainCoins,
      meta: { requiresAuth: true, allowedTypes: ['P'] } 
    },
    { path: '/users',
        name: 'users',
        component: UserList ,
        meta: { requiresAuth: true, allowedTypes: ['A'] }
      },
    { 
      path: '/transactions/list',
        name: 'transactions-list',
        component: TransactionList 
      },
    { 
      path: '/transactions/history',
        name: 'transactions-history',
        component: TransactionHistory 
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
 
  const isAuthenticated = storeAuth.user;
  const userType = storeAuth.user?.type || '';

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'login' });
  } else if (to.meta.allowedTypes && !to.meta.allowedTypes.includes(userType)) {
    next({ name: 'home' });
  } else {
    next();
  }
})

export default router;