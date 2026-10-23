import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import GMIApi from "../../src/api/GMIApi";
import { Button } from "../commons/Button";
import type { BreadcrumbItem } from "../commons/Breadcrumbs";
import {
  getCompetitionBreadcrumbs,
  normalizeBreadcrumbPath,
} from "../../src/breadcrumbs";
import { usePageBreadcrumbs } from "./SiteBreadcrumbs";
import { competitionsPath } from "../../src/paths";

const NAV_ITEMS = [
  { href: competitionsPath("/"), label: "Home" },
  { href: competitionsPath("/search"), label: "Cerca" },
  { href: competitionsPath("/users"), label: "Utenti" },
  { href: competitionsPath("/premi"), label: "Premi" },
  { href: competitionsPath("/rules"), label: "Regolamento" },
];

type SidebarItemProps = {
  href: string;
  label: string;
  isActive: boolean;
  onClick?: () => void;
};

const SidebarItem = ({ href, label, isActive, onClick }: SidebarItemProps) => (
  <Link
    href={href}
    onClick={(event) => {
      if (isActive) event.preventDefault();
      onClick?.();
    }}
    className={`block px-3 py-2 text-sm transition-colors ${
      isActive
        ? "ds-nav-item-active text-content"
        : "text-content-muted hover:text-content hover:bg-content/5"
    }`}
  >
    {label}
  </Link>
);

type ContestItemProps = {
  contest: Contest;
  isActive: boolean;
  onClick?: () => void;
};

const ContestItem = ({ contest, isActive, onClick }: ContestItemProps) => {
  const endDate = Date.parse(contest.end_at);
  const completeDate = Date.parse(contest.completed_at);
  const now = Date.now();

  let statusColor = "bg-success";
  let statusLabel = "In corso";

  if (now > completeDate) {
    statusColor = "bg-gray-400";
    statusLabel = "Conclusa";
  } else if (now > endDate) {
    statusColor = "bg-accent";
    statusLabel = "In giudizio";
  }

  return (
    <Link
      href={`${competitionsPath("/contest")}/?contest=${contest.id}`}
      onClick={(event) => {
        if (isActive) event.preventDefault();
        onClick?.();
      }}
      className={`flex items-center gap-3 px-3 py-2 text-sm transition-colors ${
        isActive
          ? "ds-nav-item-active text-content"
          : "text-content-muted hover:text-content hover:bg-content/5"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${statusColor}`}
        title={statusLabel}
        aria-label={statusLabel}
      />
      <span className="truncate">{contest.name}</span>
    </Link>
  );
};

const ModernSidebar = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const router = useRouter();
  const { query } = router;
  const [contests, setContests] = React.useState<Contest[]>([]);
  const [showAllContests, setShowAllContests] = React.useState(false);
  const [maxHeight, setMaxHeight] = React.useState<number | null>(null);
  const contestListRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    GMIApi.getInstance().getContests((data: { success: boolean; contests: Contest[] }) => {
      if (data?.success) {
        setContests(data.contests || []);
      }
    });
  }, []);

  React.useEffect(() => {
    const list = contestListRef.current;
    if (!list) return;

    if (showAllContests || contests.length === 0) {
      list.style.maxHeight = "";
      setMaxHeight(null);
      return;
    }

    const measure = () => {
      if (!list) return;

      if (window.innerWidth < 1024) {
        list.style.maxHeight = "";
        setMaxHeight(null);
        return;
      }

      list.style.maxHeight = "";
      const naturalHeight = list.scrollHeight;

      const listRect = list.getBoundingClientRect();
      const showMoreButtonSpace = 70;
      const available = window.innerHeight - listRect.top - 20 - showMoreButtonSpace;
      const constrainedHeight = Math.max(60, available);

      if (naturalHeight > constrainedHeight) {
        setMaxHeight(constrainedHeight);
      } else {
        setMaxHeight(null);
      }
    };

    measure();
  }, [contests, showAllContests]);

  const currentPath = router.pathname;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-900/20 z-50 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:sticky lg:self-start top-0 lg:top-[96px] left-0 h-screen lg:h-auto lg:max-h-[calc(100vh-116px)]
          w-full lg:w-64 z-[60] lg:z-10
          bg-white border border-default
          transition-all duration-300 ease-in-out
          ${isOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-full lg:opacity-100 lg:translate-x-0"}
          ds-scrollbar-modern overflow-y-auto
        `}
      >
        <div className="lg:hidden flex items-center justify-between p-5 border-b border-default">
          <span className="text-xl font-semibold text-content">Competizioni</span>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Chiudi
          </Button>
        </div>

        <div className="p-5 flex flex-col gap-8">
          <div>
            <p className="px-3 text-xs font-semibold text-content-muted uppercase tracking-wider mb-3">
              Sezioni
            </p>
            {NAV_ITEMS.map((item) => (
              <SidebarItem
                key={item.href}
                href={item.href}
                label={item.label}
                isActive={normalizeBreadcrumbPath(currentPath) === normalizeBreadcrumbPath(item.href)}
                onClick={onClose}
              />
            ))}
          </div>

          {contests.length > 0 && (
            <div>
              <p className="px-3 text-xs font-semibold text-content-muted uppercase tracking-wider mb-3">
                Edizioni
              </p>
              <div
                ref={contestListRef}
                className="space-y-0.5 overflow-hidden transition-all duration-300"
                style={{
                  maxHeight: showAllContests
                    ? "none"
                    : maxHeight
                      ? `${maxHeight}px`
                      : undefined,
                }}
              >
                {contests.map((contest) => (
                  <ContestItem
                    key={contest.id}
                    contest={contest}
                    isActive={query.contest === String(contest.id)}
                    onClick={onClose}
                  />
                ))}
              </div>
              {maxHeight !== null && (
                <button
                  onClick={() => setShowAllContests(!showAllContests)}
                  className="w-full px-3 py-2 mt-2 text-xs font-medium text-content-muted hover:text-content transition-colors"
                >
                  {showAllContests ? "Mostra meno" : "Vedi altre"}
                </button>
              )}
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

type PageLayoutProps = {
  children: React.ReactNode;
  /** Override delle breadcrumb automatiche. `null` le nasconde. */
  breadcrumbs?: BreadcrumbItem[] | null;
};

export const PageLayout = ({ children, breadcrumbs }: PageLayoutProps) => {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const breadcrumbItems =
    breadcrumbs === null
      ? []
      : breadcrumbs ?? getCompetitionBreadcrumbs(router.pathname);

  usePageBreadcrumbs(breadcrumbItems);

  React.useEffect(() => {
    const handleToggle = () => setSidebarOpen(true);
    const handleMobileMenu = (event: Event) => {
      setMobileMenuOpen(Boolean((event as CustomEvent).detail));
    };

    window.addEventListener("toggle-sidebar", handleToggle);
    window.addEventListener("mobile-menu", handleMobileMenu);

    return () => {
      window.removeEventListener("toggle-sidebar", handleToggle);
      window.removeEventListener("mobile-menu", handleMobileMenu);
    };
  }, []);

  React.useEffect(() => {
    document.body.style.overflow = sidebarOpen || mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen, mobileMenuOpen]);

  return (
    <div className="mx-auto w-full max-w-7xl p-5">
      <div className="w-full flex flex-col lg:flex-row gap-6 relative overflow-x-clip">
        <ModernSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="w-full flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
};
