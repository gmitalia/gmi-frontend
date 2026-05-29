import React, { useEffect, useState } from "react";
import { PageLayout } from "./WebsiteLayout/PageLayout"; 
import UserList from "./UsersList/UserList";

export default function PageUsers(props)
{

  return (
    <PageLayout>
      <div className="flex flex-col gap-6">
        <section className="ds-card-section p-6 md:p-8">
          <h1 className="text-3xl font-extrabold">La community</h1>
          <p className="ds-text-muted mt-2">Esplora i membri della community, ordina per attività e trova rapidamente profili, partecipazioni, vittorie e giudizi.</p>
        </section>
        <section className="ds-card-section p-6 md:p-8">
          <UserList/>
        </section>
      </div>
    </PageLayout>
  );
}
