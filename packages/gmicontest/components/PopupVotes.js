import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import { prosList, consList } from "../src/Constants";
import GMIApi from "../src/api/GMIApi";
import StyledButton from "./commons/StyledButton";
import { marked } from "../src/marked"

export default function PopupVotes(props)
{
	/**@type {[Vote[], (value: Vote[])=> any]} */
	let [votes, setVotes] = useState()
	let [error, setError] = useState()
	let [voteIndex, setVoteIndex] = useState(0)
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

	const escButton = function()
	{
		if(votes != null)
			toggleVotes()
	}
	document.addEventListener("keydown", escButton)

	const scaleIcon = 
	(
		<svg style={{width: "15px", height: "15px", margin: "auto"}} xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
			<path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
		</svg>
	)

	let votesContent = ""
	let votesButtonLabel = votes ? "" : "Visualizza Voti"
	if(votes)
	{
		//build judges array
		let votesElements = votes.map((vote) =>
		{
			let pros = vote.pros.map((pro) => <span key={pro} className="bg-lime-200 px-1">{prosList[pro]}</span>)
			let cons = vote.cons.map((con) => <span key={con} className="bg-red-200 px-1">{consList[con]}</span>)
			

			let isOldContest = props.contest < 19
			let comment = vote.comment;

			if(isOldContest == false)
				comment = vote.comment.replaceAll("\n", "⠀⠀\n")
			
			return (
				<div key={vote.user_id} className="h-full flex flex-col p-5">
			
					<div className="mb-2 overflow-y-scroll" style={{flexGrow: "1", maxHeight: "450px"}}>
						<span className="">
							<div className="content vote-tables" dangerouslySetInnerHTML={{__html: marked.parse(comment, {breaks: isOldContest? false : true})}}></div>
							<br />
						</span>
					</div>
					
					<div className="mt-auto">
						{vote.pros.length > 0 &&
						(
							<div className="flex flex-wrap gap-2 mb-2">
								<b style={{width: "70px"}}>Pro</b> {pros}
							</div>
						)}
						{vote.cons.length > 0 &&
						(
							<div className="flex flex-wrap gap-2 mb-2">
								<b style={{width: "70px"}}>Contro</b> {cons}
							</div>
						)}

						<div className="flex gap-2 ">
							<b style={{width: "70px"}}>Voto</b> <span className="bg-primary px-1 text-slate-50">{vote.score}</span>
						</div>
					</div>

				</div>
			)
		})

		

		votesContent =
		(
			<div className="bg-neutral-700/[.75] fixed top-0 left-0 right-0 h-full z-10 flex items-center">			
				<div className="flex flex-col modalVotes relative bg-white max-w-screen-lg mx-auto h-auto my-auto  md:h-5/6 md:my-10" style={{height: "80%", width: "90%"}}>
					
					<div className="sticky bg-white top-0 left-0 w-full z-20 pt-5 pb-2 px-10 flex justify-end">
						<h2 className="mx-auto text-2xl font-bold text-gray-900 text-center">
							{props.gamename}
						</h2>

						<button className="md:top-5 md:right-5" onClick={toggleVotes}>
							<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
								<path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
						</button>
					</div>

					

					<div style={{flexGrow: "1"}} className="h-auto flex flex-col px-2 pb-2 md:px-10 md:pb-10 border-1 border-solid">
						<div className="flex flex-row flex-wrap">
							{votes.map((o, index)=> 
							(
								<div
								 key={index}
								 className="px-3 py-1 relative flex flex-row"
								 style={
								 {
									gap: "5px",
									top: "1px",
									zIndex: 1,
									cursor: "pointer",
									width: "auto", 
									border: "1px solid black",
									borderBottom: index == voteIndex? "2px solid white" : "1px solid black",
									backgroundColor: index == voteIndex? "white" : "lightgray",
								 }}
								 onClick={()=> setVoteIndex(index)}
								>
									{scaleIcon}
									{o.judge_name}
								</div>
							))}
						</div>
						<div style={{border: "1px solid", flexGrow: "1", height: "1px"}}>
							{votesElements[voteIndex]}
						</div>
					</div>
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