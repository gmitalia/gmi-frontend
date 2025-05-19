import React from 'react'
import { GetStaticProps } from 'next'
import { groq } from 'next-sanity'
import { sanityClient } from '../sanity'
import Header from "../components/molecules/Header/Header";
import Footer from "../components/molecules/Footer/Footer";

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
}

interface ResourcesPageProps {
  resources: Resource[]
  categories: ResourceCategory[]
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
          r.description.toLowerCase().includes(search.toLowerCase())
        );
    return matchesCategory && matchesSearch;
  });

  return (
    <div>
      <Header />
      <div className="max-w-7xl mx-auto p-5">
        <h2 className="text-3xl mb-3">Risorse Gamedev</h2>
        {/* Barra di ricerca migliorata */}
        <div className="mb-8 flex justify-center">
          <div className="relative w-full max-w-md">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              {/* Heroicon: Magnifying Glass */}
              <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" fill="none"/>
                <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </span>
            <input
              type="text"
              placeholder="Cerca risorse per titolo o descrizione..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="block w-full pl-10 pr-4 py-2 rounded-full border-2 border-primary focus:border-secondary focus:ring-2 focus:ring-secondary bg-white shadow transition-all placeholder-gray-400 text-base"
              aria-label="Cerca risorse"
            />
          </div>
        </div>
        <nav aria-label="Categorie risorse" className="flex flex-wrap gap-2 mb-8">
          <button
            className={`px-5 py-2 rounded-full border font-medium focus:outline-none transition-all duration-200 ${selectedCategories.length === 0 ? 'bg-primary text-white shadow' : 'bg-white text-primary border-primary hover:bg-primary hover:text-white'}`}
            onClick={() => setSelectedCategories([])}
            aria-pressed={selectedCategories.length === 0}
          >
            Tutte
          </button>
          {categories.map(cat => (
            <button
              key={cat._id}
              className={`px-5 py-2 rounded-full border font-medium focus:outline-none transition-all duration-200 ${
                selectedCategories.includes(cat._id)
                  ? 'bg-primary text-white shadow'
                  : 'bg-white text-primary border-primary'
              }`}
              onClick={() => toggleCategory(cat._id)}
              aria-pressed={selectedCategories.includes(cat._id)}
              style={cat.color ? {
                borderColor: cat.color,
                color: selectedCategories.includes(cat._id) ? '#ffffff' : cat.color,
                backgroundColor: selectedCategories.includes(cat._id) ? cat.color : '#ffffff'
              } : {}}
            >
              {cat.title}
            </button>
          ))}
        </nav>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 py-3">
          {filteredResources.length === 0 && (
            <div className="col-span-full text-center text-gray-500 text-lg py-12">
              Nessuna risorsa trovata per questa categoria.
            </div>
          )}
          {filteredResources.map(resource => (
            <div
              key={resource._id}
              className="bg-white border border-gray-100 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col justify-between p-7 group focus-within:ring-2 focus-within:ring-primary"
              tabIndex={0}
              aria-label={`Risorsa: ${resource.name}`}
            >
              <div>
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xl font-bold mb-2 text-primary group-hover:underline group-focus:underline transition-all duration-200 block"
                  aria-label={`Vai alla risorsa: ${resource.name}`}
                >
                  {resource.name}
                </a>
                <div className="flex flex-wrap gap-2 mb-3">
                  {resource.resourceCategories.map(cat => (
                    <span
                      key={cat._id}
                      className="inline-block text-xs font-semibold px-3 py-1 rounded-full border"
                      style={cat.color ? {
                        backgroundColor: `${cat.color}1A`, // 10% opacity
                        color: cat.color,
                        borderColor: `${cat.color}33` // 20% opacity
                      } : {
                        backgroundColor: 'rgba(107, 114, 128, 0.1)', // fallback gray-500/10
                        color: '#6b7280', // fallback gray-500
                        borderColor: 'rgba(107, 114, 128, 0.2)' // fallback gray-500/20
                      }}
                    >
                      {cat.title}
                    </span>
                  ))}
                </div>
                <p className="mb-4 text-gray-700 text-base leading-relaxed">
                  {resource.description}
                </p>
              </div>
              {/* Bottone rimosso */}
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const resourcesQuery = groq`*[_type == "resource"]{_id, name, description, url, resourceCategories[]->{_id, title, color}} | order(name asc)`
  const categoriesQuery = groq`*[_type == "resourceCategories"]{_id, title, color} | order(title asc)`
  const resources = await sanityClient.fetch(resourcesQuery)
  const categories = await sanityClient.fetch(categoriesQuery)
  return { props: { resources, categories } }
}

export default ResourcesPage
