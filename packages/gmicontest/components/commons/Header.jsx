import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { mainSlice } from "../../src/slices/mainSlice";
import { ButtonSecondary } from "../library/Buttons/ButtonSecondary";
import Portal from "../library/portal";
import ContestList from "./../Contest/ContestList";
import { Menu } from "./Menu";
import { UserInfo } from "./UserInfo";
import { basePath } from "../../next.config";
import Link from "next/link";
import UserButton from "../UsersList/UserButton";


const UserButtonMemo = React.memo(UserButton, ()=> true)
const ContestListMemo = React.memo(ContestList, ()=> true)
export default function Header(props)
{
	const showMenu = useSelector(root => root.main.showMenu)
	const dispatch = useDispatch();

	const onClickMenu = (event)=>
	{
		dispatch(mainSlice.actions.showMenu())
		document.getElementsByTagName("body")[0].style.overflow = "hidden"
	}
	const onCloseMenu = (event)=>
	{
		dispatch(mainSlice.actions.hideMenu())
		document.getElementsByTagName("body")[0].style.overflow = null
	}

	return (
		<>
			<header className="sticky top-0 bg-white z-10">

				<div className="p-5 py-2 flex flex-row items-center justify-between">
					<div className="flex flex-row items-center justify-between">
						<div className="d-block lg:hidden mr-2">
							<ButtonSecondary
							 icon="fa fa-bars fa-2x"
							 onClick={onClickMenu}
							/>
						</div>
						<div>
							<Link href={"/"} >
								<a><img
								 className="w-24 cursor-pointer"
								 src={`${basePath}/img/logo.png`}
								/></a>
							</Link>
						</div>
					</div>
					<div>
						<UserInfo />
					</div>
				</div>

				<div className="lg:hidden w-full h-full" style={{pointerEvents: "none"}}>
					{showMenu &&
					(
						<Portal>
							<Menu onClose={onCloseMenu}>
							<div className="w-full h-full flex flex-col gap-1 ">
								<UserButtonMemo />
								<ContestListMemo />
							</div>
							</Menu>
						</Portal>
					)}
					
				</div>
			</header>
		</>
	)
}
