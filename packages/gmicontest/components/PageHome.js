import React, { useEffect, useState } from "react"
import { PageLayout } from "./library/Layouts/PageLayout";
import { PageTitle } from "./library/Titles/PageTitle";
import { ExtLink } from "./library/Links/ExtLink";
import RuleBook from "./RuleBook";

export default function PageHome(props) {

   return (
	   <PageLayout>
	      <>
	        <PageTitle title="Competizione annuale" />
	 
	        <div style={{background: "url('./img/banner.png')", backgroundRepeatX: "repeat",width: "100%", height:"200px"}} />
			  
	        <p className="mb-4">
					La competizione annuale di GameMaker Italia si svolge da anni sul <ExtLink href="http://gmitalia.altervista.org/forum">forum</ExtLink>. 
					Una game jam senza tema, tra creatori di videogiochi che utilizzano il tool GameMaker di <ExtLink href="https://www.yoyogames.com/">YoYoGames</ExtLink>, con tanto di giuria.
				</p>

	        <RuleBook />
	        
	      </>
	    </PageLayout>
   );
}
