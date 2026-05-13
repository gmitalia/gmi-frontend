export const AreaTitle = (props)=>
{
	const { title, inverted } = props;

	let classString = "bg-primary text-content ";

	if(inverted)
		classString = "bg-surface-solid text-content font-bold p-2 border-thin border-default"

	return (
		<h3 className={"font-bold p-2 "+classString}>
			{title}
		</h3>
	)
}