import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getQuery } from "../src/Utils";
import { ParticipantType } from "../src/Constants";
import GameForm from "./Forms/GameForm";
import GMIApi from "../src/api/GMIApi";
import InfoMessage from "./commons/InfoMessage";
import { PageLayout } from "./WebsiteLayout/PageLayout";
import { Button } from "./commons/Button";
import { competitionsPath } from "../src/paths";


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
        router.push("/competizioni/contest?contest=" + query.contest);
      } else setError(data.error);
    });
  }

  function renderBody(body) {
    return (
      <PageLayout
        breadcrumbs={[
          { label: "Competizioni", href: competitionsPath("/") },
          ...(query.contest
            ? [
                {
                  label: "Dettaglio competizione",
                  href: `${competitionsPath("/contest")}?contest=${query.contest}`,
                },
              ]
            : []),
          { label: "Partecipazione" },
        ]}
      >
        <div className="w-full flex flex-col gap-2 pb-12 pt-4">
          {body}
        </div>
      </PageLayout>
    );
  }

  if (error) {
    // Check if it's a "not logged in" error and show a nice explanatory page
    const isNotLoggedError = typeof error === 'string' &&
      error.toLowerCase().includes('not logged');

    if (isNotLoggedError) {
      return renderBody(
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <h2 className="text-2xl font-bold text-content mb-3">Accesso richiesto</h2>
          <p className="text-content-muted max-w-md mb-6">
            Per iscriverti o gestire la tua partecipazione alla competizione devi aver effettuato l'accesso con il tuo account Discord.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="primary" size="lg" onClick={() => { GMIApi.getInstance().login(); }}>Accedi con Discord</Button>
          </div>
        </div>
      );
    }

    return renderBody(error);
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
    let isJudge = participation.kind == String(ParticipantType.judge);

    return renderBody(
      <>
        <InfoMessage>
          Sei iscritto come {isJudge ? "Giudice" : "Partecipante"}
        </InfoMessage>

        <div className="flex-grow-v">
          <GameForm
            participation={participation}
            onFormSubmit={onFormSubmit}
            onDelete={onDelete}
            contestId={query.contest}
          />
        </div>
      </>
    );
  } else return <div>loading</div>;
}
