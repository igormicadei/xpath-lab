import { createRouter, createWebHashHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'
import MissionView from '../views/MissionView.vue'
import PlaygroundView from '../views/PlaygroundView.vue'

const routes = [
  { path: '/', name: 'dashboard', component: DashboardView },
  { path: '/missao/:id', name: 'mission', component: MissionView },
  { path: '/playground', name: 'playground', component: PlaygroundView }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 })
})

export default router
