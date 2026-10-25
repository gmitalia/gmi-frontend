import { Config } from "../Constants"
import GMIApiParent from "./GMIApiParent"
import apiClient from "../services/ApiClient"
import { TokenService } from "../services/TokenService"
import { parseUserLinks } from "../userLinks"

export default class GMIApiProd extends GMIApiParent {
  apiURL = "https://gmitalia.altervista.org/competizioni/api/v1/"
  imageURL = "https://gmitalia.altervista.org/competizioni/thumbnails/"
  awardsURL = "https://gmitalia.altervista.org/competizioni/awards/"
  prizesURL = "https://gmitalia.altervista.org/competizioni/prizes/"
  forumProfileURL = "https://gmitalia.altervista.org/forum/memberlist.php?mode=viewprofile&u="

  // Cache in RAM
  cache: Record<string, any> = {}
  pendingRequests: Record<string, any> = {}

  _getCacheKey(endpoint, params = undefined) {
    return endpoint + (params ? "?" + params.toString() : "")
  }

  _getFromCache(key) {
    return this.cache[key] || null
  }

  _setInCache(key, data) {
    this.cache[key] = data
  }

  /** Elimina dalla cache RAM tutte le risposte degli endpoint indicati. */
  _invalidateCache(...prefixes) {
    Object.keys(this.cache).forEach(key => {
      if (prefixes.some(prefix => key.startsWith(prefix))) {
        delete this.cache[key]
        delete this.pendingRequests[key]
      }
    })
  }

  /* ───────── Auth (promise-based) ───────── */

  async getMe() {
    const data = await apiClient.get(this.apiURL + "get_me.php")
    // Normalizza response al formato AccountInfo atteso dal frontend
    if (data.success && data.user) {
      const u = data.user
      data.user = {
        user_id: u.user_id,
        user_name: u.name || u.user_name,
        forum_id: u.forum_id,
        admin: !!u.admin,
        approved: u.approved !== undefined ? !!u.approved : true,
        links: parseUserLinks(u.links),
        discord_info: u.discord_info || {
          id: u.user_id,
          username: u.name || u.user_name,
          avatar: u.avatar,
        },
      }
    }
    return data
  }

  openURL(url, params) {
    const urlParams = new URLSearchParams(params)
    if (typeof window !== 'undefined')
      window.location.href = url + "?" + urlParams.toString()
    else
      console.error("window is undefined")
  }

  login() {
    // Salva la pagina corrente per redirect dopo login
    const redirectUri = Config.getServerUrl() + "/auth/callback"
    this.openURL(this.apiURL + "auth.php", {
      action: "login",
      redirect_uri: redirectUri,
    })
  }

  async logout() {
    const refreshToken = TokenService.getRefreshToken()
    try {
      await apiClient.post(this.apiURL + "auth.php?action=logout", {
        refresh_token: refreshToken,
      })
    } catch (e) {
      // Logout also on backend error - clean local state anyway
      console.error("[GMIApi] logout error:", e)
    }
    TokenService.clearTokens()
  }

  async exchangeCode(code) {
    // Endpoint pubblico: il 401 significa "code non valido/scaduto",
    // non un access token da rinnovare.
    const data = await apiClient.post(
      this.apiURL + "auth.php?action=exchange",
      { code },
      { skipAuth: true, skipAuthRefresh: true }
    )
    return data
  }

  async refreshToken(refreshToken) {
    const data = await apiClient.post(this.apiURL + "auth.php?action=refresh", {
      refresh_token: refreshToken,
    })
    return data
  }

  async revokeToken(refreshToken) {
    const data = await apiClient.post(this.apiURL + "auth.php?action=revoke", {
      refresh_token: refreshToken,
    })
    return data
  }

  /* ───────── Avatar ───────── */

  getAvatarUrl(discord_info) {
    if (!discord_info?.avatar) {
      return "https://cdn.discordapp.com/embed/avatars/0.png"
    }
    return discord_info.avatar
  }

  /* ───────── Cache helper (usa ApiClient internamente) ───────── */

