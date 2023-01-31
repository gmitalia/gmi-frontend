import React from "react";
import Link from "next/link";
import Navbar from "./Navbar";

const Header = () => {
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
        <Navbar />
        <div className="flex items-center justify-center text-white bg-gray-800 px-4 py-1 rounded-full ml-auto">
          <Link href="https://discord.gg/0wKBBPIbX2r3S32a">
            Entra su Discord
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
