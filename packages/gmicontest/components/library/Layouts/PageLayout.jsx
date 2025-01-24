import React from "react";
import UserButton from "../../UsersList/UserButton";
import ContestList from "./../../../components/Contest/ContestList"

const UserButtonMemo = React.memo(UserButton, ()=> true)
const ContestListMemo = React.memo(ContestList, ()=> true)

export const PageLayout = (props)=>
{
	const { children } = props;


	return (
		<div className="flex flex-grow flex-column bg-backcolor">
			<div className="fixed w-72 lg:mr-2  lg:inline flex flex-col gap-1 hidden lg:block">
				<UserButtonMemo />
				<ContestListMemo />
			</div>
			<div className="w-full flex-1 lg:ml-72 lg:pl-2">
				{children}
			</div>
		</div>
	)
}