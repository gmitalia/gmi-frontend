import React from "react";
import Link from "next/link";

type NavbarProps = {
  openMenu: boolean;
  setOpenMenu: React.Dispatch<React.SetStateAction<boolean>>;
};

const Navbar = ({ openMenu, setOpenMenu }: NavbarProps) => {
  return (
    <ul
      className={`ml-0 text-xl flex flex-col items-start md:flex-row md:justify-end md:items-center space-x-5 flex-1 z-1 md:z-auto absolute md:static w-full bg-white left-0`}
    >
      <li className="border-transparent hover:underline decoration-2 duration-500 mx-4 my-6 md:my-0">
        <Link href="/competizioni">Competizioni</Link>
      </li>
      <li className="border-transparent hover:underline decoration-2  duration-500 mx-4 my-6 md:my-0">
        <Link href="https://gmitalia.altervista.org/forum">Forum</Link>
      </li>
      <li className="border-transparent hover:underline decoration-2  duration-500 mx-4 my-6 md:my-0">
        <Link href="https://gmiscores.altervista.org">Classifiche</Link>
      </li>
      <li className="border-transparent hover:underline decoration-2  duration-500 mx-4 my-6 md:my-0">
        <Link href="https://gmitalia.altervista.org/site/risorse-2/">
          Risorse
        </Link>
      </li>
      <li className=" mx-4 my-6 md:my-0">
        <div className="items-center justify-end">
          <div className="flex justify-center text-white bg-gray-800 px-4 py-1 rounded-full">
            <Link href="https://discord.gg/0wKBBPIbX2r3S32a">
              Entra su Discord
            </Link>
          </div>
        </div>
      </li>
    </ul>
  );
};

export default Navbar;
