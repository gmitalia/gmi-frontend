import { Post } from "../../typings";

interface BlogMetaDataProps {
  post: Post;
}

const BlogMetaData = ({ post }: BlogMetaDataProps) => {
  const author = post.author.name;
  const formatDate = (date: Date) => {
    return [date.getDate(), date.getMonth() + 1, date.getFullYear()].join("/");
  };
  console.log(post.categories.concat());
  const date = formatDate(new Date(post._createdAt));
  return (
    <div className="blog-post__metadata">
      <p>Scritto da {author}</p>
      <p>{date}</p>
    </div>
  );
};

export default BlogMetaData;
