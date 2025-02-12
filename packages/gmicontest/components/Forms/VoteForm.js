import React, { useEffect, useRef, useState } from "react"
import { prosList, consList } from "../../src/Constants"
import StyledButton from "../commons/StyledButton";
import { marked } from "../../src/marked"

const VoteFormValidationRules =
{
	prosMax: function(pros) { return pros.length > 3; },
	consMax: function(cons) { return cons.length > 3; },
	prosConsMin: function(pros, cons) { return pros.length + cons.length < 2 }
}

export default function VoteForm(props)
{
	const [score, setScore] = useState(props.score)
	const [pros, setPros] = useState(props.pros)
	const [cons, setCons] = useState(props.cons)
	const [comment, setComment] = useState(props.comment)
	const [voted, setVoted] = useState(props.voted)
	const [saved, setSaved] = useState(true)
	const [textareaInfo, setTextareaInfo] = useState({size: "", scroll: 0})
	const [formError, setFormError] = useState(null);

	const refTextarea = useRef();

	function changeScore(event)
	{
		setScore(Math.max(0, Math.min(100, event.target.value)))
		setSaved(false)
	}

	function changeComment(event)
	{
		setComment(event.target.value)
		setSaved(false)
	}

	function addPros()
	{
		if(pros.length >= 3)
			return;
		
		setPros([...pros, 0])
		setSaved(false)

	}

	function deletePros(index)
	{
		let newPros = [...pros]
		newPros.splice(index, 1)
		setPros(newPros)
		setSaved(false)
	}

	function changePros(event, index)
	{
		let newPros = [...pros]
		newPros[index] = event.target.value
		setPros(newPros)
		setSaved(false)
	}

	function addCons()
	{
		if(cons.length >= 3)
			return;

		setCons([...cons, 0])
		setSaved(false)
	}

	function deleteCons(index)
	{
		let newCons = [...cons]
		newCons.splice(index, 1)
		setCons(newCons)
		setSaved(false)
	}

	function changeCons(event, index)
	{
		let newCons = [...cons]
		newCons[index] = event.target.value
		setCons(newCons)
		setSaved(false)
	}

	function formValidation(data)
	{
		const { score, pros, cons, comment, voted } = data;

		setFormError(undefined);
		if(VoteFormValidationRules.prosConsMin(pros, cons)) { setFormError("Inserire almeno 2 pro/contro"); return false }
		if(VoteFormValidationRules.prosMax(pros)) { setFormError("impossibile inserire più di 3 pro"); return false; }
		if(VoteFormValidationRules.consMax(cons)) { setFormError("impossibile inserire più di 3 contro"); return false; }

		return true;
	}

	function onSave()
	{
		setVoted(true)

		const data = 
		{
			score: 	score,
			pros: 	pros,
			cons: 	cons,
			comment: comment,
			game_id: props.game_id,
			voted: 	voted,
		};

		if(formValidation(data) == false)
			return null;

		props.onChange(data, props.index, (success)=> setSaved(success))
	}

	let prosOptions = prosList.map((elem, i)=>
	(
		<option
		 key={i}
		 value={i}
		>
			{elem}
		</option>
	))

	let prosElements = pros.map((elem, index)=>
	(
		<div key={index} className="m-2 border-b">
			<select type="button" value={elem} onChange={(e)=> changePros(e, index)} >
				{prosOptions}
			</select>
			<input className="px-3" type="button" value=" X " onClick={()=> deletePros(index)} />
		</div>
	))

	let consOptions = consList.map((elem, i)=>
	(
		<option key={i} value={i} >
			{elem}
		</option>
	))

	let consElements = cons.map((elem, index)=>
	(
		<div key={index} className="m-2 border-b">
			<select type="button" value={elem} onChange={(e)=> changeCons(e, index)} >
				{consOptions}
			</select>
			<input type="button" value=" X " onClick={()=> deleteCons(index)} />
		</div>
	))


	return (
		<div >
			<div className="my-3">
				<label className="h6">Voto</label>
				<div>
					<input type="number" className="pl-2 border" min="0" max="100" value={score} onChange={changeScore} />
					<input type="range" className="ml-3" min="0" max="100" value={score} onChange={changeScore} />
				</div>
			</div>

			<div className="my-3">
				<div className="h6">Commento</div>
				<div className="flex flex-row gap-1">

					<textarea
					 style={{width: "50%"}}
					 className="p-3 border"
					 defaultValue={comment}
					 onChange={changeComment}
					 rows={8}
					 onScroll={(e)=> setTextareaInfo({size: textareaInfo.size, scroll: e.target.scrollTop})}
					 onWheel={(e)=> setTextareaInfo({size: textareaInfo.size, scroll: e.target.scrollTop})}
					 //onmousedown={(e)=>setTextareaInfo({size: e.target.offsetHeight, scroll: textareaInfo.scroll})}
  					 onMouseUp={(e)=> {refTextarea.current.scrollTop = textareaInfo.scroll; setTextareaInfo({size: e.target.offsetHeight, scroll: textareaInfo.scroll})}}
					/>

					<div
					 ref={refTextarea}
					 style={{width: "50%", height: textareaInfo.size+"px"}}
					 className="vote-tables p-3 border overflow-y-scroll"
					 dangerouslySetInnerHTML={{__html: marked.parse(comment.replaceAll("\n", "⠀⠀\n"), {breaks: true})}}
					/>
				</div>
			</div>

			<div className="my-3 flex flex-row">
				<div className="border p-2 mb-2 mr-2">
					<div className="flex flex-col grow">
						<div className="h6" >Pro</div>
						{prosElements}
						{/* <input type="button" className="bg-gray" value="Aggiungi" onClick={addPros} /> */}
					</div>
					<StyledButton disabled={saved} onClick={addPros}><i className="fa fa-plus fa-1x" /></StyledButton>
				</div>
				<div className="border p-2 mb-2 ml-2">
					<div className="flex flex-col">
						<div className="h6">Contro</div>
						{consElements}
						{/* <input type="button" className="bg-gray" value="Aggiungi" onClick={addCons} /> */}
					</div>
					<StyledButton disabled={saved} onClick={addCons}><i className="fa fa-plus fa-1x" /></StyledButton>
				</div>
			</div>
			<div className="my-3 row">
				<div>
					<StyledButton disabled={saved} onClick={onSave}>Salva</StyledButton>
					<span className="ml-3" style={{ color: "green" }}>{saved && "Salvato"}</span>
					<span className="ml-3" style={{ color: "red" }}>{formError}</span>
				</div>
			</div>
		</div >
	)
}
