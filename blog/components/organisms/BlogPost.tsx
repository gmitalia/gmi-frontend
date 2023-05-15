import PortableText from "react-portable-text";
import { config, urlFor } from "../../sanity";
import { Post } from "../../typings";
import getYouTubeID from "get-youtube-id";

interface BlogPostProps {
  post: Post;
}

const BlogPost = ({ post }: BlogPostProps) => {
  console.log(post);
  return (
    <div className="blog-post__wrapper">
      <article className="blog-post">
        <h2 className="blog-post__title">{post.title}</h2>
        <h3 className="font-light text-xl mb-2 text-gray-500">
          <img src={urlFor(post.mainImage).url()} alt={post.title} />
        </h3>
        <div>
          {post.author.image && (
            <img
              src={urlFor(post.author.image)?.url()!}
              alt={post.author.name}
            />
          )}
          <p>
            Blog post di <span>{post.author.name}</span> - pubblicato il{" "}
            {new Date(post._createdAt).toLocaleString()}
          </p>
        </div>
        <div>
          <PortableText
            dataset={config.dataset}
            projectId={config.projectId}
            content={post.body}
            serializers={{
              h1: (props: any) => <h1 {...props} />,
              h2: (props: any) => <h2 {...props} />,
              li: ({ children }: any) => <li>{children}</li>,
              link: ({ href, children }: any) => <a href={href}>{children}</a>,
              youtube: ({ url }: any) => {
                const id = getYouTubeID(url) || undefined;
                return (
                  <iframe
                    width="560"
                    height="315"
                    src={`https://www.youtube.com/embed/${id}`}
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  ></iframe>
                );
              },
            }}
          />
        </div>
      </article>
    </div>
  );
};

export default BlogPost;
