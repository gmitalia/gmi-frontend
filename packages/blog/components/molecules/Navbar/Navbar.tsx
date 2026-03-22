import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";

type NavbarProps = {
  id?: string;
  openMenu: boolean;
  setOpenMenu: React.Dispatch<React.SetStateAction<boolean>>;
};

const NAV_LINKS = [
  { href: "/blog", label: "Blog" },
  { href: "/tutorial", label: "Tutorial" },
  { href: "/showcase", label: "Showcase" },
  { href: "/competizioni", label: "Competizioni" },
  {
    href: "https://gmiscores.altervista.org",
    label: "GMIScores",
    external: true,
  },
  { href: "/resources", label: "Risorse" },
];

const Navbar = ({ id, openMenu, setOpenMenu }: NavbarProps) => {
  const [isMobile, setIsMobile] = useState(false);

  const handleResize = useCallback(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  useEffect(() => {
    if (!isMobile) setOpenMenu(false);
  }, [isMobile, setOpenMenu]);

  const handleLinkClick = () => setOpenMenu(false);
  const isVisible = !isMobile || openMenu;

  return (
    <nav
      id={id}
      className={`
        absolute top-full left-0 w-full bg-white md:static md:w-auto
        transition-all duration-300 ease-in-out overflow-hidden
        shadow-md md:shadow-none
        ${
          isVisible
            ? "max-h-screen opacity-100"
            : "max-h-0 opacity-0 md:max-h-none md:opacity-100"
        }
      `}
      aria-hidden={!isVisible}
    >
      <ul className="flex flex-col md:flex-row md:items-center md:gap-5 p-4 md:p-0">
        {NAV_LINKS.map(({ href, label, external }) => (
          <li className="my-6 md:my-0" key={href}>
            <Link href={href}>
              <a
                onClick={handleLinkClick}
                tabIndex={isVisible ? 0 : -1}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                className="block py-3 md:py-0 px-2 md:px-0 hover:underline decoration-2 underline-offset-4 transition-all duration-200 whitespace-nowrap"
                title={`Vai alla pagina: ${label}`}
              >
                {label}
              </a>
            </Link>
          </li>
        ))}

        <li className="mt-6 md:mt-0">
          <Link href="https://discord.com/invite/juj4yEF2Yv">
            <a
              onClick={handleLinkClick}
              tabIndex={isVisible ? 0 : -1}
              target="_blank"
              rel="noopener noreferrer"
              className="block mx-2 md:mx-0 text-center text-white bg-gray-800 px-4 py-3 md:py-2 rounded-full text-sm font-medium hover:shadow-lg hover:bg-gray-700 transition-all duration-200 whitespace-nowrap"
              title="Vai al server Discord di GMI"
            >
              Entra su Discord
            </a>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
