import React, { useEffect, useState } from "react"
import { PageLayout } from "./library/Layouts/PageLayout";
import { ParagraphTitle } from "./library/Titles/ParagraphTitle";
import { PageTitle } from "./library/Titles/PageTitle";
import { ExtLink } from "./library/Links/ExtLink";
import { ButtonPrimary } from "./library/Buttons/ButtonPrimary";
import RuleBook from "./RuleBook";

export default function PageHome(props) {

  return (
    <PageLayout>
      <>
        <PageTitle title="Competizione annuale">
        </PageTitle>
        <div style={{background: "url('./img/banner.png')", backgroundRepeatX: "repeat",width: "100%", height:"200px"}}></div>
        <p className="mb-4">La competizione annuale di GameMaker Italia si svolge da anni sul <ExtLink href="http://gmitalia.altervista.org/forum">forum</ExtLink>. Una game jam senza tema, tra creatori di videogiochi che utilizzano il tool GameMaker di <ExtLink href="https://www.yoyogames.com/">YoYoGames</ExtLink>, con tanto di giuria.</p>

        <RuleBook />
        
      </>
    </PageLayout>
  );
}
