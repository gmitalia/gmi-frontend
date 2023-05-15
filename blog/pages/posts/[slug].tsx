import { GetStaticProps } from "next";
import React, { useState } from "react";
import Header from "../../components/Header/Header";
import { sanityClient } from "../../sanity";
import { Post } from "../../typings";
import { useForm, SubmitHandler } from "react-hook-form";
import BlogPost from "../../components/organisms/BlogPost";

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
  //console.log(post)

  const onSubmit: SubmitHandler<iForm> = (data) => {
    // console.log(data)
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

  console.log(post);
  return (
    <>
      <Header />
      {/* {post.mainImage && <img className='w-full h-40 object-cover' src={urlFor(post.mainImage)?.url()!} alt='' />} */}
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
      categories,
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
