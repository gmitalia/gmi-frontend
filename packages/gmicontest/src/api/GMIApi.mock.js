import { Config } from "../Constants";
import GMIApiParent from "./GMIApiParent"

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
			games: 
			[
				{
					id: "200",
					name: "Supergame",
					contest_id: "1000",
					image_url: "19_168740067156688896.png",
					short_description: "Al mondo tutto il filo è stato usato dagli umani per costruire vestiti, e ai gatti non è rimasto più niente, se non l'ultimo gomitolo esistente. L'unico modo per impossessarsene è battere tutti in un epica battaglia a ping pong.",
					description: "Readme incluso nella cartella di gioco.",
					authors: "W3siaWQiOiIxNCIsIm5hbWUiOiJDbGEifV0=",
					download_url: "https://mega.nz/file/Wdx1DKrJ#rjk_uqEgPzRP80guDNJx7dUlivU5slR7pmQSI5OCh_o",
					placement: "1",
				},
			],
			public_results: true,
		});
	}

	getContest(contestId, callback)
	{
		callback(
		{
			success: true,
			contests: 
			[
				{
					id: 1000,
					name: "Competizione GMI_mock_2036",
					end_at: "2023-05-10 08:00:00",
					can_submit: false,
					completed_at: "2023-05-30 08:00:00",
					public: "1",
					is_ended: false,
					is_completed: false,
				},
			],
		});
	}

	getContests(callback)
	{
		callback(
		{
			success: true,
			contests: 
			[
				{
					id: 1000,
					name: "Competizione GMI mock_2036",
					end_at: "2023-05-10 08:00:00",
					can_submit: false,
					completed_at: "2023-05-30 08:00:00",
					public: "1",
					is_ended: false,
					is_completed: false,
				},
				{
					id: 1001,
					name: "Competizione GMI mock_2020",
					end_at: "2020-04-20 08:00:00",
					can_submit: false,
					completed_at: "2020-04-20 08:00:00",
					public: "1",
					is_ended: true,
					is_completed: true,
				},
			],
		});
	}

	getParticipants(contest, onlyMe, callback)
	{
		callback(
		{
			success: true,
			participants:
			[
				{
					id: "71",
					user_name: "AlexoFalco",
					user_discord_id: "190723513911345154",
					contest_id: "1000",
					kind: "1",
				},
			],
		});
	}

	getUsers(callback)
	{
		callback(
		{
			success: true,
			users:
			[
				{
					id: "71",
					user_name: "AlexoFalco",
					user_discord_id: "190723513911345154",
					contest_id: "1000",
					kind: "1",
				},
			],
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
