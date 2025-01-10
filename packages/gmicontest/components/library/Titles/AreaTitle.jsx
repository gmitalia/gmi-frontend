export const AreaTitle = (props)=>
{
	const { title } = props;

	return (
		<h3 className="bg-primary text-white font-bold p-2">
			{title}
		</h3>
	)
}