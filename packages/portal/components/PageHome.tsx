import React, { useEffect, useMemo, useState } from "react"
import { PageLayout } from "./WebsiteLayout/PageLayout";
import GMIApi from "../src/api/GMIApi";
import RandomGameSection from "./Home/RandomGameSection";
import { Button } from "./commons/Button";

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
        <section className="relative bg-surface border border-default overflow-hidden">
          <div className="relative p-6 md:p-10">
            <div className="max-w-3xl">
              <p className="uppercase tracking-widest text-xs mb-4 text-accent font-semibold">
                GameMaker Italia
              </p>
              <h1 className="text-4xl md:text-6xl font-normal leading-tight text-content">
                Competizioni
              </h1>
              <p className="mt-4 text-lg md:text-xl text-content-muted leading-relaxed">
                La vetrina delle competizioni e game jam di GMI: partecipa per vincere la fantastica maglietta (e probabilmente un vasetto di babbà)
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {latestContest && (
                  <Button variant="primary" size="lg" href={`/competizioni/contest?contest=${latestContest.id}`}>{latestContest.can_submit || !latestContest.is_ended ? "Partecipa" : "Vai all'ultima edizione"}</Button>
                )}
                <Button variant="secondary" size="lg" href="/competizioni/users">La community</Button>
              </div>
            </div>
          </div>
        </section>

        <RandomGameSection contests={contests} />

        <section className="">
          <h2 className="text-3xl font-normal text-content mb-4">Statistiche</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-surface border border-default p-5 text-center">
              <p className="text-sm text-content-muted font-semibold mb-1">Competizioni</p>
              <p className="text-3xl font-bold text-content">{stats?.competitions ?? "—"}</p>
            </div>
            <div className="bg-surface border border-default p-5 text-center">
              <p className="text-sm text-content-muted font-semibold mb-1">Giochi creati</p>
              <p className="text-3xl font-bold text-content">{stats?.games_count ?? "—"}</p>
            </div>
            <div className="bg-surface border border-default p-5 text-center">
              <p className="text-sm text-content-muted font-semibold mb-1">Partecipanti</p>
              <p className="text-3xl font-bold text-content">{stats?.participants ?? "—"}</p>
            </div>
          </div>
        </section>

        <section className="ds-card-section">
          <h2 className="text-3xl font-normal text-content mb-4">Vuoi vincere la maglietta?</h2>
          <ol className="grid gap-3 md:grid-cols-2">
            <li className="flex gap-3 bg-surface-muted border border-default p-4">
              <span className="flex-shrink-0 w-8 h-8 border border-default text-content-muted font-bold flex items-center justify-center">1</span>
              <span className="text-content/80">Invia il gioco entro la scadenza del contest</span>
            </li>
            <li className="flex gap-3 bg-surface-muted border border-default p-4">
              <span className="flex-shrink-0 w-8 h-8 border border-default text-content-muted font-bold flex items-center justify-center">2</span>
              <span className="text-content/80">La giuria gioca i titoli e assegna i voti</span>
            </li>
            <li className="flex gap-3 bg-surface-muted border border-default p-4">
              <span className="flex-shrink-0 w-8 h-8 border border-default text-content-muted font-bold flex items-center justify-center">3</span>
              <span className="text-content/80">Segui la live di premiazione</span>
            </li>
            <li className="flex gap-3 bg-surface-muted border border-default p-4">
              <span className="flex-shrink-0 w-8 h-8 border border-default text-content-muted font-bold flex items-center justify-center">4</span>
              <span className="text-content/80">Pubblicheremo classifica, giochi e votazioni</span>
            </li>
          </ol>
        </section>

        <section className="ds-card-section text-center">
          <div>
            <h2 className="text-3xl font-normal text-content mb-3">Partecipa alla community</h2>
            <p className="text-content-muted max-w-lg mx-auto mb-6">Vieni a fare quattro chiacchiere con noi</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button variant="primary" size="lg" href="https://discord.gg/0wKBBPIbX2r3S32a">Entra su Discord</Button>
              {latestContest && (
                <Button variant="secondary" size="lg" href={"/competizioni/contest?contest=" + latestContest.id}>Competizione più recente</Button>
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
