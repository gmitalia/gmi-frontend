import { ButtonSecondary } from "../library/Buttons/ButtonSecondary";


export const Menu = (props)=>
{
	const { children, onClose } = props;


	return (
		<div className="bg-black/50 absolute top-0 left-0 w-full min-h-screen h-screen" onClick={onClose}>
			<div className="bg-white w-fit min-h-screen h-screen overflow-auto">
				<div className="p-5">
					<ButtonSecondary icon="fa fa-times fa-2x" onClick={onClose} />
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