  async _fetchWithCache(cacheKey, url, callback) {
    const cached = this._getFromCache(cacheKey)
    if (cached) {
      callback(cached)
      return
    }

    if (this.pendingRequests[cacheKey]) {
      this.pendingRequests[cacheKey].callbacks.push(callback)
      return
    }

    const request = { callbacks: [callback] }
    this.pendingRequests[cacheKey] = request

    try {
      const data = await apiClient.get(url)

      if (this.pendingRequests[cacheKey] === request) {
        this._setInCache(cacheKey, data)
        delete this.pendingRequests[cacheKey]
      }

      request.callbacks.forEach(cb => cb(data))
    } catch (error) {
      console.error("GMIApi Error:", error)
      if (this.pendingRequests[cacheKey] === request)
        delete this.pendingRequests[cacheKey]
    }
  }

  /* ───────── Public GET endpoints (callback-based, cached) ───────── */

  getGames(contest, callback) {
    const params = new URLSearchParams({ contest: contest })
    const cacheKey = this._getCacheKey("get_games", params)
    this._fetchWithCache(cacheKey, this.apiURL + "get_games.php?" + params.toString(), callback)
  }

  getContest(contestId, callback) {
    const params = new URLSearchParams({ contest: contestId })
    const cacheKey = this._getCacheKey("get_contests", params)
    this._fetchWithCache(cacheKey, this.apiURL + "get_contests.php?" + params.toString(), callback)
  }

  getContests(callback, limit) {
    const params = new URLSearchParams()

    if (limit !== undefined) {
      if (!Number.isInteger(limit) || limit <= 0) {
        callback({ success: false, error: "Invalid 'limit' parameter" })
        return
      }
      params.set("limit", String(limit))
    }

    const query = params.toString()
    // La chiave include il limit: la home (limit=3) e la pagina competizioni
    // (senza limit) mantengono due voci di cache RAM distinte.
    const cacheKey = this._getCacheKey("get_contests", query ? params : undefined)
    const url = this.apiURL + "get_contests.php" + (query ? "?" + query : "")
    this._fetchWithCache(cacheKey, url, callback)
  }

  getParticipants(contest, onlyMe, callback) {
    let params = new URLSearchParams({
      contest: contest || "0",
      me: onlyMe ? "1" : "0",
    })
    const cacheKey = this._getCacheKey("get_participants", params)
    this._fetchWithCache(cacheKey, this.apiURL + "get_participants.php?" + params.toString(), callback)
  }

  getSearchResults(q, callback) {
    if (!q || q.length < 2) {
      callback({ success: false, error: "Query must be at least 2 characters" })
      return
    }
    const params = new URLSearchParams({ q: q })
    const cacheKey = this._getCacheKey("get_search_results", params)
    this._fetchWithCache(cacheKey, this.apiURL + "get_search_results.php?" + params.toString(), callback)
  }

  getUsers(callback) {
    const cacheKey = this._getCacheKey("get_users")
    this._fetchWithCache(cacheKey, this.apiURL + "get_users.php", callback)
  }

  getStats(callback) {
    const cacheKey = this._getCacheKey("get_stats")
    this._fetchWithCache(cacheKey, this.apiURL + "get_stats.php", callback)
  }

  getUserInfo(userId, callback) {
    const params = new URLSearchParams({ user: userId })
    const cacheKey = this._getCacheKey("get_user_info", params)
    this._fetchWithCache(cacheKey, this.apiURL + "get_user_info.php?" + params.toString(), callback)
  }

  getUserMedals(userId, callback) {
    const params = new URLSearchParams({ user: userId })
    const cacheKey = this._getCacheKey("get_user_medals", params)
    this._fetchWithCache(cacheKey, this.apiURL + "get_user_medals.php?" + params.toString(), callback)
  }

  getParticipation(contest, callback) {
    const params = new URLSearchParams({ contest: contest })
    const cacheKey = this._getCacheKey("get_participation_data", params)
    this._fetchWithCache(cacheKey, this.apiURL + "get_participation_data.php?" + params.toString(), callback)
  }

