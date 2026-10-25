import { PostInterface } from "../../../typings";
import { formatDate } from "../../utils";

interface BlogMetaDataProps {
  post: PostInterface;
}

const BlogMetaData = ({ post }: BlogMetaDataProps) => {
  const author = post.author.name;
  const dateSource = post.publishedAt || post._createdAt;
  const date = dateSource ? formatDate(new Date(dateSource)) : "Data sconosciuta";
  return (
    <div className={`blog-post__metadata`}>
      <p>Scritto da {author}</p>
      <p>{date}</p>
    </div>
  );
};


export default BlogMetaData;
