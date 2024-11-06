import { Post } from "../../../typings";
import { formatDate } from "../../utils";

interface BlogMetaDataProps {
  post: Post;
}

const BlogMetaData = ({ post }: BlogMetaDataProps) => {
  const author = post.author.name;

  const date = formatDate(new Date(post.publishedAt));
  return (
    <div className={`blog-post__metadata`}>
      <p>Scritto da {author}</p>
      <p>{date}</p>
    </div>
  );
};


export default BlogMetaData;
