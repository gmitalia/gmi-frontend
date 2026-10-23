import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { HeaderUserInfo } from "./HeaderUserInfo";
import { GMILogoIcon } from "../commons/Icons";
import { authAsyncThunk } from "../../src/slices/authAsyncThunk";
import { TokenService } from "../../src/services/TokenService";
import type { AppDispatch } from "../../src/store";

type NavLink = {
  href: string;
  label: string;
  external?: boolean;
  isActive?: (pathname: string) => boolean;
};

const NAV_LINKS: NavLink[] = [
  {
    href: "/blog/",
    label: "Blog",
    isActive: (pathname) =>
      pathname === "/" || pathname.startsWith("/blog") || pathname.startsWith("/posts") || pathname.startsWith("/tutorial"),
  },
  {
    href: "/showcase/",
    label: "Showcase",
    isActive: (pathname) => pathname.startsWith("/showcase"),
  },
  {
    href: "/competizioni/",
    label: "Competizioni",
    isActive: (pathname) => pathname.startsWith("/competizioni"),
  },
  {
    href: "/resources/",
    label: "Risorse",
    isActive: (pathname) => pathname.startsWith("/resources"),
  },
];

const linkClasses =
  "block py-3 md:py-0 px-2 md:px-0 text-gray-900 hover:underline decoration-2 underline-offset-4 transition-all duration-200 whitespace-nowrap";

const NavItem = ({
  item,
  pathname,
  onClick,
}: {
  item: NavLink;
  pathname: string;
  onClick?: () => void;
}) => {
  const active = item.isActive?.(pathname) ?? false;
  const classes = `${linkClasses} ${
    active ? "underline decoration-2 underline-offset-4" : ""
  }`;

  if (item.external) {
    return (
      <a
        href={item.href}
        className={classes}
        onClick={onClick}
        target="_blank"
        rel="noopener noreferrer"
      >
        {item.label}
      </a>
    );
  }

  return (
    <Link
      href={item.href}
      className={classes}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
    >
      {item.label}
    </Link>
  );
};

export default function Header() {
  const [openMenu, setOpenMenu] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const isCompetitionsRoute = router.pathname.startsWith("/competizioni");

  // Un solo bootstrap dell'utente per tutta l'app: evita richieste duplicate
  // tra la versione desktop e quella mobile dell'header.
  useEffect(() => {
    if (TokenService.isLoggedIn()) dispatch(authAsyncThunk.getMe());
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setOpenMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setOpenMenu(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenMenu(false);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("mobile-menu", { detail: openMenu }));
  }, [openMenu]);

  const closeMenu = () => setOpenMenu(false);

  const openEditions = () => {
    setOpenMenu(false);
    window.dispatchEvent(new CustomEvent("toggle-sidebar"));
  };

  return (
    <header ref={headerRef} className="bg-white shadow-sm sticky top-0 z-50">
      <div className="flex justify-between items-center p-5 max-w-7xl mx-auto relative">
        <Link href="/" title="GameMaker Italia — Home" className="flex items-center gap-2 shrink-0 cursor-pointer">
          <GMILogoIcon size={36} />
          <span className="text-3xl text-gray-900 hidden lg:block">GameMaker Italia</span>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden lg:block">
          <ul className="flex items-center gap-4 xl:gap-5">
            {NAV_LINKS.map((item) => (
              <li key={item.href}>
                <NavItem item={item} pathname={router.pathname} />
              </li>
            ))}
            <li>
              <HeaderUserInfo />
            </li>
          </ul>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 rounded-md hover:bg-gray-100 transition-colors"
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

        {/* Mobile navigation */}
        <nav
          id="main-nav"
          className={`lg:hidden absolute top-full left-0 w-full bg-white shadow-md transition-all duration-300 ease-in-out ${
            openMenu
              ? "h-[calc(100dvh-76px)] opacity-100 visible overflow-y-auto"
              : "h-0 opacity-0 invisible overflow-hidden"
          }`}
          aria-hidden={!openMenu}
        >
          <ul className="flex flex-col p-4">
            {NAV_LINKS.map((item) => (
              <li className="my-3" key={item.href}>
                <NavItem item={item} pathname={router.pathname} onClick={closeMenu} />
              </li>
            ))}
            {isCompetitionsRoute && (
              <li className="my-3">
                <button onClick={openEditions} className={`${linkClasses} w-full text-left`}>
                  Area competizioni
                </button>
              </li>
            )}
            <li className="my-4">
              <div className="px-2">
                <HeaderUserInfo />
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
