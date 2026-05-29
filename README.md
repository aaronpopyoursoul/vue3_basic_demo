# Vue 3 Auth 與保單查詢教學示範

這是一個用 Vue 3、Vite、TypeScript、Vue Router、Pinia 與 axios 建立的課堂練習專案。主題從登入、token 保存、route guard，一路延伸到 protected API、Authorization header 與 401 前端處理流程。

## 專案重點

- 使用 Vue Router 管理不同教學頁與 requiresAuth 路由保護。
- 使用 Pinia 管理深色 / 淺色模式與 auth store。
- 使用 axios interceptor 統一注入 Authorization header。
- 示範 401 發生後如何由 interceptor、store、router 分工處理。
- 建立 header、footer、sidebar 的教學後台式版型。
- 使用 v-model 進行父子元件資料同步。
- 使用 computed 顯示格式化後的保單號。
- 使用 watch 在重新輸入時清除錯誤訊息。
- 使用 v-if 區分 loading、error、empty 三種狀態。
- 使用 v-for 渲染保單摘要清單，並以 policyNo 作為 key。
- 使用 TypeScript 定義 PolicySummary、LoginResponse、DashboardSummary 與 ClaimSummary 型別。
- 把登入資料與驗證流程抽成 useAuthForm composable。
- 使用帶 title slot 的共用區塊元件統一卡片結構。

## 驗收對照

- Vue 3：處理元件、響應式資料與模板指令。
- Vite：提供開發伺服器與建置流程。
- TypeScript：保證資料結構明確。
- Vue Router：負責頁面切換、requiresAuth meta 與 route guard 導頁。
- Pinia：管理全域 UI 狀態與 auth store，例如 theme mode、access token、使用者名稱與登入訊息。
- axios：透過 interceptor 統一加入 Authorization header，並在 401 時集中處理登出流程。
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

- Login：直接使用預設帳密 student / password123 可取得 mock token。
- PL-2024-0001：可查到一筆生效中保單。
- PL20240002：可查到一筆審核中保單。
- ERROR500：模擬 API 錯誤狀態。
- 任意不存在的保單號：可展示 empty 狀態。

## 練習頁內容

- /login：登入頁，示範 auth store、useAuthForm 與登入後導頁。
- /dashboard：受保護頁，示範 requiresAuth 與 route guard。
- /policies：保留保單查詢練習，並加入 protected request 與 Authorization header 教學。
- /claims：模擬 401 回應，搭配流程圖說明 interceptor、store、router 的接力順序。

## 版型展示重點

- Header：顯示目前主題、登入狀態、登出按鈕與深淺色切換。
- Sidebar：顯示主題導覽，並以 Vue Router 對應不同網址。
- Main：由 RouterView 顯示目前對應的練習頁。
- Footer：顯示目前主題摘要與 auth 流程提示。

## 路由設計

- /login：登入入口
- /dashboard：受保護首頁
- /policies：保單查詢與 protected request
- /claims：401 處理流程示範

## Pinia 發想方向

- 保單查詢：查詢條件草稿、結果快取、最近查詢紀錄
- auth：access token、使用者資料、登入逾時訊息
- UI：主題模式、教學提示是否展開、最近瀏覽頁面
