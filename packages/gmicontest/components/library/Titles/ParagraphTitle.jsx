export const ParagraphTitle = (props)=>
{
	const { title } = props;

	return (
		<h2 className="text-primary text-2xl font-bold mb-2">
			{title}
		</h2>
	)
}