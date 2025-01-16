import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getQuery } from "../src/Utils";
import { ParticipantType } from "../src/Constants";
import GameForm from "./GameForm";
import GMIApi from "../src/api/GMIApi";
import InfoMessage from "./InfoMessage";


export default function PageEditParticipation(props)
{
	let router = useRouter();
	let query = getQuery(router);

	/**@type {[Partecipation, (obj: Partecipation)=> any]} */
	let [participation, setParticipation] = useState();
	let [error, setError] = useState();
	let [joined, setJoined] = useState(false);

	function fetchData()
	{
		GMIApi.getInstance().getParticipation(query.contest, (data) =>
		{
			if(!data.success)
				setError(data.error);
			else
			{
				setJoined(data.participation ? true : false);
				setParticipation(data.participation);
			}
		});
	}

	useEffect(fetchData, [query.contest]); //hook dependencies

	function onFormSubmit(game, callback)
	{
		console.debug("submit", game);
		GMIApi.getInstance().setParticipationData(query.contest, game, (data) =>
		{
			//if we just joined
			if(data.success && data.joined) fetchData();

			callback(data);
		});
	}

	function onDelete()
	{
		console.debug("delete");
		GMIApi.getInstance().deleteParticipationData(query.contest, (data) =>
		{
			if(data.success)
			{
				alert("Cancellato con successo");
				router.push("/contest?contest=" + query.contest);
			} else setError(data.error);
		});
	}

	function renderBody(body)
	{
		return (
			<div>
				{body}
				{/* <p>
          <input
            type="button"
            onClick={() => router.push("/contest?contest=" + query.contest)}
            value="Indietro"
          />
        </p> */}
			</div>
		);
	}

	if(error) return renderBody(error);

	//join contest
	if(!joined)
	{
		return renderBody(
			<>
				<InfoMessage>
					Compila i seguenti campi e premi "Salva" per iscriverti alla competizione.
				</InfoMessage>
				<GameForm
					participation={participation}
					onFormSubmit={onFormSubmit}
					onDelete={onDelete}
					contestId={query.contest}
				/>
			</>
		);
	}
	//edit contest info
	else if(participation)
	{
		let isJudge = participation.kind == ParticipantType.judge;

		return renderBody(
			<>
				<InfoMessage>
					Sei iscritto come {isJudge ? "Giudice" : "Partecipante"}
				</InfoMessage>

				<GameForm
					participation={participation}
					onFormSubmit={onFormSubmit}
					onDelete={onDelete}
					contestId={query.contest}
				/>
			</>
		);
	} else return <div>loading</div>;
}
