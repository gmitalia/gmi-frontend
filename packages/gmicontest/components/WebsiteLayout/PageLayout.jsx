import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import GMIApi from "../../src/api/GMIApi";
import { Button } from "../commons/Button";
import { useDispatch, useSelector } from "react-redux";
import { authAsyncThunk } from "../../src/slices/authAsyncThunk";
import { HomeIcon, UsersIcon, TrophyIcon, ClockIcon, BookIcon, MenuIcon, CloseIcon, SearchIcon, PenIcon, LogOutIcon } from "../commons/Icons";

// Sidebar Item Component
const SidebarItem = ({ href, icon: Icon, label, isActive, onClick }) => (
  <Link href={href}>
    <a
      onClick={(e) => { if (isActive) e.preventDefault(); onClick?.(e); }}
      className={`flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 group ${isActive
        ? "ds-nav-item-active text-secondary"
        : "text-content-muted hover:text-content hover:bg-content/5"
        }`}
    >
      <span className={`transition-transform duration-200 ${isActive ? "scale-110" : "group-hover:scale-110"}`}>
        <Icon />
      </span>
      <span className="font-medium text-sm">{label}</span>
      {isActive && (
        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-secondary shadow-[0_0_8px_rgba(var(--ds-rgb-secondary),0.8)]" />
      )}
    </a>
  </Link>
);

// Contest Item for Sidebar
const ContestItem = ({ contest, isActive, onClick }) => {
  const end_date = Date.parse(contest.end_at);
  const complete_date = Date.parse(contest.completed_at);
  const now = Date.now();

  let statusColor = "text-secondary";
  let Icon = null;

  if (now > complete_date) {
    statusColor = "text-warning";
    Icon = TrophyIcon;
  } else if (now > end_date) {
    statusColor = "text-accent";
    Icon = BookIcon;
  } else {
    statusColor = "text-success";
    Icon = () => (
      <div className="w-[18px] h-[18px] flex items-center justify-center">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-success"></span>
        </span>
      </div>
    );
  }

  return (
    <Link href={`/contest/?contest=${contest.id}`}>
      <a
        onClick={(e) => { if (isActive) e.preventDefault(); onClick?.(e); }}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${isActive
          ? "ds-nav-item-active text-content"
          : "text-content-muted hover:text-content hover:bg-content/5"
          }`}
      >
        <span className={`${statusColor} flex items-center transition-transform duration-200 ${isActive ? "scale-110" : "group-hover:scale-110"}`}>
          <Icon />
        </span>
        <span className="text-sm truncate">{contest.name}</span>
      </a>
    </Link>
  );
};

// Modern Sidebar Component
const ModernSidebar = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { query } = router;
  const [contests, setContests] = React.useState([]);

  const dispatch = useDispatch();
  const userInfo = useSelector(root => root.auth.userInfo);
  const user = userInfo && userInfo.success ? userInfo.user : undefined;

  const logoutOnClick = () => {
    dispatch(authAsyncThunk.logout());
    onClose();
  };

  React.useEffect(() => {
    GMIApi.getInstance().getContests((data) => {
      if (data?.success) {
        setContests(data.contests || []);
      }
    });
  }, []);

  const currentPath = router.pathname;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-surface-muted/80 backdrop-blur-md z-50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 lg:top-16 left-0 h-screen rounded-md lg:h-[calc(100vh-6rem)] 
          w-full lg:w-72 z-[60] lg:z-10
          ds-sidebar-panel
          transition-all duration-300 ease-in-out
          ${isOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-full lg:opacity-100 lg:translate-x-0"}
          ds-scrollbar-hide overflow-y-auto
        `}
      >
        {/* Mobile Header in Sidebar */}
        <div className="lg:hidden flex items-center justify-between p-6 border-b border-default">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-content tracking-tight">Competizioni GMI</span>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}><CloseIcon /></Button>
        </div>

        <div className="p-6 lg:py-0 flex flex-col gap-8">
          {/* Mobile Main Navigation */}
          <div className="lg:hidden space-y-2">
            <p className="px-4 text-[10px] font-black text-content-muted uppercase tracking-[0.2em] mb-4">
              Navigazione
            </p>
            <div className="grid grid-cols-1 gap-2">
              <SidebarItem href="/" icon={HomeIcon} label="Home" isActive={currentPath === "/"} onClick={onClose} />
              <SidebarItem href="/search" icon={SearchIcon} label="Cerca" isActive={currentPath === "/search"} onClick={onClose} />
              <SidebarItem href="/users" icon={UsersIcon} label="Utenti" isActive={currentPath === "/users"} onClick={onClose} />
              <SidebarItem href="/premi" icon={TrophyIcon} label="Premi" isActive={currentPath === "/premi"} onClick={onClose} />
              <SidebarItem href="/rules" icon={BookIcon} label="Regolamento" isActive={currentPath === "/rules"} onClick={onClose} />
            </div>

            {/* Blog link - mobile only */}
            <a
              href="https://gamemakeritalia.it/blog/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 text-content-muted hover:text-content hover:bg-content/5"
            >
              <span className="transition-transform duration-200 group-hover:scale-110">
                <PenIcon />
              </span>
              <span className="font-medium text-sm">Blog</span>
            </a>
          </div>

          {/* Contests Section */}
          <div className="space-y-2">
            <p className="pt-4 px-4 text-[12px] font-black text-content-muted uppercase tracking-[0.2em] mb-4">
              Competizioni
            </p>
            <div className="space-y-1">
              {contests.map((contest) => (
                <ContestItem
                  key={contest.id}
                  contest={contest}
                  isActive={query.contest === String(contest.id)}
                  onClick={onClose}
                />
              ))}
            </div>
          </div>

          {/* User Section - Mobile Only */}
          {user && (
            <div className="lg:hidden space-y-2 mt-auto pb-6">
              <div className="h-px bg-default mb-6" />
              <button
                onClick={logoutOnClick}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 text-error hover:bg-error/10"
              >
                <LogOutIcon />
                <span className="font-medium text-sm">Logout</span>
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

// Mobile Menu Button
export const MobileMenuButton = ({ onClick }) => (
  <Button variant="ghost" size="icon" onClick={onClick} className="lg:hidden" aria-label="Open menu"><MenuIcon /></Button>
);

// Main PageLayout
export const PageLayout = (props) => {
  const { children } = props;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Listen for toggle-sidebar event from header
  React.useEffect(() => {
    const handleToggle = () => setSidebarOpen(true);
    window.addEventListener('toggle-sidebar', handleToggle);
    return () => window.removeEventListener('toggle-sidebar', handleToggle);
  }, []);

  return (
    <div className="w-full flex flex-col lg:flex-row gap-6 relative overflow-x-clip">
      {/* Sidebar */}
      <ModernSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <main className="w-full flex-1 min-w-0">
        {children}
      </main>
    </div>
  );
};

