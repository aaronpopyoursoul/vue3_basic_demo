import { apiClient } from './httpClient'
import type { LoginFormValues, LoginResponse } from '../types/auth'

// header 注入放在 axios interceptor，而不是頁面裡逐個手寫，
// 這樣 service 層會更容易維護，也不會讓畫面元件背負 HTTP 細節。
export async function loginRequest(credentials: LoginFormValues) {
  const response = await apiClient.post<LoginResponse>('/auth/login', credentials)
  return response.data
}