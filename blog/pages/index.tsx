import type { NextPage } from "next";
import Head from "next/head";
import Hero from "../components/molecules/Hero/Hero";
import Link from "next/link";
import Header from "../components/molecules/Header/Header";
import { sanityClient, urlFor } from "../sanity";
import { Post } from "../typings";

interface Props {
  posts: [Post];
}
export default function Home({ posts }: Props) {
  return (
    <div>
      <Head>
        <title>GameMaker Italia</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <Hero />

      <div className="max-w-7xl mx-auto p-5">
        <h2 className="text-3xl mb-3">Blog</h2>
        {/* posts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 py-3">
          {posts.map((post) => {
            return (
              <Link href={`/posts/${post?.slug.current}`} key={post?._id}>
                <div className="group cursor-pointer overflow-hidden border rounded-lg">
                  {post.mainImage && (
                    <img
                      className="h-60 w-full object-cover group-hover:scale-105 transition-transform duration-200 ease-in-out"
                      src={urlFor(post?.mainImage)?.url()!}
                      alt=""
                    />
                  )}
                  <div className="flex justify-between p-5">
                    <div>
                      <p className="font-bold">{post?.title}</p>
                      <p className="text-xs">
                        {post?.description} by {post?.author.name}
                      </p>
                    </div>
                    {post.author.image && (
                      <img
                        className="h-12 w-12 rounded-full"
                        src={urlFor(post?.author.image)?.url()!}
                        alt=""
                      />
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
export async function getStaticProps() {
  const query = `*[_type == 'post'] | order(_createdAt desc){
    _id,
    title,
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
