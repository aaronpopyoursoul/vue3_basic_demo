<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { RouterView, useRoute } from 'vue-router'
import AppFooter from './components/AppFooter.vue'
import AppHeader from './components/AppHeader.vue'
import AppSidebar from './components/AppSidebar.vue'
import { demoNavItems } from './router'
import { useDemoUiStore } from './stores/demoTabs'
import { useAuthStore } from './stores/auth'

const route = useRoute()
const router = useRouter()
const uiStore = useDemoUiStore()
const authStore = useAuthStore()
const { themeMode } = storeToRefs(uiStore)

const { isAuthenticated, userName, authMessage } = storeToRefs(authStore)

const heroTitle = computed(() => route.meta.title ?? 'Vue 3 教學示範')
const heroCopy = computed(() => route.meta.description ?? '')
const learningGoals = computed(() => route.meta.learningGoals ?? [])
const activeTopicLabel = computed(() => route.meta.label ?? '未命名主題')

async function handleLogout() {
  authStore.logout('你已主動登出，access token 已清除。')
  await router.push('/login')
}
</script>

<template>
  <div class="app-layout">
    <AppSidebar :items="demoNavItems" />

    <div class="app-shell">
      <AppHeader
        :current-title="heroTitle"
        :current-description="heroCopy"
        :theme-mode="themeMode"
        :is-authenticated="isAuthenticated"
        :user-name="userName"
        :auth-message="authMessage"
        @toggle-theme="uiStore.toggleThemeMode"
        @logout="handleLogout"
      />

      <main class="app-main">
        <section class="hero-panel">
          <p class="eyebrow">Vue 3 + Vite + TypeScript + Vue Router + Pinia</p>
          <h1>{{ heroTitle }}</h1>
          <p class="hero-copy">{{ heroCopy }}</p>

          <div class="hero-goals">
            <article class="goal-card">
              <h2>目前練習重點</h2>
              <ul>
                <li v-for="goal in learningGoals" :key="goal">{{ goal }}</li>
              </ul>
            </article>
            <article class="goal-card">
              <h2>SPA 切分方式</h2>
              <p>sidebar 的選單改由 Vue Router 控制，頁面切換與網址同步；受保護頁則再由 guard 判斷是否放行。</p>
            </article>
            <article class="goal-card">
              <h2>Pinia 的責任</h2>
              <p>Pinia 現在專注管理全域 UI 與 auth 狀態，例如主題模式、access token 與登入訊息，而不是負責頁面切換。</p>
            </article>
          </div>
        </section>

        <RouterView />
      </main>

      <AppFooter :active-topic-label="activeTopicLabel" />
    </div>
  </div>
</template>
