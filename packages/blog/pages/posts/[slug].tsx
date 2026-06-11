import { GetStaticProps } from "next";
import React from "react";
import Header from "../../components/molecules/Header/Header";
import { sanityClient, urlFor } from "../../sanity";
import { PostInterface } from "../../typings";
import BlogPost from "../../components/organisms/BlogPost";
import Head from "next/head";
import Footer from "../../components/molecules/Footer/Footer";

interface Props {
  post: PostInterface;
}

const Post = ({ post }: Props) => {
  return (
    <>
      <Header />
      <Head>
        <title>{post.title} | GameMaker Italia</title>
        <meta property="og:title" content={post.title} />
        <meta
          property="og:description"
          content={post.description}
        />
        <meta
          name="description"
          content={post.description}
          key="desc"
        />
        <meta
          property="og:image"
          content={post.mainImage ? urlFor(post.mainImage)?.url()! : 'https://gamemakeritalia.it/images/gmi_logo.png'}
        />
      </Head>
      <BlogPost post={post} />
      <Footer />
    </>
  );
};
export async function getStaticPaths() {
  const query = `*[_type == "post" && defined(slug.current)]{
    _id,
    slug {
      current
    }
  }`;

  const posts = await sanityClient.fetch(query);

  const paths = posts
    .filter((post: any) => post.slug && post.slug.current)
    .map((post: PostInterface) => ({
      params: { slug: post.slug.current },
    }));

  return {
    paths,
    fallback: false,
  };
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = `
    *[_type == 'post' && slug.current == $slug][0]{
        _id,
        _createdAt,
        publishedAt,
        title,
        slug,
        author -> {
        name,
        image
      }, 
      'comments': *[
        _type == 'comment' &&
        post._ref == ^._id &&
        approved == true
      ],
      mainImage,
      description,
      body,
      "categories": categories[]->title,
      }
    `;
  const post = await sanityClient.fetch(query, {
    slug: params?.slug,
  });
  if (!post) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      post,
    },
  };
};

export default Post;
