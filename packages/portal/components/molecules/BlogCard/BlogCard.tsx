import { urlFor } from "../../../sanity";
import { PostInterface } from "../../../typings";

interface BlogCardProps {
  post: PostInterface;
}

const BlogCard = ({post}: BlogCardProps) => {
  const category = post.categories ? post?.categories[0]?.toLowerCase().replace(" ", "-") : undefined;
  const mainImageUrl = post?.mainImage ? urlFor(post.mainImage)?.url() : null;
  return (
    <section className={`blog-card blog-card--${category}`}>
      <div
      className="blog-card__image" style={mainImageUrl ? {backgroundImage: `url(${mainImageUrl})`} : {}}>
      </div>
      {category && <div className="blog-card__category">{category}</div>}
      <div className="blog-card__body">
        <div>
          <a className="blog-card__link" href={post?.slug?.current ? `/posts/${post.slug.current}` : "#"} title={post?.title}>
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