import { urlFor } from "../../../sanity";
import { Post } from "../../../typings";

interface BlogCardProps {
  post: Post;
}

const BlogCard = ({post}: BlogCardProps) => {
  console.log(post)
  const category = post.categories[0].toLowerCase().replace(" ", "-");
  return (
    <section className={`blog-card blog-card--${category}`}>
      <div 
      className="blog-card__image">
        <img
          src={urlFor(post?.mainImage)?.url()!}
          alt={post?.title}
        />
      </div>
      <div className="blog-card__category">{category}</div>
      <div className="blog-card__body">
        <div>
          <h2 className="blog-card__title">{post?.title}</h2>
        </div>
        <div className="blog-card__description">
        {post?.description}
        </div>
      </div>
      <div className="blog-card__author">
        di {post?.author?.name}
      </div>
    </section>
  )
}

export default BlogCard