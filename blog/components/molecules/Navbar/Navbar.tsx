import React, { useEffect, useState } from "react";
import Link from "next/link";

type NavbarProps = {
  openMenu: boolean;
  setOpenMenu: React.Dispatch<React.SetStateAction<boolean>>;
};

const Navbar = ({ openMenu, setOpenMenu }: NavbarProps) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window !== undefined) {
      const updateWindowDimensions =
        window.innerWidth < 768
          ? () => setIsMobile(true)
          : () => setIsMobile(false);
      updateWindowDimensions();
      window.addEventListener("resize", updateWindowDimensions);

      return () => window.removeEventListener("resize", updateWindowDimensions);
    }
  });

  return (
    <>
      {((isMobile && openMenu) || !isMobile) && (
        <ul
          className={`ml-0 text-md flex flex-col items-start md:flex-row md:justify-end md:items-center space-x-5 flex-1 z-1 md:z-auto absolute md:static w-full bg-white left-0`}
        >
          <li className="border-transparent hover:underline decoration-2 duration-500 my-6 ml-5 md:my-0">
            <Link href="/competizioni">Competizioni</Link>
          </li>
          <li className="border-transparent hover:underline decoration-2 duration-500 my-6 md:my-0">
            <Link href="https://gmitalia.altervista.org/forum">Forum</Link>
          </li>
          <li className="border-transparent hover:underline decoration-2 duration-500 my-6 md:my-0">
            <Link href="https://gmiscores.altervista.org">Classifiche</Link>
          </li>
          <li className="border-transparent hover:underline decoration-2 duration-500 my-6 md:my-0">
            <Link href="https://gmitalia.altervista.org/site/risorse-2/">
              Risorse
            </Link>
          </li>
          <li className="my-6 md:my-0">
            <div className="items-center justify-end">
              <div className="flex justify-center items-center text-white bg-gray-800 px-4 py-2 rounded-full leading-none hover:shadow-lg hover:contrast-200 transition-all">
                <Link href="https://discord.gg/0wKBBPIbX2r3S32a">
                  Entra su Discord
                </Link>
              </div>
            </div>
          </li>
        </ul>
      )}
    </>
  );
};

export default Navbar;
