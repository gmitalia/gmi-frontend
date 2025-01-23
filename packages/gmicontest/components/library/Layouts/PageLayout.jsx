import UserButton from "../../Users/UserButton";
import ContestList from "./../../../components/Contest/ContestList"

export const PageLayout = (props)=>
{
	const { children } = props;

	return (
		<div className="flex flex-grow flex-column bg-backcolor">
			<div className="fixed w-72 lg:mr-2  lg:inline flex flex-col gap-1 hidden lg:block">
				<UserButton />
				<ContestList />
			</div>
			<div className="w-full flex-1 lg:ml-72 lg:pl-2">
				{children}
			</div>
		</div>
	)
}