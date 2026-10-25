import type { NextPage } from "next";
import Head from "next/head";
import Hero from "../components/molecules/Hero/Hero";
import Link from "next/link";
import { sanityClient, urlFor } from "../sanity";
import { PostInterface, Game } from "../typings";
import BlogCard from "../components/molecules/BlogCard/BlogCard";
import ShowcaseCard from "../components/molecules/ShowcaseCard/ShowcaseCard";
import ContestCard from "../components/Competition/ContestCard";
import DiscordCommunitySection from "../components/Home/DiscordCommunitySection";
import GMIApi from "../src/api/GMIApi";
import { useEffect, useMemo, useState } from "react";

interface Props {
  posts: [PostInterface];
  games: [Game];
}

const seeAllClasses =
  "text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 hover:underline hover:decoration-2 hover:underline-offset-4";

const LATEST_CONTESTS_LIMIT = 3;

export default function Home({ posts, games }: Props) {
  const [gamesArray, setGamesArray] = useState<Game[]>(games);
  const [contests, setContests] = useState<Contest[]>([]);
  const [contestsLoading, setContestsLoading] = useState(true);

  useEffect(() => {
    const shuffledGames = [...games].sort(() => Math.random() - 0.5);
    setGamesArray(shuffledGames);
  }, [games]);

  useEffect(() => {
    GMIApi.getInstance().getContests((data) => {
      if (data?.success) setContests(data.contests || []);
      setContestsLoading(false);
    }, LATEST_CONTESTS_LIMIT);
  }, []);

  const latestContests = useMemo(
    () =>
      [...contests]
        .sort((a, b) => Number(b.id) - Number(a.id))
        .slice(0, LATEST_CONTESTS_LIMIT),
    [contests]
  );

  return (
    <div>
      <Head>
        <title>GameMaker Italia</title>
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:title" content="GameMaker Italia" />
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


      <Hero />

      <div className="max-w-7xl mx-auto p-5 blog-section">
        <div className="flex flex-col items-start mt-5 mb-4 md:flex-row md:items-center md:justify-between">
          <h2 className="text-3xl mb-2 md:mb-0">Ultimi articoli</h2>
        </div>
        {/* posts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 py-3">
          {posts.slice(0, 3).map((post) => {
            return (
              <BlogCard post={post} key={post?._id} />
            );
          })}

        </div>
        <div className="mt-4 flex justify-center">
          <Link href="/blog/" title="Vai alla pagina Blog" className={seeAllClasses}>
            Vedi tutti gli articoli
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-5 blog-section">
        <div className="flex flex-col items-start mt-5 mb-4 md:flex-row md:items-center md:justify-between">
          <h2 className="text-3xl mb-2 md:mb-0">Giochi dalla community</h2>
        </div>
        {/* games */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 py-3">
          {gamesArray.slice(0, 3).map((game) => (
            <ShowcaseCard game={game} key={game._id} />
          ))}
        </div>
        <div className="mt-4 flex justify-center">
          <Link href="/showcase/" title="Vai alla pagina Showcase" className={seeAllClasses}>
            Vedi tutti i giochi
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-5 blog-section">
        <div className="flex flex-col items-start mt-5 mb-4 md:flex-row md:items-center md:justify-between">
          <h2 className="text-3xl mb-2 md:mb-0">Ultime competizioni</h2>
        </div>

        {contestsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 py-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="animate-pulse overflow-hidden border border-gray-200 bg-white"
              >
                <div className="aspect-video bg-gray-200" />
                <div className="space-y-3 p-5">
                  <div className="h-3 w-20 bg-gray-200" />
                  <div className="h-5 w-2/3 bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        ) : latestContests.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 py-3">
            {latestContests.map((contest) => (
              <ContestCard key={contest.id} contest={contest} />
            ))}
          </div>
        ) : (
          <div className="border border-gray-200 bg-white p-6">
            <p className="text-sm text-gray-500">
              Le competizioni arriveranno presto.
            </p>
          </div>
        )}

        <div className="mt-4 flex justify-center">
          <Link href="/competizioni/" title="Vai alla pagina Competizioni" className={seeAllClasses}>
            Vedi tutte le competizioni
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-5">
        <DiscordCommunitySection />
      </div>
    </div>
  );
}
export async function getStaticProps() {
  const query = `*[_type == 'post'] | order(publishedAt desc) [0..2] {
    _id,
    title,
    publishedAt,
    description,
    "categories": categories[]->title,
    slug,
    author -> {
    name,
    image
  },
  mainImage,
  description
  }`;

  const queryGames = `*[_type == 'game'] | order(title asc) {
    _id,
    title,
    author,
    banner,
    url
  }`;

  const games = await sanityClient.fetch(queryGames)

  const posts = await sanityClient.fetch(query);
  return {
    props: { posts, games }, // will be passed to the page component as props
  };
}
