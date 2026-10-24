import type { ReactNode } from "react";
import type { BreadcrumbItem } from "../../src/breadcrumbs";
import { usePageBreadcrumbs } from "./SiteBreadcrumbs";
import { SectionTabs, type SectionTab } from "./SectionTabs";

type SectionLayoutProps = {
  title: string;
  description?: ReactNode;
  tabs?: SectionTab[];
  /** Azione a destra del titolo (es. ricerca o selettore edizione). */
  action?: ReactNode;
  /** Override delle breadcrumb globali. `null` le nasconde. */
  breadcrumbs?: BreadcrumbItem[] | null;
  children: ReactNode;
};

/**
 * Shell unica delle sezioni editoriali: titolo, descrizione, tab e contenuto.
 * Le breadcrumb restano globali e vengono solo sovrascritte dalle pagine
 * che hanno bisogno di un titolo dinamico.
 */
export function SectionLayout({
  title,
  description,
  tabs,
  action,
  breadcrumbs,
  children,
}: SectionLayoutProps) {
  usePageBreadcrumbs(breadcrumbs);

  return (
    <div className="mx-auto w-full max-w-7xl p-5">
      <header className="mb-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0">
            <h1 className="text-3xl font-normal text-gray-900">{title}</h1>
            {description && (
              <p className="mt-2 text-gray-500">{description}</p>
            )}
          </div>

          {action && <div className="shrink-0">{action}</div>}
        </div>

        {tabs && tabs.length > 0 && (
          <div className="mt-6 hidden lg:block">
            <SectionTabs tabs={tabs} />
          </div>
        )}
      </header>

      {children}
    </div>
  );
}

export default SectionLayout;
