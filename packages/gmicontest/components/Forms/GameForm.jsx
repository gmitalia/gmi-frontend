import React, { useEffect, useState } from "react";
import { Config, ParticipantType } from "../../src/Constants";
import GMIApi from "../../src/api/GMIApi";
import { Button } from "../commons/Button";
import { ChevronLeftIcon, InfoIcon, PenIcon, ImageIcon } from "../commons/Icons";
import { useRouter } from "next/router";


const InputClasses = "w-full px-4 py-3 bg-surface focus:bg-surface-solid border border-default ds-rounded-cta text-content placeholder:text-content-muted/40 focus:outline-none focus:border-secondary/50 focus:ring-1 focus:ring-secondary/50 ring-offset-transparent focus:ring-offset-transparent transition-all shadow-sm";
const LabelClasses = "block text-xs font-black text-content-muted uppercase tracking-widest mb-2";

export default function GameForm(props) {
	const router = useRouter();
	const contestId = props.contestId;
	const partecipation = props.participation || {};
	const img_url = "";

	let [gameName, setGameName] = useState(partecipation.game_name || "");
	let [gameUrl, setGameUrl] = useState(partecipation.game_url || "");
	let [gameShortDesc, setGameShortDesc] = useState(partecipation.game_short_desc || "");
	let [gameDesc, setGameDesc] = useState(partecipation.game_desc || "");

	const initial_img_url = partecipation.game_thumbnail ? GMIApi.getInstance().imageURL + partecipation.game_thumbnail : "";
	let [gameThumbnail, setGameThumbnail] = useState(initial_img_url);
	let [imgError, setImgError] = useState(false);

	let [saved, setSaved] = useState(true);
	let [error, setError] = useState();
	let [file, setFile] = useState();
	let [uploading, setUploading] = useState();

	const isUrlValid = gameUrl === "" || /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/.test(gameUrl);
	const formValid = isUrlValid && gameName.trim() !== "" && gameShortDesc.trim() !== "" && gameThumbnail;

	useEffect(() => {
		if (props.participation) {
			const p = props.participation;
			setGameName(p.game_name || "");
			setGameUrl(p.game_url || "");
			setGameShortDesc(p.game_short_desc || "");
			setGameDesc(p.game_desc || "");

			if (p.game_thumbnail) {
				setGameThumbnail(GMIApi.getInstance().imageURL + p.game_thumbnail);
				setImgError(false);
			}
		}
	}, [props.participation]);

	function handleChange() {
		setUploading(true);
		props.onFormSubmit(
			{
				name: gameName,
				downloadUrl: gameUrl,
				shortDescription: gameShortDesc,
				description: gameDesc,
				thumbnailFile: file,
			},
			(data) => {
				if (!data.success)
					setError(data.error);

				setSaved(data.success);
				setUploading(false);
			});
	}

	function handleDeletion() {
		if (confirm("Vuoi disiscriverti e cancellare il gioco? Questa operazione è irreversibile."))
			props.onDelete();
	}

	function handleThumbnail(file) {
		if (!file) return;
		if (file.size > Config.maxThumbnailSize)
			return setError("L'immagine è troppo grande (" + Math.ceil(file.size / 1024) + "KB)");

		var reader = new FileReader();
		reader.onload = (event) => {
			setGameThumbnail(event.target.result);
			setImgError(false);
		};

		reader.readAsDataURL(file);

		setFile(file);
		setError(null);
		setSaved(false);
	}

	return (
		<div className="w-full max-w-4xl mx-auto flex flex-col gap-8 pb-12 animate-in slide-in-from-bottom-4 duration-500">
			{/* Header */}
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface border border-default rounded-md p-6 md:p-8 relative overflow-hidden">
				<div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
				<div className="relative flex items-center gap-4">
					<Button variant="secondary" size="icon"
						onClick={() => router.push("/contest?contest=" + contestId)}
						icon={<ChevronLeftIcon size={24} strokeWidth="2.5" />}
					/>
					<div>
						<h2 className="text-2xl md:text-3xl font-black text-content tracking-tight">Informazioni Gioco</h2>
						<p className="text-content-muted text-sm mt-1">Completa i campi per {props.participation?.id ? "aggiornare" : "inviare"} la tua partecipazione</p>
					</div>
				</div>

				<div className="relative flex gap-3">
					{props.participation && (
						<Button
							variant="danger"
							size="md"
							disabled={uploading}
							onClick={handleDeletion}
							className="!px-6 !py-3"
						>
							Disiscriviti
						</Button>
					)}
					<Button
						variant="gradient"
						size="md"
						disabled={saved || uploading || !formValid}
						onClick={handleChange}
						className={`!px-8 !py-3 ${saved || uploading || !formValid
							? 'bg-surface !text-content-muted cursor-not-allowed shadow-none !border-default'
							: ''
							}`}
					>
						{uploading ? 'Salvataggio...' : 'Salva Modifiche'}
					</Button>
				</div>
			</div>

			{error && (
				<div className="bg-error/10 border border-error/30 text-error p-4 ds-rounded-card text-sm font-medium flex items-center gap-3">
					<InfoIcon size={20} />
					{error}
				</div>
			)}

			<div className="bg-surface-muted/70 backdrop-blur-sm border border-default rounded-md p-6 md:p-10 space-y-8">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
					<div className="space-y-8">
						<label className="block group">
							<span className={LabelClasses}>Nome del Gioco <span className="text-error">*</span></span>
							<input
								type="text"
								value={gameName}
								placeholder="Es. Click The Ball"
								maxLength={128}
								className={InputClasses}
								onChange={(e) => { setGameName(e.target.value); setSaved(false); }}
							/>
						</label>

						<div className="block group">
							<label className="block">
								<div className="flex justify-between items-end mb-2">
									<span className={LabelClasses}>Link Download</span>
									{gameUrl && (
										isUrlValid ?
											<span className="text-success text-[10px] font-bold uppercase tracking-widest bg-success/10 px-2 py-0.5 ds-rounded-sm">Valido</span> :
											<span className="text-error text-[10px] font-bold uppercase tracking-widest bg-error/10 px-2 py-0.5 ds-rounded-sm">URL Non Valido</span>
									)}
								</div>
								<input
									type="text"
									maxLength={256}
									value={gameUrl}
									placeholder="https://tuosito.com/download.zip"
									className={`${InputClasses} ${gameUrl && !isUrlValid ? 'border-error/50 focus:border-error/50 focus:ring-error/50' : ''}`}
									onChange={(e) => { setGameUrl(e.target.value); setSaved(false); }}
								/>
							</label>
							<p className="text-xs text-content-muted mt-2 flex items-start gap-1.5">
								<InfoIcon size={14} className="shrink-0 mt-0.5" />
								Puoi iscriverti ora e inserire il link del gioco in un secondo momento, ma ricordati di farlo prima della scadenza della competizione!
							</p>
						</div>

						<label className="block group">
							<div className="flex justify-between items-end mb-2">
								<span className={LabelClasses}>Descrizione Breve <span className="text-error">*</span></span>
								<span className="text-xs font-mono text-content-muted">{gameShortDesc.length}/256</span>
							</div>
							<textarea
								value={gameShortDesc}
								maxLength={256}
								rows={3}
								placeholder="Una breve descrizione del gioco o frase d'effetto"
								className={`${InputClasses} resize-none`}
								onChange={(e) => { setGameShortDesc(e.target.value); setSaved(false); }}
							/>
						</label>
					</div>

					<div className="space-y-8">
						<label className="block">
							<div className="flex justify-between items-end mb-2">
								<span className={LabelClasses}>Copertina <span className="text-error">*</span></span>
								<div className="flex gap-3">
									<span className="text-xs font-mono font-bold text-secondary/80 bg-secondary/10 px-2 py-0.5 ds-rounded-sm">Consigliato 4:3</span>
									<span className="text-xs font-mono text-content-muted py-0.5">Max {Config.maxThumbnailSize / 1024}KB</span>
								</div>
							</div>
							<div className="relative w-full aspect-video ds-rounded-card border-thin border-dashed border-default hover:border-secondary/50 bg-surface-muted flex flex-col items-center justify-center overflow-hidden transition-all group cursor-pointer">
								{gameThumbnail && (!imgError || gameThumbnail.startsWith("data:")) ? (
									<>
										<img
											alt="Anteprima copertina"
											src={gameThumbnail}
											onError={() => {
												if (gameThumbnail && gameThumbnail.startsWith("http")) {
													setImgError(true);
												}
											}}
											className="absolute inset-0 w-full h-full object-contain opacity-100 group-hover:opacity-60 transition-opacity"
										/>
										<div className="absolute top-4 right-4 bg-surface-muted backdrop-blur border border-default text-content p-2.5 ds-rounded-cta ds-shadow-lg flex items-center justify-center transition-all group-hover:scale-110 pointer-events-none">
											<PenIcon size={20} />
										</div>
									</>
								) : (
									<div className="flex flex-col items-center justify-center gap-3 text-content-muted group-hover:text-secondary transition-colors h-full w-full pointer-events-none">
										<ImageIcon size={36} />
										<span className="text-sm font-bold text-center px-4">
											{file ? `File selezionato: ${file.name}` : "Clicca per caricare un'immagine"}
										</span>
									</div>
								)}
								<input
									type="file"
									accept=".png,.jpg,.jpeg,.gif"
									className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
									onChange={(e) => {
										if (e.target.files && e.target.files[0]) {
											handleThumbnail(e.target.files[0]);
										}
									}}
								/>
							</div>
						</label>
					</div>
				</div>

				<div className="pt-4 border-t border-default">
					<label className="block group">
						<div className="flex justify-between items-end mb-2">
							<span className={LabelClasses}>Descrizione Completa</span>
							<span className="text-xs font-mono text-content-muted">{gameDesc.length}/{Config.descriptionMaxLength}</span>
						</div>
						<textarea
							value={gameDesc}
							className={`${InputClasses} min-h-[300px]`}
							placeholder="Descrivi dettagliatamente il tuo gioco. Parla della trama, del gameplay e di ciò che lo rende unico"
							maxLength={Config.descriptionMaxLength}
							onChange={(e) => { setGameDesc(e.target.value); setSaved(false); }}
						/>
					</label>
				</div>

				<div className="flex justify-end pt-2">
					<p className="text-[10px] font-black text-content-muted uppercase tracking-widest">
							<span className="text-error">*</span> campi obbligatori
					</p>
				</div>
			</div>
		</div>
	);
}
