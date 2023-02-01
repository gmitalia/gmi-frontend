import React, { useState } from "react";
import Link from "next/link";
import Navbar from "./Navbar";

const Header = () => {
  const [openMenu, setOpenMenu] = useState(false);
  return (
    <header className="flex justify-between p-5 max-w-7xl mx-auto">
      <div className="flex space-x-5 items-center w-full gap-5">
        <Link href={"/"}>
          <img
            className="w-20 object-contain cursor-pointer"
            src="/images/gmi_logo.png"
            alt=""
          />
        </Link>
        <Navbar openMenu={openMenu} setOpenMenu={setOpenMenu} />
        <div className="items-center justify-end">
          <div className="flex justify-center text-white bg-gray-800 px-4 py-1 rounded-full">
            <Link href="https://discord.gg/0wKBBPIbX2r3S32a">
              Entra su Discord
            </Link>
          </div>
        </div>
        <button className="hidden" onClick={() => setOpenMenu(!openMenu)}>
          Menu
        </button>
      </div>
    </header>
  );
};

export default Header;
