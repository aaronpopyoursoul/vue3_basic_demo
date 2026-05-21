<script setup lang="ts">
import LoginFormComposition from '../components/login/LoginFormComposition.vue'
import LoginFormOptions from '../components/login/LoginFormOptions.vue'
</script>

<template>
  <section class="demo-grid demo-grid--equal">
    <LoginFormComposition />
    <LoginFormOptions />
  </section>

  <section class="notes-grid">
    <article class="card note-card">
      <h2>Options API 與 Composition API</h2>
      <p>Options API 依 data、watch、methods 分區；Composition API 依功能聚合邏輯，重構與抽共用時通常更方便。</p>
    </article>
    <article class="card note-card">
      <h2>composable 的角色</h2>
      <p>useAuthForm 只抽出登入資料、驗證與提交流程，不把元件外觀與排版也一起抽走。</p>
    </article>
    <article class="card note-card">
      <h2>閱讀與維護差異</h2>
      <p>初學者通常覺得 Options API 分區清楚；功能變多後，Composition API 會更容易把相關邏輯維持在一起。</p>
    </article>
    <article class="card note-card">
      <h2>Pinia 可應用在哪裡</h2>
      <p>登入練習若要集中管理登入狀態、使用者資料、權限資訊，或做記住帳號功能，就很適合讓 Pinia 來接手這些跨元件狀態。</p>
    </article>
  </section>
</template>