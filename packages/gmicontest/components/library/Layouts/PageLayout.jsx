import UserButton from "../../Users/UserButton";
import ContestList from "./../../../components/Contest/ContestList"

export const PageLayout = (props)=>
{
	const { children } = props;

	return (
		<div className="flex flex-grow flex-column bg-backcolor">
			<div className="w-72 lg:mr-2  lg:inline flex flex-col gap-1">
				<UserButton />
				<ContestList />
			</div>
			<div className="flex-1 lg:ml-2">
				{children}
			</div>
		</div>
	)
}