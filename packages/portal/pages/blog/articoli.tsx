import Head from "next/head";
import { sanityClient } from "../../sanity";
import { PostInterface } from "../../typings";
import BlogListing from "../../components/Blog/BlogListing";
import { blogTabs } from "../../src/blogSections";

interface Props {
  posts: [PostInterface];
}

export default function Articles({ posts }: Props) {
  return (
    <>
      <Head>
        <title>GameMaker Italia | Articoli</title>
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:title" content="GameMaker Italia | Articoli" />
        <meta property="og:description" content="Sviluppatori per passione" />
        <meta name="description" content="Sviluppatori per passione" key="desc" />
        <meta
          property="og:image"
          content="https://gamemakeritalia.it/images/gmi_logo.png"
        />
      </Head>

      <BlogListing
        title="Articoli"
        description="Articoli, approfondimenti e novità dalla community di GameMaker Italia."
        posts={posts}
        tabs={blogTabs}
        emptyMessage="Non ci sono ancora articoli pubblicati."
      />
    </>
  );
}

export async function getStaticProps() {
  const query = `*[_type == 'post' && !("Tutorial" in categories[]->title)] | order(publishedAt desc){
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

  const posts = await sanityClient.fetch(query);
  return {
    props: { posts },
  };
}
