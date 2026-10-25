import React from 'react'
import Head from 'next/head'
import { GetStaticProps } from 'next'
import { groq } from 'next-sanity'
import { sanityClient } from '../sanity'
import {
  RESOURCE_PALETTE,
  categoryColor,
  categoryLabel,
  categoryStyle,
  normalizeCategory,
} from '../src/resourceCategories'

interface Resource {
  _id: string
  name: string
  description: string
  url: string
  resourceCategories: { _id: string; title: string; color?: string }[]
}

interface ResourceCategory {
  _id: string
  title: string
  color?: string
  group?: number
}

interface ResourcesPageProps {
  resources: Resource[]
  categories: ResourceCategory[]
}

type MacroKey = "assets" | "tools" | "tutorial";

interface MacroSection {
  key: MacroKey;
  label: string;
  description: string;
  icon: string;
  color: string;
}

/** Sezioni principali della pagina: ogni risorsa vive in almeno una di queste. */
const MACRO_SECTIONS: MacroSection[] = [
  {
    key: "assets",
    label: "Assets",
    description: "Grafica, suoni, font e snippet pronti all'uso",
    icon: "fa-boxes",
    color: RESOURCE_PALETTE.teal,
  },
  {
    key: "tools",
    label: "Tools",
    description: "Software, generatori e utility per lo sviluppo",
    icon: "fa-tools",
    color: RESOURCE_PALETTE.blue,
  },
  {
    key: "tutorial",
    label: "Tutorials",
    description: "Guide, approfondimenti e risorse didattiche",
    icon: "fa-book",
    color: RESOURCE_PALETTE.violet,
  },
];

const MACRO_KEYS = MACRO_SECTIONS.map(section => section.key);

/** Sottocategorie usate per assegnare una macro alle risorse senza tag esplicito. */
const ASSET_CATEGORY_KEYS = new Set([
  "2d",
  "3d",
  "animazione",
  "grafica",
  "musica",
  "pixel art",
  "suoni",
  "a pagamento",
]);

const TOOL_CATEGORY_KEYS = new Set([
  "programmazione",
  "shaders",
  "ai",
  "game design",
  "marketing",
]);

/** Verifica se un titolo normalizzato corrisponde a una delle sezioni principali. */
function isMacroKey(value: string): value is MacroKey {
  return (MACRO_KEYS as string[]).includes(value);
}

/**
 * Macro di appartenenza di una risorsa. I tag espliciti hanno priorità; per le
 * risorse più datate, prive di un tag di sezione, si deduce la macro dalle
 * sottocategorie (es. "2D" -> Assets).
 */
function resourceMacroKeys(resource: Resource): MacroKey[] {
  const normalized = resource.resourceCategories.map(category =>
    normalizeCategory(category.title)
  );
  const explicit = MACRO_KEYS.filter(key => normalized.includes(key));

  if (explicit.length > 0) return explicit;
  if (normalized.some(key => ASSET_CATEGORY_KEYS.has(key))) return ["assets"];
  if (normalized.some(key => TOOL_CATEGORY_KEYS.has(key))) return ["tools"];
  return ["assets"];
}

