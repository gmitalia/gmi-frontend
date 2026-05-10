import { InfoIcon } from "./Icons";

const InfoMessage = (props)=>
{
	return (
		<div
		 className="bg-secondary/10 border border-secondary/20 ds-rounded-card py-4 px-6 text-sm font-medium text-secondary mb-6 flex items-center gap-3"
		 role="alert"
		>
			<InfoIcon size={20} strokeWidth={2.5} />
			<div>{props.children}</div>
		</div>
	);
};

export default InfoMessage;
