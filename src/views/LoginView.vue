<script setup lang="ts">
import axios from 'axios'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseSectionBlock from '../components/BaseSectionBlock.vue'
import { useAuthForm } from '../composables/useAuthForm'
import { useAuthStore } from '../stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const { authMessage } = storeToRefs(authStore)
const { form, errors, canSubmit, validate, resetSubmitError } = useAuthForm({
  username: 'student',
  password: 'password123',
})

const redirectTarget = computed(() => String(route.query.redirect ?? '/dashboard'))

async function handleLogin() {
  resetSubmitError()

  if (!validate()) {
    return
  }

  try {
    await authStore.login({
      username: form.username,
      password: form.password,
    })

    await router.push(redirectTarget.value)
  } catch (error) {
    if (axios.isAxiosError(error)) {
      errors.submit = error.response?.data?.message ?? '登入失敗，請稍後再試。'
      return
    }

    errors.submit = '發生未預期錯誤。'
  }
}
</script>

<template>
  <section class="demo-grid demo-grid--equal">
    <BaseSectionBlock>
      <template #title>
        <div>
          <h2>登入頁 /login</h2>
          <p>這裡示範 auth store 如何保存 access token，並讓頁面不直接操作 localStorage。</p>
        </div>
      </template>

      <form class="login-form" @submit.prevent="handleLogin">
        <label class="search-field">
          <span class="search-field__label">帳號</span>
          <input v-model="form.username" class="search-field__input" type="text" />
        </label>
        <p v-if="errors.username" class="field-error">{{ errors.username }}</p>

        <label class="search-field">
          <span class="search-field__label">密碼</span>
          <input v-model="form.password" class="search-field__input" type="password" />
        </label>
        <p v-if="errors.password" class="field-error">{{ errors.password }}</p>
        <p class="hint">示範環境會接受已通過驗證的帳密，並回傳 mock access token。</p>

        <button class="primary-button" type="submit" :disabled="!canSubmit">登入取得 token</button>
        <p v-if="errors.submit" class="state-box state-box--error">{{ errors.submit }}</p>
        <p v-else class="state-box state-box--loading">{{ authMessage }}</p>
      </form>
    </BaseSectionBlock>

    <BaseSectionBlock>
      <template #title>
        <div>
          <h2>教學重點</h2>
          <p>登入頁重點不是畫面，而是狀態流：表單 → store → router。</p>
        </div>
      </template>

      <ul class="teaching-list">
        <li>auth store 統一保存 access token，避免頁面四處讀寫 localStorage。</li>
        <li>登入成功後先更新 store，再交由 router 導向原本要去的受保護頁面。</li>
        <li>guard 負責前端導頁保護；後端驗證則由 API 與 token 檢查負責。</li>
        <li>interceptor 把 Authorization header 的責任集中在 service 層，而不是頁面層。</li>
      </ul>
    </BaseSectionBlock>
  </section>
</template>