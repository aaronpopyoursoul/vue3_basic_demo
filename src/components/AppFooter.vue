<script setup lang="ts">
defineProps<{
  activeTopicLabel: string
}>()
</script>

<template>
  <footer class="app-footer">
    <p>目前主題：{{ activeTopicLabel }}</p>
    <p>這個版型示範 auth store、requiresAuth、route guard、axios interceptor 與 401 前端處理流程。</p>
  </footer>
</template>