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
						<button className="medal-button">
						<img
						 style={{width: "80px"}}
						 src={info.image}
						/>
						<div className="medal-popover">
							<b>{item.contest_name}</b>
							{info.desc}
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
					<button className="medal-button">
						<img
						 style={{width: "80px"}}
						 src={info.image}
						/>
						<div className="medal-popover">
							<b>{info.name}</b>
							{info.desc}
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
		<fieldset style={{width: "100%"}}  className="ml-auto p-5 border-2 border-gray h-250">
		<legend className="px-4 text-2xl">Inventario</legend>
		
			<div className="flex flex-row flex-wrap justify-evenly " style={{gap: "10px"}}>
				{renderInventory()}
			</div>

		</fieldset>
		
	);
}
