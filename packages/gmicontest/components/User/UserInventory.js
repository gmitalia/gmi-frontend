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
				let medals = data.medals[0];
				
				Object.entries(medals).forEach(o=>
				{
					medals[o[0]] = o[1] == "1"? true : false
				})
				setMedals(medals);
			}
			else
				setError(data.error || "invalid contest");
		});
	},
	[userId]); 

	if(error)
		return (
			<div>
				<div>ERROR: {error}</div>
			</div>
		);

	if(!medals) 
		return <div>Loading</div>;


	return (
		
		<fieldset style={{width: "100%", height: "250px"}}  className="ml-auto p-5 border-2 border-gray">
		<legend className="px-4 text-2xl">Inventario</legend>
			
			<div className="flex flex-row flex-wrap justify-evenly  gap-10 lg:gap-20">
				{/**
				 * {Object.entries(medals).map((medal, index)=>
				(
					medal[1] &&
					(
						<div key={index} className="flex flex-col items-center">
							<img
							 style={{width: "80px"}}
							 src={MedalsInfo[medal[0]].image}
							 title={MedalsInfo[medal[0]].name}
							/>
						</div>
					)
				))}
				 */}
			</div>

		</fieldset>
		
	);
}
