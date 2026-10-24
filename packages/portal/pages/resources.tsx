import React from 'react'
import Head from 'next/head'
import { GetStaticProps } from 'next'
import { groq } from 'next-sanity'
import { sanityClient } from '../sanity'

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

// Categorie "macro" mostrate per prime nei filtri
const MACRO_PRIORITY = ["assets", "tools", "tutorial"];

/** Icone e colori Font Awesome per le categorie (chiave = titolo normalizzato). */
const CATEGORY_STYLES: Record<string, { icon: string; color: string }> = {
  assets: { icon: "fa-boxes", color: "#0f766e" },
  tools: { icon: "fa-tools", color: "#2563eb" },
  tutorial: { icon: "fa-book", color: "#7c3aed" },
  "2d": { icon: "fa-image", color: "#d6336c" },
  "3d": { icon: "fa-cube", color: "#0e7490" },
  "a pagamento": { icon: "fa-euro-sign", color: "#059669" },
  ai: { icon: "fa-robot", color: "#4f46e5" },
  animazione: { icon: "fa-film", color: "#c026d3" },
  "game design": { icon: "fa-gamepad", color: "#dc2626" },
  grafica: { icon: "fa-palette", color: "#e11d48" },
  marketing: { icon: "fa-bullhorn", color: "#ea580c" },
  musica: { icon: "fa-headphones", color: "#7e22ce" },
  "pixel art": { icon: "fa-th", color: "#15803d" },
  programmazione: { icon: "fa-code", color: "#0d9488" },
  shaders: { icon: "fa-flask", color: "#475569" },
  suoni: { icon: "fa-volume-up", color: "#0284c7" },
};

const FALLBACK_CATEGORY_STYLE = { icon: "fa-tag", color: "#3b3c5c" };

/** Normalizza il titolo di una categoria: solo lettere, numeri e spazi, in minuscolo. */
function normalizeCategory(title: string) {
  return (title.match(/[A-Za-z0-9\s]+/g) || []).join("").trim().toLowerCase();
}

/** Rimuove l'eventuale emoji iniziale dal nome della categoria. "🎧 Musica" -> "Musica" */
function categoryLabel(title: string) {
  const match = title.match(/^([^A-Za-z0-9\u00C0-\u024F]+)(.*)$/);
  return match && match[2].trim() ? match[2].trim() : title.trim();
}

/** Stile associato alla categoria (icona e colore di fallback). */
function categoryStyle(title: string) {
  return CATEGORY_STYLES[normalizeCategory(title)] || FALLBACK_CATEGORY_STYLE;
}

/** Colore della categoria: palette locale per categoria, con fallback su Sanity. */
function categoryColor(title: string, color?: string) {
  const style = CATEGORY_STYLES[normalizeCategory(title)];
  return style?.color || color || FALLBACK_CATEGORY_STYLE.color;
}

