<script setup lang="ts">
defineProps<{
  currentTitle: string
  currentDescription: string
  themeMode: 'light' | 'dark'
  isAuthenticated: boolean
  userName: string
  authMessage: string
}>()

const emit = defineEmits<{
  toggleTheme: []
  logout: []
}>()
</script>

<template>
  <header class="app-header">
    <div>
      <p class="app-header__eyebrow">Vue 3 練習主控台</p>
      <h1 class="app-header__title">{{ currentTitle }}</h1>
      <p class="app-header__description">{{ currentDescription }}</p>
    </div>

    <div class="app-header__actions">
      <div class="auth-status" :class="{ 'auth-status--active': isAuthenticated }">
        <span>{{ isAuthenticated ? '已登入' : '未登入' }}</span>
        <strong>{{ isAuthenticated ? userName || '示範使用者' : authMessage }}</strong>
      </div>
      <div class="theme-status">
        <span>目前模式</span>
        <strong>{{ themeMode === 'light' ? '淺色' : '深色' }}</strong>
      </div>
      <div class="header-button-row">
        <button v-if="isAuthenticated" type="button" class="secondary-button" @click="emit('logout')">
          Logout
        </button>
        <button type="button" class="theme-toggle" @click="emit('toggleTheme')">
          切換{{ themeMode === 'light' ? '深色' : '淺色' }}模式
        </button>
      </div>
    </div>
  </header>
</template>