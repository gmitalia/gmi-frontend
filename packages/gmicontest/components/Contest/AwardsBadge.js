import { useState } from "react";

export const AwardBadge = (props = { award: { name: "", image: undefined, desc: "" }, gameId: 0, contestId: 0 }) => {
	const [image, setImage] = useState(null)

	let imagePath = typeof props.award.image == "function" ? props.award.image(props.contestId) : props.award.image;

	if(image === null) {
		fetch(imagePath).then(response => {
			if(response.status == 404)
				setImage(undefined)
			else
				response.blob().then((o => setImage(URL.createObjectURL(o))))

		})
	}

	const createHex = function () 
	{
		var hexCode1 = "";
		var hexValues1 = "0123456789abcdef";

		for(var i = 0; i < 6; i++) {
			hexCode1 += hexValues1.charAt(Math.floor(Math.random() * hexValues1.length));
		}
		return hexCode1;
	}

	const generate = function () 
	{

		var deg = Math.floor(Math.random() * 360);

		var gradient = "linear-gradient(" + deg + "deg, " + "#" + createHex() + ", " + "#" + createHex() + ")";

		return gradient;

	}


	return (
		<div
		 style={{ width: "300px", height: "50px", outline: image ? "" : "1px solid" }}
		 className="flex justify-center items-center"
		>
			{image ?
			(
				<img src={image} alt={props.award.name} />
			)
			:
			(
				<div
				 className="p-5 w-full h-full flex justify-center items-center font-bold text-outline"
				 style={{background: generate(), fontSize: "1.5rem"}}
				>
					{props.award.name}
				</div>
			)}
		</div>
	)
}