export const ButtonSecondary = (props)=>
{
	const { icon, title, onClick } = props;


	const onClickHandler = (event)=>
	{
		event.preventDefault();
		event.stopPropagation();

		if(onClick)
			onClick(event)
	}

	return (
		<button
		 className="h-12 bg-transparent hover:bg-black text-black-700 font-semibold hover:text-white py-2 px-4 border border-black-500 hover:border-transparent"
		 onClick={onClickHandler}
		>
			{icon  && <i className={icon}></i>}
			{title && <span>{title}</span>}
		</button>
	)
}