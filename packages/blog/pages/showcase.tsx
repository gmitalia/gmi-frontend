import Head from "next/head";
import Header from "../components/molecules/Header/Header";
import { sanityClient } from "../sanity";
import { Game } from "../typings";
import Footer from "../components/molecules/Footer/Footer";
import ShowcaseCard from "../components/molecules/ShowcaseCard/ShowcaseCard";
import { useEffect, useState } from "react";

interface ShowcaseProps {
  games: [Game];
}

function orderByAuthor(firstElement: Game, secondElement: Game) {
  const autorA = firstElement.author.toUpperCase(); // Ignora maiuscole/minuscole
  const autorB = secondElement.author.toUpperCase();

  if (autorA < autorB) {
    return -1;
  }
  if (autorA > autorB) {
    return 1;
  }
  return 0;
}

function orderByTitle(firstElement: Game, secondElement: Game) {
  const autorA = firstElement.title.toUpperCase(); // Ignora maiuscole/minuscole
  const autorB = secondElement.author.toUpperCase();

  if (autorA < autorB) {
    return -1;
  }
  if (autorA > autorB) {
    return 1;
  }
  return 0;
}

export default function Showcase({ games }: ShowcaseProps) {
  const titleOrder = [...games].sort(orderByTitle);
  const authorOrder = [...games].sort(orderByAuthor);

  const [gamesArray, setGamesArray] = useState<Game[]>(games);
  const [activeButton, setActiveButton] = useState<"title" | "random" | "author">("random");

  useEffect(() => {
    const shuffledGames = [...games].sort(() => Math.random() - 0.5);
    setGamesArray(shuffledGames);
    setActiveButton("random");
  }, [games]);

  return (
    <div className="page">
      <Head>
        <title>GameMaker Italia | Showcase</title>
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:title" content="GameMaker Italia | Showcase" />
        <meta property="og:description" content="Sviluppatori per passione" />
        <meta
          name="description"
          content="Sviluppatori per passione"
          key="desc"
        />
        <meta
          property="og:image"
          content="https://gamemakeritalia.it/images/gmi_logo.png" />
      </Head>

      <Header />
      <div>
        <div className="max-w-7xl mx-auto p-5 blog-section">
          <h2 className="text-3xl mb-3">Showcase</h2>
          <p className="mb-1">Una selezione di titoli sviluppati dai membri della community</p>
          <div className="showcaseCard-btn__container">
            <span>Ordina per:</span>
            <button onClick={() => {setGamesArray(titleOrder); setActiveButton("title")}} className={`showcaseCard-btn${activeButton === 'title' ? ' showcaseCard-btn--active' : ''}`}>Titolo</button>
            <button onClick={() => {setGamesArray(authorOrder); setActiveButton("author")}} className={`showcaseCard-btn${activeButton === 'author' ? ' showcaseCard-btn--active' : ''}`}>Autore</button>
            <button onClick={() => {setGamesArray([...games].sort(() => Math.random() - 0.5)); setActiveButton("random")}} className={`showcaseCard-btn${activeButton === 'random' ? ' showcaseCard-btn--active' : ''}`}>Random</button>
          </div>
          {/* games */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 py-6">
            {gamesArray.map((game) => {
              return <ShowcaseCard game={game} key={game._id} />;
            })}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
export async function getStaticProps() {
  const query = `*[_type == 'game'] | order(title asc) {
    _id,
    title,
    author,
    banner,
    url
  }`;

  const games = await sanityClient.fetch(query)

  return {
    props: { games }, // will be passed to the page component as props
  };
}
