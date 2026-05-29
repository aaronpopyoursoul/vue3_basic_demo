import axios, {
  AxiosError,
  AxiosHeaders,
  type AxiosAdapter,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'
import type { Pinia } from 'pinia'
import router from '../router'
import { useAuthStore } from '../stores/auth'
import type { ClaimSummary, DashboardSummary, LoginFormValues, LoginResponse } from '../types/auth'

let interceptorsReady = false

function parseJsonData<T>(data: unknown): T {
  if (typeof data === 'string') {
    return JSON.parse(data) as T
  }

  return data as T
}

function buildResponse<T>(config: InternalAxiosRequestConfig, data: T, status = 200) {
  const response: AxiosResponse<T> = {
    data,
    status,
    statusText: status === 200 ? 'OK' : 'Error',
    headers: {},
    config,
  }

  return Promise.resolve(response)
}

function buildHttpError(config: InternalAxiosRequestConfig, status: number, data: unknown) {
  return Promise.reject(
    new AxiosError(
      typeof data === 'object' && data && 'message' in (data as Record<string, unknown>)
        ? String((data as Record<string, unknown>).message)
        : 'Request failed',
      String(status),
      config,
      undefined,
      {
        data,
        status,
        statusText: status === 401 ? 'Unauthorized' : 'Error',
        headers: {},
        config,
      },
    ),
  )
}

function getAuthorizationHeader(config: InternalAxiosRequestConfig) {
  const headerValue =
    typeof config.headers?.Authorization === 'string'
      ? config.headers.Authorization
      : typeof config.headers?.authorization === 'string'
        ? config.headers.authorization
        : ''

  return headerValue
}

const mockAdapter: AxiosAdapter = async (config) => {
  await new Promise((resolve) => window.setTimeout(resolve, 350))

  const authHeader = getAuthorizationHeader(config)
  const hasToken = authHeader.startsWith('Bearer ')
  const tokenLooksExpired = authHeader.includes('expired-demo-token')

  if (config.url === '/auth/login' && config.method === 'post') {
    const payload = parseJsonData<LoginFormValues>(config.data)

    if (!payload.username.trim() || !payload.password.trim()) {
      return buildHttpError(config, 400, { message: '請輸入完整登入資料。' })
    }

    const response: LoginResponse = {
      accessToken: `demo-token-${payload.username}-${Date.now()}`,
      tokenType: 'Bearer',
      user: {
        name: payload.username,
      },
    }

    return buildResponse(config, response)
  }

  if (!hasToken || tokenLooksExpired) {
    return buildHttpError(config, 401, { message: 'Access token is missing or expired.' })
  }

  if (config.url === '/dashboard/summary' && config.method === 'get') {
    const response: DashboardSummary = {
      welcomeMessage: '你已進入受保護頁面，route guard 與 interceptor 都已生效。',
      lastLoginAt: '2026-05-27 15:45',
      pendingApprovals: 2,
      openClaims: 3,
    }

    return buildResponse(config, response)
  }

  if (config.url === '/claims/list' && config.method === 'get') {
    const response: ClaimSummary[] = [
      {
        claimNo: 'CL-0001',
        policyNo: 'PL-2024-0001',
        status: 'reviewing',
        amount: 12000,
      },
      {
        claimNo: 'CL-0002',
        policyNo: 'PL-2024-0002',
        status: 'received',
        amount: 8600,
      },
    ]

    return buildResponse(config, response)
  }

  if (config.url === '/claims/unauthorized' && config.method === 'get') {
    return buildHttpError(config, 401, { message: 'Demo 401 unauthorized response.' })
  }

  if (config.url === '/policies/summary' && config.method === 'get') {
    return buildResponse(config, {
      message: '這個 protected request 用來示範 Authorization header 由 interceptor 統一帶入。',
    })
  }

  return buildHttpError(config, 404, { message: 'Mock endpoint not found.' })
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: '/api',
  adapter: mockAdapter,
})

export function setupApiInterceptors(pinia: Pinia) {
  if (interceptorsReady) {
    return
  }

  apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const authStore = useAuthStore(pinia)

    config.headers = config.headers ?? new AxiosHeaders()

    if (authStore.accessToken) {
      config.headers.Authorization = `Bearer ${authStore.accessToken}`
    }

    return config
  })

  apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<{ message?: string }>) => {
      const authStore = useAuthStore(pinia)

      if (error.response?.status === 401) {
        const redirectTarget = router.currentRoute.value.fullPath

        authStore.handleUnauthorized()

        if (router.currentRoute.value.path !== '/login') {
          await router.push({
            path: '/login',
            query: {
              redirect: redirectTarget,
            },
          })
        }
      }

      return Promise.reject(error)
    },
  )

  interceptorsReady = true
}