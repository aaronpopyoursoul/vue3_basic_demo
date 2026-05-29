import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import './style.css'
import App from './App.vue'
import { setupApiInterceptors } from './services/httpClient'
import { useAuthStore } from './stores/auth'
import { useDemoUiStore } from './stores/demoTabs'
import { setupRouterGuards } from './router'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)

useAuthStore(pinia).initializeAuth()
useDemoUiStore(pinia).initializeTheme()
setupApiInterceptors(pinia)
setupRouterGuards(pinia)

app.use(router)
app.mount('#app')
