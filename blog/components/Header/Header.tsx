import React, { useState } from "react";
import Link from "next/link";
import Navbar from "./Navbar";

const Header = () => {
  const [openMenu, setOpenMenu] = useState(false);
  return (
    <header className="md:flex md:justify-between p-5 max-w-7xl mx-auto bg-white">
      <div className="block md:flex md:space-x-5 items-center w-full gap-5">
        <div className="flex items-center space-x-5">
          <Link href={"/"}>
            <img
              className="w-20 object-contain cursor-pointer"
              src="/images/gmi_logo.png"
              alt=""
            />
          </Link>
          <span className="text-3xl hidden lg:block ">GameMaker Italia</span>
        </div>
        <Navbar openMenu={openMenu} setOpenMenu={setOpenMenu} />

        <button className="hidden" onClick={() => setOpenMenu(!openMenu)}>
          Menu
        </button>
      </div>
    </header>
  );
};

export default Header;
