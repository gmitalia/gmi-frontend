export const ButtonPrimary = (props)=>
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
		 className="h-12 bg-primary hover:bg-white text-white font-semibold hover:text-primary py-2 px-4 border border-black-500 hover:border-black-700"
		 onClick={onClickHandler}
		>
			{icon  && <i className={icon}></i>}
			{title && <span>{title}</span>}
		</button>
	)
}