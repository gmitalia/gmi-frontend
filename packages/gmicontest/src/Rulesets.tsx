import React from "react";
import RuleBook from "../components/commons/RuleBook";

export const Rulesets =
{
	"original":
	{
		// 2004 -> 2011
		contest: [1,2,3,4,5,6,7,8],	
		rules: "",
		method: "Il regolamento originale ed usato per più anni, prevedeva 2 fasi di voto e diverse categorie: Grafica, Sonoro, Giocabilità, Tecniche, Originalità, Longevità",
		rulebook: 
		(
			<div className="vote-tables flex flex-col gap-3 p-6">
				 <h2 className="text-2xl font-bold text-gray-900">
		        Regolamento della competizione
		      </h2>
				<b className="p-3" style={{color: "red", background: "#ff000017"}}>
					Questo regolamento è quello 'originale' in vigore negli anni 2004-{">"}2011, per leggere il regolamento moderno consulta quello su una competizione recente o sulla home
				</b>

				<ul>
					<li>1 - I giochi vanno consegnati all'e-mail del capo-giuria entro la mezzanotte del giorno della consegna;</li>
					<li>2 - I giochi accettati devono essere completi, stand-alone o editable (in entrambi i casi devono essere compressi in zip), devono essere creati in Game Maker, non devono essere già stati presentati in una competizione di GMItalia.tk precedente, devono essere in lingua Inglese o Italiana e non devono contenere materiale pornografico o adatto ad un pubblico adulto o illegale: software pirata, mp3 che violino il regolamento internazionale sul diritto d'autore. Un concorrente non può partecipare con più di un (1) gioco;</li>
					<li>3 - Il capo-giuria, dopo aver verificato la presenza di eventuali virus e l'integrità dei file pervenuti (sarà comunque concessa la possibilità di ri-inviare i giochi in questo caso), ne diffonderà una copia per ogni giurato;</li>
					<li>3.1 - Chiunque partecipi alla giuria non è in grado di partecipare come concorrente;</li>
					<li>4 - Entro due (2) settimane dalla scadenza della competizione, i giudici dovranno far pervenire una e-mail al capo-giuria (vedi punto 1) con le informazioni del punto 5. Se per la conlusione di questo punto si dovesse impiegare più tempo delle due (2) settimane, il giurato verrà richiamato e si posticiperà la data di consegna;</li>
					<li>5 - Le votazioni procederanno in questo modo:</li>
				</ul>
					

				<div className="flex flex-col">
					<b>Prima fase: nomination. </b>
					Ogni gioco riceverà un voto da 1 a 10 per ogni categoria, abbinato ad un breve commento di motivazione (le motivazioni dovranno essere concrete ed il voto in linea con esso. GMItalia.tk si riserva il diritto di invalidare, a discrezione, votazioni ritenute non serie ed escludere, eventualmente, il votante dalle votazioni delle competizioni successive). Ogni legittimato al voto dovrà valutare tutti i giochi in concorso, ovviamente eccetto i propri. La media dei voti ottenuti da ciascun gioco stabilirà i giochi finalisti. In caso di parità di voti, si andrà al ballottaggio.
				</div>

				<div className="flex flex-col">
					<b>Seconda fase: proclamazione dei vincitori finali. </b>
					Ogni giudice della "giuria di qualità" esprimerà, per ogni categoria, un ordine di preferenza fra i quattro giochi in nomination, motivando le scelte con un breve commento. In caso di parità, si andrà al ballottaggio. In caso di ulteriore pareggio, verrà preferito il gioco con il migliore piazzamento alle nominations.
				</div>

				<div className="flex flex-col">
					<b>Categorie nominations.</b> 
					Miglior Grafica, Miglior Sonoro (suoni e musica), Migliore Giocabilità, Miglior Gioco (categoria che garantirà la vittoria), Miglior Tecnica (migliori tecniche utilizzate nel gioco, come innovazioni, effetti speciali e così via), Originalità e Longevità. 
				</div>
				Se i giochi sono meno di 4, si procederà secondo le sole regole delle nominations.
			</div>
		)
	},

	"classic":
	{
		// 2013 -> 2017
		contest: [9,10,11,12,13,14],	
		rules: "",
		method: "Una forma leggermente modificata del regolamento precedente, prevedeva sempre 2 fasi e una categoria di voto in più oltre a quella generale: Grafica, Sonoro, Giocabilità, Longevità, Carisma, Professionalità, Generale",
		rulebook:
		(
			<div className="vote-tables flex flex-col gap-3 p-6">
				 <h2 className="text-2xl font-bold text-gray-900">
		        Regolamento della competizione
		      </h2>
				<b className="p-3" style={{color: "red", background: "#ff000017"}}>
					Questo regolamento è quello 'classico' in vigore negli anni 2013-{">"}2017, per leggere il regolamento moderno consulta quello su una competizione recente o sulla home
				</b>

				I giochi inviati devono essere conformi alle seguenti caratteristiche:
				<ul>
					<li>devono essere completi (non beta e dunque interamente giocabili, privi di bug che ne compromettano il totale funzionamento);</li>
					<li>devono essere stand-alone (EXE, poichè non tutti i giudici potrebbero avere GM registrato o la vostra versione);</li>
					<li>devono essere inviati compressi con una dimensione massima di 80 megabyte (zip, rar);</li>
					<li>devono essere creati con Game Maker (versioni non beta del tool a partire dalla 5.3, ma si CONSIGLIA la 7/8 che va anche su Vista, 7 ecc... -non importa se registrate o meno-. Anche GMStudio ovviamente é OK). I giochi devono comunque funzionare su windows vista e superiori, quindi per exe creati con da GM6 in giù, usate il convertitore.</li>
					<li>devono funzionare su windows</li>
					<li>non devono essere già stati presentati in una competizione di GMItalia.tk precedente o già presentati alla comunità;</li>
					<li>devono essere in lingua Inglese o Italiana;</li>
					<li>non devono contenere virus o istruzioni che possono danneggiare pc altrui;</li>
					<li>non devono contenere materiale pornografico, altamente offensivo o adatto ad un solo pubblico adulto;</li>
					<li>possono essere in 3d o 2d e avere il supporto di DLL (citate gli autori dei materiali se non siete voi);</li>
					<li>possono essere anche multigiocatore e con supporto al gioco online, ma solo se è anche disponibile una modalità a gioco singolo. Possono partecipare anche i giochi che necessitano di due giocatori (umano vs umano) nello stesso pc.</li>
					<li>si consiglia di valutare bene il livello di difficoltà del gioco e se necessario inserire una selezione di difficoltà o dei trucchi per evitare che il gioco non possa essere finito da un membro della giuria. Tali cheats inseritele se volete durante l'e-mail di invio.</li>
					<li>non devono essere pubblicati sul sito/forum prima dei giudizi finali pena esclusione. (se volete presentare demo parziali, iniziali e non complessive del gioco va bene, ma fate a vostro rischio e pericolo)</li>
				</ul>
				Le risorse altrui vanno specificate nei crediti, si consiglia però di farne un modesto uso perché potrebbe portare la giuria a quantificare un minore impegno da parte del programmatore (magari anche a discapito della qualità del gioco es. grafica rippata male).
				Si ricorda che la giuria giudica il gioco in se, però essendo una comunità di “creatori di giochi” capirete bene che anche il giudizio sul lavoro svolto con le proprie mani è importante. Il tutto è delegato al buonsenso della giuria.

				<b style={{fontSize: "1.5rem"}}>Il concorrente</b>
				si impegna a leggere e comprendere il regolamento e le caratteristiche dei giochi da inviare;
				non può partecipare con più di un gioco;
				deve essere il reale e l'unico sviluppatore del gioco (va bene usare risorse altrui specificando tutto nei crediti, vedi sopra);
				deve essere iscritto al forum;
				non deve far parte della giuria (ma va?).
				Capo giuria e giurati
				Il capo giuria, dopo aver verificato la presenza di eventuali virus e l'integrità dei file pervenuti (non sarà concessa la possibilità di rimandare il file, al massimo hostatene una copia di sicurezza e fornitemela assieme al primo link), ne diffonderà una copia per ogni giurato attraverso un sito FTP dove verranno ricaricati i giochi mandati.

				Con questa copia verrà fornito anche un modulo da riempire per le votazioni.

				<b style={{fontSize: "1.5rem"}}>I giurati</b>
				si impegnano a non diffondere il gioco e a rispettare la privacy dell'autore e ai dati personali
				si impegnano a giocare a tutti i titoli e rispettare il procedimento seguente.
				Entro due (2) settimane dalla scadenza della competizione, i giudici dovranno far pervenire una e-mail al capo-giuria (vedi punto 1) con le informazioni del punto 4. Se per la conlusione di questo punto si dovesse impiegare più tempo delle due (2) settimane il giurato dovrà fornire una spiegazione e nel caso si posticiperà la data di consegna, se sarà impossibilitato nel fornire i giudizi verrà scartato dalla giuria.
				Eventualmente se i giochi presenti saranno tanti si provvederà ad allungare il termine accordandosi.

				Il capo giuria avrà come funzione la gestione dei risultati e non esporrà propri giudizi per non essere influenzato dagli altri giurati, inoltre si riserva la possibilità di escludere un giurato nel caso non rispettasse gli impegni presi.

				<b style={{fontSize: "1.5rem"}}>Votazioni</b>
				Le votazioni procederanno in questo modo:

				<b>Fase 1</b>
				Ogni gioco riceverà un voto da 1 a 10 per ogni categoria (grafica, sonoro ecc...), abbinato ad un breve commento di motivazione (le motivazioni dovranno essere concrete ed il voto in linea con esso. GMItalia.tk si riserva il diritto di invalidare, a discrezione, votazioni ritenute non serie ed escludere, eventualmente, il votante dalle votazioni delle competizioni successive).
				Ogni legittimato al voto dovrà valutare tutti i giochi in concorso. La media dei voti ottenuti da ciascun gioco stabilirà i giochi finalisti. In caso di parità di voti, si andrà al ballottaggio.

				Ogni gioco riceverà dei punti (da 1 a 3) in base alla media più alta nella categoria.

				Questa fase è utile all'utente che ha partecipato per avere un giudizio sui vari parametri.

				<b>Fase 2</b>
				A ogni gioco verrà dato un voto complessivo e unico con cui verrà stillata la classifica finale tenendo conto per i ballottaggi dei punti ricevuti prima.
			</div>
		)
	
	},

	"experimental":
	{
		// 2018 -> 2020
		contest: [15,16,17,18],	
		rules: "",
		method: "Usata per alcuni anni come modifica più concisa dei sistemi precedenti, prevedeva solo 3 categorie di voto: Artisticità, Professionalità, Immersione",
		rulebook:
		(
			<div className="vote-tables flex flex-col gap-3 p-6">
				 <h2 className="text-2xl font-bold text-gray-900">
		        Regolamento della competizione
		      </h2>
				<b className="p-3" style={{color: "red", background: "#ff000017"}}>
					Questo regolamento è quello 'sperimentale' in vigore negli anni 2018-{">"}2020, per leggere il regolamento moderno consulta quello su una competizione recente o sulla home
				</b>

				I giochi inviati devono essere conformi alle seguenti caratteristiche
				<ul>
					<li>Devono essere completi (non beta e dunque interamente giocabili, privi di bug che ne compromettano il totale funzionamento);</li>
					<li>Devono essere stand-alone (in formato .exe funzionanti almeno su windows 7), si può allegare un eventuale versione android (.apk), Mac/Linux o Web(Html5) ma deve comunque essere presente la versione windows;</li>
					<li>Devono essere inviati compressi in formato zip (non vi sono limiti di dimensioni ma contenetevi, se la dimensione supera i 500MB ed il motivo è un palese spreco di risorse verranno presi provvedimenti, pertanto evitate di fare giochi "click the ball" con 600 canzoni mp3, chi manda un gioco del genere verrà bannato per 1 mese da me in persona [mi danno i permessi]);</li>
					<li>Devono essere creati con Game Maker dalla versione 5 in poi (I giochi devono comunque funzionare su windows 7 e superiori, quindi per exe creati con da GM6 in giù, usate il convertitore). Ovviamente è consentito anche l'utilizzo di Game Maker: Studio, considerato diretto erede del nostro antico tool;</li>
					<li>Devono essere esportati e consegnati sotto forma di archivio zip(opzione di export disponibile per Game Maker: Studio). Nel caso si utilizzi Game Maker 6(o versioni successive) sarà accettato il classico file exe purchè zippato. In ogni caso si eviti completamente l'export sotto forma di installer;</li>
					<li>Devono essere in lingua Inglese o Italiana;</li>
					<li>Non devono essere già stati presentati in una competizione di GMItalia precedente o già rilasciati in giro per il web;</li>
					<li>Non devono contenere virus o istruzioni che possono danneggiare pc altrui;</li>
					<li>Non devono resi pubblici sul web prima dei giudizi finali pena esclusione. (se volete presentare demo parziali, iniziali e non complessive del gioco va bene, ma fate a vostro rischio e pericolo);</li>
					<li>Possono essere in 3d o 2d e avere il supporto di DLL (citate gli autori dei materiali se non siete voi);</li>
					<li>Possono essere anche multi giocatore e con supporto al gioco online. Possono anche partecipare anche i giochi che necessitano di due giocatori (umano VS umano) nello stesso pc;</li>
					<li>Possono contenere materiale pornografico, offensivo, o più in generale, non adatto ad un pubblico di minori, purchè non sia fine a se stesso. Non si vuole in alcun modo imporre una censura così che ogni autore sia libero di esprimersi tramite le sue opere. Si consiglia tuttavia di utilizzare buon senso, in quanto la presenza di eccessi sotto questo aspetto o la mancata giustificabile motivazione della presenza di tale materiale verrà punita con la squalifica del titolo dalla gara;</li>
					<li>Si consiglia di valutare bene il livello di difficoltà del gioco e se necessario inserire una selezione di difficoltà o dei trucchi per evitare che il gioco non possa essere finito da un membro della giuria. Tali cheats inseritele se volete durante l'e-mail di invio;</li>
					<li>Si può partecipare in team. (in tal caso, durante l'invio del gioco, bisogna specificare nel PM chi riceverà l'eventuale premio).</li>
					<li>Nonostante ne sia completamente consentito l'utilizzo, si invitano i partecipanti a specificare con quanta chiarezza possibile la quantità di risorse non proprie utilizzate all'interno del titolo(che sia in un file di testo o nei crediti). Il gioco verrà valutato nell'insieme, ma è innegabile il fatto che chi ha investito tempo nella realizzazione di un proprio compartimento artistico ha motivo di essere ricompensato.</li>
					<li>Il discorso si riflette anche sul codice. L'utilizzo di DLL, estensioni, shader o qualsivoglia altra componente di codice non proprio ha motivo di essere debitamente specificato, al pari di un qualsiasi sprite o effetto sonoro.</li>
				</ul>

				<b style={{fontSize: "1.5rem"}}>Il concorrente</b>
				Si impegna a leggere e comprendere il regolamento e le caratteristiche dei giochi da inviare;
				Non può partecipare con più di un gioco;
				Non è ammesso partecipare con giochi degli altri (va bene usare risorse altrui specificando tutto nei crediti, vedi sopra);
				Deve essere iscritto al forum;
				Non deve far parte della giuria.

				<b style={{fontSize: "1.5rem"}}>Regolamento giuria</b>
				Il capo giuria, dopo aver verificato la presenza di eventuali virus e l'integrità dei file pervenuti (non sarà concessa la possibilità di rimandare il file, al massimo hostatene una copia di sicurezza e fornitela assieme al primo link), ne diffonderà una copia per ogni giurato.



				Tempo di giudizio: 2 Settimane.

				<b style={{fontSize: "1.5rem"}}>I giurati</b>
				Si impegnano a non diffondere il gioco e a rispettare la privacy dell'autore e ai dati personali;
				Si impegnano a giocare a tutti i titoli nei tempi di giudizio previsti;
				Non possono commentare nei topic relativi ai giochi durante il periodo di giudizio.
				Alla scadenza della competizione, i giudici dovranno valutare tutti i giochi e far pervenire un PM al capo-giuria con il modulo compilato entro il "Tempo di giudizio"
				Se per la conclusione di questo punto si dovesse impiegare più tempo del previsto il giurato dovrà fornire una spiegazione e nel caso si posticiperà la data di consegna, se sarà impossibilitato nel fornire i giudizi verrà scartato dalla giuria.
				Se i giochi presenti saranno tanti si provvederà ad allungare il termine accordandosi.

				Il capo giuria avrà come funzione la gestione dei risultati(oltre che la ovvia funzione di giudice) e si riserva la possibilità di escludere un giurato nel caso non rispettasse gli impegni presi. I giudizi di tutti i giurati così come del capo giuria saranno mantenuti privati(confidenzialità anche verso gli altri giudici) fino al calcolo dei risultati, momento in cui, al termine del tempo di giudizio, i voti di ciascun giudice saranno resi pubblici.

				La votazione avviene attraverso una piattaforma online che calcola automaticamente classifica principale e statistiche secondarie.

				<b style={{fontSize: "1.5rem"}}>Parametri di Giudizio</b>

				<b>Artisticità</b>
				Valutazione del gioco dal punto di vista puramente artistico, avente come riferimento una valutazione sull'artisticità della grafica utilizzata e del compartimento sonoro, e di conseguenza il connubio tra i due. Vuole essere implicito il fatto che verrà premiato chi si sarà preso il fardello di produrre materiale proprio. Si vuole quindi scoraggiare l'uitilizzo di assets 'rippati' da altri titoli, in quanto uccidono il concetto stesso di arte. L'influenza di quest'ultimi sulla valutazione finale è lasciata al buon senso dei giurati.
				<br/>
				
				<b>Professionalità</b>
				Valutazione del gioco dal punto di vista puramente tecnico, avente come riferimento una valutazione sul gameplay, la longevità, la cura per il dettaglio del titolo ed in generale, la parvenza di professionalità e buona fattura trasmesse all'utente. Da notare che con 'valutazioni di riferimento' si intendono in linea generale gli aspetti del gioco che questa categoria andrà ad esprimere; Questo non significa che ogni aspetto abbia lo stesso peso all'interno della valutazione. L'importanza di una lacuna sotto uno degli aspetti di riferimento è lasciata alla soggettività ed al buon senso dei giurati. Questo non esclude la necessità di essere il più oggettivi possibile; Valutare la buona fattura di un titolo non può essere puramente soggettivo ed alcuni fatti dovranno essere necessariamente presi in considerazione.
				<br/>
				
				<b>Immersione</b>
				Valutazione del gioco dal punto di vista carismatico, avente come riferimento una valutazione sull'originalità, sulla trama o eventuale lore ed in generale su tutti gli elementi del titolo che sono stati in grado di sedurre e rapire l'utente. Se la professionalità ha come scopo la valutazione della cura per il titolo, l'immersione ne è l'esatto opposto; A prescindere da eventuali pecche o pratiche poco professionali, questa categoria vuole valutare con quanto successo è trasmessa quella sensazione di voler giocare ininterrottamente e la capacità del titolo di farti perdere di vista l'orologio. In questa categoria più di tutte è chiamata in causa la soggettività dei giudici.
				<br/>	<br/>	<br/>

				Le votazioni procederanno in questo modo:
				<br/>
				Ogni gioco riceverà un voto da 1 a 10 per ogni categoria (artisticità, professionalità, immersione), abbinato ad un breve commento di motivazione (le motivazioni dovranno essere concrete ed il voto in linea con esso. GMItalia si riserva il diritto di invalidare, a discrezione, votazioni ritenute non serie ed escludere, eventualmente, il votante dalle votazioni delle competizioni successive).
				Ogni legittimato al voto dovrà valutare tutti i giochi in concorso. La media dei voti ottenuti da ciascun gioco stabilirà i giochi finalisti. In caso di parità di voti, si andrà al ballottaggio.
				<br/>
				Il ballottaggio non sarà altro che una discussione all'interno della giuria, con lo scopo di determinare un vincitore.
			</div>
		)
	},
	
	"modern":
	{
		// 2021 -> ....
		contest: [0],	
		rules: "",
		method: "Il sistema moderno e attualmente in uso, prevede un unico voto e commento a giudice, più dei pro e contro segnalabili",
		rulebook: RuleBook()
	},

}


export function GetRulebook(contest_id: number)
{
	return Object.values(Rulesets).find(o=> o.contest.includes(contest_id))?.rulebook ?? RuleBook()
}