import type { Pinia } from 'pinia'
import { createRouter, createWebHistory, type RouteMeta } from 'vue-router'
import ClaimsView from './views/ClaimsView.vue'
import DashboardView from './views/DashboardView.vue'
import LoginView from './views/LoginView.vue'
import PolicySearchView from './views/PolicySearchView.vue'
import { useAuthStore } from './stores/auth'

export interface DemoRouteMeta extends Record<string, unknown> {
  shortLabel: string
  label: string
  title: string
  description: string
  learningGoals: string[]
  requiresAuth?: boolean
}

export interface DemoNavItem extends DemoRouteMeta {
  path: string
}

export const demoNavItems: DemoNavItem[] = [
  {
    path: '/login',
    shortLabel: '00',
    label: '登入入口',
    title: '登入與 Token 管理',
    description: '從登入頁開始，建立 access token、auth store 與後續受保護路由的基礎。',
    learningGoals: ['auth store 保存 token', '登入後導頁', '避免頁面直接碰 localStorage'],
  },
  {
    path: '/dashboard',
    shortLabel: '01',
    label: 'Dashboard',
    title: 'Route Guard 與登入保護',
    description: '這裡聚焦在 requiresAuth 路由 meta、guard 邏輯，以及前端導頁保護與後端驗證的分工。',
    learningGoals: ['requiresAuth meta', '未登入導回 /login', 'guard 與後端驗證分工'],
    requiresAuth: true,
  },
  {
    path: '/policies',
    shortLabel: '02',
    label: 'Policies',
    title: 'Policy 查詢與 Header 注入',
    description: '保單查詢頁保留原本的元件拆分，並補上 protected route 與 Authorization header 注入教學。',
    learningGoals: ['保單查詢互動', 'interceptor 注入 Authorization', 'Pinia 在查詢場景的延伸應用'],
    requiresAuth: true,
  },
  {
    path: '/claims',
    shortLabel: '03',
    label: 'Claims',
    title: '401 攔截與前端處理流程',
    description: '這一頁專注在 401 發生後，interceptor、store 與 router 的接力順序。',
    learningGoals: ['401 後清 token', '更新 auth store', '導回 /login'],
    requiresAuth: true,
  },
]

declare module 'vue-router' {
  interface RouteMeta extends Partial<DemoRouteMeta> {}
}

const loginMeta: RouteMeta = { ...demoNavItems[0] }
const dashboardMeta: RouteMeta = { ...demoNavItems[1] }
const policyMeta: RouteMeta = { ...demoNavItems[2] }
const claimsMeta: RouteMeta = { ...demoNavItems[3] }

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: loginMeta,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: dashboardMeta,
    },
    {
      path: '/policies',
      name: 'policies',
      component: PolicySearchView,
      meta: policyMeta,
    },
    {
      path: '/claims',
      name: 'claims',
      component: ClaimsView,
      meta: claimsMeta,
    },
  ],
})

let guardsRegistered = false

export function setupRouterGuards(pinia: Pinia) {
  if (guardsRegistered) {
    return
  }

  router.beforeEach((to) => {
    const authStore = useAuthStore(pinia)

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
      return {
        path: '/login',
        query: {
          redirect: to.fullPath,
        },
      }
    }

    if (to.path === '/login' && authStore.isAuthenticated) {
      return { path: '/dashboard' }
    }

    return true
  })

  guardsRegistered = true
}

export default router