  getVotes(contest, game, callback) {
    const params = game ?
      new URLSearchParams({ contest: contest, game: game }) :
      new URLSearchParams({ contest: contest })
    const cacheKey = this._getCacheKey("get_votes", params)
    this._fetchWithCache(cacheKey, this.apiURL + "get_votes.php?" + params.toString(), callback)
  }

  getResults(contest, callback) {
    const params = new URLSearchParams({ contest: contest || 0 })
    const cacheKey = this._getCacheKey("get_results", params)
    this._fetchWithCache(cacheKey, this.apiURL + "get_results.php?" + params.toString(), callback)
  }

  getPrizes(contestId, callback) {
    const params = contestId ? new URLSearchParams({ id: contestId }) : null
    const cacheKey = this._getCacheKey("get_prizes", params)
    const url = this.apiURL + "get_prizes.php" + (params ? "?" + params.toString() : "")
    this._fetchWithCache(cacheKey, url, callback)
  }

  getVideos(contestId, callback) {
    const params = contestId ? new URLSearchParams({ contest: contestId }) : null
    const cacheKey = this._getCacheKey("get_videos", params)
    const url = this.apiURL + "get_videos.php" + (params ? "?" + params.toString() : "")
    this._fetchWithCache(cacheKey, url, callback)
  }

  /* ───────── Auth-required POST endpoints ───────── */

  setUserValues(user_id, values, callback) {
    apiClient.post(this.apiURL + "set_user_values.php", { user_id, ...values })
      .then(data => {
        if (data.success)
          this._invalidateCache("get_user_info")
        callback(data)
      })
      .catch(error => {
        console.error("GMIApi Error:", error)
        callback({ success: false, error: "Errore di rete durante il salvataggio del profilo." })
      })
  }

  setVote(contest, voteObject, callback) {
    const params = new URLSearchParams({ contest: contest, game: voteObject.game_id })
    const url = this.apiURL + "set_vote.php?" + params.toString()

    apiClient.post(url, {
      vote: {
        score: voteObject.score ?? null,
        comment: voteObject.comment,
        pros: JSON.stringify(voteObject.pros || []),
        cons: JSON.stringify(voteObject.cons || []),
        confirmed: !!voteObject.confirmed,
      },
    })
      .then(data => {
        if (data.success) {
          this._invalidateCache("get_votes", "get_results")
        }
        callback(data)
      })
      .catch(error => {
        console.error("GMIApi Error:", error)
        callback({ success: false, error: "Errore di rete durante il salvataggio del voto." })
      })
  }

  setParticipationData(contest, game, callback) {
    const formData = new FormData()
    formData.append("thumbnail", game.thumbnailFile)

    const params = new URLSearchParams({
      contest: contest,
      name: game.name,
      url: game.downloadUrl,
      description: game.description,
      short_description: game.shortDescription,
    })

    apiClient.postFormData(this.apiURL + "set_participation_data.php?" + params.toString(), formData)
      .then(data => callback(data))
      .catch(error => {
        console.error("GMIApi Error:", error)
        callback({ success: false, error: "Errore di rete durante il salvataggio delle modifiche." })
      })
  }

  deleteParticipationData(contest, callback) {
    const params = new URLSearchParams({ contest: contest })
    apiClient.post(this.apiURL + "delete_participation_data.php?" + params.toString(), {})
      .then(data => callback(data))
      .catch(error => console.error("GMIApi Error:", error))
  }

  publishResults(contestId, callback) {
    const params = new URLSearchParams({ contest: contestId })
    apiClient.post(this.apiURL + "set_results.php?" + params.toString(), {})
      .then(data => {
        if (data.success) {
          this._invalidateCache("get_votes", "get_results", "get_contests", "get_games", "get_participants")
        }
        callback(data)
      })
      .catch(error => {
        console.error("GMIApi Error:", error)
        callback({ success: false, error: "Errore di rete durante la pubblicazione dei risultati." })
      })
  }
}
