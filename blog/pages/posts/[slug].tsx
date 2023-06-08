import { GetStaticProps } from "next";
import React, { useState } from "react";
import Header from "../../components/molecules/Header/Header";
import { sanityClient } from "../../sanity";
import { Post } from "../../typings";
import { useForm, SubmitHandler } from "react-hook-form";
import BlogPost from "../../components/organisms/BlogPost";
import Head from "next/head";
import { urlFor } from "../../sanity";

interface iForm {
  _id: string;
  name: string;
  email: string;
  comment: string;
}

interface Props {
  post: Post;
}

const Post = ({ post }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<iForm>();
  const [submitted, setsubmitted] = useState(false);

  const onSubmit: SubmitHandler<iForm> = (data) => {
    fetch("/api/createComment", {
      method: "POST",
      body: JSON.stringify(data),
    })
      .then(() => {
        console.log(data);
        setsubmitted(true);
      })
      .catch((err) => {
        console.log(err);
        setsubmitted(false);
      });
  };
  console.log(post.mainImage)
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
          content={urlFor(post.mainImage)?.url()!}
        />
      </Head>
      <BlogPost post={post} />
    </>
  );
};
export async function getStaticPaths() {
  const query = `*[_type == 'post']{
        _id,
        slug  {
        current
      }
      }`;
  const posts = await sanityClient.fetch(query);

  const paths = posts.map((post: Post) => ({
    params: {
      slug: post.slug.current,
    },
  }));
  return {
    paths,
    fallback: "blocking", // false or 'blocking'
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
    revalidate: 60,
  };
};

export default Post;
