import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Navbar from "../Navbar/Navbar";
import GMILogo from "../../atoms/GMILogo/GMILogo";

const Header = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setOpenMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = openMenu ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [openMenu]);

  return (
    <header ref={headerRef} className="bg-white shadow-sm sticky top-0 z-50">
      <div className="flex justify-between items-center p-5 max-w-7xl mx-auto relative">
        <Link href="/">
          <a
            title="GameMaker Italia Home Page"
            className="flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <GMILogo className="w-9 object-contain" />
            <span className="text-3xl hidden lg:block">GameMaker Italia</span>
          </a>
        </Link>

        {/* Hamburger */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 rounded-md hover:bg-gray-100 transition-colors"
          onClick={() => setOpenMenu((prev) => !prev)}
          aria-label={openMenu ? "Chiudi menu" : "Apri menu"}
          aria-expanded={openMenu}
          aria-controls="main-nav"
        >
          <span
            className={`block w-6 h-0.5 bg-gray-700 transition-transform duration-300 origin-center ${
              openMenu ? "translate-y-2 rotate-45" : ""
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-gray-700 transition-opacity duration-300 ${
              openMenu ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-gray-700 transition-transform duration-300 origin-center ${
              openMenu ? "-translate-y-2 -rotate-45" : ""
            }`}
          />
        </button>

        <Navbar id="main-nav" openMenu={openMenu} setOpenMenu={setOpenMenu} />
      </div>
    </header>
  );
};

export default Header;
