<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import PolicySearchForm from '../components/policy/PolicySearchForm.vue'
import PolicyResultsPanel from '../components/policy/PolicyResultsPanel.vue'
import BaseSectionBlock from '../components/BaseSectionBlock.vue'
import { searchPolicies } from '../services/policyService'
import { apiClient } from '../services/httpClient'
import type { PolicySummary } from '../types/policy'

// 父層負責整合資料與查詢流程，
// 表單元件專心輸入，結果元件專心顯示，這樣責任會比較清楚。
const policyKeyword = ref('')

const queryState = reactive({
  loading: false,
  errorMessage: '',
  hasSearched: false,
  results: [] as PolicySummary[],
})

function formatPolicyNumber(value: string) {
  const normalizedValue = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()

  if (!normalizedValue) {
    return ''
  }

  const prefix = normalizedValue.slice(0, 2)
  const year = normalizedValue.slice(2, 6)
  const serial = normalizedValue.slice(6, 10)

  return [prefix, year, serial].filter(Boolean).join('-')
}

const formattedPolicyKeyword = computed(() => formatPolicyNumber(policyKeyword.value))
const resultCountText = computed(() => `查到 ${queryState.results.length} 筆保單摘要`)
const protectedMessage = ref('')

watch(policyKeyword, (newValue, oldValue) => {
  if (newValue !== oldValue && queryState.errorMessage) {
    queryState.errorMessage = ''
  }
})

async function handleSearch() {
  if (!policyKeyword.value.trim()) {
    queryState.hasSearched = true
    queryState.results = []
    queryState.errorMessage = '請先輸入保單號碼再查詢。'
    return
  }

  queryState.loading = true
  queryState.errorMessage = ''
  queryState.hasSearched = true

  try {
    queryState.results = await searchPolicies(policyKeyword.value)
  } catch (error) {
    queryState.results = []
    queryState.errorMessage =
      error instanceof Error ? error.message : '發生未預期錯誤，請稍後再試。'
  } finally {
    queryState.loading = false
  }
}

async function loadProtectedSummary() {
  try {
    const response = await apiClient.get<{ message: string }>('/policies/summary')
    protectedMessage.value = response.data.message
  } catch (error) {
    protectedMessage.value = error instanceof Error ? error.message : 'protected request 讀取失敗。'
  }
}

onMounted(() => {
  void loadProtectedSummary()
})
</script>

<template>
  <section class="demo-grid">
    <PolicySearchForm
      v-model="policyKeyword"
      :formatted-keyword="formattedPolicyKeyword"
      @search="handleSearch"
    />
    <PolicyResultsPanel
      :loading="queryState.loading"
      :error-message="queryState.errorMessage"
      :has-searched="queryState.hasSearched"
      :results="queryState.results"
      :result-count-text="resultCountText"
    />
  </section>

  <section class="demo-grid demo-grid--equal section-spacing">
    <BaseSectionBlock>
      <template #title>
        <div>
          <h2>Protected request 示範</h2>
          <p>這段請求不在頁面手動組 Authorization header，而是交給 axios interceptor 統一注入。</p>
        </div>
      </template>

      <p class="state-box state-box--loading">{{ protectedMessage || '正在讀取 protected request 結果...' }}</p>
      <p class="hint">如果 token 遺失或失效，interceptor 會接手處理 401，並導回登入頁。</p>
    </BaseSectionBlock>

    <BaseSectionBlock>
      <template #title>
        <div>
          <h2>這頁怎麼結合 auth 教學</h2>
          <p>Policy 頁保留原本的元件拆分練習，再額外接上受保護路由與受保護 API。</p>
        </div>
      </template>

      <ul class="teaching-list">
        <li>Vue Router 負責把 /policies 標成 requiresAuth，先做進頁前保護。</li>
        <li>axios interceptor 負責在送出請求前補上 Authorization header。</li>
        <li>Pinia 可延伸保存查詢草稿、最近查詢保單與結果快取。</li>
      </ul>
    </BaseSectionBlock>
  </section>

  <section class="notes-grid">
    <article class="card note-card">
      <h2>元件拆分理由</h2>
      <p>查詢表單負責輸入與送出，結果元件負責呈現資料，父層負責把流程串起來。</p>
    </article>
    <article class="card note-card">
      <h2>props / emit</h2>
      <p>資料向下傳給子元件，事件向上回到父元件，這樣狀態來源會比較單純。</p>
    </article>
    <article class="card note-card">
      <h2>slot 使用時機</h2>
      <p>共用區塊標題不只是一段字，可能還有副標與說明，所以用 slot 比單一 title props 更彈性。</p>
    </article>
    <article class="card note-card">
      <h2>Pinia 可應用在哪裡</h2>
      <p>這題如果要跨頁保留查詢草稿、快取查詢結果，或記錄最近查詢過的保單號，就很適合把這些狀態交給 Pinia 管理。</p>
    </article>
  </section>
</template>