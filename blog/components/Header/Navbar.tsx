import React from "react";
import Link from "next/link";

type NavbarProps = {
  openMenu: boolean;
  setOpenMenu: React.Dispatch<React.SetStateAction<boolean>>;
};

const Navbar = ({ openMenu, setOpenMenu }: NavbarProps) => {
  return (
    <ul
      className={`text-lg hidden md:inline-flex items-center justify-end space-x-5 flex-1`}
    >
      <li>
        <Link href="/competizioni">Competizioni</Link>
      </li>
      <li>
        <Link href="https://gmitalia.altervista.org/forum">Forum</Link>
      </li>
      <li>
        <Link href="https://gmiscores.altervista.org">Classifiche</Link>
      </li>
      <li>
        <Link href="https://gmitalia.altervista.org/site/risorse-2/">
          Risorse
        </Link>
      </li>
    </ul>
  );
};

export default Navbar;
