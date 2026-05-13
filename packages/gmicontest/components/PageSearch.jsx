import React, { useState, useEffect, useRef } from "react";
import GMIApi from "../src/api/GMIApi";
import Link from "next/link";
import { SearchIcon, CloseIcon } from "./commons/Icons";
import { basePath } from "../next.config";
import { GameTile } from "./Contest/GameTile";

const UserCard = ({ user }) => {
  const avatar = user.avatar ?? basePath + "/img/profile.png";

  return (
    <Link href={`/user?user=${user.id}`}>
      <a className="flex items-center gap-3 p-3 rounded-md bg-surface-elevated border border-default hover:border-secondary/40 transition-all cursor-pointer hover:translate-x-1">
        <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-surface-muted">
          <img className="w-full h-full object-cover" src={avatar} alt={user.name} loading="lazy" />
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-content truncate">{user.name}</p>
          <p className="text-xs text-content-muted">Visualizza profilo</p>
        </div>
      </a>
    </Link>
  );
};

export default function PageSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const q = query.trim();

    if (q.length === 0) {
      setResults(null);
      setHasSearched(false);
      setLoading(false);
      return;
    }

    if (q.length < 2) {
      setResults(null);
      setHasSearched(true);
      setLoading(false);
      return;
    }

    setLoading(true);
    debounceRef.current = setTimeout(() => {
      GMIApi.getInstance().getSearchResults(q, (data) => {
        setLoading(false);
        setHasSearched(true);
        if (data.success) {
          setResults(data);
          setError(null);
        } else {
          setError(data.error || "Errore durante la ricerca");
          setResults(null);
        }
      });
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  const handleClear = () => {
    setQuery("");
    setResults(null);
    setHasSearched(false);
    inputRef.current?.focus();
  };

  const gamesCount = results?.games?.length || 0;
  const usersCount = results?.users?.length || 0;
  const totalResults = gamesCount + usersCount;

  const isEmptySearch = hasSearched && !loading && totalResults === 0;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-content mb-2">Cerca</h1>
        <p className="text-content-muted">
          Cerca giochi e utenti della community
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-8">
        <div className="relative flex items-center">
          <SearchIcon size={22} className="absolute left-4 text-content-muted" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cerca giochi o utenti..."
            className="w-full h-14 pl-12 pr-12 rounded-xl bg-surface-elevated border border-default text-content placeholder-content-muted/50 text-lg outline-none focus:border-secondary/50 focus:ring-2 focus:ring-secondary/20 transition-all"
          />
          {query.length > 0 && (
            <button
              onClick={handleClear}
              className="absolute right-4 p-1 rounded-md text-content-muted hover:text-content hover:bg-surface-muted transition-colors"
            >
              <CloseIcon size={20} />
            </button>
          )}
        </div>
        {query.length > 0 && query.length < 2 && (
          <p className="text-xs text-content-muted mt-2 ml-1">
            Inserisci almeno 2 caratteri per cercare
          </p>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center gap-3 py-16">
          <div className="w-10 h-10 border-thick border-secondary/30 border-t-secondary rounded-full animate-spin" />
          <span className="text-sm text-content-muted">Ricerca in corso...</span>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="p-4 rounded-md bg-error/10 border border-error/20 text-error text-sm">
          {error}
        </div>
      )}

      {/* Empty State */}
      {isEmptySearch && (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <SearchIcon size={48} className="text-content-muted/40" />
          <p className="text-content-muted text-lg">Nessun risultato trovato</p>
          <p className="text-content-muted/60 text-sm">Prova con termini di ricerca diversi</p>
        </div>
      )}

      {/* Results */}
      {results && !loading && (
        <div className="space-y-10">
          {/* Games Section */}
          {gamesCount > 0 && (
            <section>
              <h2 className="text-xl font-bold text-content mb-4 flex items-center gap-2">
                Giochi
                <span className="text-sm font-normal text-content-muted">({gamesCount})</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.games.map((game) => (
                  <GameTile key={game.id} game={game} contest={game.contest_id} href={`/contest?contest=${game.contest_id}`} />
                ))}
              </div>
            </section>
          )}

          {/* Users Section */}
          {usersCount > 0 && (
            <section>
              <h2 className="text-xl font-bold text-content mb-4 flex items-center gap-2">
                Utenti
                <span className="text-sm font-normal text-content-muted">({usersCount})</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {results.users.map((user) => (
                  <UserCard key={user.id} user={user} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
