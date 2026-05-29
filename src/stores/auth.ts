import { defineStore } from 'pinia'
import type { LoginFormValues } from '../types/auth'
import { loginRequest } from '../services/authService'

const ACCESS_TOKEN_KEY = 'vue3-demo-access-token'
const USER_NAME_KEY = 'vue3-demo-user-name'

// auth store 集中處理 token 與登入狀態，
// 避免各頁面自己去碰 localStorage，讓狀態來源維持單一。
export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: '',
    userName: '',
    authMessage: '尚未登入。',
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.accessToken),
  },
  actions: {
    initializeAuth() {
      if (typeof window === 'undefined') {
        return
      }

      this.accessToken = window.localStorage.getItem(ACCESS_TOKEN_KEY) ?? ''
      this.userName = window.localStorage.getItem(USER_NAME_KEY) ?? ''
      this.authMessage = this.accessToken
        ? `已恢復登入狀態：${this.userName || '示範使用者'}`
        : '尚未登入。'
    },
    async login(credentials: LoginFormValues) {
      const response = await loginRequest(credentials)

      this.accessToken = response.accessToken
      this.userName = response.user.name
      this.authMessage = `登入成功，歡迎 ${response.user.name}。`

      if (typeof window !== 'undefined') {
        window.localStorage.setItem(ACCESS_TOKEN_KEY, response.accessToken)
        window.localStorage.setItem(USER_NAME_KEY, response.user.name)
      }
    },
    logout(reason = '你已登出。') {
      this.accessToken = ''
      this.userName = ''
      this.authMessage = reason

      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(ACCESS_TOKEN_KEY)
        window.localStorage.removeItem(USER_NAME_KEY)
      }
    },
    handleUnauthorized() {
      // 401 發生時，先清 token，再更新 store，再交給路由導向登入頁。
      this.logout('權杖已失效或登入逾時，請重新登入。')
    },
    clearAuthMessage() {
      this.authMessage = ''
    },
  },
})