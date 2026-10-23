import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/router";
import Breadcrumbs from "../commons/Breadcrumbs";
import {
  getGlobalBreadcrumbs,
  type BreadcrumbItem,
} from "../../src/breadcrumbs";

type BreadcrumbOverride = {
  path: string;
  items: BreadcrumbItem[] | null;
};

const BreadcrumbStateContext = createContext<BreadcrumbOverride | null>(null);
const BreadcrumbSetterContext = createContext<
  ((items: BreadcrumbItem[] | null) => void) | null
>(null);

/**
 * Raccoglie le breadcrumb dinamiche delle pagine (es. nome della competizione)
 * e le rende disponibili al componente globale montato in `_app`.
 */
export function BreadcrumbsProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [override, setOverride] = useState<BreadcrumbOverride | null>(null);

  const setPageBreadcrumbs = useCallback(
    (items: BreadcrumbItem[] | null) => {
      setOverride({ path: router.asPath, items });
    },
    [router.asPath]
  );

  return (
    <BreadcrumbSetterContext.Provider value={setPageBreadcrumbs}>
      <BreadcrumbStateContext.Provider value={override}>
        {children}
      </BreadcrumbStateContext.Provider>
    </BreadcrumbSetterContext.Provider>
  );
}

/**
 * Registra le breadcrumb specifiche di una pagina. `null` le nasconde.
 * Se il percorso cambia, l'override precedente viene ignorato automaticamente.
 */
export function usePageBreadcrumbs(items: BreadcrumbItem[] | null) {
  const setPageBreadcrumbs = useContext(BreadcrumbSetterContext);
  const key = JSON.stringify(items);

  useEffect(() => {
    if (!setPageBreadcrumbs) return;

    setPageBreadcrumbs(items);
    return () => setPageBreadcrumbs(null);
  }, [key, setPageBreadcrumbs]);
}

type SiteBreadcrumbsProps = {
  /** Titolo dinamico disponibile in `pageProps` (es. articolo del blog). */
  pageTitle?: string;
};

/**
 * Breadcrumb globali: un unico punto di rendering per blog, showcase, risorse,
 * tutorial, articoli e competizioni. Le pagine possono sovrascriverle.
 */
export function SiteBreadcrumbs({ pageTitle }: SiteBreadcrumbsProps) {
  const router = useRouter();
  const override = useContext(BreadcrumbStateContext);

  const items =
    override && override.path === router.asPath
      ? override.items
      : getGlobalBreadcrumbs(router.pathname, pageTitle);

  if (!items || items.length === 0) return null;

  return (
    <div className="mx-auto w-full max-w-7xl px-5 pt-5">
      <Breadcrumbs items={items} />
    </div>
  );
}
