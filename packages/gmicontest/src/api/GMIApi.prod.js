
import { Config } from "../Constants"

class GMIApiProd {

    apiURL = "https://gmitalia.altervista.org/competizioni/api/v1/"
    imageURL = "https://gmitalia.altervista.org/competizioni/thumbnails/"
    forumProfileURL = "https://gmitalia.altervista.org/forum/memberlist.php?mode=viewprofile&u="

    getMe() {
        return fetch(this.apiURL + "me.php", {
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
        this.openURL(this.apiURL + "auth.php", {
            action: "login",
            redirect: Config.getServerUrl()
        })
    }

    logout() {
        this.openURL(this.apiURL + "auth.php", {
            action: "logout",
            redirect: Config.getServerUrl()
        })
    }

    getAvatarUrl(discord_info) {
        return "https://cdn.discordapp.com/avatars/" + discord_info.id + "/" + discord_info.avatar + ".png"
    }


    getGames(contest, callback) {
        const params = new URLSearchParams({
            contest: contest
        })
        fetch(this.apiURL + "get_games.php?" + params.toString(), {
            credentials: "include",
            method: "GET"
        })
            .then(response => response.json())
            .then(data => callback(data))
            .catch(error => console.error("GMIApi Error:", error))
    }


    getContest(contestId, callback) {
        const params = new URLSearchParams({
            contest: contestId
        })
        fetch(this.apiURL + "get_contests.php?" + params.toString(), {
            credentials: "include",
            method: "GET"
        })
            .then(response => response.json())
            .then(data => callback(data))
            .catch(error => console.error("GMIApi Error:", error))
    }

    getContests(callback) {
        fetch(this.apiURL + "get_contests.php", {
            credentials: "include",
            method: "GET"
        })
            .then(response => response.json())
            .then(data => callback(data))
            .catch(error => console.error("GMIApi Error:", error))
    }

    getParticipants(contest, onlyMe, callback) {
        let params = new URLSearchParams({
            contest: contest || 0,
            me: onlyMe ? 1 : 0
        })
        fetch(this.apiURL + "get_participants.php?" + params.toString(), {
            credentials: "include",
            method: "GET"
        })
            .then(response => response.json())
            .then(data => callback(data))
            .catch(error => console.error("GMIApi Error:", error))
    }

    getParticipation(contest, callback) {
        const params = new URLSearchParams({
            contest: contest
        })
        fetch(this.apiURL + "get_participation_data.php?" + params.toString(), {
            credentials: "include",
            method: "GET"
        })
            .then(response => response.json())
            .then(data => callback(data))
            .catch(error => console.error("GMIApi Error:", error))
    }

    getVotes(contest, game, callback) {
        const params = game ?
            new URLSearchParams({
                contest: contest,
                game: game
            }) :
            new URLSearchParams({
                contest: contest
            })

        return fetch(this.apiURL + "get_votes.php?" + params.toString(), {
            credentials: "include",
            method: "GET"
        })
            .then(response => response.json())
            .then(data => callback(data))
            .catch(error => console.error("GMIApi Error:", error))
    }

    getResults(contest, callback) {
        const params = new URLSearchParams({
            contest: contest || 0
        })
        fetch(this.apiURL + "get_results.php?" + params.toString(), {
            credentials: "include",
            method: "GET"
        })
            .then(response => response.json())
            .then(data => callback(data))
            .catch(error => console.error("GMIApi Error:", error))
    }

    setVote(contest, voteObject, callback) {
        const params = new URLSearchParams({
            contest: contest,
            game: voteObject.game_id,
        })
        const url = this.apiURL + "set_vote.php?" + params.toString()
        fetch(url, {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            mode: "cors", // no-cors, *cors, same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "include", // include, *same-origin, omit
            headers: { "Content-Type": "application/json" },
            referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify({
                vote: {
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

        const params = new URLSearchParams({
            contest: contest,
            name: game.name,
            url: game.downloadUrl,
            description: game.description,
            short_description: game.shortDescription,
        })
        fetch(this.apiURL + "set_participation_data.php?" + params.toString(), {
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
        const params = new URLSearchParams({
            contest: contest
        })
        fetch(this.apiURL + "delete_participation_data.php?" + params.toString(), {
            credentials: "include",
            method: "GET"
        })
            .then(response => response.json())
            .then(data => callback(data))
            .catch(error => console.error("GMIApi Error:", error))
    }
}

export default new GMIApiProd();