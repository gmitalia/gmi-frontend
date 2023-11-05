import type { NextPage } from "next";
import Head from "next/head";
import Hero from "../components/molecules/Hero/Hero";
import Link from "next/link";
import Header from "../components/molecules/Header/Header";
import { sanityClient, urlFor } from "../sanity";
import { Post } from "../typings";
import BlogCard from "../components/molecules/BlogCard/BlogCard";
import Footer from "../components/molecules/Footer/Footer";

interface Props {
  posts: [Post];
}
export default function Home({ posts }: Props) {
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
          content="../public/images/gmi_logo.png" />
      </Head>

      <Header />

      <Hero />

      <div className="max-w-7xl mx-auto p-5 blog-section">
        <h2 className="text-3xl mb-3">Blog</h2>
        {/* posts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 py-3">
          {posts.map((post) => {
            return (
              <BlogCard post={post} key={post?._id} />
            );
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

  const posts = await sanityClient.fetch(query);
  return {
    props: { posts }, // will be passed to the page component as props
  };
}
