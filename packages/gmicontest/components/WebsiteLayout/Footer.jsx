import { useSelector } from "react-redux";
import { CogIcon } from "../commons/Icons";

export const Footer = (props)=>
{
	/** @type {{user: AccountInfo, success: boolean}} */
	let userInfo = useSelector(root => root.auth.userInfo);
	const user = userInfo && userInfo.success ? userInfo.user : undefined;

	return (
		<footer className="mt-2 border-t ds-border-subtle bg-surface-solid">
			<div className="mx-auto max-w-screen-2xl px-4 py-6 sm:px-6 lg:px-8 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between text-sm ds-text-muted">
				<div className="flex items-center gap-3">
					<span className="font-semibold ds-text-content">GameMaker Italia</span>

					{user?.admin && (
						<a
							href="https://gmitalia.altervista.org/competizioni/admin/"
							className="flex items-center gap-1.5 text-accent hover:text-accent/80 transition-colors"
							target="_blank"
							rel="noreferrer"
						>
							<CogIcon size={16} />
							<span className="font-medium">Amministrazione</span>
						</a>
					)}
				</div>

				<span>Portale competizioni della community italiana di GameMaker</span>
			</div>
		</footer>
	)
}
