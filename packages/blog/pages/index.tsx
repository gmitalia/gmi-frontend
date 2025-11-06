import type { NextPage } from "next";
import Head from "next/head";
import Hero from "../components/molecules/Hero/Hero";
import Link from "next/link";
import Header from "../components/molecules/Header/Header";
import { sanityClient, urlFor } from "../sanity";
import { PostInterface, Game } from "../typings";
import BlogCard from "../components/molecules/BlogCard/BlogCard";
import ShowcaseCard from "../components/molecules/ShowcaseCard/ShowcaseCard";
import Footer from "../components/molecules/Footer/Footer";
import { useEffect, useState } from "react";

interface Props {
  posts: [PostInterface];
  games: [Game];
}
export default function Home({ posts, games }: Props) {

  const [gamesArray, setGamesArray] = useState<Game[]>(games);

  useEffect(() => {
    const shuffledGames = [...games].sort(() => Math.random() - 0.5);
    setGamesArray(shuffledGames);
  }, [games]);

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

      <Header />

      <Hero />

      <div className="max-w-7xl mx-auto p-5 blog-section">
      <div className="flex flex-col items-start mt-5 mb-4 md:flex-row md:items-center md:justify-between">
        <h2 className="text-3xl mb-2 md:mb-0">Ultimi articoli</h2>
        <Link href="/blog" title="Vai alla pagina Blog" className="hover:underline">Vedi tutti gli articoli →</Link>
        </div>
        {/* posts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 py-3">
          {posts.map((post) => {
            return (
              <BlogCard post={post} key={post?._id} />
            );
          })}

        </div>
      </div>

      <div className="max-w-7xl mx-auto p-5 blog-section">
      <div className="flex flex-col items-start mt-5 mb-4 md:flex-row md:items-center md:justify-between">
        <h2 className="text-3xl mb-2 md:mb-0">Giochi dalla community</h2>
        <Link href="/showcase" title="Vai alla pagina Showcase" className="hover:underline">Vedi tutti i giochi →</Link>
        </div>
        {/* games */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 py-3">
        {gamesArray.map((game, i) => {
              if (i<6) {
                return <ShowcaseCard game={game} key={game._id} />;
              }
        })}
        </div>
      </div>
      <Footer />
    </div>
  );
}
export async function getStaticProps() {
  const query = `*[_type == 'post'] | order(publishedAt desc) [0..5] {
    _id,
    title,
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
