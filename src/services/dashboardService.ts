import { apiClient } from './httpClient'
import type { DashboardSummary } from '../types/auth'

export async function fetchDashboardSummary() {
  const response = await apiClient.get<DashboardSummary>('/dashboard/summary')
  return response.data
}