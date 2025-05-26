import { useState } from "react";
import usePosts from "../hooks/usePosts";

const PostList = () => {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data: posts, error, isLoading } = usePosts({ page, pageSize });
  
  if(isLoading) return <p>loading...</p>

  return (
    <>
      <ul className="list-group my-5">
        {posts?.map((post) => (
          <li key={post.id} className="list-group-item">
            {post.title}
          </li>
        ))}
      </ul>

      <button
        className="btn btn-primary me-3"
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
      >
        Previous
      </button>
      <button className="btn btn-primary" onClick={() => setPage(page + 1)}>
        Next
      </button>
    </>
  );
};

export default PostList;
