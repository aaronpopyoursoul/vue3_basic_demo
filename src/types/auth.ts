export interface LoginFormValues {
  username: string
  password: string
}

export interface LoginSubmitResult {
  success: boolean
  message: string
}

export interface LoginResponse {
  accessToken: string
  tokenType: 'Bearer'
  user: {
    name: string
  }
}

export interface DashboardSummary {
  welcomeMessage: string
  lastLoginAt: string
  pendingApprovals: number
  openClaims: number
}

export interface ClaimSummary {
  claimNo: string
  policyNo: string
  status: 'received' | 'reviewing' | 'paid'
  amount: number
}