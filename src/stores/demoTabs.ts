import { defineStore } from 'pinia'

export type ThemeMode = 'light' | 'dark'

const THEME_MODE_KEY = 'vue3-demo-theme-mode'

// Pinia 在這裡只保留全域 UI 狀態，
// 例如主題模式；頁面切換則交給 Vue Router 管理。
export const useDemoUiStore = defineStore('demoUi', {
  state: () => ({
    themeMode: 'light' as ThemeMode,
  }),
  actions: {
    initializeTheme() {
      if (typeof window === 'undefined') {
        return
      }

      const savedTheme = window.localStorage.getItem(THEME_MODE_KEY)

      if (savedTheme === 'light' || savedTheme === 'dark') {
        this.themeMode = savedTheme
      }

      this.applyTheme()
    },
    toggleThemeMode() {
      this.themeMode = this.themeMode === 'light' ? 'dark' : 'light'
      this.applyTheme()
    },
    applyTheme() {
      if (typeof document === 'undefined' || typeof window === 'undefined') {
        return
      }

      document.documentElement.dataset.theme = this.themeMode
      window.localStorage.setItem(THEME_MODE_KEY, this.themeMode)
    },
  },
})