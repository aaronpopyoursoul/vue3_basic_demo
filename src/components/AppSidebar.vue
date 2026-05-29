<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { DemoNavItem } from '../router'

defineProps<{
  items: readonly DemoNavItem[]
}>()
</script>

<template>
  <aside class="app-sidebar">
    <div class="app-sidebar__brand">
      <strong>課堂練習導航</strong>
      <p>用 Vue Router 控制不同練習題頁面；需要登入的路由再交給 route guard 補上保護邏輯。</p>
    </div>

    <nav class="sidebar-nav" aria-label="練習主題選單">
      <RouterLink
        v-for="item in items"
        :key="item.path"
        :to="item.path"
        class="sidebar-link"
        active-class="sidebar-link--active"
      >
        <span class="sidebar-link__kicker">{{ item.shortLabel }}</span>
        <strong>{{ item.label }}</strong>
        <span>{{ item.description }}</span>
      </RouterLink>
    </nav>

    <section class="sidebar-card">
      <p class="sidebar-card__title">切分原則</p>
      <ul class="sidebar-card__list">
        <li>header 放全域資訊與主題模式切換</li>
        <li>sidebar 用 Vue Router 做主題導覽與網址切換</li>
        <li>main 由 RouterView 顯示目前練習頁內容</li>
        <li>guard 用 requiresAuth 決定是否導回 /login</li>
        <li>footer 放課堂摘要與提醒</li>
      </ul>
    </section>
  </aside>
</template>