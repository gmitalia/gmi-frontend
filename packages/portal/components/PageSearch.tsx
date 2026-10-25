import React, { useState, useEffect, useRef } from "react";
import GMIApi from "../src/api/GMIApi";
import Link from "next/link";
import { basePath } from "../src/paths";
import { GameTile } from "./Contest/GameTile";
import { SearchBar } from "./commons/SearchBar";

const UserCard = ({ user }) => {
  const avatar = user.avatar ?? basePath + "/img/profile.png";

  return (
    <Link href={`/competizioni/user/?user=${user.id}`} className="flex items-center gap-3 p-3 bg-surface border border-default hover:border-content/30 transition-colors cursor-pointer">
      
        <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-surface-muted">
          <img className="w-full h-full object-cover" src={avatar} alt={user.name} loading="lazy" />
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-content truncate">{user.name}</p>
          <p className="text-xs text-content-muted">Visualizza profilo</p>
        </div>
      </Link>
  );
};

export default function PageSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef<HTMLInputElement>(null);
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
    <div className="w-full">
      {/* Search Bar */}
      <div className="mb-8">
        <SearchBar
          ref={inputRef}
          value={query}
          onChange={setQuery}
          onClear={handleClear}
          placeholder="Cerca giochi o partecipanti..."
          ariaLabel="Cerca giochi o partecipanti"
          autoFocus
        />
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
        <div className="p-4 bg-error/10 border border-error/20 text-error text-sm">
          {error}
        </div>
      )}

      {/* Empty State */}
      {isEmptySearch && (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
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
                  <GameTile key={game.id} game={game} contest={game.contest_id} href={`/competizioni/contest/?contest=${game.contest_id}`} />
                ))}
              </div>
            </section>
          )}

          {/* Users Section */}
          {usersCount > 0 && (
            <section>
              <h2 className="text-xl font-bold text-content mb-4 flex items-center gap-2">
                Partecipanti
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
