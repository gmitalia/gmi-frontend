import { GetStaticProps } from 'next';
import React, { useState } from 'react'
import PortableText from 'react-portable-text';
import Header from '../../components/Header'
import { sanityClient, urlFor } from '../../sanity';
import { Post } from '../../typings';
import { config } from '../../sanity';
import {useForm, SubmitHandler} from 'react-hook-form'
import getYouTubeId from 'get-youtube-id'

interface iForm {
    _id: string;
    name: string;
    email: string;
    comment: string;
}

interface Props {
    post: Post;
}
const Post = ({post}: Props) => {
    const {register, handleSubmit, formState:{errors}} = useForm<iForm>()
    const [submitted, setsubmitted] = useState(false)
    //console.log(post)

    const onSubmit: SubmitHandler<iForm> = (data) => {
        // console.log(data)
         fetch('/api/createComment', {
            method: 'POST',
            body: JSON.stringify(data)
        }).then(()=> {
            console.log(data);
            setsubmitted(true)
        }).catch((err) => {
            console.log(err);
            setsubmitted(false)
        })
    }
  return (
      <>
      <Header/>
      {post.mainImage && <img className='w-full h-40 object-cover' src={urlFor(post.mainImage)?.url()!} alt='' />}
    
    <article className='max-w-3xl mx-auto p-5'>
        <h1 className='text-3xl mt-10 mb-3'>{post.title}</h1>
        <h2 className='font-light text-xl mb-2 text-gray-500'>{post.description}</h2>
        <div className='flex items-center space-x-2'>
            {post.author.image && <img className='h-10 w-10 rounded-full' src={urlFor(post.author.image)?.url()!} alt={post.author.name} /> }
            <p className='font-extralight text-sm'>Blog post by <span className='text-green-600'>{post.author.name}</span> - published at {new Date(post._createdAt).toLocaleString()}</p>
        </div>
        <div className='mt-10'>
            <PortableText
             dataset={config.dataset}
             projectId={config.projectId}
             content={post.body}
             serializers={{
                 h1: (props: any) => (
                     <h1 className='text-2xl font-bold my-5' {...props} />
                 ),
                 h2: (props: any) => (
                    <h2 className='text-xl font-bold my-5' {...props} />
                ),
                li: ({children}: any) => (
                    <li className='ml-4 list-disc'>{children}</li>
                ),
                link: ({href, children}: any) => (
                    <a href={href} className='text-blue-500 hover:underline'>{children}</a>
                ),
                youtube: ({url}: any) => {
                    const id = getYouTubeId(url) || undefined;
                    return (
                        <iframe width="560" height="315" src={`https://www.youtube.com/embed/${id}`} title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" ></iframe>
                    )
                }
             }}
            />
        </div>
    </article>
    </>
  )
}
export async function getStaticPaths() {
    const query = 
    `*[_type == 'post']{
        _id,
        slug  {
        current
      }
      }`;
      const posts = await sanityClient.fetch(query);

      const paths = posts.map((post : Post) => ({
        params: {
            slug: post.slug.current
        }
      }))
    return {
      paths,
      fallback: 'blocking' // false or 'blocking'
    };
  }

export const getStaticProps: GetStaticProps = async ({params}) => {
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
      body
      }
    `
    const post = await sanityClient.fetch(query, {
        slug: params?.slug,
    })
    if(!post){
        return {
            notFound: true
        }
    }
    return {
        props: {
            post,
        },
        revalidate: 60,
    }
}

export default Post