import React, { useState, useEffect } from "react";
import GMIApi from "../../src/api/GMIApi";
import { MedalsInfo } from "../../src/Medals";
import "moment/locale/it";


//@todo remove "visualizza voti" if not ended
export default function UserInventory(props)
{
	/**@type {number} */
	const userId = props.user
	
	/**@type {[UserMedals, (obj: UserMedals)=> any]} */
	let [medals, setMedals] = useState();
	let [error, setError] = useState();
	let [showMedal, setShowMedal] = useState(null);



	useEffect(()=>
	{
		//fetch contest
		console.debug("fetching user medals", userId);
		GMIApi.getInstance().getUserMedals(userId, (data) =>
		{
			if(data.success)
			{
				let medals = data.medals;
				setMedals(medals);
			}
			else
				setError(data.error || "invalid contest");
		});
	},
	[userId]); 

	

	/**@param {[string, boolean | MedalGame[]]} medal */
	const renderMedal = function(medal, index)
	{
		let name = medal[0];
		let value = medal[1];

		if(Array.isArray(value))
		{
			return value.map((item, subindex)=>
			{
				let info = MedalsInfo[name]

				return(
					<div key={index+"_"+subindex} className="flex flex-col items-center">

						<button 
						 className="medal-button"
						 onMouseOver={()=> setShowMedal(index+"_"+subindex)}
						 onMouseLeave={()=> setShowMedal(null)}
						 onClick={()=> setShowMedal(index+"_"+subindex)}
						>
							
							<img
							 style={{width: "80px"}}
							 src={info.image}
							/>

							<div
							 className={showMedal === (index+"_"+subindex)? "contents" : "hidden"}
							 onClick={(ev)=> 
							 {
								if(showMedal !== null)
								{
									ev.preventDefault()
									ev.stopPropagation()
									setShowMedal(null)
								}
							 }}
							>
								<div
							 	 className="sm:hidden fixed"
								 style={{width: "100vw", height: "100vh", background: "#0000006e", left: "0px", top: "0px", zIndex: "9"}}
								/>

								<div
								 className=
								 {
									"medal-popover "+
									"fixed left-1/2  transform -translate-x-1/2 translate-y-full "+
									"md:absolute md!left-1/2 md:top-full md:!transform md:!-translate-x-1/2 md:translate-y-0"
								 }
								>
									<div className="flex flex-col">
									<b>{item.contest_name}</b>
									{info.desc}
									</div>
								</div>
							</div>

						</button>
					</div>
				)
			})
		}
		else if(value == true)
		{
			let info = MedalsInfo[name];

			return(
				<div key={index} className="flex flex-col items-center">
					<button
					 className="medal-button"
					 onMouseOver={()=> setShowMedal(index)}
					 onMouseLeave={()=> setShowMedal(null)}
					 onClick={()=> setShowMedal(index)}
					>
						
						<img
						 style={{width: "80px"}}
						 src={info.image}
						/>

						<div
						 className={showMedal === index? "contents" : "hidden"}
						 onClick={(ev)=> 
						 {
							if(showMedal !== null)
							{
								ev.preventDefault()
								ev.stopPropagation()
								setShowMedal(null)
							}
						 }}
						>
							<div
							 className="sm:hidden fixed"
							 style={{width: "100vw", height: "100vh", background: "#0000006e", left: "0px", top: "0px", zIndex: "9"}}
							/>

							<div
							 className=
							 {
								"medal-popover "+
								"fixed left-1/2  transform -translate-x-1/2 translate-y-full "+
								"md:absolute md!left-1/2 md:top-full md:!transform md:!-translate-x-1/2 md:translate-y-0"
							 }
							>
								<div className="flex flex-col">
								<b>{info.name}</b>
								{info.desc}
								</div>
							</div>
						</div>

					</button>
				</div>
			)
		}
	}

	const renderInventory = function()
	{
		if(error)
			return (
				<div>ERROR: {error}</div>
			);
	
		if(!medals) 
			return <div>Loading</div>;

		return Object.entries(medals).map(renderMedal)
	}

	
	return (
		<fieldset style={{width: "100%"}}  className="ml-auto md:p-5 p-0 border-2 border-gray h-250">
		<legend className="px-4 text-2xl">Inventario</legend>
			<button id="unfocus" />
			<div className="flex flex-row flex-wrap justify-evenly " style={{gap: "10px"}}>
				{renderInventory()}
			</div>

		</fieldset>
		
	);
}
