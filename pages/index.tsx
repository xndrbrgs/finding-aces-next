import { url } from 'inspector'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import Header from '../components/Header'
import Hero from '../components/Hero'
import {sanityClient, urlFor} from '../sanity'
import { Post } from '../typings'

interface Props {
  posts: [Post];
};

export default function Home ({posts}: Props) {
  console.log(posts);
  return (
    <div className="">
      <Head>
        <title>Finding Aces: A Golf Blog</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <Hero />

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 p-2 lg:p-6'>
        {posts.map(post => (
          <Link key={post._id} href={`/post/${post.slug.current}`} >
            <div className='group cursor-pointer border rounded-lg overflow-hidden'>
              <img src={
                urlFor(post.mainImage).url()!
              } alt="" className='w-full h-60 object-cover group-hover:scale-105 transition-transform duration-200 ease-in-out' />
              <div className='flex justify-between p-5 bg-white items-center'>
                <div>

                <p className='font-bold text-lg'>{post.title}</p>
                <p className='text-xs'>{post.description}</p>
                <p className='text-xs'>{post.author.name}</p>
                </div>

              <img src={urlFor(post.author.image).url()!} alt="" className='h-12 w-12 rounded-full' />

              </div>

            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export const getServerSideProps = async () => {
  const query = `
  *[_type== 'post'] {
    _id,
    title,
    slug,
    description,
    mainImage,
    author -> {
    name,
    image
  }
  }`;

  const posts = await sanityClient.fetch(query);

  return {
    props: {
      posts,
    }
  };
};