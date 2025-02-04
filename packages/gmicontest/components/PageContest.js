import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getQuery, getItalianDate } from "../src/Utils";
import { ParticipantType } from "../src/Constants";
import GamesList from "./Contest/GamesList";
import GMIApi from "../src/api/GMIApi";
import moment from "moment";
import "moment/locale/it";
import { PageLayout } from "./library/Layouts/PageLayout";
import IconBtn from "./commons/IconBtn";
import StyledButton from "./commons/StyledButton";
import RuleBook from "./commons/RuleBook";

//@todo remove "visualizza voti" if not ended
export default function PageContest(props)
{
	let router = useRouter();
	let query = getQuery(router);
	
	/**@type {[Participant, (obj: Participant)=> any]} */
	let [participant, setParticipant] = useState(false);
	/**@type {[Contest, (obj: Contest)=> any]} */
	let [contest, setContest] = useState();
	let [error, setError] = useState();
	let [rules, setRules] = useState();


	useEffect(()=>
	{
		//fetch contest
		console.debug("fetching contests", query.contest);
		GMIApi.getInstance().getContest(query.contest, (data) =>
		{
			if(data.success)
				setContest(data.contests[0]);
			else
				setError(data.error || "invalid contest");
		});

		//fetch participant
		console.debug("fetching participants", query.contest);
		GMIApi.getInstance().getParticipants(query.contest, true, (data) =>
		{
			if(data.success)
				setParticipant(data.participants[0]);
		});
	},
	[query.contest]); 

	function toggleRules()
	{
		setRules(!rules);
	}

	if(error)
		return (
			<div>
				<div>ERROR: {error}</div>
			</div>
		);

	if(!contest) 
		return <div>Loading</div>;

	//judge section
	const complete_date = new Date(Date.parse(contest.completed_at));
	const end_date = new Date(Date.parse(contest.end_at));

	const isComplete = Date.now() > complete_date;
	const canSubmitGames = !!contest.can_submit;

	const isJudge = participant && participant?.kind == ParticipantType.judge;
	const isCompetitor =	participant && participant?.kind == ParticipantType.competitor;

	const actions = [];
	const canVote = isJudge && !isComplete && !canSubmitGames;
	
	const canNew = canSubmitGames && !canVote && !isCompetitor;
	const canEdit = canSubmitGames && !canVote && isCompetitor;

	actions.push(
		<StyledButton 
		 key={actions.length}
		 className="mr-2"
		 onClick={()=> toggleRules()}
		>
			Regolamento
		</StyledButton>
	);

	if(canVote)
	{
		actions.push(
			<StyledButton
			 key={actions.length}
			 className="mr-2"
			 onClick={()=> router.push("/editvotes?contest=" + contest.id)}
			>
				Vota
			</StyledButton>
		);
	}
	if(canNew)
	{
		actions.push(
			<StyledButton
			 key={actions.length}
			 className="mr-2"
			 onClick={()=> router.push("/participation?contest=" + contest.id)}
			>
				Invia Gioco
			</StyledButton>
		);
	}
	if(canEdit)
	{
		actions.push(
			<StyledButton
			 key={actions.length}
			 className="mr-2"
			 onClick={()=> router.push("/participation?contest=" + contest.id)}
			>
				Modifica Dati Partecipazione
			</StyledButton>
		);
	}

	let rulesModal = !rules ? 
	(
		""
	) 
	: 
	(
		<div className="bg-neutral-700/[.75] fixed top-0 left-0 right-0 h-full z-10">
			<div className="modalVotes relative bg-white max-w-screen-lg mx-auto h-full md:h-5/6 md:my-10 overflow-y-scroll">
				<div className="sticky bg-white top-0 left-0 w-full z-20 pt-5 px-10 flex justify-end">
					<button className="md:top-5 md:right-5" onClick={toggleRules}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth="2"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
					</button>
				</div>
				<RuleBook />
			</div>
		</div>
	);

	return (
		<PageLayout>
			<div className="w-full h-full flex flex-col">
			<div className="flex justify-start gap-4 items-center">
				<IconBtn onClick={() => router.push("/")}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth={2}
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z"
						/>
					</svg>
				</IconBtn>
				<h2 className="text-2xl">{contest.name}</h2>
			</div>

			<div className="my-3 flex flex-row gap-1" style={{height: "32px"}}>
				{actions}
				<div id="results-portal" className=" contents"></div>
			</div>

			<div className=" h-full overflow-y-scroll">
			<div>
				<b>Termine Consegna</b>:{" "}
				{moment(end_date).locale("it").format("DD MMMM HH:mm")}
			</div>

			<div>
				<b>Termine Giudizi</b>:{" "}
				{moment(complete_date).locale("it").format("DD MMMM HH:mm")}
			</div>

			<GamesList contest={contest.id} contestEnded={isComplete} />
			
			{rulesModal}
			</div>
			

			</div>
		</PageLayout>
	);
}
