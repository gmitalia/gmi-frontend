import React from "react";
import { SectionLayout } from "./WebsiteLayout/SectionLayout";
import UserList from "./UsersList/UserList";
import { competitionTabs } from "../src/competitionSections";

export default function PageUsers() {
  return (
    <SectionLayout
      title="Partecipanti"
      description="Esplora le persone che hanno preso parte alle competizioni di GameMaker Italia: profili, giochi, vittorie e giudizi."
      tabs={competitionTabs}
    >
      <UserList />
    </SectionLayout>
  );
}
