import React, { useEffect, useState } from "react";
import { Config, ParticipantType } from "../../src/Constants";
import GMIApi from "../../src/api/GMIApi";
import StyledButton from "../commons/StyledButton";
import IconBtn from "../commons/IconBtn";
import { useRouter } from "next/router";


const InputClasses = "form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none ";

export default function GameForm(props)
{
	const router = useRouter();
	const contestId = props.contestId;
	/**@type {Partecipation} */
	const partecipation = props.participation || [];
	const img_url = ""//partecipation.game_thumbnail ? GMIApi.getInstance().imageURL + game.image_url + "?" + Date.now().toString() : "";

	let [gameName, setGameName] = useState(partecipation.game_name || "");
	let [gameUrl, setGameUrl] = useState(partecipation.game_url || "");
	let [gameShortDesc, setGameShortDesc] = useState(partecipation.game_short_desc || "");
	let [gameDesc, setGameDesc] = useState(partecipation.game_desc || "");
	let [urlValid, setUrlValid] = useState(false);
	let [gameThumbnail, setGameThumbnail] = useState(img_url);
	let [saved, setSaved] = useState(true);
	let [error, setError] = useState();
	let [file, setFile] = useState();
	let [uploading, setUploading] = useState();


	useEffect(()=>
	{
		var valid = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/.test(gameUrl);
		setUrlValid(valid);

		if(!valid)
			setSaved(true);
	},
	[gameUrl]);

	useEffect(()=>
	{
		const img_url = GMIApi.getInstance().imageURL + partecipation.game_thumbnail// ?? GMIApi.getInstance().imageURL + game.image_url + "?" + Date.now().toString();

		setGameName(gameName || partecipation.game_name || "");
		setGameUrl(gameUrl || partecipation.game_url || "");
		setGameShortDesc(gameShortDesc || partecipation.game_short_desc || "");
		setGameDesc(gameDesc || partecipation.game_desc || "");
		setGameThumbnail(img_url);
	},
	[partecipation])


	function handleChange()
	{
		setUploading(true);
		props.onFormSubmit(
		{
			name: 				gameName,
			downloadUrl: 		gameUrl,
			shortDescription: gameShortDesc,
			description: 		gameDesc,
			thumbnailFile: 	file,
		},
		(data)=>
		{
			if(!data.success)
				setError(data.error);

			setSaved(data.success);
			setUploading(false);
		});
	}

	function handleDeletion()
	{
		if(confirm("Vuoi disiscriverti e cancellare il gioco?"))
			props.onDelete();
	}

	function handleThumbnail(file)
	{
		if(file.size > Config.maxThumbnailSize)
			return setError("L'immagine è troppo grande (" + Math.ceil(file.size / 1024) + "KB)");

		//show the image
		var reader = new FileReader();
		reader.onload = (event)=>
		{
			setGameThumbnail(event.target.result);
		};

		reader.readAsDataURL(file);

		//update state
		setFile(file);
		setError(null);
		setSaved(false);
	}

	function resetFile(e)
	{
		setGameThumbnail(null);
		setFile(null);
		setSaved(false);
		e.target.value = null;
		setError(null);
	}

	let image = gameThumbnail?
	(
		<div>
			<img
			 className="image-centered"
		 	 alt={gameName}
			 width={320}
			 height={180}
			 src={gameThumbnail}
			/>
		</div>
	)
	:
	""

	let unsubscribe = "";
	if(props.participation)
	{
		unsubscribe = 
		(
			<StyledButton
			 type="button"
			 value="Disiscriviti"
			 disabled={uploading}
			 onClick={handleDeletion}
			>
				Disiscriviti
			</StyledButton>
		)
	}


	return (
		<div className="h-full flex flex-col gap-3">
			<div className="flex justify-start gap-4 items-center">
				<IconBtn onClick={()=> router.push("/contest?contest=" + contestId)}>
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
				<h2 className="text-2xl">Informazioni Gioco</h2>
			</div>
			<span className="text-red-600">{error}</span>
			
			<div className="flex-grow-v gap-2 h-full overflow-y-scroll flex flex-col">
				<label className="block">
					<span className="block text-md font-medium text-slate-700">Nome</span>
					<input
						type="text"
						value={gameName}
						placeholder="Inserisci qui il nome del gioco"
						maxLength={128}
						className={InputClasses}
						onChange={(e)=>
						{
							setGameName(e.target.value);
							setSaved(false);
						}}
					/>
				</label>
				<label className="block">
					<span className="block text-md font-medium text-slate-700">
						Link Download
					</span>
					<input
						type="text"
						maxLength={256}
						value={gameUrl}
						placeholder="Link per il download del gioco"
						className={InputClasses}
						onChange={(e) =>
						{
							setGameUrl(e.target.value);
							setSaved(false);
						}}
					/>

					{urlValid?
					(
						" ✓"
					)
					:
					(
						<span className="text-red-600">Link non valido</span>
					)}

				</label>
				<label className="block">
					<span className="block text-md font-medium text-slate-700">
						Upload Image (max {Config.maxThumbnailSize / 1024}KB)
					</span>
					{image}
					<input
						type="file"
						accept=".png,.jpg,.jpeg,.gif"
						onClick={resetFile}
						className={InputClasses}
						onChange={(e)=> handleThumbnail(e.target.files[0])}
					/>
				</label>
				<label className="block">
					<span className="block text-md font-medium text-slate-700">
						Descrizione Breve (max 256 caratteri)
					</span>
					<textarea
						value={gameShortDesc}
						maxLength={256}
						className={InputClasses}
						onChange={(e)=>
						{
							setGameShortDesc(e.target.value);
							setSaved(false);
						}}
					/>
				</label>
				<label className="block">
					<span className="block text-md font-medium text-slate-700">
						Descrizione (max 1024 caratteri)
					</span>
					<textarea
						value={gameDesc}
						style={{ height: 300 }}
						className={InputClasses}
						maxLength={Config.descriptionMaxLength}
						onChange={(e)=>
						{
							setGameDesc(e.target.value);
							setSaved(false);
						}}
					/>
				</label>

				<div className="flex justify-between">
					{unsubscribe}
					<StyledButton
						type="button"
						value="Salva"
						disabled={saved || uploading}
						onClick={handleChange}
					>
						Salva
					</StyledButton>
				</div>
			</div>

		</div>
	);
}
