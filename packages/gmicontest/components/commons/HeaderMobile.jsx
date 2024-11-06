import React, { useState } from "react";
import { basePath } from "../../next.config";
import ContestList from "../Contest/ContestList";
import { ButtonSecondary } from "../library/Buttons/ButtonSecondary";
import { Menu } from "./Menu";
import { UserInfo } from "./UserInfo";

export default function HeaderMobile(props) {

    const [menu, setMenu] = useState(false)

    const onClickMenu = () => {
        setMenu(!menu);
    }


    return <>
        <header className="sticky top-0 bg-white">
            <div className="m-5 flex flex-row items-center justify-between">
                <div className="flex flex-row items-center justify-between">
                    <div className="mr-2">
                        <ButtonSecondary icon="fa fa-bars fa-2x" onClick={onClickMenu} />
                    </div>
                    <div>
                        <img className="w-24" src={`${basePath}/img/logo.png`} />
                    </div>
                </div>
                <div>
                    <UserInfo />
                </div>
            </div>
            {menu ? <Menu>
                <ContestList />
            </Menu> : <></>}
        </header>
    </>
}
