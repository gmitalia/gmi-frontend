const InfoMessage = (props)=>
{
	return (
		<div
		 className="bg-blue-100 rounded-lg py-5 px-6 text-base text-blue-700 mb-3"
		 role="alert"
		>
			{props.children}
		</div>
	);
};

export default InfoMessage;
