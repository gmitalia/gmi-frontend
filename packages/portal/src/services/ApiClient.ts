import { TokenService } from './TokenService'

/**
 * Fetch wrapper with automatic Bearer token injection and 401 auto-refresh.
 * Queues concurrent requests during refresh to avoid multiple refresh calls.
 *
 * Returns parsed JSON for ALL responses (including 4xx/5xx).
 * Callers check `data.success` — no exceptions for HTTP errors.
 */
class ApiClient {
  _refreshing: Promise<any> | null

  constructor() {
    this._refreshing = null
  }

  async request(url: string, options: RequestInit = {}) {
    const execute = () => {
      const headers: Record<string, string> = { ...(options.headers as Record<string, string>) }
      const token = TokenService.getAccessToken()
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
      return fetch(url, {
        ...options,
        headers,
        credentials: 'omit',
      })
    }

    let response = await execute()
    let data = await this._parseJSON(response)

    // Auto-refresh on 401 if we have a refresh token
    if (response.status === 401 && TokenService.getRefreshToken()) {
      const refreshed = await this._handleRefresh()
      if (refreshed) {
        response = await execute()
        data = await this._parseJSON(response)
      } else {
        // Refresh failed — tokens invalid, clean up
        TokenService.clearTokens()
        // Retry without auth — endpoint might be public
        response = await execute()
        data = await this._parseJSON(response)
      }
    }

    return data
  }

  get(url) {
    return this.request(url, { method: 'GET' })
  }

  post(url, body) {
    return this.request(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  }

  postFormData(url, formData) {
    // Do not set Content-Type — browser sets it with boundary for FormData
    return this.request(url, {
      method: 'POST',
      body: formData,
    })
  }

  /* ───────── Internal ───────── */

  async _parseJSON(response) {
    try {
      return await response.json()
    } catch {
      return { success: false, error: `HTTP ${response.status}` }
    }
  }

  async _handleRefresh() {
    if (this._refreshing) {
      await this._refreshing
      return TokenService.getAccessToken() !== null
    }

    this._refreshing = this._doRefresh()
    try {
      await this._refreshing
      return true
    } catch (err) {
      console.error('[ApiClient] Refresh failed:', err)
      return false
    } finally {
      this._refreshing = null
    }
  }

  async _doRefresh() {
    const refreshToken = TokenService.getRefreshToken()
    if (!refreshToken) throw new Error('No refresh token')

    // Plain fetch — no auth header, avoid infinite loop
    const response = await fetch(
      'https://gmitalia.altervista.org/competizioni/api/v1/auth.php?action=refresh',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken }),
        credentials: 'omit',
      }
    )

    const data = await response.json()
    if (!data.success) throw new Error(data.error || 'Refresh failed')

    TokenService.setTokens(data.access_token, data.refresh_token, !!data.remember)
    return data.access_token
  }
}

// Singleton
const apiClient = new ApiClient()
export default apiClient
