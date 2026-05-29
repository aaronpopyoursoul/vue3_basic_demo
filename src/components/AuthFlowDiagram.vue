<template>
  <div class="flow-diagram" aria-label="401 前端處理流程圖">
    <div class="flow-step">
      <span>1</span>
      <strong>API 回傳 401</strong>
      <p>代表 access token 遺失、失效，或後端拒絕此次請求。</p>
    </div>
    <div class="flow-arrow">→</div>
    <div class="flow-step">
      <span>2</span>
      <strong>interceptor 接手</strong>
      <p>統一攔截 401，避免每個頁面都各自判斷與清除 token。</p>
    </div>
    <div class="flow-arrow">→</div>
    <div class="flow-step">
      <span>3</span>
      <strong>store 清 token</strong>
      <p>auth store 先清理 token、更新登入狀態，再準備導回登入頁。</p>
    </div>
    <div class="flow-arrow">→</div>
    <div class="flow-step">
      <span>4</span>
      <strong>router 導向 /login</strong>
      <p>讓使用者重新登入，並可保留原本想前往的目標網址。</p>
    </div>
  </div>
</template>