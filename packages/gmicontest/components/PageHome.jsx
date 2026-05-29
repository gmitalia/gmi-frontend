import React, { useEffect, useMemo, useState } from "react"
import { PageLayout } from "./WebsiteLayout/PageLayout";
import GMIApi from "../src/api/GMIApi";
import RandomGameSection from "./Home/RandomGameSection";
import { Button } from "./commons/Button";
import { ChevronRightIcon, UsersIcon, DiscordIcon } from "./commons/Icons";

export default function PageHome(props) {
  const [contests, setContests] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    GMIApi.getInstance().getContests((data) => {
      if (data?.success)
        setContests(data.contests || []);
    });

    GMIApi.getInstance().getStats((data) => {
      if (data?.success)
        setStats(data.stats);
    });
  }, []);

  const latestContest = useMemo(() => {
    if (!contests.length)
      return null;
    return [...contests].sort((a, b) => parseInt(b.id) - parseInt(a.id))[0];
  }, [contests]);

  return (
    <PageLayout>
      <div className="flex flex-col gap-8">
        <section className="relative rounded-md overflow-hidden">
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-surface-elevated" />

          <div className="relative p-6">
            <div className="max-w-3xl">
              <p className="uppercase tracking-widest text-xs md:text-sm mb-4 text-secondary font-semibold">
                GameMaker Italia
              </p>
              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-content">
                Competizioni
              </h1>
              <p className="mt-6 text-lg md:text-xl text-content/80 leading-relaxed">
                La vetrina delle competizioni annuali di GMI: giochi, autori, classifiche e membri della community
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                {latestContest && (
                  <Button variant="primary" size="lg" href={`/contest?contest=${latestContest.id}`} icon={<ChevronRightIcon size={20} />}>{latestContest.can_submit || !latestContest.is_ended ? "Partecipa" : "Vai all'ultima edizione"}</Button>
                )}
                <Button variant="secondary" size="lg" href="/users" icon={<UsersIcon size={20} />}>La community</Button>
              </div>
            </div>
          </div>
        </section>

        <RandomGameSection contests={contests} />

        <section className="">
          <h2 className="text-2xl font-bold text-content mb-4">I numeri di GMI</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="rounded-md bg-secondary/5 border border-secondary/30 p-5 text-center">
              <p className="text-sm text-secondary font-semibold mb-1">Competizioni</p>
              <p className="text-3xl font-bold text-content">{stats?.competitions ?? "—"}</p>
            </div>
            <div className="rounded-md bg-accent/5 border border-accent/30 p-5 text-center">
              <p className="text-sm text-accent font-semibold mb-1">Giochi creati</p>
              <p className="text-3xl font-bold text-content">{stats?.games_count ?? "—"}</p>
            </div>
            <div className="rounded-md bg-accent-warm/5 border border-accent-warm/30 p-5 text-center">
              <p className="text-sm text-accent-warm font-semibold mb-1">Partecipanti</p>
              <p className="text-3xl font-bold text-content">{stats?.participants ?? "—"}</p>
            </div>
          </div>
        </section>

        <section className="ds-card-section">
          <h2 className="text-2xl font-bold text-content mb-4">Come funziona?</h2>
          <ol className="grid gap-3 md:grid-cols-2">
            <li className="flex gap-3 rounded-md bg-surface-elevated border border-default p-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-secondary/20 text-secondary font-bold flex items-center justify-center">1</span>
              <span className="text-content/80">Invia il gioco entro la scadenza del contest</span>
            </li>
            <li className="flex gap-3 rounded-md bg-surface-elevated border border-default p-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-accent/20 text-accent font-bold flex items-center justify-center">2</span>
              <span className="text-content/80">La giuria gioca i titoli e assegna i voti</span>
            </li>
            <li className="flex gap-3 rounded-md bg-surface-elevated border border-default p-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-accent-warm/20 text-accent-warm font-bold flex items-center justify-center">3</span>
              <span className="text-content/80">Segui la live di premiazione</span>
            </li>
            <li className="flex gap-3 rounded-md bg-surface-elevated border border-default p-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-bronze/20 text-bronze font-bold flex items-center justify-center">4</span>
              <span className="text-content/80">Pubblicheremo classifica, giochi e votazioni</span>
            </li>
          </ol>
        </section>

        <section className="ds-card-section relative text-center overflow-hidden">
          {/* Background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-secondary/10 rounded-full blur-[100px]" />

          <div className="relative">
            <h2 className="text-2xl font-bold text-content mb-3">Partecipa alla community</h2>
            <p className="text-content-muted max-w-lg mx-auto mb-6">Vieni a fare quattro chiacchiere con noi</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="accent" size="lg" href="https://discord.gg/0wKBBPIbX2r3S32a" icon={<DiscordIcon size={20} />}>Entra su Discord</Button>
              {latestContest && (
                <Button variant="secondary" size="lg" href={"/contest?contest=" + latestContest.id}>Competizione più recente</Button>
              )}
            </div>
            <p className="text-sm text-content-muted mt-6">Forum:
              <a
              className="font-semibold hover:cursor-pointer ds-link ml-1"
              href="https://gmitalia.altervista.org/forum/viewforum.php?f=14&sid=b92b978427ffeb67cba37b70c30bcb27"
              target="_black"
              >
                gmitalia.altervista.org/forum
              </a>
            </p>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
