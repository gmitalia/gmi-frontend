import { Config } from "../Constants";
import { store } from "../store";
import GMIApiParent from "./GMIApiParent"
import { MockContest, MockGames, MockPartecipants, MockUsers } from "./MockDatabase";
import { useDispatch, useSelector } from "react-redux";

export default class GMIApiMock extends GMIApiParent
{
	apiURL = "https://gmitalia.altervista.org/competizioni/api/v1/";
	imageURL = "https://gmitalia.altervista.org/competizioni/thumbnails/";
	forumProfileURL ="https://gmitalia.altervista.org/forum/memberlist.php?mode=viewprofile&u=";

	getMe()
	{
		return fetch(this.apiURL + "me.php", {
			credentials: "include",
			method: "GET",
		})
			.then((response) => response.json())
			.catch((error) => console.error("GMIApi Error:", error));
	}

	openURL(url, params)
	{
		const urlParams = new URLSearchParams(params);
		if(typeof window !== "undefined")
			window.location.href = url + "?" + urlParams.toString();
		else console.error("window is undefined");
	}

	login()
	{
		this.openURL(this.apiURL + "auth.php",
		{
			action: "login",
			redirect: Config.getServerUrl(),
		});
	}

	logout()
	{
		this.openURL(this.apiURL + "auth.php",
		{
			action: "logout",
			redirect: Config.getServerUrl(),
		});
	}

	getAvatarUrl(discord_info)
	{
		return `https://cdn.discordapp.com/avatars/${discord_info.id}/${discord_info.avatar}.png`;
	}

	getGames(contest, callback)
	{
		callback(
		{
			success: true,
			games: MockGames.filter(o=> o.contest_id == contest),
			public_results: true,
		});
	}

	getContest(contestId, callback)
	{
		callback(
		{
			success: true,
			contests: MockContest.filter(o=> o.id == contestId)
		});
	}

	getContests(callback)
	{
		callback(
		{
			success: true,
			contests: MockContest
		});
	}

	getParticipants(contest, onlyMe, callback)
	{
		/**@type {{success: boolean, user: AccountInfo}} */
		let userInfo = store.getState().auth.userInfo;

		// Questa funzione potrebbe essere chiamata prima che sia completo il login, crea un loop attendendo che l'account di discord sia carico.
		let inteval = setInterval(()=> 
		{
			userInfo = store.getState().auth.userInfo;

			if(userInfo == undefined)
				return;
			else
				clearInterval(inteval)
	
			if(userInfo.success == false)
			{
				callback(
				{
					success: true,
					participants: [],
				});
			}
			else
			{
				let partecipant = MockPartecipants.filter(o=> o.contest_id == contest);
		
				if(onlyMe)
					partecipant = partecipant.filter(o=> o.id == userInfo.user.user_id)
			
				
				callback(
				{
					success: true,
					participants: partecipant,
				});
			}
		},100)
	}

	getUsers(callback)
	{
		callback(
		{
			success: true,
			users: MockUsers.reduce((acc, obj)=>
					{
						if(!acc.some(item => item.id === obj.id))
							acc.push(obj)
						return acc
					}, [])
		});
	}

	getUserInfo(userId, callback)
	{
		callback(
		{
			success: true,
			users: MockUsers.reduce((acc, obj)=>
					{
						if(!acc.some(item => item.id === obj.id))
							acc.push(obj)
						return acc
					}, []).filter(o=> o.id == userId)
		});
	}

	getParticipation(contest, callback)
	{
		const params = new URLSearchParams(
		{
			contest: contest,
		});

		fetch(this.apiURL + "get_participation_data.php?" + params.toString(),
		{
			credentials: "include",
			method: "GET",
		})
			.then((response) => response.json())
			.then((data) => callback(data))
			.catch((error) => console.error("GMIApi Error:", error));
	}

	getVotes(contest, game, callback)
	{
		callback(
		{
			success: true,
			votes:
			[
				{
					user_id: "16",
					game_id: "1000",
					created_at: "2023-04-24 12:40:31",
					updated_at: "2023-04-24 12:40:31",
					score: "40",
					comment: "Chiaramente un progetto in stato prototipale (come preannunciato). Ci\u00f2 non significa che non si possano comunque apprezzare certi dettagli, premonitori di quello che sar\u00e0 o sarebbe potuto essere.\nImmersivit\u00e0 alle stelle con una variet\u00e0 di suoni per l'ambiente desktop \"simulato\" (i tuoi switch suonano meglio dei miei), con menzione d'onore ai suoni ad hoc per la barra spaziatrice ed il tasto invio.\nHo sempre apprezzato la narrazione attraverso mail, specialmente per la possibilit\u00e0 di scoprire la storia \"a ritroso\". Chiaramente quest'ultima \u00e8 a malapena abbozzata e quindi c'\u00e8 poco da dire, anche se quella che sembrerebbe una bella storia su sacrifici umani non mi dispiacerebbe affatto.\n\nSo che \u00e8 solo una bozza al momento, ma devo dirlo: trovo la musica troppo mielosa. Dopo trenta secondi \u00e8 subito spot antipovert\u00e0 nel terzo mondo.",
					pros: '["8"]',
					cons: '["4"]',
					judge_name: "BallMan",
				},
			],
		});
	}

	getResults(contest, callback)
	{
		const params = new URLSearchParams(
		{
			contest: contest || 0,
		});
		fetch(this.apiURL + "get_results.php?" + params.toString(),
		{
			credentials: "include",
			method: "GET",
		})
			.then((response) => response.json())
			.then((data) => callback(data))
			.catch((error) => console.error("GMIApi Error:", error));
	}

	setVote(contest, voteObject, callback)
	{
		const params = new URLSearchParams(
		{
			contest: contest,
			game: voteObject.game_id,
		});

		const url = this.apiURL + "set_vote.php?" + params.toString();
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
				},
			}),
		})
			.then((response) => response.json())
			.then((data) => callback(data))
			.catch((error) => console.error("GMIApi Error:", error));
	}

	setParticipationData(contest, game, callback)
	{
		const formData = new FormData();
		formData.append("thumbnail", game.thumbnailFile);

		const params = new URLSearchParams(
		{
			contest: contest,
			name: game.name,
			url: game.downloadUrl,
			description: game.description,
			short_description: game.shortDescription,
		});

		fetch(this.apiURL + "set_participation_data.php?" + params.toString(),
		{
			method: "POST",
			mode: "cors", // no-cors, *cors, same-origin
			cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
			credentials: "include", // include, *same-origin, omit
			body: formData,
		})
			.then((response) => response.json())
			.then((data) => callback(data))
			.catch((error) => console.error("GMIApi Error:", error));
	}

	deleteParticipationData(contest, callback)
	{
		const params = new URLSearchParams(
		{
			contest: contest,
		});
		fetch(this.apiURL + "delete_participation_data.php?" + params.toString(),
		{
			credentials: "include",
			method: "GET",
		})
			.then((response) => response.json())
			.then((data) => callback(data))
			.catch((error) => console.error("GMIApi Error:", error));
	}
}
