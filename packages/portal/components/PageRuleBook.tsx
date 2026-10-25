{/* prettier-ignore */}

import { prosList, consList } from "../src/Constants";
import { Button } from "./commons/Button";
import { DiscordIcon } from "./commons/Icons";

const PageRuleBook = ()=>
{
  return (
    <article className="prose max-w-none text-content/80">
      <div>
        {/* REGOLAMENTO COMPLETO - SEMPRE VISIBILE */}
        <div className="space-y-8">
            {/* MODALITÀ DI INVIO */}
            <section className="bg-surface p-5 border border-default">
              <h4 className="text-lg font-bold text-content m-0 mb-5">
                Come partecipare
              </h4>

              <ol className="m-0 list-none p-0 space-y-6">
                {/* STEP 1 */}
                <li className="flex gap-4">
                  <div className="relative flex flex-col items-center">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-default bg-surface-muted text-sm font-semibold text-content">
                      1
                    </span>
                    <span
                      aria-hidden="true"
                      className="absolute left-1/2 top-9 -bottom-6 w-px -translate-x-1/2 border-l border-default"
                    />
                  </div>
                  <div className="min-w-0 flex-1 pb-1">
                    <p className="m-0">Carica il gioco su un sito di hosting a scelta</p>

                    <p className="m-0 mt-3 text-sm font-semibold text-content">Siti di hosting consigliati:</p>
                    <ul className="m-0 mt-2 flex list-none flex-wrap gap-2 p-0">
                      <li>
                        <a
                          href="https://drive.google.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center border border-default bg-surface px-3 py-1.5 text-sm text-content transition-colors hover:border-content/30 hover:bg-surface-muted"
                        >
                          Google Drive
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://onedrive.live.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center border border-default bg-surface px-3 py-1.5 text-sm text-content transition-colors hover:border-content/30 hover:bg-surface-muted"
                        >
                          Microsoft OneDrive
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://www.dropbox.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center border border-default bg-surface px-3 py-1.5 text-sm text-content transition-colors hover:border-content/30 hover:bg-surface-muted"
                        >
                          Dropbox
                        </a>
                      </li>
                    </ul>
                    <p className="m-0 mt-2 text-sm text-content-muted"><strong>NOTA:</strong> Fornire sempre un link condivisibile e accessibile senza account.</p>
                  </div>
                </li>

                {/* STEP 2 */}
                <li className="flex gap-4">
                  <div className="relative flex flex-col items-center">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-default bg-surface-muted text-sm font-semibold text-content">
                      2
                    </span>
                    <span
                      aria-hidden="true"
                      className="absolute left-1/2 top-9 -bottom-6 w-px -translate-x-1/2 border-l border-default"
                    />
                  </div>
                  <div className="min-w-0 flex-1 pb-1">
                    <p className="m-0">
                      Eseguire il login attraverso un account Discord, dopodiché potrete iscrivere il vostro gioco alla competizione e caricare un link al gioco.
                    </p>
                  </div>
                </li>

                {/* STEP 3 */}
                <li className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-default bg-surface-muted text-sm font-semibold text-content">
                      3
                    </span>
                  </div>
                  <div className="min-w-0 flex-1 pb-1">
                    <p className="m-0">
                      I giochi dovranno essere consegnati nelle modalità previste entro la data e ora di scadenza, i giochi consegnati oltre la scadenza non saranno considerati. Ricordate di controllare bene il gioco prima di consegnare. Verrà prelevato il link dell'ultima versione del gioco inviata.
                    </p>
                  </div>
                </li>
              </ol>

              <div className="mt-6 space-y-3 border-t border-default pt-5">
                <p className="m-0 text-sm text-content-muted">
                  Non è necessario iscriversi anticipatamente, tutti i giochi pervenuti entro la data limite saranno considerati in gara.
                </p>
                <p className="m-0 flex items-start gap-2 text-sm text-content-muted">
                  <DiscordIcon size={16} className="mt-0.5 shrink-0" />
                  <span>
                    <strong className="font-semibold text-content">Nel caso di problemi</strong> chiedi aiuto su{" "}
                    <a
                      href="https://discord.com/invite/juj4yEF2Yv"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ds-link"
                    >
                      discord
                    </a>
                    !
                  </span>
                </p>
              </div>
            </section>

            {/* PREMI */}
            <section className="bg-surface p-5 border border-default">
              <h4 className="text-lg font-bold text-content m-0 mb-4">
                Cosa si vince?
              </h4>
              <p className="m-0">Per il primo classificato: la gloriosa <b>Maglietta GMI</b> con stampa dedicata al gioco vincitore!</p>
            </section>
            {/* REGOLAMENTO IN BREVE */}
            <div className="bg-surface p-5 border border-default">
              <h3 className="text-lg font-bold text-content m-0 mb-4">
                Regolamento in breve
              </h3>
              <ul className="m-0 space-y-2 list-disc list-inside">
                <li>Fai il login col tuo account Discord, apri la pagina di una competizione in corso e partecipa con il tuo gioco</li>
                <li>Consegna il gioco entro la scadenza: caricalo su un servizio di hosting e poi aggiungi il link del gioco sul form di partecipazione per farlo pervenire ai giudici, altrimenti scrivi in privato al capogiuria se il portale dovesse dare problemi;</li>
                <li>Puoi ficcare nel gioco tutto quello che vuoi, nessun limite! Se però dovesse includere contenuti espliciti (NSFW) avvisa i giudici preventivamente.</li>
                <li>Se il gioco dovesse presentare contenuti protetti da copyright, avvisa preventivamente i giudici e se possibile inserisci un'impostazione per disabilitarli, altrimenti potrebbero sorgere problemi nella live di premiazione su Twitch.</li>
                <li>Il gioco deve essere sviluppato per Windows e deve funzionare almeno su Windows 10, altrimenti puoi caricarlo su GX.games (sia windows che mobile va bene);</li>
                <li>Il gioco deve poter essere lanciato con un semplice doppio click (oppure giocabile direttamente su OperaGX); se arriva un installer non lo accettiamo;</li>
                <li>Non rilasciare il gioco pubblicamente prima che finisca la Compe. Caricare immagini o clip per mettere hype invece è ben accetto;</li>
                <li>Puoi fare team e puoi ovviamente far provare privatamente il gioco ad altri per testare;</li>
                <li>Prepara un file <b>README.txt</b> per informare i giudici di comandi, cheat codes ed eventualmente suggerimenti per sezioni impegnative o più semplicemente per aiutare i giudici a fruire al meglio del tuo lavoro;</li>
              </ul>
            </div>

            {/* REGOLAMENTO CONCORRENTI */}
            <section className="bg-surface p-5 border border-default">
              <h4 className="text-lg font-bold text-content m-0 mb-4">
                Regolamento concorrenti
              </h4>
              <p className="m-0 mb-2"><strong>I giochi presentati devono:</strong></p>
              <ul className="m-0 space-y-1">
                <li>Essere completi (anche se Demo è importante i giochi siano interamente giocabili, privi di bug che ne compromettano il totale funzionamento);</li>
                <li>Essere consegnati in archivio compresso (zip, 7z o rar), oppure essere caricati su Opera GXC non listati (mi raccomando, non rendetelo pubblico). NO installer;</li>
                <li>In caso partecipiate con un archivio: deve contenere una build compatibile con Windows 10, ma può contenere altre build (ad esempio mobile);</li>
                <li>In caso partecipiate con gioco su Opera GXC: è sufficiente inviare il link alla pagina corrispondente.</li>
              </ul>
              
              <ul className="m-0 mt-3 space-y-1">
                <li>Devono essere creati con GameMaker dalla versione 5 in poi (I giochi devono comunque funzionare su Windows 10 e superiori, quindi per exe creati con/da GM6 in giù usate il convertitore), GameMaker Studio o GameMaker Studio 2;</li>
                <li>Devono essere in lingua Italiana o Inglese;</li>
                <li>Non devono essere già stati presentati in una competizione di GMI precedente o già rilasciati in giro per il web, pena esclusione. È tuttavia possibile pubblicare demo parziali, iniziali e non complessive del gioco, così come immagini e video relativi ad esso;</li>
                <li>Non devono contenere malware o istruzioni che possono danneggiare pc altrui;</li>
              </ul>
              
              <ul className="m-0 mt-3 space-y-1">
                <li>Possono avvalersi di estensioni e materiale non vostro, purchè vengano citati gli autori originali;</li>
                <li>Possono essere anche multi giocatore e con supporto al gioco online. Possono partecipare anche giochi che necessitano di due o più giocatori (umani) sullo stesso pc;</li>
                <li>Possono contenere materiale NSFW o comunque non adatto ad un pubblico di minori, purchè non sia fine a se stesso. Usate il buon senso;</li>
                <li>Si consiglia di valutare bene il livello di difficoltà del gioco e se necessario inserire una selezione di difficoltà o dei trucchi, onde evitare che i membri della giuria possano incagliarsi causa bug o difficoltà troppo elevata. Potete specificare l'esistenza di trucchi in un file di testo apposito, incluso nell'archivio;</li>
                <li>Si può partecipare in team (il premio sarà comunque solo uno);</li>
                <li>Qualsiasi contenuto coperto da copyright (traccia musicale, video etc.) deve essere dichiarato nel README.txt e, preferibilmente, bisogna avere la possibilità di essere mutato. Questo provvedimento è stato preso a causa dei comportamenti di Twitch verso il materiale protetto. Va da sè che la totale assenza di materiale protetto sia la scelta migliore.</li>
              </ul>
              
              <p className="m-0 mt-3">Si invitano i partecipanti a specificare con quanta chiarezza possibile <strong>la quantità di risorse non proprie utilizzate all'interno del titolo</strong> (che sia in un file di testo o nei crediti). Il discorso si riflette anche sul codice: L'utilizzo di DLL, estensioni, shader o qualsivoglia altra componente di codice non proprio ha motivo di essere debitamente specificato, al pari di un qualsiasi sprite o effetto sonoro.</p>
              <p className="m-0 mt-2">Inutile dirlo, ma lo stesso discorso vale per i contenuti artistici realizzati con AI generativa: esattamente come con gli assets non propri, i partecipanti sono pregati di rivelare nel file README.txt l'utilizzo che si è fatto della tecnologia.</p>
              <p className="m-0 mt-2">Il gioco verrà valutato nell'insieme, ma è innegabile il fatto che chi ha investito tempo nella realizzazione del proprio comparto artistico ha motivo di essere ricompensato.</p>
              
              <p className="m-0 mt-3"><strong>Il concorrente/team:</strong></p>
              <ul className="m-0 space-y-1">
                <li>Si impegna a leggere e comprendere il regolamento e le caratteristiche dei giochi da inviare;</li>
                <li>Non può partecipare con più di un gioco;</li>
                <li>Deve essere autore principale del gioco che consegna;</li>
                <li>Non deve far parte della giuria.</li>
                <li>Accetta di vedere pubblicato sul sito GMI il proprio gioco al termine della live di premiazione. Qualora il concorrente non volesse rendere pubblica la build inviata per il giudizio, dovrà farlo presente.</li>
              </ul>
            </section>

            {/* REGOLAMENTO GIURIA */}
            <section className="bg-surface p-5 border border-default">
              <h4 className="text-lg font-bold text-content m-0 mb-4">
                Regolamento giuria
              </h4>
              <p className="m-0 mb-3">Il capo giuria, dopo aver verificato la presenza di eventuali virus e l'integrità dei file pervenuti (non sarà concessa la possibilità di rimandare il file, al massimo hostatene una copia di sicurezza e fornitela assieme al primo link), ne diffonderà una copia per ogni giurato.</p>
              <p className="m-0 mb-3"><strong>Tempo di giudizio: 20 giorni.</strong></p>
              
              <p className="m-0 mb-2"><strong>I giurati:</strong></p>
              <ul className="m-0 space-y-1">
                <li>Si impegnano a non diffondere il gioco e a rispettare la privacy dell'autore e ai dati personali;</li>
                <li>Si impegnano a giocare a tutti i titoli nei tempi di giudizio previsti;</li>
                <li>Si impegnano a non commentare esplicitamente i giochi in pubblico (Canali Discord di GMI in primis, ma anche fuori dalla community).</li>
              </ul>
              
              <p className="m-0 mt-3">Alla scadenza della consegna da parte dei partecipanti, i giudici dovranno valutare tutti i giochi compilando i campi del portale GMI entro il "Tempo di giudizio".</p>
              <p className="m-0 mt-2">Se per la conclusione di questo punto il giurato dovesse trovarsi impossibilitato a fornire i giudizi, verrà scartato dalla giuria.</p>
              <p className="m-0 mt-2">Se i giochi presenti dovessero essere tanti, si provvederà ad allungare il termine accordandosi.</p>
              <p className="m-0 mt-2">Il capo giuria avrà come funzione la gestione dei risultati (oltre che la ovvia funzione di giudice) e si riserva la possibilità di escludere un giurato nel caso non rispettasse gli impegni presi. I giudizi di tutti i giurati così come del capo giuria saranno mantenuti privati (confidenzialità anche verso gli altri giudici) fino al calcolo dei risultati, momento in cui, al termine della live di premiazione, i voti e commenti di ciascun giudice saranno resi pubblici.</p>
              <p className="m-0 mt-2">La votazione avviene attraverso questa piattaforma, che calcolerà automaticamente classifica principale e statistiche secondarie.</p>
            </section>

            {/* METODO DI GIUDIZIO */}
            <section className="bg-surface p-5 border border-default">
              <h4 className="text-lg font-bold text-content m-0 mb-4">
                Metodo di giudizio
              </h4>
              <p className="m-0 mb-3">Il giudice assegna al gioco un proprio voto unico intero da 0 a 100. Il voto è influenzato da tutte le caratteristiche che rendono il gioco piacevole e meritevole, secondo il gusto soggettivo del giudice ed i canoni più oggettivi stabilitisi per il medium in questo e nello scorso secolo. Al voto si associa una descrizione generale delle impressioni del giurato.</p>
              <p className="m-0 mb-3">Per ogni gioco viene quindi calcolata la media dei voti attribuitigli dalla giuria. Il gioco con il voto medio più alto vince.</p>
              
              <p className="m-0 mb-2"><strong>Pro e contro</strong></p>
              <p className="m-0 mb-2">Nonostante il voto sia l'unico parametro necessario a determinare il gioco vincitore, per aiutare ad esprimere al meglio le proprie impressioni ed indurre ad un approfondimento dell'opera, il giudice ha la possibilità specificare pro e contro di ciascun gioco, nel formato che segue:</p>
              <p className="m-0 mb-2 text-sm text-content-muted">I pro ed i contro non sono liberi, ma a scelta da una lista di possibilità. Si possono specificare al massimo tre pro e tre contro per un gioco. </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="m-0 mb-2 text-sm font-semibold text-content">Pro</p>
                  <div className="space-y-1 text-sm">
                    {prosList.map((pro, i) => (
                      <div key={i} className="text-content/80">• {pro}</div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="m-0 mb-2 text-sm font-semibold text-content">Contro</p>
                  <div className="space-y-1 text-sm">
                    {consList.map((con, i) => (
                      <div key={i} className="text-content/80">• {con}</div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            

            {/* SPUNTI */}
            <section className="bg-surface p-4 border border-default">
              <div className="text-sm text-content/80 space-y-2">
                <p className="m-0">Se ancora non avete iniziato a realizzare il vostro capolavoro, questo è il momento ideale per cercare compagni di sviluppo o passare in rassegna utilissimi 
                  &nbsp;<a href="https://www.gamemakeritalia.it/blog" target="_blank" rel="noopener noreferrer" className="ds-link">tutorial</a>&nbsp;
                  e <a href="https://www.gamemakeritalia.it/resources" target="_blank" rel="noopener noreferrer" className="ds-link">risorse</a></p>
                <p className="m-0 text-content-muted">Alcuni utenti della community GMI hanno all'attivo molte utility importanti che puoi trovare sul Blog. <br/> Non c'è limite su GameMaker, fintanto che siete disposti a sporcarvi le mani</p>
              </div>
            </section>
            
            
        </div>
      </div>
    </article>
  );
};

export default PageRuleBook;
