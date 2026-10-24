import React from "react";
import Head from "next/head";
import { SectionLayout } from "../../components/WebsiteLayout/SectionLayout";
import PageRuleBook from "../../components/PageRuleBook";
import { competitionTabs } from "../../src/competitionSections";

export default function RulesPage() {
  return (
    <>
      <Head>
        <title>GMI Competizioni | Regolamento</title>
      </Head>
      <SectionLayout
        title="Regolamento"
        description="Requisiti, scadenze e metodo di giudizio delle competizioni GameMaker Italia."
        tabs={competitionTabs}
      >
        <PageRuleBook />
      </SectionLayout>
    </>
  );
}
