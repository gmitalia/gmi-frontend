import { urlFor } from "../../sanity";
import { PostInterface } from "../../typings";
import BlogMetaData from "../atoms/BlogMetaData/BlogMetaData";
import BlogPostText from "../molecules/BlogPostText/BlogPostText";

interface BlogPostProps {
  post: PostInterface;
}

const BlogPost = ({ post }: BlogPostProps) => {
  const category = post.categories[0].toLowerCase().replace(" ", "-");

  return (
    <div className="blog-post__wrapper">
      <article className={`blog-post blog-post--${category}`}>
        <h2 className="blog-post__title">{post.title}</h2>
        <img
          className="blog-post__main-image"
          src={urlFor(post.mainImage).url()}
          alt={post.title}
        />
        <div>
          <BlogMetaData post={post} />
        </div>
        <BlogPostText post={post} />
      </article>
    </div>
  );
};

export default BlogPost;
