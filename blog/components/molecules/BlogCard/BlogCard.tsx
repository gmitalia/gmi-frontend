import { urlFor } from "../../../sanity";
import { Post } from "../../../typings";

interface BlogCardProps {
  post: Post;
}

const BlogCard = ({post}: BlogCardProps) => {
  const category = post.categories[0].toLowerCase().replace(" ", "-");
  return (
    <section className={`blog-card blog-card--${category}`}>
      <img
        src={urlFor(post?.mainImage)?.url()!}
        alt={post?.title}
        className="blog-card__image"
      />
      <div className="blog-card__category">{category}</div>
      <div className="blog-card__body">
        <div>
          <h2 className="blog-card__title">{post?.title}</h2>
        </div>
        <div className="blog-card__description">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris vulputate dolor metus, rhoncus congue sem cursus at. Aliquam erat volutpat. Aenean dictum facilisis nisl at ullamcorper.
        </div>
      </div>
      <div className="blog-card__author">
        di {post?.author?.name}
      </div>
    </section>
  )
}

export default BlogCard