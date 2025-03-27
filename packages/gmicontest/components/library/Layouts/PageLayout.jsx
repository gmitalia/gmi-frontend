import React from "react";
import UserButton from "../../UsersList/UserButton";
import ContestList from "./../../../components/Contest/ContestList"

const UserButtonMemo = React.memo(UserButton, ()=> true)
const ContestListMemo = React.memo(ContestList, ()=> true)

export const PageLayout = (props)=>
{
	const { children } = props;


	return (
		<div className="h-full flex flex-grow flex-row bg-backcolor">

			<div className="sticky w-72 h-full  lg:mr-2  lg:inline hidden lg:block">
				<div className="w-full h-full flex flex-col gap-1 ">
				<UserButtonMemo />
				<ContestListMemo />
				</div>
			</div>

			<div className="w-full h-full flex-1 lg:pl-2">
				{children}
			</div>
		</div>
	)
}