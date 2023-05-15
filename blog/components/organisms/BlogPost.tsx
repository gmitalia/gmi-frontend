import { urlFor } from "../../sanity";
import { Post } from "../../typings";
import BlogMetaData from "../atoms/BlogMetaData";
import BlogPostText from "../atoms/BlogPostText";

interface BlogPostProps {
  post: Post;
}

const BlogPost = ({ post }: BlogPostProps) => {
  console.log(post);
  return (
    <div className="blog-post__wrapper">
      <article className="blog-post">
        <h2 className="blog-post__title">{post.title}</h2>
        <img
          className="blog-post__main-image"
          src={urlFor(post.mainImage).url()}
          alt={post.title}
        />
        <div>
          {/* {post.author.image && (
            <img
              src={urlFor(post.author.image)?.url()!}
              alt={post.author.name}
            />
          )} */}
          <BlogMetaData post={post} />
        </div>
        <BlogPostText post={post} />
      </article>
    </div>
  );
};

export default BlogPost;
