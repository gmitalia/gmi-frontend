import React, { useEffect, useState } from "react"
import { useRouter } from 'next/router'
import { getQuery } from "../src/Utils"
import VoteForm from "./Forms/VoteForm";
import GMIApi from "../src/api/GMIApi";

import StyledButton from "./commons/StyledButton";

//@todo don't load if not judge
export default function PageEditVotes(props)
{
	let router = useRouter()
	let query = getQuery(router)

	let [loaded, setLoaded] = useState(false)
	/**@type {[Game[], (data: Game[])=> any]} */
	let [games, setGames] = useState()
	/**@type {[Vote[], (data: Vote[])=> any]} */
	let [votes, setVotes] = useState()
	let [gameIndex, setGameIndex] = useState(0)
	let [error, setError] = useState()

	useEffect(()=>
	{
		GMIApi.getInstance().getGames(query.contest, data=> setGames(data.games))
	}, [query.contest])


	useEffect(()=>
	{
		if(!games)
			return;

		GMIApi.getInstance().getVotes(query.contest, null, data=>
		{
			if(!data.success)
			{
				setError(data.error);
				console.error(data.error);
				return;
			}

			let votes = new Array(games.length);
			for(let index = 0; index < votes.length; index++)
			{
				const gameId = games[index].id;
				const voteIdx = data.votes.findIndex(game => game.game_id === gameId);
				if(voteIdx >= 0)
				{
					let vote = data.votes[voteIdx];
					//parse arrays
					vote.pros = JSON.parse(vote.pros);
					vote.cons = JSON.parse(vote.cons);
					//reset if not array
					if(!Array.isArray(vote.pros)) vote.pros = [];
					if(!Array.isArray(vote.cons)) vote.cons = [];

					vote.voted = true;

					votes[index] = vote;
				}
				else
				{
					votes[index] = 
					{
						game_id: 	games[index].id,
						score: 		0,
						comment: 	"",
						pros: 		[],
						cons: 		[],
						voted: 		false,
					};
				}
			}

			setVotes(votes)
			setLoaded(true)
			console.debug("received games and votes", games, votes);
		})
	}, [games, query.contest]); //triggered when "games" changes (received data from API)

	if(!games)
		return <div>Loading</div>;

	if(!votes)
		return <div>Loading</div>;

	function onVoteUpdate(newVote, index, callback)
	{
		const newVotes = [...votes];
		newVotes[index] = newVote;
		setVotes(newVotes);

		//todo check if the vote is valid
		sendVote(newVote, callback);
	}

	function sendVote(vote, callback)
	{
		GMIApi.getInstance().setVote(query.contest, vote, data=>
		{
			callback(data.success);
			if(!data.success)
				setError(data.error);
		})
	}


	let yourLeaderboard = "Loading";
	let content = "Loading";
	let gamePages = []

	if(error)
	{
		content = error;
		yourLeaderboard = "";
	}
	else if(loaded)
	{
		yourLeaderboard = votes.map((vote, index)=>
		(
			{
				game: games[index],
				vote: votes[index]
			}
		))
		.sort((e1, e2) => parseInt(e2.vote.score) - parseInt(e1.vote.score))
		.map((elem, index) =>
		{
			return (
				<li key={index} className="grid grid-cols-2 md:grid-cols-4">
					<div className="flex flex-row">
						<b>{elem.vote.score}</b> 
						<div style={{marginLeft: "10px"}}>{elem.game.name}</div>
					</div>
					<b style={{color: "red"}} className="ml-2">{!elem.vote.voted? "DA VOTARE" : ""}</b> 
				</li>
			)
		});

		gamePages.push(
		(
			<div className="p-10">
				
				<StyledButton onClick={()=> router.push("/contest?contest=" + query.contest)}>
					Indietro
				</StyledButton>

				<br />
				<br />
				<hr />
				<br />
				
				<b>La tua classifica</b>
				<ul>
					{yourLeaderboard}
				</ul>
				<br />

			</div>
		))

		gamePages = gamePages.concat(games.map((game, index)=>
		{
			const vote = votes[index];

			let authors = "";
			try
			{
				authors = Buffer.from(game.authors, 'base64').toString('ascii');
				authors = JSON.parse(authors);
				authors = authors.map((author)=>
				(
					<a
					 key={author.id}
					 href={`/user?user=${author.id}`}
					>
						<div className="text-blue-500 hover:underline cursor-pointer">{author.name}</div>
					</a>
				));
			}
			catch(e) { console.error(game.authors, e); }


			let img_url = GMIApi.getInstance().imageURL + "/thumbnail.png";
			if(game.image_url)
			{
				if(game.image_url.indexOf("http") >= 0)
					img_url = game.image_url
				else
					img_url = GMIApi.getInstance().imageURL + game.image_url + "?" + Date.now().toString()
			}

			return (
				<div key={game.id} className="shadow border p-3 mb-3 h-full overflow-y-scroll">
					<div>

						<div className="flex flex-row flex-wrap md:flex-nowrap" style={{gap: "30px"}}>

							<div className="div-image">
								<img className="image-centered h-48" alt="" src={img_url} layout={'fill'} objectfit={'cover'} />
							</div>

							<div className="flex flex-col gap-2">
								<p className="flex flex-col">
									<b>{game.name}</b>
									<span className="author"> di {authors}</span>
								</p>

								<p className="flex flex-col">
									<b>Descrizione</b>
									<p>{game.short_description}</p>
								</p>

								<p><b>Download</b>: <a href={game.download_url}>{game.download_url}</a></p>

								<div className="h5" style={{color: vote.voted? "green" : "red"}}>{vote.voted? "VOTATO" : "DA VOTARE"}</div>
							</div>

						</div>

						<VoteForm {...vote} onChange={onVoteUpdate} index={index} />
					</div>
				</div>
			);
		}
		));
	}

	const gameIcon = <svg  width="20" height="20" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <rect x="2" y="6" width="20" height="12" rx="2" />  <path d="M6 12h4m-2 -2v4" />  <line x1="15" y1="11" x2="15" y2="11.01" />  <line x1="18" y1="13" x2="18" y2="13.01" /></svg>
	
	return (
		<div className="shadow border p-3 h-full">
			
		

			<div className="h-full flex flex-col border-1 border-solid">
				<div className="flex flex-row flex-wrap">
						<div
						 key={0}
						 className="px-3 py-1 relative flex flex-row"
						 style={
						 {
							gap: "5px",
							top: "1px",
							zIndex: 1,
							cursor: "pointer",
							width: "auto", 
							border: "1px solid black",
							borderBottom: 0 == gameIndex? "2px solid white" : "1px solid black",
							backgroundColor: 0 == gameIndex? "white" : "lightgray",
						 }}
						 onClick={()=> setGameIndex(0)}
						>
							Generale
						</div>

					{games.map((o, index)=> 
					(
						<div
						 key={index+1}
						 className="px-3 py-1 relative flex flex-row items-center"
						 style={
						 {
							gap: "5px",
							top: "1px",
							zIndex: 1,
							cursor: "pointer",
							width: "auto", 
							border: "1px solid black",
							borderBottom: index+1 == gameIndex? "2px solid white" : "1px solid black",
							backgroundColor: index+1 == gameIndex? "white" : "lightgray",
						 }}
						 onClick={()=> setGameIndex(index+1)}
						>
							{gameIcon}{o.name}
						</div>
					))}
				</div>
				<div style={{border: "1px solid", flexGrow: "1", height: "1px"}}>
					{gamePages[gameIndex]}
				</div>
			</div>

		</div>
	);
}
