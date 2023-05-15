import getYouTubeID from "get-youtube-id";
import { Post } from "../../../typings";
import { config } from "../../../sanity";
import PortableText from "react-portable-text";

interface BlogPostTextProps {
  post: Post;
}

const BlogPostText = ({ post }: BlogPostTextProps) => {
  return (
    <div className="blog-post__text">
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
  );
};

export default BlogPostText;
