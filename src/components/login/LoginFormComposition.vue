<script setup lang="ts">
import { ref, watch } from 'vue'
import BaseSectionBlock from '../BaseSectionBlock.vue'
import { useAuthForm } from '../../composables/useAuthForm'

const { form, errors, canSubmit, submit, resetSubmitError } = useAuthForm()
const successMessage = ref('')

watch(
  () => [form.username, form.password],
  () => {
    // watch 在這裡代表輸入變動後的副作用：把先前的送出訊息清掉。
    successMessage.value = ''
    resetSubmitError()
  },
)

async function handleSubmit() {
  const result = await submit()
  successMessage.value = result.success ? result.message : ''
}
</script>

<template>
  <BaseSectionBlock>
    <template #title>
      <div>
        <h2>Composition API 登入表單</h2>
        <p>邏輯以 setup 與 composable 組合，適合把可重用行為拆開維護。</p>
      </div>
    </template>

    <form class="login-form" @submit.prevent="handleSubmit">
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

      <button class="primary-button" type="submit" :disabled="!canSubmit">登入</button>

      <p v-if="successMessage" class="state-box state-box--loading">{{ successMessage }}</p>
    </form>
  </BaseSectionBlock>
</template>