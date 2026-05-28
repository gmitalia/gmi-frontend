import React, { useEffect, useRef, useState } from "react"
import { prosList, consList } from "../../src/Constants"
import { Button } from "../commons/Button";
import { marked } from "../../src/marked"

const VoteFormValidationRules = {
	prosMax: function (pros) { return pros.length > 3; },
	consMax: function (cons) { return cons.length > 3; },
	prosConsMin: function (pros, cons) { return pros.length + cons.length < 2 }
}

export default function VoteForm(props) {
	const [score, setScore] = useState(props.score)
	const [pros, setPros] = useState(props.pros)
	const [cons, setCons] = useState(props.cons)
	const [comment, setComment] = useState(props.comment)
	const [voted, setVoted] = useState(props.voted)
	const [saved, setSaved] = useState(true)
	const [formError, setFormError] = useState(null);
	const [isPreviewFocused, setIsPreviewFocused] = useState(false);

	const refTextarea = useRef();

	function changeScore(event) {
		setScore(Math.max(0, Math.min(100, event.target.value)))
		setSaved(false)
	}

	function changeComment(event) {
		setComment(event.target.value)
		setSaved(false)
	}

	function addPros() {
		if (pros.length >= 3)
			return;

		setPros([...pros, 0])
		setSaved(false)

	}

	function deletePros(index) {
		let newPros = [...pros]
		newPros.splice(index, 1)
		setPros(newPros)
		setSaved(false)
	}

	function changePros(event, index) {
		let newPros = [...pros]
		newPros[index] = event.target.value
		setPros(newPros)
		setSaved(false)
	}

	function addCons() {
		if (cons.length >= 3)
			return;

		setCons([...cons, 0])
		setSaved(false)
	}

	function deleteCons(index) {
		let newCons = [...cons]
		newCons.splice(index, 1)
		setCons(newCons)
		setSaved(false)
	}

	function changeCons(event, index) {
		let newCons = [...cons]
		newCons[index] = event.target.value
		setCons(newCons)
		setSaved(false)
	}

	function formValidation(data) {
		const { score, pros, cons, comment, voted } = data;

		setFormError(undefined);
		if (VoteFormValidationRules.prosConsMin(pros, cons)) { setFormError("Inserire almeno 2 pro/contro"); return false }
		if (VoteFormValidationRules.prosMax(pros)) { setFormError("impossibile inserire più di 3 pro"); return false; }
		if (VoteFormValidationRules.consMax(cons)) { setFormError("impossibile inserire più di 3 contro"); return false; }

		return true;
	}

	function onSave() {
		setVoted(true)

		const data =
		{
			score: score,
			pros: pros,
			cons: cons,
			comment: comment,
			game_id: props.game_id,
			voted: voted,
		};

		if (formValidation(data) == false)
			return null;

		props.onChange(data, props.index, (success) => setSaved(success))
	}

	const prosOptions = prosList.map((elem, i) => (
		<option key={i} value={i}>{elem}</option>
	));

	const consOptions = consList.map((elem, i) => (
		<option key={i} value={i}>{elem}</option>
	));

	const getScoreColor = (score) => {
		if (score >= 80) return 'from-emerald-500 to-teal-500';
		if (score >= 60) return 'from-cyan-500 to-blue-500';
		if (score >= 40) return 'from-amber-500 to-orange-500';
		return 'from-red-500 to-pink-500';
	};

	return (
		<div className="space-y-6">
			{/* Score Section */}
			<div className="p-6 ds-rounded-cta">
				<div className="flex flex-col lg:flex-row lg:items-center gap-6">
					{/* Score Input */}
					<div className="flex-1">
						<label className="text-sm font-semibold ds-text-content mb-3 flex items-center gap-2">
							<i className="fa fa-star text-secondary" />
							Punteggio
						</label>
						<div className="flex items-center gap-4">
							<div className="relative">
								<input
									type="number"
									min="0"
									max="100"
									value={score}
									onChange={changeScore}
									className="w-24 h-14 text-2xl font-bold text-center ds-surface border border-default ds-rounded-cta focus:border-secondary/50 focus:outline-none transition-colors ds-text-content"
								/>
								<span className="absolute right-2 top-1/2 -translate-y-1/2 ds-text-muted text-sm">/100</span>
							</div>

							{/* Slider */}
							<div className="flex-1">
								<input
									type="range"
									min="0"
									max="100"
									value={score}
									onChange={changeScore}
									className="w-full h-2 ds-surface ds-rounded-sm appearance-none cursor-pointer accent-secondary"
									style={{
										background: `linear-gradient(to right, var(--ds-color-secondary) 0%, var(--ds-color-secondary) ${score}%, rgba(148,163,184,0.2) ${score}%, rgba(148,163,184,0.2) 100%)`
									}}
								/>
							</div>
						</div>
					</div>

					{/* Save Section */}
					<div>
						<Button
							variant="primary"
							size="md"
							disabled={saved}
							onClick={onSave}
							className="!px-6"
						>
							<i className="fa fa-save mr-2" />
							{saved ? 'Salvato' : 'Salva'}
						</Button>
					</div>
				</div>
				{/* Error Message */}
				{formError && (
					<div className="mt-4 p-3 ds-rounded-sm bg-error/10 border border-error/30 flex items-center gap-2 text-error">
						<i className="fa fa-exclamation-triangle" />
						<span className="text-sm">{formError}</span>
					</div>
				)}
			</div>

			{/* Comment Section */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
				{/* Editor */}
				<div className="p-4 ds-rounded-cta">
					<label className="text-sm font-semibold ds-text-content mb-3 flex items-center gap-2">
						<i className="fa fa-edit text-secondary" />
						Commento
						<span className="text-xs ds-text-muted font-normal">(Markdown supportato)</span>
					</label>
					<textarea
						defaultValue={comment}
						onChange={changeComment}
						rows={10}
						placeholder="Scrivi la tua recensione dettagliata del gioco..."
						className="w-full p-4 ds-surface border border-default ds-rounded-cta resize-none focus:border-secondary/50 focus:outline-none transition-colors ds-text-content placeholder:text-content-muted/40"
						onScroll={(e) => refTextarea.current && (refTextarea.current.scrollTop = e.target.scrollTop)}
						onWheel={(e) => refTextarea.current && (refTextarea.current.scrollTop = e.target.scrollTop)}
					/>
				</div>

				{/* Preview */}
				<div className="p-4 ds-rounded-cta">
					<label className="text-sm font-semibold ds-text-content mb-3 flex items-center gap-2">
						<i className="fa fa-eye text-secondary" />
						Anteprima
					</label>
					<div
						ref={refTextarea}
						className="w-full p-4 ds-surface border border-default ds-rounded-cta overflow-y-auto h-[280px] prose prose-sm max-w-none"
						dangerouslySetInnerHTML={{
							__html: marked.parse(comment.replaceAll("\n", "⠀⠀\n"), { breaks: true })
						}}
					/>
				</div>
			</div>

			{/* Pros & Cons Section */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{/* Pros */}
				<div className="p-4 ds-rounded-cta border-l-4 border-l-success/30">
					<div className="flex items-center justify-between mb-4">
						<label className="text-sm font-semibold ds-text-content flex items-center gap-2">
							<i className="fa fa-thumbs-up text-success" />
							Pro
							<span className="text-xs ds-text-muted font-normal">({pros.length}/3)</span>
						</label>
						<Button
							variant="primary"
							size="sm"
							disabled={pros.length >= 3}
							onClick={addPros}
						>
							<i className="fa fa-plus mr-1" /> Aggiungi
						</Button>
					</div>

					<div className="space-y-2">
						{pros.map((elem, index) => (
							<div key={index} className="flex items-center gap-2">
								<select
									value={elem}
									onChange={(e) => changePros(e, index)}
									className="ds-select flex-1"
								>
									{prosOptions}
								</select>
								<button
									onClick={() => deletePros(index)}
									className="w-8 h-8 ds-rounded-sm ds-surface-elevated text-error hover:bg-error/20 transition-colors flex items-center justify-center"
								>
									<i className="fa fa-times" />
								</button>
							</div>
						))}
						{pros.length === 0 && (
							<p className="text-sm ds-text-muted text-center py-4">
								Nessun pro aggiunto. Clicca "Aggiungi" per iniziare.
							</p>
						)}
					</div>
				</div>

				{/* Cons */}
				<div className="p-4 ds-rounded-cta border-l-4 border-l-error/30">
					<div className="flex items-center justify-between mb-4">
						<label className="text-sm font-semibold ds-text-content flex items-center gap-2">
							<i className="fa fa-thumbs-down text-error" />
							Contro
							<span className="text-xs ds-text-muted font-normal">({cons.length}/3)</span>
						</label>
						<Button
							variant="primary"
							size="sm"
							disabled={cons.length >= 3}
							onClick={addCons}
						>
							<i className="fa fa-plus mr-1" /> Aggiungi
						</Button>
					</div>

					<div className="space-y-2">
						{cons.map((elem, index) => (
							<div key={index} className="flex items-center gap-2">
								<select
									value={elem}
									onChange={(e) => changeCons(e, index)}
									className="ds-select flex-1"
								>
									{consOptions}
								</select>
								<button
									onClick={() => deleteCons(index)}
									className="w-8 h-8 ds-rounded-sm ds-surface-elevated text-error hover:bg-error/20 transition-colors flex items-center justify-center"
								>
									<i className="fa fa-times" />
								</button>
							</div>
						))}
						{cons.length === 0 && (
							<p className="text-sm ds-text-muted text-center py-4">
								Nessun contro aggiunto. Clicca "Aggiungi" per iniziare.
							</p>
						)}
					</div>
				</div>
			</div>

			{/* Validation Hint */}
			<div className="text-center">
				<p className="text-xs ds-text-muted">
					<i className="fa fa-info-circle mr-1" />
					Inserire almeno 2 pro/contro in totale, massimo 3 per categoria
				</p>
			</div>
		</div>
	);
}
