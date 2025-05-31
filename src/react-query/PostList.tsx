import React, { useState } from "react";
import usePosts from "../hooks/usePosts";

const PostList = () => {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // const { data: posts, error, isLoading } = usePosts({ page, pageSize });

  const { data, error, isLoading, fetchNextPage, isFetchingNextPage } =
    usePosts({ pageSize }); // remove page number

  if (isLoading) return <p>loading...</p>;

  return (
    <>
      <ul className="list-group my-5">
        {data?.pages.map((page, index) => (
          <React.Fragment key={index}>
            {page.map((post) => (
              <li key={post.id} className="list-group-item">
                {post.title}
              </li>
            ))}
          </React.Fragment>
        ))}
      </ul>

      <button
        className="btn btn-primary me-3"
        onClick={() => fetchNextPage()}
        disabled={isFetchingNextPage}
      >
        {isFetchingNextPage ? "loading..." : "load more"}
      </button>
    </>
  );
};

export default PostList;
