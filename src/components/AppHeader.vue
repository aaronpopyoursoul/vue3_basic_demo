<script setup lang="ts">
defineProps<{
  currentTitle: string
  currentDescription: string
  themeMode: 'light' | 'dark'
}>()

const emit = defineEmits<{
  toggleTheme: []
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
      <div class="theme-status">
        <span>目前模式</span>
        <strong>{{ themeMode === 'light' ? '淺色' : '深色' }}</strong>
      </div>
      <button type="button" class="theme-toggle" @click="emit('toggleTheme')">
        切換{{ themeMode === 'light' ? '深色' : '淺色' }}模式
      </button>
    </div>
  </header>
</template>