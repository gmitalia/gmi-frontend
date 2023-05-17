import { urlFor } from "../../../sanity";
import { Post } from "../../../typings";

interface BlogCardProps {
  post: Post;
}

const BlogCard = ({post}: BlogCardProps) => {
  return (
    <section>
      <img
        src={urlFor(post?.mainImage)?.url()!}
        alt=""
      />
      <div>
        <h2>{post.title}</h2>
      </div>
      <div>
        {post.description}
      </div>
    </section>
  )
}

export default BlogCard