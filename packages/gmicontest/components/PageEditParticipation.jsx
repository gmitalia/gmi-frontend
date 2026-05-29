import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getQuery } from "../src/Utils";
import { ParticipantType } from "../src/Constants";
import GameForm from "./Forms/GameForm";
import GMIApi from "../src/api/GMIApi";
import LoginRequiredPage from "./commons/LoginRequiredPage";
import InfoMessage from "./commons/InfoMessage";
import { PageLayout } from "./WebsiteLayout/PageLayout";
import { Button } from "./commons/Button";
import { ChevronLeftIcon, UsersIcon, DiscordIcon } from "./commons/Icons";


export default function PageEditParticipation(props) {
  let router = useRouter();
  let query = getQuery(router);

  /**@type {[Partecipation, (obj: Partecipation)=> any]} */
  let [participation, setParticipation] = useState();
  let [error, setError] = useState();
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
        router.push("/contest?contest=" + query.contest);
      } else setError(data.error);
    });
  }

  function renderBody(body) {
    return (
      <PageLayout>
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
          <div className="mb-6 p-4 rounded-full bg-surface-muted border border-secondary/30">
            <UsersIcon size={48} className="text-secondary" />
          </div>
          <h2 className="text-2xl font-bold text-content mb-3">Accesso richiesto</h2>
          <p className="text-content-muted max-w-md mb-6">
            Per iscriverti o gestire la tua partecipazione alla competizione devi aver effettuato l'accesso con il tuo account Discord.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="secondary" onClick={() => router.back()} icon={<ChevronLeftIcon size={20} />}>Torna indietro</Button>
            <Button variant="primary" size="lg" onClick={() => { GMIApi.getInstance().login(); }} icon={<DiscordIcon size={20} />}>Accedi con Discord</Button>

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
    let isJudge = participation.kind == ParticipantType.judge;

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
