import { Button } from "../commons/Button";


export const Menu = (props)=>
{
	const { children, onClose } = props;


	return (
		<div className="bg-black/50 backdrop-blur-sm fixed top-0 left-0 w-full min-h-full h-full" onClick={onClose} style={{zIndex: 99999}}>
			<div className="ds-surface w-[88vw] max-w-sm min-h-full h-full overflow-auto shadow-2xl">
				<div className="h-full p-5 flex flex-col">
					<Button variant="secondary" size="md" icon="fa fa-bars fa-2x" onClick={onClose} />
					<div className="my-4">
						<h1 className="text-lg font-bold">GameMaker Italia</h1>
						<span className="ds-text-muted">Archivio competizioni e giochi</span>
					</div>
					{children}
				</div>
			</div>
		</div>
	)
}
