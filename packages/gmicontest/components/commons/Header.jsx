import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { mainSlice } from "../../src/slices/mainSlice";
import { ButtonSecondary } from "../library/Buttons/ButtonSecondary";
import Portal from "../library/portal";
import ContestList from "./../Contest/ContestList";
import { Menu } from "./Menu";
import { UserInfo } from "./UserInfo";
import { basePath } from "../../next.config";


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

				<div className="p-5 flex flex-row items-center justify-between">
					<div className="flex flex-row items-center justify-between">
						<div className="d-block lg:hidden mr-2">
							<ButtonSecondary
							 icon="fa fa-bars fa-2x"
							 onClick={onClickMenu}
							/>
						</div>
						<div>
							<img
							 className="w-24"
							 src={`${basePath}/img/logo.png`}
							/>
						</div>
					</div>
					<div>
						<UserInfo />
					</div>
				</div>

				<div className="lg:hidden w-full h-full">
					{showMenu &&
					(
						<Portal>
							<Menu onClose={onCloseMenu}>
								<ContestList />
							</Menu>
						</Portal>
					)}
					
				</div>
			</header>
		</>
	)
}
