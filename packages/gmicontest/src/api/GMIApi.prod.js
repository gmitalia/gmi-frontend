import { Config } from "../Constants"
import GMIApiParent from "./GMIApiParent"

export default class GMIApiProd extends GMIApiParent {
	apiURL = "https://gmitalia.altervista.org/competizioni/api/v1/"
	imageURL = "https://gmitalia.altervista.org/competizioni/thumbnails/"
	awardsURL = "https://gmitalia.altervista.org/competizioni/awards/";
	forumProfileURL = "https://gmitalia.altervista.org/forum/memberlist.php?mode=viewprofile&u="

	// Cache in RAM - si svuota al refresh
	cache = {}
	pendingRequests = {}

	_getCacheKey(endpoint, params) {
		return endpoint + (params ? "?" + params.toString() : "")
	}

	_getFromCache(key) {
		return this.cache[key] || null
	}

	_setInCache(key, data) {
		this.cache[key] = data
	}

	async getMe() {
		return fetch(this.apiURL + "me.php",
			{
				credentials: "include",
				method: "GET"
			})
			.then(response => response.json())
			.catch(error => console.error("GMIApi Error:", error))
	}

	openURL(url, params) {
		const urlParams = new URLSearchParams(params)

		if (typeof window !== 'undefined')
			window.location.href = url + "?" + urlParams.toString()
		else
			console.error("window is undefined")
	}

	login() {
		this.openURL(this.apiURL + "auth.php",
			{
				action: "login",
				redirect: Config.getServerUrl()
			})
	}

	logout() {
		this.openURL(this.apiURL + "auth.php",
			{
				action: "logout",
				redirect: Config.getServerUrl()
			})
	}

	getAvatarUrl(discord_info) {
		if (!discord_info?.id || !discord_info?.avatar) {
			return "https://cdn.discordapp.com/embed/avatars/0.png"
		}
		return `https://cdn.discordapp.com/avatars/${discord_info.id}/${discord_info.avatar}.png`
	}


	_fetchWithCache(cacheKey, url, callback) {
		const cached = this._getFromCache(cacheKey)
		if (cached) {
			callback(cached)
			return
		}

		if (this.pendingRequests[cacheKey]) {
			this.pendingRequests[cacheKey].push(callback)
			return
		}

		this.pendingRequests[cacheKey] = [callback]

		fetch(url, {
			credentials: "include",
			method: "GET"
		})
		.then(response => response.json())
		.then(data => {
			this._setInCache(cacheKey, data)
			const callbacks = this.pendingRequests[cacheKey]
			delete this.pendingRequests[cacheKey]
			callbacks.forEach(cb => cb(data))
		})
		.catch(error => {
			console.error("GMIApi Error:", error)
			delete this.pendingRequests[cacheKey]
		})
	}

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

	getContests(callback) {
		const cacheKey = this._getCacheKey("get_contests")
		this._fetchWithCache(cacheKey, this.apiURL + "get_contests.php", callback)
	}

	getParticipants(contest, onlyMe, callback) {
		let params = new URLSearchParams({
			contest: contest || "0",
			me: onlyMe ? "1" : "0"
		})
		const cacheKey = this._getCacheKey("get_participants", params)
		this._fetchWithCache(cacheKey, this.apiURL + "get_participants.php?" + params.toString(), callback)
	}

	getSearchResults(q, callback) {
		if (!q || q.length < 2) {
			callback({ success: false, error: "Query must be at least 2 characters" });
			return;
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

	setUserValues(user_id, user_name, callback) {
		const url = this.apiURL + "set_user_values.php"

		fetch(url,
			{
				method: "POST", // *GET, POST, PUT, DELETE, etc.
				mode: "cors", // no-cors, *cors, same-origin
				cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
				credentials: "include", // include, *same-origin, omit
				headers: { "Content-Type": "application/json" },
				referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
				body: JSON.stringify(
					{
						user_id: user_id,
						user_name: user_name,
					})
			})
			.then(response => response.json())
			.then(data => callback(data))
			.catch(error => console.error("GMIApi Error:", error))

	}

	setVote(contest, voteObject, callback) {
		const params = new URLSearchParams(
			{
				contest: contest,
				game: voteObject.game_id,
			})

		const url = this.apiURL + "set_vote.php?" + params.toString()

		fetch(url,
			{
				method: "POST", // *GET, POST, PUT, DELETE, etc.
				mode: "cors", // no-cors, *cors, same-origin
				cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
				credentials: "include", // include, *same-origin, omit
				headers: { "Content-Type": "application/json" },
				referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
				body: JSON.stringify(
					{
						vote:
						{
							score: voteObject.score,
							comment: voteObject.comment,
							pros: JSON.stringify(voteObject.pros),
							cons: JSON.stringify(voteObject.cons),
							voted: voteObject.voted,
						}
					})
			})
			.then(response => response.json())
			.then(data => callback(data))
			.catch(error => console.error("GMIApi Error:", error))

	}

	setParticipationData(contest, game, callback) {
		const formData = new FormData()
		formData.append("thumbnail", game.thumbnailFile)

		const params = new URLSearchParams(
			{
				contest: contest,
				name: game.name,
				url: game.downloadUrl,
				description: game.description,
				short_description: game.shortDescription,
			})
		fetch(this.apiURL + "set_participation_data.php?" + params.toString(),
			{
				method: 'POST',
				mode: "cors", // no-cors, *cors, same-origin
				cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
				credentials: "include", // include, *same-origin, omit
				body: formData,
			})
			.then(response => response.json())
			.then(data => callback(data))
			.catch(error => console.error("GMIApi Error:", error))
	}


	deleteParticipationData(contest, callback) {
		const params = new URLSearchParams(
			{
				contest: contest
			})
		fetch(this.apiURL + "delete_participation_data.php?" + params.toString(),
			{
				credentials: "include",
				method: "GET"
			})
			.then(response => response.json())
			.then(data => callback(data))
			.catch(error => console.error("GMIApi Error:", error))
	}
}
