import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getQuery } from "../src/Utils";
import GMIApi from "../src/api/GMIApi";
import { PageLayout } from "./../components/library/Layouts/PageLayout";
import IconBtn from "./commons/IconBtn";

export default function PageResults(props)
{
	const router = useRouter();
	const query = getQuery(router);
	const [results, setResults] = useState();

	const [error, setError] = useState();
	const [visibleGames, setVisibleGames] = useState([]);

	useEffect(()=>
	{
		GMIApi.getInstance().getResults(query.contest, (data)=>
		{
			if(!data.success)
				setError(data.error || "invalid results");
			else
				setResults(data);
		});
	},
	[query.contest]);

	if(error)
		return <div>{error}</div>;

	if(!results)
		return <div>Loading</div>;

	const toggleGameVisibility = (index)=>
	{
		const updatedVisibleGames = [...visibleGames];
		updatedVisibleGames[index] = !updatedVisibleGames[index];
		setVisibleGames(updatedVisibleGames);
	};

	let leaderboard =  "Missing games data";
	if(results.games_data)
	{
		leaderboard = results.games_data.map((game, index)=>
		(
			<tr
			 key={game.id}
			 className="odd:bg-white even:bg-slate-50 hover:bg-primary hover:text-white"
			>
				<td>{game.avg_score ? index + 1 : ""}</td>
				{/* Magari in futuro aggiungiamo una pagina dedicata al gioco con la descrizione lunga */}
				{/* <span><Link href={"/game?game=" + game.id}>{game.name}</Link></span> */}
				{/* qui vorei oscurare il game.name utilizzando tailwind e mostrando al posto del testo un roundrect cliccabile nero
				quando lo clicchi appare il nome (effetto spoiler delle chat che al click appare) cliccando di nuovo invece torna sotto spoiler
				la gestione deve essere che viene aggiunto in visibleGames (inizialmente sono tutti oscurati) */}
				<td
				 className={`cursor-pointer `}
				 onClick={() => toggleGameVisibility(index)}
				>
					{visibleGames[index] || results.public?
						game.name
					: 
						"**************"}
				</td>
				<td className="text-center">
					{" "}
					{game.avg_score || "Nessuno ha votato"}
				</td>
			</tr>
		))
	}

	let judges_report = "Missing judges data";
	if(results.judges_data)
	{
		judges_report = results.judges_data.map((judge, index)=>
		(
			<tr key={judge.id} className="odd:bg-white even:bg-slate-50">
				<td>
					<b>{judge.name}</b>
				</td>
				<td className="text-center">
					{judge.votes_count + "/" + (results.games_count || 1)}
				</td>
			</tr>
		))
	}

	return (
		<PageLayout>
			<div className="">
				<div className="relative">
					<IconBtn
						className="absolute top-0 left-0"
						onClick={()=> router.push("/contest?contest=" + query.contest)}
					>
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
					<h2 className="flex-1 text-3xl text-center mb-2">CLASSIFICA</h2>
				</div>
				<table className="charts w-full max-w-screen-md mx-auto">
					<thead>
						<tr>
							<td></td>
							<td className="text-left">Gioco</td>
							<td className="text-center">Punteggio</td>
						</tr>
					</thead>
					<tbody>{leaderboard}</tbody>
				</table>
				<hr />
				<h2 className="text-2xl text-center my-2">
					Stato completamento giudizi
				</h2>
				<table className="mx-auto max-w-xl w-full">
					<thead>
						<tr>
							<td>Giudice</td>
							<td className="text-center">Giochi votati</td>
						</tr>
					</thead>
					<tbody>{judges_report}</tbody>
				</table>
				<hr />
			</div>
		</PageLayout>
	);
}
