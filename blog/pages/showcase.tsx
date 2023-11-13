import Head from "next/head";
import Header from "../components/molecules/Header/Header";
import { sanityClient } from "../sanity";
import { Game } from "../typings";
import Footer from "../components/molecules/Footer/Footer";
import ShowcaseCard from "../components/molecules/ShowcaseCard/ShowcaseCard";

interface Props {
  games: [Game];
}
export default function Showcase({ games }: Props) {
  return (
    <div className="page">
      <Head>
        <title>GameMaker Italia | Showcase</title>
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:title" content="GameMaker Italia | Showcase" />
        <meta
          property="og:description"
          content="Sviluppatori per passione"
        />
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
          <p>Una selezione di titoli pubblicati dai membri della community</p>
          {/* games */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 py-6">
            {games.map((game) => {
              return (
                <ShowcaseCard game={game} key={game._id} />
              );
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

  const games = await sanityClient.fetch(query);
  return {
    props: { games }, // will be passed to the page component as props
  };
}
