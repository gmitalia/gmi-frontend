import { useState } from "react";

export const AwardBadge = (props={award: {name:"", image: undefined, desc:""}, gameId: 0, contestId: 0})=>
{
	const [image, setImage] = useState(undefined)

	let imagePath = typeof props.award.image == "function"? props.award.image(props.contestId) : props.award.image;
	fetch(imagePath).then(response=>
	{
		if(response.status != 404)
			setImage(undefined)
		else
			setImage(image)
	})

	return(
		<div
		 style={{width: "300px", height: "50px", outline: image? "" : "1px solid"}}
		 className="flex justify-center items-center"
		>
			{image? 
				<img src={image} alt={props.award.name}/> 
			: 
				<div className="p-5">{props.award.name}</div>
			}
		</div>
	)
}