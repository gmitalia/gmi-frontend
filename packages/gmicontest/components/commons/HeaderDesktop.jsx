import React from "react";
import { basePath } from "../../next.config";
import ContestList from "../Contest/ContestList";
import { Menu } from "./Menu";
import { UserInfo } from "./UserInfo";

export default function HeaderDesktop(props) {

    return <>
        <header className="sticky top-0 bg-white">
            <div className="m-5 flex flex-row items-center justify-between">
                <div className="flex flex-row items-center justify-between">
                    <div>
                        <img className="w-24" src={`${basePath}/img/logo.png`} />
                    </div>
                </div>
                <div>
                    <UserInfo />
                </div>
            </div>
            <Menu>
                <ContestList />
            </Menu>
        </header>
    </>
}
