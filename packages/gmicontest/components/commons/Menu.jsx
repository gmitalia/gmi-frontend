import { ButtonSecondary } from "../library/Buttons/ButtonSecondary";


export const Menu = (props)=>
{
	const { children, onClose } = props;


	return (
		<div className="bg-black/50 absolute top-0 left-0 w-full min-h-full h-full" onClick={onClose} style={{zIndex: 99999}}>
			<div className="bg-white w-fit min-h-full h-full overflow-auto">
				<div className="h-full p-5 overflow-y-hidden flex flex-col">
					<ButtonSecondary icon="fa fa-bars fa-2x" onClick={onClose} />
					<div className="my-4">
						<h1 className="text-lg font-bold">GameMaker Italia</h1>
						<span>Giochi delle competizioni annuali</span>
					</div>
					{children}
				</div>
			</div>
		</div>
	)
}