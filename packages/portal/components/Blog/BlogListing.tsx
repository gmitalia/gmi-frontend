import BlogCard from "../molecules/BlogCard/BlogCard";
import { SectionLayout } from "../WebsiteLayout/SectionLayout";
import type { SectionTab } from "../WebsiteLayout/SectionTabs";
import type { PostInterface } from "../../typings";

type BlogListingProps = {
  title: string;
  description: string;
  posts: PostInterface[];
  tabs: SectionTab[];
  emptyMessage: string;
};

/** Feed condiviso da Blog e Tutorial: stessa struttura, contenuti diversi. */
export function BlogListing({
  title,
  description,
  posts,
  tabs,
  emptyMessage,
}: BlogListingProps) {
  return (
    <SectionLayout title={title} description={description} tabs={tabs}>
      {posts.length === 0 ? (
        <div className="border border-gray-200 bg-white p-10 text-center">
          <p className="text-gray-500">{emptyMessage}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 py-3 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard post={post} key={post?._id} />
          ))}
        </div>
      )}
    </SectionLayout>
  );
}

export default BlogListing;
