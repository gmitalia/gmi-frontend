import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getQuery } from "../src/Utils";
import GameForm from "./Forms/GameForm";
import GMIApi from "../src/api/GMIApi";
import { SectionLayout } from "./WebsiteLayout/SectionLayout";
import { Button } from "./commons/Button";
import LoginRequiredPage from "./commons/LoginRequiredPage";
import { competitionsBreadcrumb, homeBreadcrumb } from "../src/breadcrumbs";


export default function PageEditParticipation(props) {
  let router = useRouter();
  let query = getQuery(router);

  /**@type {[Partecipation, (obj: Partecipation)=> any]} */
  let [participation, setParticipation] = useState<Partecipation>();
  let [error, setError] = useState<string>();
  let [joined, setJoined] = useState(false);

  function fetchData() {
    GMIApi.getInstance().getParticipation(query.contest, (data) => {
      if (!data.success)
        setError(data.error);
      else {
        setJoined(data.participation ? true : false);
        setParticipation(data.participation);
      }
    });
  }

  useEffect(fetchData, [query.contest]); //hook dependencies

  function onFormSubmit(game, callback) {
    console.debug("submit", game);
    GMIApi.getInstance().setParticipationData(query.contest, game, (data) => {
      //if we just joined
      if (data.success && data.joined) fetchData();

      callback(data);
    });
  }

  function onDelete() {
    console.debug("delete");
    GMIApi.getInstance().deleteParticipationData(query.contest, (data) => {
      if (data.success) {
        alert("Cancellato con successo");
        router.push("/competizioni/contest/?contest=" + query.contest);
      } else setError(data.error);
    });
  }

  function renderBody(body) {
    return (
      <SectionLayout
        title="Partecipa"
        description="Iscrivi il tuo gioco o aggiorna la partecipazione alla competizione scelta."
        breadcrumbs={[
          homeBreadcrumb,
          competitionsBreadcrumb,
          { label: "Partecipa" },
        ]}
      >
        <div className="w-full pb-12">
          {body}
        </div>
      </SectionLayout>
    );
  }

  if (error) {
    // Check if it's a "not logged in" error and show a nice explanatory page
    const isNotLoggedError = typeof error === 'string' &&
      error.toLowerCase().includes('not logged');

    if (isNotLoggedError) {
      return renderBody(
        <LoginRequiredPage message="Per iscriverti o gestire la tua partecipazione alla competizione devi aver effettuato l'accesso con il tuo account Discord." />
      );
    }

    return renderBody(
      <div className="mx-auto w-full max-w-5xl border border-error/20 bg-error/10 p-8 text-center">
        <h2 className="text-xl font-bold text-error">Errore</h2>
        <p className="mt-2 text-sm text-error">{error}</p>
        <div className="mt-6">
          <Button variant="secondary" onClick={() => router.push("/competizioni/")}>
            Torna alle competizioni
          </Button>
        </div>
      </div>
    );
  }

  //join contest
  if (!joined) {
    return renderBody(
      <GameForm
        participation={participation}
        onFormSubmit={onFormSubmit}
        onDelete={onDelete}
        contestId={query.contest}
      />
    );
  }
  //edit contest info
  else if (participation) {
    return renderBody(
      <GameForm
        participation={participation}
        onFormSubmit={onFormSubmit}
        onDelete={onDelete}
        contestId={query.contest}
      />
    );
  }

  return renderBody(
    <div className="mx-auto w-full max-w-5xl border border-gray-200 bg-white p-10">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-thick border-gray-200 border-t-gray-700" />
        <span className="text-sm text-gray-500">Caricamento partecipazione...</span>
      </div>
    </div>
  );
}
