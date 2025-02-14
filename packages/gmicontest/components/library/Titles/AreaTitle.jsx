export const AreaTitle = (props)=>
{
	const { title, inverted } = props;

	let classString = "bg-primary text-white ";

	if(inverted)
		classString = "bg-white text-primary font-bold p-2 border-2 border-primary"

	return (
		<h3 className={"font-bold p-2 "+classString}>
			{title}
		</h3>
	)
}