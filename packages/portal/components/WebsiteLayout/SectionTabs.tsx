import Link from "next/link";
import { useRouter } from "next/router";
import { normalizeBreadcrumbPath } from "../../src/breadcrumbs";

export type SectionTab = {
  href: string;
  label: string;
  /** Permette di marcare la tab attiva anche sulle pagine di dettaglio. */
  isActive?: (pathname: string) => boolean;
};

type SectionTabsProps = {
  tabs: SectionTab[];
  ariaLabel?: string;
};

export function SectionTabs({
  tabs,
  ariaLabel = "Sezioni",
}: SectionTabsProps) {
  const router = useRouter();

  return (
    <nav aria-label={ariaLabel} className="border-b border-gray-200">
      <ul className="flex flex-wrap gap-x-6">
        {tabs.map((tab) => {
          const active = tab.isActive
            ? tab.isActive(router.pathname)
            : normalizeBreadcrumbPath(router.pathname) ===
              normalizeBreadcrumbPath(tab.href);

          return (
            <li key={tab.href} className="shrink-0">
              <Link
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={`inline-block whitespace-nowrap border-b-2 px-0.5 pb-1 pt-1 text-sm transition-colors ${
                  active
                    ? "border-primary font-semibold text-gray-900"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-900"
                }`}
              >
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default SectionTabs;
