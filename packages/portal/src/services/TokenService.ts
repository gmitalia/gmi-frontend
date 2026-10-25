const STORAGE_KEYS = {
  ACCESS_TOKEN: 'gmi_access_token',
  REFRESH_TOKEN: 'gmi_refresh_token',
}

let memoryTokens = {
  accessToken: null,
  refreshToken: null,
}

function getStorage(remember) {
  return remember ? localStorage : sessionStorage
}

export const TokenService = {
  getAccessToken() {
    if (memoryTokens.accessToken) return memoryTokens.accessToken
    try {
      return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
        || sessionStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
    } catch { return null }
  },

  getRefreshToken() {
    if (memoryTokens.refreshToken) return memoryTokens.refreshToken
    try {
      return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
        || sessionStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
    } catch { return null }
  },

  setTokens(accessToken, refreshToken, remember = true) {
    memoryTokens.accessToken = accessToken
    memoryTokens.refreshToken = refreshToken
    try {
      const storage = getStorage(remember)
      const other = remember ? sessionStorage : localStorage
      storage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken)
      storage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken)
      // Clean up the other storage
      other.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
      other.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
    } catch { /* storage unavailable */ }
  },

  clearTokens() {
    memoryTokens.accessToken = null
    memoryTokens.refreshToken = null
    try {
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
      sessionStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
      sessionStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
    } catch { /* storage unavailable */ }
  },

  isLoggedIn() {
    return !!this.getAccessToken()
  },
}
