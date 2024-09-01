import React, { useEffect } from 'react';
import { useInfiniteQuery } from 'react-query';
import axios from 'axios';

// defining the Post
interface Post {
  id: number;
  title: string;
  body: string;
}


const fetchPosts = async ({ pageParam = 1 }): Promise<Post[]> => {
    const response = await axios.get(
      `https://jsonplaceholder.typicode.com/posts?_page=${pageParam}&_limit=10`
    );
    
    return response.data;
};

const PostsTable: React.FC = () => {
// fetch posts using the infinite query hook
const {
    data,
    isLoading,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<Post[], Error>({
    queryKey: ['posts'],
    queryFn: fetchPosts,
    getNextPageParam: (lastPage, pages) => lastPage.length > 0 ? pages.length + 1 : undefined,
  });

  // automatically fetch the next page of posts
    useEffect(() => {
    const intervalId = setInterval(() => {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }, 2000); // more data every 2 seconds

    return () => clearInterval(intervalId); // clear on component unmount
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const totalRowsLoaded = data?.pages.flat().length || 0;

  if (isLoading) return <div className="loading">Loading...</div>;
  if (isError) return <div className="error">Error!</div>;

  return (
    <div className="container">
      <h1 className="title">Posts Table</h1>
      <div className="loading-indicator">Rows loaded: {totalRowsLoaded}</div>
      <table className="posts-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Content</th>
          </tr>
        </thead>
        <tbody>
          {data?.pages.map((page, index) => (
            <React.Fragment key={index}>
              {page.map((post) => (
                <tr key={post.id}>
                  <td>{post.id}</td>
                  <td>{post.title}</td>
                  <td>{post.body}</td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      {hasNextPage && <div className="loading">Loading data...</div>}
    </div>
  );
};

export default PostsTable; 