import React from "react";
import Head from "next/head";
import { SectionLayout } from "../../components/WebsiteLayout/SectionLayout";
import PageSearch from "../../components/PageSearch";
import { competitionTabs } from "../../src/competitionSections";

export default function SearchPage() {
  return (
    <>
      <Head>
        <title>GMI Competizioni | Cerca</title>
      </Head>
      <SectionLayout
        title="Cerca"
        description="Trova un gioco o un partecipante."
        tabs={competitionTabs}
      >
        <PageSearch />
      </SectionLayout>
    </>
  );
}
