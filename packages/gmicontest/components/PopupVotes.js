import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import { prosList, consList } from "../src/Constants";
import GMIApi from "../src/api/GMIApi";
import StyledButton from "./commons/StyledButton";

export default function Votes(props)
{
	let [votes, setVotes] = useState()
	let [error, setError] = useState()
	let [showButtonVotes, setShowButtonVotes] = useState(false)

	useEffect(() =>
	{
		GMIApi.getInstance().getVotes(props.contest, props.game, data =>
		{
			if(data.success)
			{
				data.votes.length > 0 ? setShowButtonVotes(true) : setShowButtonVotes(false)
			}
		})
	}, [])


	function toggleVotes()
	{
		if(votes)
		{
			setVotes(null)
			return
		}

		GMIApi.getInstance().getVotes(props.contest, props.game, data =>
		{
			if(data.success)
			{
				for(let index = 0; index < data.votes.length; index++)
				{
					//parse arrays
					data.votes[index].pros = JSON.parse(data.votes[index].pros)
					data.votes[index].cons = JSON.parse(data.votes[index].cons)
					//reset if not array
					if(!Array.isArray(data.votes[index].pros))
						votes[index].pros = []
					if(!Array.isArray(data.votes[index].cons))
						votes[index].cons = []
				}
				setVotes(data.votes)
			}
			else
				setError(data.error)
		})

	}

	if(error)
		return <div>{error}</div>

	let votesContent = ""
	let votesButtonLabel = votes ? "" : "Visualizza Voti"
	if(votes)
	{
		//build judges array
		let votesElements = votes.map((vote) =>
		{
			let pros = vote.pros.map((pro) => <span key={pro} className="bg-lime-200 px-1">{prosList[pro]}</span>)
			let cons = vote.cons.map((con) => <span key={con} className="bg-red-200 px-1">{consList[con]}</span>)
			const scaleIcon = 
			(
				<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
					<path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
				</svg>
			)

			return (
				<div key={vote.user_id} className="my-3 pb-3 border-b-2">

					<h5 className="flex justify-center gap-4 font-bold text-cyan-900">
						{scaleIcon}
						{vote.judge_name}
						{scaleIcon}
					</h5>

					<div className="mb-2">
						{vote.comment.trim().split("\n").map((item, idx)=>
						(
							<span key={idx}>
								{item}
								<br />
							</span>
						))}
					</div>

					<div className="flex flex-wrap gap-2 mb-2">
						<b>Pro</b> {pros}
					</div>
					<div className="flex flex-wrap gap-2 mb-2">
						<b>Contro</b> {cons}
					</div>
					<div>
						<b>Voto:</b> <span className="bg-primary mx-1 px-1 text-slate-50">{vote.score}</span>
					</div>
				</div>
			)
		})

		votesContent =
		(
			<div className="bg-neutral-700/[.75] fixed top-0 left-0 right-0 h-full z-10">
				<div className="modalVotes relative bg-white max-w-screen-lg mx-auto h-full md:h-5/6 md:my-10 overflow-y-scroll">
					<div className="sticky bg-white top-0 left-0 w-full z-20 pt-5 px-10 flex justify-end">
						<button className="md:top-5 md:right-5" onClick={toggleVotes}>
							<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
								<path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
						</button>
					</div>
					<h2 className="text-2xl font-bold text-gray-900 text-center">
						{props.gamename}
					</h2>
					<div className="px-2 pb-2 md:px-10 md:pb-10">{votesElements}</div>
				</div>
			</div>
		)
	}

	return (
		<div>
			{votesButtonLabel &&
			(
				<StyledButton disabled={!showButtonVotes} onClick={toggleVotes}>
					{votesButtonLabel}
				</StyledButton>
			)}
			
			{votesContent}
		</div>
	)
}