const ResourcesPage: React.FC<ResourcesPageProps> = ({ resources, categories }) => {
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([]);
  const [search, setSearch] = React.useState<string>("");

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

  const filteredResources = resources.filter(r => {
    const matchesCategory =
      selectedCategories.length === 0
        ? true
        : selectedCategories.every(selCat =>
            r.resourceCategories.some(c => c._id === selCat)
          );
    const matchesSearch =
      search.trim().length === 0
        ? true
        : (
          r.name.toLowerCase().includes(search.toLowerCase()) ||
          r.description.toLowerCase().includes(search.toLowerCase()) ||
          r.resourceCategories.some(cat =>
            cat.title.toLowerCase().includes(search.toLowerCase())
          )
        );
    return matchesCategory && matchesSearch;
  });

  // Ordina le categorie: macrocategorie prima, poi alfabeticamente
  const orderedCategories = categories.slice().sort((a, b) => {
    const aNorm = normalizeCategory(a.title);
    const bNorm = normalizeCategory(b.title);
    const aPriority = MACRO_PRIORITY.indexOf(aNorm);
    const bPriority = MACRO_PRIORITY.indexOf(bNorm);
    const aIsMacro = aPriority !== -1;
    const bIsMacro = bPriority !== -1;
    if (aIsMacro && bIsMacro) return aPriority - bPriority;
    if (aIsMacro) return -1;
    if (bIsMacro) return 1;
    return aNorm.localeCompare(bNorm);
  });

  const hasActiveFilters = selectedCategories.length > 0 || search.trim().length > 0;

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

        {/* Ricerca + conteggio */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              {/* Heroicon: Magnifying Glass */}
              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" fill="none" />
                <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Cerca risorse..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="block w-full pl-9 pr-9 py-2 bg-white border border-gray-200 rounded-sm text-sm text-gray-900 placeholder-gray-400 transition-colors focus:outline-none focus:border-primary/50"
              aria-label="Cerca risorse"
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

          <div className="text-[0.7rem] uppercase tracking-wider text-gray-500">
            {filteredResources.length} {filteredResources.length === 1 ? "risorsa" : "risorse"}
          </div>
        </div>

        {/* Filtri categoria */}
        <nav
          aria-label="Categorie risorse"
          className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-6 mb-2 border-b border-gray-200 pb-1"
        >
          <span className="text-gray-700 font-medium text-sm">Filtri attivi</span>
          <button
            onClick={() => setSelectedCategories([])}
            aria-pressed={selectedCategories.length === 0}
            className={`text-sm pb-1 -mb-1 border-b-2 transition-colors duration-200 ${
              selectedCategories.length === 0
                ? 'text-primary border-primary font-semibold'
                : 'text-gray-500 border-transparent hover:text-primary hover:border-primary/40'
            }`}
          >
            Mostra tutti
          </button>
          {orderedCategories.map(cat => {
            const isActive = selectedCategories.includes(cat._id);
            return (
              <button
                key={cat._id}
                onClick={() => toggleCategory(cat._id)}
                aria-pressed={isActive}
                className={`text-sm pb-1 -mb-1 border-b-2 transition-colors duration-200 ${
                  isActive
                    ? 'text-primary font-semibold'
                    : 'text-gray-500 border-transparent hover:text-primary hover:border-primary/40'
                }`}
                style={isActive ? { borderBottomColor: categoryColor(cat.title, cat.color) } : undefined}
              >
                <i
                  className={`fas ${categoryStyle(cat.title).icon} mr-1.5 text-[0.7rem]`}
                  style={{ color: categoryColor(cat.title, cat.color) }}
                  aria-hidden="true"
                />
                {categoryLabel(cat.title)}
              </button>
            );
          })}
        </nav>

        {/* Griglia risorse */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 py-3">
          {filteredResources.length === 0 && (
            <div className="col-span-full text-center py-16">
              <p className="text-gray-500">Nessuna risorsa trovata.</p>
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
            const macroKey = resource.resourceCategories
              .map(cat => normalizeCategory(cat.title))
              .find(norm => MACRO_PRIORITY.includes(norm));

            const primaryCategory =
              resource.resourceCategories.find(cat => normalizeCategory(cat.title) === macroKey) ||
              resource.resourceCategories[0];

            const label = primaryCategory ? categoryLabel(primaryCategory.title) : "";
            const primaryColor = primaryCategory
              ? categoryColor(primaryCategory.title, primaryCategory.color)
              : undefined;

            const secondaryCategories = resource.resourceCategories.filter(cat => {
              const norm = normalizeCategory(cat.title);
              return cat._id !== primaryCategory?._id && !MACRO_PRIORITY.includes(norm);
            });

            return (
              <a
                key={resource._id}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="resource-card"
                aria-label={`Apri ${resource.name} (si apre in una nuova scheda)`}
              >
                {label && (
                  <div className="resource-card__top">
                    <span
                      className="resource-card__category"
                      style={primaryColor ? { borderBottomColor: primaryColor } : undefined}
                    >
                      {label}
                    </span>
                    <i
                      className={`resource-card__icon fas ${categoryStyle(primaryCategory.title).icon}`}
                      style={primaryColor ? { color: primaryColor } : undefined}
                      aria-hidden="true"
                    />
                  </div>
                )}

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
