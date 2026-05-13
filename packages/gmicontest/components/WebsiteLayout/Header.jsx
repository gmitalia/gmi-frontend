import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import GMIApi from "../../src/api/GMIApi";
import { mainActions } from "../../src/slices/mainSlice";
import { HeaderUserInfo } from "./HeaderUserInfo";
import { HomeIcon, UsersIcon, MenuIcon, ClockIcon, BookIcon, TrophyIcon, GMILogoIcon, SearchIcon, SunIcon, MoonIcon } from "../commons/Icons";

// Compact status icons for header contest items (14px)
const StatusClock = () => <ClockIcon size={14} />;
const StatusTrophy = () => <TrophyIcon size={14} />;
const StatusBook = () => <BookIcon size={14} />;



// Modern Logo Component
const Logo = () => (
  <Link href="/">
    <a className="flex items-center gap-3 group flex-shrink-0">
      <GMILogoIcon />
    </a>
  </Link>
);

// Contest Item for Header - Compact version
const HeaderContestItem = ({ contest, isActive }) => {
  const end_date = Date.parse(contest.end_at);
  const complete_date = Date.parse(contest.completed_at);
  const now = Date.now();

  let statusColor = "text-secondary";
  let Icon = StatusClock;
  let isLive = false;

  if (now > complete_date) {
    statusColor = "text-warning";
    Icon = StatusTrophy;
  } else if (now > end_date) {
    statusColor = "text-accent";
    Icon = StatusBook;
  } else {
    // Contest is active
    statusColor = "text-success";
    Icon = StatusClock;
  }

  return (
    <Link href={`/contest/?contest=${contest.id}`}>
      <a
        onClick={(e) => isActive && e.preventDefault()}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200 ${isActive
            ? "bg-gradient-to-r from-secondary/20 via-white/40 to-accent/10 text-content border border-secondary/30"
            : "text-content-muted hover:text-content hover:bg-content/5"
          }`}
        title={contest.name}
      >
        <span className={`${statusColor} ${isActive ? "scale-110" : ""} transition-transform flex items-center`}>
          <Icon />
        </span>
        <span className="truncate max-w-[120px]">{contest.name}</span>
      </a>
    </Link>
  );
};

// Contest Navigation Bar
const ContestNav = () => {
  const router = useRouter();
  const { query } = router;
  const [contests, setContests] = useState([]);

  useEffect(() => {
    GMIApi.getInstance().getContests((data) => {
      if (data?.success) {
        setContests(data.contests || []);
      }
    });
  }, []);

  if (contests.length === 0) return null;

  return (
    <nav className="flex items-center gap-1 overflow-x-auto ds-scrollbar-hide px-2 -mx-2">
      {contests.slice(0, 8).map((contest) => (
        <HeaderContestItem
          key={contest.id}
          contest={contest}
          isActive={query.contest === String(contest.id)}
        />
      ))}
    </nav>
  );
};

// Main Navigation Links
const MainNav = () => {
  const router = useRouter();
  const currentPath = router.pathname;
  const { query } = router;
  const isContestActive = query.contest !== undefined;

  const NavItem = ({ href, icon: Icon, label, isActive }) => (
    <Link href={href}>
      <a 
        onClick={(e) => isActive && e.preventDefault()}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
          ? "bg-secondary/20 text-secondary border border-secondary/30"
          : "text-content-muted hover:text-content hover:bg-content/5"
        }`}>
        <Icon />
        <span className="hidden sm:inline">{label}</span>
      </a>
    </Link>
  );

  return (
    <nav className="flex items-center gap-1">
      <NavItem href="/" icon={HomeIcon} label="Home" isActive={currentPath === "/"} />
      <NavItem href="/search" icon={SearchIcon} label="Cerca" isActive={currentPath === "/search"} />
      <NavItem href="/users" icon={UsersIcon} label="Utenti" isActive={currentPath === "/users"} />
      <NavItem href="/rules" icon={BookIcon} label="Regolamento" isActive={currentPath === "/rules"} />
    </nav>
  );
};

export default function Header(props) {
  const dispatch = useDispatch();
  const theme = useSelector(root => root.main.theme);

  const toggleTheme = () => {
    dispatch(mainActions.toggleTheme());
  };

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Glassmorphism background */}
      <div className="absolute inset-0 bg-surface-muted backdrop-blur-xl border-b border-default" />

      {/* Gradient glow line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary/50 to-transparent" />

      {/* Content */}
      <div className="relative">
        {/* Main header row */}
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
          <div className="py-3 flex flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Logo />
              <div className="hidden lg:flex">
                <MainNav />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="https://gamemakeritalia.it/blog/"
                className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-content-muted hover:text-content hover:bg-content/5 transition-all duration-200"
              >
                <span>Blog</span>
              </a>

              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="flex items-center justify-center w-9 h-9 rounded-lg text-content-muted hover:text-content hover:bg-content/5 transition-all duration-200"
                aria-label={theme === 'light' ? 'Passa al tema scuro' : 'Passa al tema chiaro'}
                title={theme === 'light' ? 'Tema scuro' : 'Tema chiaro'}
              >
                {theme === 'light' ? <MoonIcon size={18} /> : <SunIcon size={18} />}
              </button>

              <HeaderUserInfo />

              {/* Mobile hamburger - moved to right */}
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('toggle-sidebar'))}
                className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg text-content-muted hover:text-content hover:bg-content/5 transition-all duration-200"
                aria-label="Apri menu"
              >
                <MenuIcon size={20} />
              </button>
            </div>
          </div>
        </div>

      </div>
    </header>
  )
}
