# Vue 3 保單查詢教學示範

這是一個用 Vue 3、Vite、TypeScript、Vue Router 與 Pinia 建立的課堂練習專案，包含保單查詢與登入表單兩組教學示範，並提供 header、footer、sidebar 與深淺色模式的教學版型。

## 專案重點

- 使用單檔元件建立可重用的保單查詢輸入框。
- 使用 Vue Router 管理不同練習主題的頁面切換。
- 使用 Pinia 管理深色 / 淺色模式，並記住使用者偏好。
- 建立 header、footer、sidebar 的教學後台式版型。
- 使用 v-model 進行父子元件資料同步。
- 使用 computed 顯示格式化後的保單號。
- 使用 watch 在重新輸入時清除錯誤訊息。
- 使用 v-if 區分 loading、error、empty 三種狀態。
- 使用 v-for 渲染保單摘要清單，並以 policyNo 作為 key。
- 使用 TypeScript 定義 PolicySummary 型別，欄位名稱對齊模擬 API。
- 分別用 Options API 與 Composition API 實作簡單登入表單。
- 把登入資料與驗證流程抽成 useAuthForm composable。
- 使用帶 title slot 的共用區塊元件統一卡片結構。

## 驗收對照

- Vue 3：處理元件、響應式資料與模板指令。
- Vite：提供開發伺服器與建置流程。
- TypeScript：保證保單摘要資料結構明確。
- Vue Router：負責不同練習主題的頁面切換與網址管理。
- Pinia：目前主要用於深淺色模式，也適合延伸到查詢草稿、快取、登入狀態等全域狀態。
- Layout：示範 header、footer、sidebar 與主畫面責任切分。
- ref 與 reactive：分別示範單一值與狀態物件。
- computed 與 watch：分別示範衍生值與副作用。
- props / emit：示範資料向下、事件向上。
- slot 與 composable：示範結構重用與邏輯重用的不同切分方式。

## 執行方式

```bash
npm run dev
```

開發完成後可用以下指令驗證建置：

```bash
npm run build
```

## 示範測試資料

- PL-2024-0001：可查到一筆生效中保單
- PL20240002：可查到一筆審核中保單
- ERROR500：模擬 API 錯誤狀態
- 任意不存在的保單號：可展示 empty 狀態

## 練習頁內容

- 保單查詢練習：拆成表單元件與結果元件，示範 props / emit 與 slot。
- 登入表單練習：同時比較 Options API 與 Composition API，兩者共用 useAuthForm composable。

## 版型展示重點

- Header：顯示目前主題、簡介與深淺色切換。
- Sidebar：顯示主題導覽，並以 Vue Router 對應不同網址。
- Main：由 RouterView 顯示目前對應的練習頁。
- Footer：顯示目前主題摘要與本頁示範重點。

## 路由設計

- /policies：保單查詢練習
- /auth：登入表單練習

## Pinia 發想方向

- 保單查詢：查詢條件草稿、結果快取、最近查詢紀錄
- 登入表單：登入狀態、使用者資料、權限資訊、記住帳號
