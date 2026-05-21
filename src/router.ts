import { createRouter, createWebHistory, type RouteMeta } from 'vue-router'
import LoginDemoView from './views/LoginDemoView.vue'
import PolicySearchView from './views/PolicySearchView.vue'

export interface DemoRouteMeta extends Record<string, unknown> {
  shortLabel: string
  label: string
  title: string
  description: string
  learningGoals: string[]
}

export interface DemoNavItem extends DemoRouteMeta {
  path: string
}

export const demoNavItems: DemoNavItem[] = [
  {
    path: '/policies',
    shortLabel: '01',
    label: '保單查詢練習',
    title: '保單查詢元件拆分示範',
    description: '這一頁聚焦在父子元件責任分工、props / emit 流程，以及為什麼共用區塊適合用 slot。',
    learningGoals: ['拆分表單與結果元件', '資料向下、事件向上', '共用區塊與 slot'],
  },
  {
    path: '/auth',
    shortLabel: '02',
    label: '登入表單練習',
    title: '登入表單 API 寫法比較',
    description: '這一頁同時示範 Options API 與 Composition API，並把共用登入邏輯抽成 composable。',
    learningGoals: ['比較兩種 API 的維護方式', '抽出可重用 composable', '理解邏輯重用與畫面重用'],
  },
]

declare module 'vue-router' {
  interface RouteMeta extends Partial<DemoRouteMeta> {}
}

const policyMeta: RouteMeta = {
  ...demoNavItems[0],
}

const authMeta: RouteMeta = {
  ...demoNavItems[1],
}

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/policies',
    },
    {
      path: '/policies',
      name: 'policies',
      component: PolicySearchView,
      meta: policyMeta,
    },
    {
      path: '/auth',
      name: 'auth',
      component: LoginDemoView,
      meta: authMeta,
    },
  ],
})

export default router