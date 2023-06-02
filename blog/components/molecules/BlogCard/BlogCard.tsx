import { urlFor } from "../../../sanity";
import { Post } from "../../../typings";

interface BlogCardProps {
  post: Post;
}

const BlogCard = ({post}: BlogCardProps) => {
  const category = post.categories[0].toLowerCase().replace(" ", "-");
  return (
    <section className={`blog-card blog-card--${category}`}>
      <div 
      className="blog-card__image" style={{backgroundImage: `url(${urlFor(post?.mainImage)?.url()!}`}}>
      </div>
      <div className="blog-card__category">{category}</div>
      <div className="blog-card__body">
        <div>
          <a className="blog-card__link" href={`/posts/${post?.slug.current}`} title={post?.title}>
            <h2 className="blog-card__title">{post?.title}</h2>
          </a>
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