import { GetStaticProps } from "next"
import Header from "../../components/Header"
import { sanityClient, urlFor } from "../../sanity"
import { Post } from "../../typings"
import PortableText from "react-portable-text"
import { useForm, SubmitHandler } from "react-hook-form";
import { json } from "stream/consumers"
import { Children, useState } from "react"

interface IFormInput {
    _id: string;
    name: string;
    email: string;
    comment: string
}

interface Props {
    post: Post
}

function Post({post}: Props) {
  const [submitted, setSubmitted] = useState(false);
    
  console.log(post);

  const { register, handleSubmit, formState: { errors } } = useForm<IFormInput>();
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    await fetch('/api/createComment', {
        method: 'POST',
        body: JSON.stringify(data)
    }).then(() => {
        console.log(data)
        setSubmitted(true)
    }).catch((err) => {
        console.log(err)
        setSubmitted(false)
    })
  }

  return (
    <main>
    <Header />
    <img src={urlFor(post.mainImage).url()!} alt="" className="w-full h-40 object-cover" />
    <article className="max-w-3xl mx-auto p-5">
        <h1 className="text-4xl mt-10 mb-3">{post.title}</h1>
        <h2 className="text-xl font-light mb-2 text-gray-500">{post.description}</h2>

        <div className="flex items-center space-x-2">
            <img src={urlFor(post.author.image).url()!} alt="" className="h-10 w-10 rounded-full" />
            <p className="font-extralight text-sm">
                Blog post by <span className="font-bold text-green-500">{post.author.name}</span> - Published at {new Date(post._createdAt).toLocaleString()}
            </p>
        </div>

        <div className="mt-10">
            <PortableText 
            className=""
            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET!}
            projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!}
            content={post.body}
            serializers={{
                h1: (props: any) => (
                    <h1 className="text-2xl font-bold my-5" {...props} />
                ),
                h2: (props: any) => (
                    <h1 className="text-xl font-bold my-5" {...props} />
                ),
                normal: ({children}: any) => (
                    <p className="text-base my-3">{children}</p>
                ),
                li: ({children}: any) => (
                    <li className="ml-4 list-disc">{children}</li>
                ),
                link: ({href, children}: any) => (
                    <a href={href} className="hover:underline text-green-500">{children}</a>
                ),
            }}
            />
        </div>
    </article>

    <hr className="max-w-lg mx-auto border-black my-5"/>

    {/* Forms */}

    {submitted ? (
        <div className="flex flex-col p-10 my-10 bg-green-500 text-white max-w-2xl mx-auto rounded-lg">
            <h3 className="text-3xl font-bold">Thank You For Submitting Your Comment!</h3>
            <p>Once it has been approved, it will appear below</p>
        </div>
    ): (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col p-5 max-w-2xl mx-auto mb-10">
            <h3 className="text-sm text-green-500">Enjoyed this article?</h3>
            <h4 className="text-3xl font-bold">Leave a comment below!</h4>
            <hr className="py-3 mt-5" />

        <input {...register("_id")} type='hidden' name="_id" value={post._id} />

        <label className="block mb-5">
            <span className="text-gray-700">Name</span>
            <input {...register("name", { required: true })} className="shadow border rounded py-2 px-3 form-input mt-1 block w-full outline-none transition-transform duration-200 ease-in-out focus:ring ring-green-500" type="text" placeholder="John Smith" />
        </label>
        <label className="block mb-5">
            <span className="text-gray-700">Email</span>
            <input {...register("email", { required: true })} className="shadow border rounded py-2 px-3 form-input mt-1 block w-full outline-none transition-transform duration-200 ease-in-out focus:ring ring-green-500" type="email" placeholder="jsmith@email.com" />
        </label>
        <label className="block mb-5">
            <span className="text-gray-700">Comment</span>
            <textarea {...register("comment", { required: true })} className="shadow border rounded py-2 px-3 form-textarea mt-1 block w-full outline-none transition-transform duration-200 ease-in-out focus:ring ring-green-500" placeholder="John Smith" rows={8} />
        </label>

        {/* errors returned when the validation process fails */}
        <div className="flex flex-col p-5">
            {errors.name && (
                <span className="text-red-500">-The Name Field is Required</span>
            )}
            {errors.email && (
                <span className="text-red-500">-The Email Field is Required</span>
            )}
            {errors.comment && (
                <span className="text-red-500">-The Comment Field is Required</span>
            )}
        </div>

        <input type="submit" className="shadow bg-green-500 hover:bg-green-400 focus:shadow-outline focus:outline-none text-white font-bold px-2 py-4 rounded-full cursor-pointer" />

    </form>
    )}

    {/* Comments */}
    
    <div className="flex flex-col p-10 my-10 max-w-2xl mx-auto shadow shadow-green-500 space-y-2">
        <h3 className="text-4xl">Comments</h3>
        <hr className="pb-2" />

        {post.comments.map((comment) => (
            <div key={comment._id}>
                <p><span className="font-bold text-green-500">{comment.name}:</span> {comment.comment}</p>
            </div>
        ))}
    </div>

  </main>
  ) 
}

export default Post

export const getStaticPaths = async () => {
    const query = `
    *[_type== 'post'] {
        _id,
        slug {
        current
      }
      }`;

    const posts = await sanityClient.fetch(query);

    const paths = posts.map((post: Post) => ({
        params: {
            slug: post.slug.current
        }
    }));

    return {
        paths,
        fallback: 'blocking'
    }
};

export const getStaticProps: GetStaticProps = async ({params}) => {
    const query = `
    *[_type == "post" && slug.current == $slug][0] {
      _id,
      _createdAt,
      title,
      body,
      description,
      mainImage,
      slug,
      'comments': *[
        _type == "comment" &&
        post._ref == ^._id &&
        approved == true
      ],
      author -> {
        name,
        image
      }
    }
  `;

  const post = await sanityClient.fetch(query, {
    slug: params?.slug,
  })

  if (!post) {
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