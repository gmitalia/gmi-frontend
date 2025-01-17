{/* prettier-ignore */}

const RuleBook = ()=>
{
  return (
    <article className="prose max-w-none">
      <div className="px-2 pb-2 md:px-10 md:pb-10">
      <h2 className="text-2xl font-bold text-gray-900">
        Regolamento della competizione
      </h2>
        <p>
          <strong>
            I giochi inviati devono essere conformi alle seguenti
            caratteristiche
          </strong>
        </p>
        <ul>
          <li>
            Devono essere completi (non beta e dunque interamente giocabili,
            privi di bug che ne compromettano il totale funzionamento);
          </li>
          <li>
            Devono essere consegnati in archivio compresso (zip, 7z o rar),
            oppure essere caricati su Opera GXC <strong>non listati</strong> (mi
            raccomando, non rendetelo pubblico). NO installer.
            <ul>
              <li>
                In caso partecipiate con un archivio: deve contenere una build
                compatibile con Windows 10 (sono accettate in allegato altre
                build, ad esempio Android/iOS, ma deve comunque essere presente
                una versione eseguibile nativamente su Windows 10).
              </li>
              <li>
                In caso partecipiate con gioco su Opera GXC: &egrave;
                sufficiente inviare il link alla pagina corrispondente.
              </li>
            </ul>
          </li>
          <li>
            Devono essere creati con GameMaker dalla versione 5 in poi (I giochi
            devono comunque funzionare su Windows 10 e superiori, quindi per exe
            creati con/da GM6 in gi&ugrave; usate il convertitore), GameMaker
            Studio o GameMaker Studio 2;
          </li>
          <li>Devono essere in lingua Inglese o Italiana;</li>
          <li>
            Non devono essere gi&agrave; stati presentati in una competizione di
            GMItalia precedente o gi&agrave; rilasciati in giro per il web;
          </li>
          <li>
            Non devono contenere virus o istruzioni che possono danneggiare pc
            altrui;
          </li>
          <li>
            Non devono venire resi pubblici sul web prima dei giudizi
            finali,&nbsp;<strong>pena esclusione</strong>.<br />
            &Egrave; tuttavia possibile pubblicare demo parziali, iniziali e non
            complessive del gioco: noi lo sconsigliamo, in quanto l&apos;effetto
            sorpresa potrebbe influenzare positivamente il vostro punteggio;
          </li>
          <li>
            Possono essere in 3d o 2d e avere il supporto di DLL (citate gli
            autori dei materiali se non &egrave; farina del vostro sacco);
          </li>
          <li>
            Possono essere anche multi giocatore e con supporto al gioco online.
            Possono partecipare anche giochi che necessitano di due o pi&ugrave;
            giocatori (umani) sullo stesso pc;
          </li>
          <li>
            Possono contenere materiale pornografico, offensivo, o pi&ugrave; in
            generale, non adatto ad un pubblico di minori, purch&egrave; non sia
            fine a se stesso. Non si vuole in alcun modo imporre una censura, ma
            usate il buon senso;
            <br />
            In aggiunta, per essere adatto allo streaming su Twitch si richiede
            che buona parte del gioco&nbsp;<em>non</em> presenti queste
            caratteristiche(cos&igrave; che si possano abilmente mostrare in
            diretta solo le parti consone);
          </li>
          <li>
            Si consiglia di valutare bene il livello di difficolt&agrave; del
            gioco e se necessario inserire una selezione di difficolt&agrave; o
            dei trucchi, onde evitare che i membri della giuria possano
            incagliarsi causa bug o difficolt&agrave; troppo elevata. Potete
            scrivere queste cheats nell&apos;e-mail di consegna o in un
            Readme.txt all&apos;interno del file zip;
          </li>
          <li>
            Si pu&ograve; partecipare in team. (in tal caso, durante
            l&apos;invio del gioco, bisogna specificare nel PM chi
            ricever&agrave; l&apos;eventuale premio).
          </li>
          <li>
            Qualsiasi traccia sonora (o spezzone video) coperto da copyright
            deve essere dichiarata e avere la possibilit&agrave;
            (preferibilmente) di essere mutato. Si suggerisce quindi di fornire
            un&apos;impostazione per mutare la musica di gioco (o pi&ugrave;
            minuziosamente per mutare solo le tracce coperte da copyright, se
            presenti in piccola quantit&agrave;);
            <br />
            Questo provvedimento &egrave; stato preso a causa dei comportamenti
            di Twitch verso il materiale protetto. Va da s&egrave; che la totale
            assenza di materiale protetto sia la scelta migliore.
          </li>
        </ul>
        <p>
          Nonostante ne sia completamente consentito l&apos;utilizzo, si
          invitano i partecipanti a specificare con quanta chiarezza
          possibile&nbsp;
          <strong>
            la quantit&agrave; di risorse non proprie utilizzate
            all&apos;interno del titolo
          </strong>{" "}
          (che sia in un file di testo o nei crediti). Il gioco verr&agrave;
          valutato nell&apos;insieme, ma &egrave; innegabile il fatto che chi ha
          investito tempo nella realizzazione del proprio comparto artistico ha
          motivo di essere ricompensato.
        </p>
        <p>
          Il discorso si riflette anche sul codice: L&apos;utilizzo di DLL,
          estensioni, shader o qualsivoglia altra componente di codice non
          proprio ha motivo di essere debitamente specificato, al pari di un
          qualsiasi sprite o effetto sonoro.
        </p>
        <p>
          <br />
        </p>
        <p>
          <strong>Il concorrente</strong>
        </p>
        <ul>
          <li>
            Si impegna a leggere e comprendere il regolamento e le
            caratteristiche dei giochi da inviare;
          </li>
          <li>Non pu&ograve; partecipare con pi&ugrave; di un gioco;</li>
          <li>
            Non &egrave; ammesso partecipare con giochi degli altri (va bene
            usare risorse altrui specificando tutto nei crediti, come detto
            sopra);
          </li>
          <li>Non deve far parte della giuria.</li>
        </ul>
      </div>
      <div>
        <b>Per iscriverti entra nel server discord al seguente link:</b><br/>
        <a href="https://discord.gg/0wKBBPIbX2r3S32a">https://discord.gg/0wKBBPIbX2r3S32a</a>
      </div>
      <br/>
    </article>
  );
};

export default RuleBook;
