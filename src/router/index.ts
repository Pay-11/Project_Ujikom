import { createRouter, createWebHistory } from '@ionic/vue-router'
import { RouteRecordRaw } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import ScanQr from '../views/ScanQr.vue'
import GuruQr from '../views/GuruQr.vue'
import GuruHome from '../views/GuruHome.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/guru'
  },
  {
    path: '/home',
    name: 'Home',
    component: HomePage
  }, 
  {
    path: '/scan',
    name: 'Scan',
    component: ScanQr
  },
  {
    path: '/guruqr',
    name: 'GuruQr',
    component: GuruQr
  },
  {
    path: '/guru',
    name: 'Guru',
    component: GuruHome
  }   
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
