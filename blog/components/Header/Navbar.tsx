import React from "react";
import Link from "next/link";

const Navbar = () => {
  return (
    <ul className="text-lg hidden md:inline-flex items-center justify-end space-x-5">
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