const ResourcesPage: React.FC<ResourcesPageProps> = ({ resources, categories }) => {
  const [activeMacro, setActiveMacro] = React.useState<MacroKey>("assets");
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([]);
  const [search, setSearch] = React.useState<string>("");
  const tabRefs = React.useRef<Partial<Record<MacroKey, HTMLButtonElement | null>>>({});

  const resourcesByMacro = React.useMemo(() => {
    const grouped: Record<MacroKey, Resource[]> = {
      assets: [],
      tools: [],
      tutorial: [],
    };

    resources.forEach(resource => {
      resourceMacroKeys(resource).forEach(key => grouped[key].push(resource));
    });

    return grouped;
  }, [resources]);

  const activeMacroSection =
    MACRO_SECTIONS.find(section => section.key === activeMacro) || MACRO_SECTIONS[0];
  const activeResources = resourcesByMacro[activeMacro];

  // Solo le sottocategorie presenti nella sezione attiva, con il numero di risorse.
  const activeFilterCategories = React.useMemo(() => {
    const counts = new Map<string, number>();

    activeResources.forEach(resource => {
      const seen = new Set<string>();

      resource.resourceCategories.forEach(category => {
        if (isMacroKey(normalizeCategory(category.title)) || seen.has(category._id)) return;
        seen.add(category._id);
        counts.set(category._id, (counts.get(category._id) || 0) + 1);
      });
    });

    return categories
      .filter(category => counts.has(category._id))
      .map(category => ({ ...category, count: counts.get(category._id) || 0 }))
      .sort((a, b) =>
        categoryLabel(a.title).localeCompare(categoryLabel(b.title), "it", {
          sensitivity: "base",
        })
      );
  }, [activeResources, categories]);

  const selectMacro = (key: MacroKey) => {
    if (key === activeMacro) return;
    setActiveMacro(key);
    setSelectedCategories([]);
    setSearch("");
  };

  const handleTabKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    index: number
  ) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;

    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const nextIndex =
      (index + direction + MACRO_SECTIONS.length) % MACRO_SECTIONS.length;
    const nextMacro = MACRO_SECTIONS[nextIndex];

    selectMacro(nextMacro.key);
    tabRefs.current[nextMacro.key]?.focus();
  };

  const toggleCategory = (catId: string) => {
    setSelectedCategories(prev =>
      prev.includes(catId)
        ? prev.filter(id => id !== catId)
        : [...prev, catId]
    );
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setSearch("");
  };

  const searchTerm = search.trim().toLowerCase();

  const filteredResources = activeResources.filter(resource => {
    const matchesCategory =
      selectedCategories.length === 0
        ? true
        : selectedCategories.every(selectedId =>
            resource.resourceCategories.some(category => category._id === selectedId)
          );
    const matchesSearch =
      searchTerm.length === 0
        ? true
        : resource.name.toLowerCase().includes(searchTerm) ||
          resource.description.toLowerCase().includes(searchTerm) ||
          resource.resourceCategories.some(category =>
            category.title.toLowerCase().includes(searchTerm)
          );

    return matchesCategory && matchesSearch;
  });

  const hasActiveFilters = selectedCategories.length > 0 || searchTerm.length > 0;

  return (
    <div>
      <Head>
        <title>GameMaker Italia | Risorse</title>
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:title" content="GameMaker Italia | Risorse" />
        <meta property="og:description" content="Sviluppatori per passione" />
        <meta name="description" content="Sviluppatori per passione" key="desc" />
        <meta property="og:image" content="https://gamemakeritalia.it/images/gmi_logo.png" />
        <link rel="stylesheet" href="/competizioni/fontawesome/css/fontawesome.min.css" />
        <link rel="stylesheet" href="/competizioni/fontawesome/css/solid.min.css" />
      </Head>

      <div className="max-w-7xl mx-auto p-5 blog-section">
        <h2 className="text-3xl mb-3">Risorse Gamedev</h2>
        <p className="mb-1">
          Una selezione di strumenti, asset e tutorial per chi sviluppa con GameMaker
        </p>

        {/* Macro sezioni */}
        <div className="mt-8 border border-gray-200 bg-white">
          <div role="tablist" aria-label="Sezioni risorse" className="grid grid-cols-3">
            {MACRO_SECTIONS.map((section, index) => {
              const isActive = section.key === activeMacro;
              const count = resourcesByMacro[section.key].length;

              return (
                <button
                  key={section.key}
                  ref={element => {
                    tabRefs.current[section.key] = element;
                  }}
                  type="button"
                  role="tab"
                  id={`resources-tab-${section.key}`}
                  aria-selected={isActive}
                  aria-controls="resources-panel"
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => selectMacro(section.key)}
                  onKeyDown={event => handleTabKeyDown(event, index)}
                  className={`relative flex flex-col items-start gap-2 px-3 py-4 text-left transition-colors sm:flex-row sm:items-center sm:gap-4 sm:px-5 ${
                    index > 0 ? "border-l border-gray-200" : ""
                  } ${
                    isActive
                      ? "bg-primary-dark text-white"
                      : "bg-white text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center border text-sm ${
                      isActive
                        ? "border-white/20 bg-white/10 text-white"
                        : "border-gray-200 bg-gray-50"
                    }`}
                    style={!isActive ? { color: section.color } : undefined}
                  >
                    <i className={`fas ${section.icon}`} aria-hidden="true" />
                  </span>

                  <span className="min-w-0 sm:flex-1">
                    <span className="block text-sm font-semibold sm:text-base">
                      {section.label}
                    </span>
                    <span
                      className={`mt-0.5 hidden text-xs leading-snug md:block ${
                        isActive ? "text-white/60" : "text-gray-500"
                      }`}
                    >
                      {section.description}
                    </span>
                  </span>

                  <span
                    className={`absolute right-3 top-3 text-[0.7rem] font-semibold tabular-nums sm:static sm:ml-2 sm:text-xs ${
                      isActive ? "text-white/55" : "text-gray-500"
                    }`}
                  >
                    {count}
                    <span className="sr-only"> risorse</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div
          role="tabpanel"
          id="resources-panel"
          aria-labelledby={`resources-tab-${activeMacro}`}
          className="mt-6"
        >
          {/* Ricerca + conteggio */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-sm">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                {/* Heroicon: Magnifying Glass */}
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" fill="none" />
                  <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </span>
              <input
                type="text"
                placeholder={`Cerca in ${activeMacroSection.label}...`}
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="block w-full pl-9 pr-9 py-2 bg-white border border-gray-200 rounded-sm text-sm text-gray-900 placeholder-gray-400 transition-colors focus:outline-none focus:border-primary/50"
                aria-label={`Cerca in ${activeMacroSection.label}`}
              />
              {search.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-primary transition-colors"
                  aria-label="Cancella ricerca"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                    <line x1="6" y1="6" x2="18" y2="18" strokeLinecap="round" />
                    <line x1="18" y1="6" x2="6" y2="18" strokeLinecap="round" />
                  </svg>
                </button>
              )}
            </div>

            <div
              className="text-[0.7rem] uppercase tracking-wider text-gray-500"
              aria-live="polite"
            >
              {hasActiveFilters
                ? `${filteredResources.length} di ${activeResources.length} risorse`
                : `${filteredResources.length} ${
                    filteredResources.length === 1 ? "risorsa" : "risorse"
                  }`}
            </div>
          </div>

          {/* Filtri categoria */}
          <div className="mt-5">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-gray-500">
              Filtra per
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSelectedCategories([])}
                aria-pressed={selectedCategories.length === 0}
                className={`inline-flex items-center gap-1.5 border px-3 py-1.5 text-xs font-semibold transition-colors ${
                  selectedCategories.length === 0
                    ? "border-primary bg-primary text-white"
                    : "border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:text-gray-900"
                }`}
              >
                Tutte
                <span
                  className={
                    selectedCategories.length === 0 ? "text-white/60" : "text-gray-500"
                  }
                >
                  {activeResources.length}
                </span>
              </button>

              {activeFilterCategories.map(category => {
                const isActive = selectedCategories.includes(category._id);
                const color = categoryColor(category.title, category.color);

                return (
                  <button
                    key={category._id}
                    type="button"
                    onClick={() => toggleCategory(category._id)}
                    aria-pressed={isActive}
                    className={`inline-flex items-center gap-1.5 border px-3 py-1.5 text-xs transition-colors ${
                      isActive
                        ? "font-semibold text-gray-900"
                        : "border-gray-200 bg-white font-medium text-gray-600 hover:border-gray-300 hover:text-gray-900"
                    }`}
                    style={
                      isActive
                        ? { backgroundColor: `${color}12`, borderColor: color }
                        : undefined
                    }
                  >
                    <i
                      className={`fas ${categoryStyle(category.title).icon} text-[0.68rem]`}
                      style={{ color }}
                      aria-hidden="true"
                    />
                    {categoryLabel(category.title)}
                    <span
                      className={`text-[0.65rem] font-semibold ${
                        isActive ? "text-gray-600" : "text-gray-500"
                      }`}
                    >
                      {category.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Griglia risorse */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 pt-4 pb-6">
            {filteredResources.length === 0 && (
              <div className="col-span-full border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
                <p className="text-gray-500">
                  Nessuna risorsa trovata nella sezione {activeMacroSection.label}.
                </p>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="mt-3 text-sm text-primary underline underline-offset-4 hover:text-primary/70 transition-colors"
                  >
                    Azzera filtri
                  </button>
                )}
              </div>
            )}

            {filteredResources.map(resource => {
              const secondaryCategories = resource.resourceCategories.filter(
                category => !isMacroKey(normalizeCategory(category.title))
              );

              return (
                <a
                  key={resource._id}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="resource-card"
                  aria-label={`Apri ${resource.name} (si apre in una nuova scheda)`}
                >
                  <div className="resource-card__body">
                    <h3 className="resource-card__title">{resource.name}</h3>
                    <p className="resource-card__description">{resource.description}</p>
                  </div>

                  <div className="resource-card__footer">
                    <div className="resource-card__tags">
                      {secondaryCategories.map(cat => (
                        <span key={cat._id} className="resource-card__tag">
                          <span
                            className="resource-card__dot"
                            style={{ backgroundColor: categoryColor(cat.title, cat.color) }}
                            aria-hidden="true"
                          />
                          {categoryLabel(cat.title)}
                        </span>
                      ))}
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const resourcesQuery = groq`*[_type == "resource"]{_id, name, description, url, resourceCategories[]->{_id, title, color}} | order(name asc)`
  const categoriesQuery = groq`*[_type == "resourceCategories"]{_id, title, color, group} | order(title asc)`
  const resources = await sanityClient.fetch(resourcesQuery)
  const categories = await sanityClient.fetch(categoriesQuery)
  return { props: { resources, categories } }
}

export default ResourcesPage
