import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import Header from '../components/Header'
import {sanityClient, urlFor} from '../sanity'
import { Post } from '../typings'

interface Props {
  posts : [Post];
}
export default function Home({posts}: Props) {
  // console.log(posts)
  return (
    <div className="max-w-7xl mx-auto">
      <Head>
        <title>GameMaker Italia</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

    <Header/>

<div className='flex justify-between items-center bg-gray-800 text-gray-100 border-y border-gray-100 py-10 lg:py-0'>
  <div className='px-2 md:px-10 space-y-5'>
    <h1 className='text-6xl max-w-xl font-serif'><span className='underline decoration-gray-100  text-gray-100 decoration-4'>GMI</span> &egrave; la community italiana di GameMaker</h1>
    <h2>Un software che permette di creare videogiochi in modo veloce e divertente.</h2>
  </div>
  <img className='hidden md:inline-flex h-32 lg:h-full' src="/images/gamemaker.png" alt="" />

</div>


{/* posts */}
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 px-2 py-6 md:px-10 md:p-6'>
      {posts.map((post) => {
       return <Link href={`/posts/${post?.slug.current}`} key={post?._id}>
          <div className='group cursor-pointer overflow-hidden border rounded-lg'>
           {post.mainImage && <img className='h-60 w-full object-cover group-hover:scale-105 transition-transform duration-200 ease-in-out' src={urlFor(post?.mainImage)?.url()!} alt='' /> }
           <div className='flex justify-between p-5'>
             <div>
               <p className='font-bold'>{post?.title}</p>
               <p className='text-xs'>{post?.description} by {post?.author.name}</p>
             </div>
             {post.author.image && <img className='h-12 w-12 rounded-full' src={urlFor(post?.author.image)?.url()!} alt="" /> }
           </div>
          </div>
        </Link>
      })}
    </div>
    </div>
  )
}
export async function getStaticProps() {
  const query = `*[_type == 'post']{
    _id,
    title,
    slug,
    author -> {
    name,
    image
  }, 
  mainImage,
  description
  }`

  const posts = await sanityClient.fetch(query)
  return {
    props: {posts}, // will be passed to the page component as props
  }
}


