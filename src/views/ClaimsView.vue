<script setup lang="ts">
import { onMounted, ref } from 'vue'
import AuthFlowDiagram from '../components/AuthFlowDiagram.vue'
import BaseSectionBlock from '../components/BaseSectionBlock.vue'
import { fetchClaims, triggerUnauthorizedDemo } from '../services/claimsService'
import type { ClaimSummary } from '../types/auth'

const loading = ref(false)
const errorMessage = ref('')
const claims = ref<ClaimSummary[]>([])

async function loadClaims() {
  loading.value = true
  errorMessage.value = ''

  try {
    claims.value = await fetchClaims()
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '理賠資料讀取失敗。'
  } finally {
    loading.value = false
  }
}

async function runUnauthorizedDemo() {
  try {
    await triggerUnauthorizedDemo()
  } catch {
    // 401 會由 interceptor 統一處理，這裡故意不在頁面重複寫清 token 與導頁流程。
  }
}

onMounted(() => {
  void loadClaims()
})
</script>

<template>
  <section class="demo-grid demo-grid--equal">
    <BaseSectionBlock>
      <template #title>
        <div>
          <h2>Claims 受保護頁</h2>
          <p>這個頁面用來示範 axios interceptor 在 401 發生後，如何統一清 token 與導頁。</p>
        </div>
      </template>

      <p v-if="loading" class="state-box state-box--loading">正在讀取理賠資料...</p>
      <p v-else-if="errorMessage" class="state-box state-box--error">{{ errorMessage }}</p>
      <ul v-else class="result-list">
        <li v-for="claim in claims" :key="claim.claimNo" class="result-item">
          <div>
            <p class="policy-no">{{ claim.claimNo }}</p>
            <h3>{{ claim.policyNo }}</h3>
          </div>
          <dl>
            <div>
              <dt>狀態</dt>
              <dd>{{ claim.status }}</dd>
            </div>
            <div>
              <dt>金額</dt>
              <dd>{{ claim.amount }}</dd>
            </div>
          </dl>
        </li>
      </ul>

      <button type="button" class="secondary-button" @click="runUnauthorizedDemo">
        模擬 401 後端回應
      </button>
    </BaseSectionBlock>

    <BaseSectionBlock>
      <template #title>
        <div>
          <h2>401 前端處理流程圖</h2>
          <p>這張流程圖用來說明清 token、更新 store、導頁三步之間的順序關係。</p>
        </div>
      </template>

      <AuthFlowDiagram />
    </BaseSectionBlock>
  </section>
</template>