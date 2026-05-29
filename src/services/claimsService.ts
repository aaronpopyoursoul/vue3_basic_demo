import { apiClient } from './httpClient'
import type { ClaimSummary } from '../types/auth'

export async function fetchClaims() {
  const response = await apiClient.get<ClaimSummary[]>('/claims/list')
  return response.data
}

export async function triggerUnauthorizedDemo() {
  return apiClient.get('/claims/unauthorized')
}
