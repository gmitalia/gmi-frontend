import Head from "next/head";
import { sanityClient } from "../sanity";
import { PostInterface } from "../typings";
import BlogListing from "../components/Blog/BlogListing";
import { blogTabs } from "../src/blogSections";

interface Props {
  posts: [PostInterface];
}

export default function Tutorial({ posts }: Props) {
  return (
    <>
      <Head>
        <title>GameMaker Italia | Tutorial</title>
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:title" content="GameMaker Italia | Tutorial" />
        <meta property="og:description" content="Sviluppatori per passione" />
        <meta name="description" content="Sviluppatori per passione" key="desc" />
        <meta
          property="og:image"
          content="https://gamemakeritalia.it/images/gmi_logo.png"
        />
      </Head>

      <BlogListing
        title="Tutorial"
        description="Guide passo passo per imparare GameMaker, dall'idea al gioco finito."
        posts={posts}
        tabs={blogTabs}
        emptyMessage="Non ci sono ancora tutorial pubblicati."
      />
    </>
  );
}

export async function getStaticProps() {
  const query = `*[_type == 'post' && "Tutorial" in categories[]->title] | order(publishedAt desc){
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
