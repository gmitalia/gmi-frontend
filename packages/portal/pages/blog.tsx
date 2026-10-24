import Head from "next/head";
import { sanityClient } from "../sanity";
import { PostInterface } from "../typings";
import BlogListing from "../components/Blog/BlogListing";
import { blogTabs } from "../src/blogSections";

interface Props {
  posts: [PostInterface];
}

export default function Blog({ posts }: Props) {
  return (
    <>
      <Head>
        <title>GameMaker Italia | Blog</title>
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:title" content="GameMaker Italia | Blog" />
        <meta property="og:description" content="Sviluppatori per passione" />
        <meta name="description" content="Sviluppatori per passione" key="desc" />
        <meta
          property="og:image"
          content="https://gamemakeritalia.it/images/gmi_logo.png"
        />
      </Head>

      <BlogListing
        title="Blog"
        description="Tutti gli articoli, gli approfondimenti e i tutorial della community di GameMaker Italia."
        posts={posts}
        tabs={blogTabs}
        emptyMessage="Non ci sono ancora contenuti pubblicati."
      />
    </>
  );
}

export async function getStaticProps() {
  const query = `*[_type == 'post'] | order(publishedAt desc){
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
