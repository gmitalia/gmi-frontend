import React, { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { Button } from "../commons/Button";
import GMIApi from "../../src/api/GMIApi";
import RandomGameThumbnail from "./RandomGameThumbnail";
import { parseAuthors } from "../../src/Utils";

interface Contest {
  id: number;
  name: string;
  end_at: string;
  can_submit: boolean;
  completed_at: string;
  public: boolean;
  is_ended: boolean;
  is_completed: boolean;
}

interface GameWithContest {
  id: number;
  name: string;
  image_url: string;
  short_description?: string;
  authors: string;
  placement?: string | number;
  contestId: number;
  contestName: string;
}

export default function RandomGameSection({ contests }: { contests: Contest[] }) {
  const [games, setGames] = useState<GameWithContest[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isMountedRef = useRef(true);

  const loadRandomGames = useCallback(async () => {
    if (contests.length === 0) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const loadedGames: GameWithContest[] = [];

    // Shuffle contests and pick up to 3 to try loading games from
    const shuffledContests = [...contests].sort(() => Math.random() - 0.5);

    for (const contest of shuffledContests) {
      if (loadedGames.length >= 3) break;

      await new Promise<void>((resolve) => {
        GMIApi.getInstance().getGames(String(contest.id), (data) => {
          if (data?.games?.length > 0) {
            const randomIndex = Math.floor(Math.random() * data.games.length);
            const selected = data.games[randomIndex];
            loadedGames.push({
              ...selected,
              contestId: contest.id,
              contestName: contest.name,
            } as GameWithContest);
          }
          resolve();
        });
      });
    }

    if (isMountedRef.current) {
      setGames(loadedGames);
      setCurrentIndex(0);
      setIsLoading(false);
    }
  }, [contests]);

  useEffect(() => {
    isMountedRef.current = true;
    loadRandomGames();

    return () => {
      isMountedRef.current = false;
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
        autoplayRef.current = null;
      }
    };
  }, [loadRandomGames]);

  // Autoplay every 5 seconds
  useEffect(() => {
    if (games.length <= 1) return;

    autoplayRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % games.length);
    }, 5000);

    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
        autoplayRef.current = null;
      }
    };
  }, [games.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    // Reset autoplay timer on manual navigation
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % games.length);
      }, 5000);
    }
  };

  const currentGame = games[currentIndex];

  const renderAuthors = (authorsString: string) => {
    const parsedAuthors = parseAuthors(authorsString);
    if (parsedAuthors.length === 0) return "Autore sconosciuto";

    return (
      <>
        {parsedAuthors.map((a, i) => (
          <React.Fragment key={a.id}>
            <Link
              href={`/competizioni/user/?user=${a.id}`}
              className="text-gray-700 hover:text-gray-900 hover:underline hover:decoration-2 hover:underline-offset-4 transition-colors"
            >
              {a.name}
            </Link>
            {i < parsedAuthors.length - 1 && <span className="text-gray-400">, </span>}
          </React.Fragment>
        ))}
      </>
    );
  };

  if (isLoading) {
    return (
      <section className="border border-gray-200 bg-white p-6 md:p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-6 w-32 bg-gray-200 rounded" />
          <div className="grid gap-6 md:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-video bg-gray-200 rounded" />
                <div className="h-6 w-3/4 bg-gray-200 rounded" />
                <div className="h-4 w-1/2 bg-gray-200 rounded" />
                <div className="h-4 w-full bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (games.length === 0) {
    return (
      <section className="border border-gray-200 bg-white p-6 md:p-8 text-center">
        <p className="text-gray-500">Nessun gioco disponibile al momento.</p>
      </section>
    );
  }

  return (
    <section className="border border-gray-200 bg-white p-6 md:p-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h2 className="text-2xl font-normal text-gray-900">Giochi in evidenza</h2>
        <div className="flex items-center gap-2">
          {games.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? "bg-gray-900 w-6" : "bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Vai al gioco ${index + 1}`}
              aria-current={index === currentIndex ? "true" : "false"}
            />
          ))}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {games.map((game, index) => (
          <article
            key={game.id}
            className={`group border border-gray-200 bg-white transition-shadow duration-300 ${
              index === currentIndex ? "shadow-lg ring-2 ring-gray-200" : "opacity-60 hover:opacity-100 hover:shadow-md"
            }`}
            aria-current={index === currentIndex ? "true" : "false"}
          >
            <Link
              href={`/competizioni/contest/?contest=${game.contestId}#game-${game.id}`}
              className="block"
              aria-label={`Vedi dettagli di ${game.name}`}
            >
              <div className="relative aspect-video overflow-hidden bg-gray-100">
                <RandomGameThumbnail game={game} className="w-full h-full transition-transform duration-500 group-hover:scale-[1.02]" />
                {index === currentIndex && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                )}
              </div>
            </Link>
            <div className="p-4 space-y-2">
              <h3 className="font-medium text-gray-900 line-clamp-1">
                <Link
                  href={`/competizioni/contest/?contest=${game.contestId}#game-${game.id}`}
                  className="hover:underline transition-colors"
                >
                  {game.name}
                </Link>
              </h3>
              <p className="text-xs text-gray-500">di {renderAuthors(game.authors)}</p>
              <p className="text-xs text-gray-400">{game.contestName}</p>
              {game.short_description && (
                <p className="text-sm text-gray-500 line-clamp-2 italic">
                  {"\"" + game.short_description + "\""}
                </p>
              )}
            </div>
          </article>
        ))}
      </div>

      {games.length > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            onClick={() => goToSlide((currentIndex - 1 + games.length) % games.length)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-900"
            aria-label="Gioco precedente"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => goToSlide((currentIndex + 1) % games.length)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-900"
            aria-label="Gioco successivo"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </section>
  );
}