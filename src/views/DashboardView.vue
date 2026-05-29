<script setup lang="ts">
import { onMounted, ref } from 'vue'
import BaseSectionBlock from '../components/BaseSectionBlock.vue'
import { fetchDashboardSummary } from '../services/dashboardService'
import type { DashboardSummary } from '../types/auth'

const loading = ref(false)
const errorMessage = ref('')
const summary = ref<DashboardSummary | null>(null)

async function loadSummary() {
  loading.value = true
  errorMessage.value = ''

  try {
    summary.value = await fetchDashboardSummary()
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '資料讀取失敗。'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  void loadSummary()
})
</script>

<template>
  <section class="demo-grid demo-grid--equal">
    <BaseSectionBlock>
      <template #title>
        <div>
          <h2>Dashboard 受保護頁</h2>
          <p>這個頁面加上 requiresAuth，用來示範 route guard 如何先擋住未登入使用者。</p>
        </div>
      </template>

      <p v-if="loading" class="state-box state-box--loading">正在讀取 dashboard 資料...</p>
      <p v-else-if="errorMessage" class="state-box state-box--error">{{ errorMessage }}</p>
      <template v-else-if="summary">
        <div class="stats-grid">
          <article class="stat-card">
            <span>待審核案件</span>
            <strong>{{ summary.pendingApprovals }}</strong>
          </article>
          <article class="stat-card">
            <span>理賠處理中</span>
            <strong>{{ summary.openClaims }}</strong>
          </article>
        </div>
        <p class="state-box state-box--loading">{{ summary.welcomeMessage }}</p>
        <p class="hint">最後登入時間：{{ summary.lastLoginAt }}</p>
      </template>
    </BaseSectionBlock>

    <BaseSectionBlock>
      <template #title>
        <div>
          <h2>guard 與後端驗證差異</h2>
          <p>這裡要分清楚 guard 擋的是前端導頁，後端驗證擋的是 API 存取。</p>
        </div>
      </template>

      <ul class="teaching-list">
        <li>route guard：在進頁前先看 store 裡有沒有 token，沒有就導回 /login。</li>
        <li>後端驗證：就算前端放行，API 還是會依 token 有效性決定是否回 200 或 401。</li>
        <li>兩層一起存在，才能兼顧使用者體驗與安全性。</li>
      </ul>
    </BaseSectionBlock>
  </section>
</template>