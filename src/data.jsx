import React, { useEffect } from 'react';
import {useInfiniteQuery } from 'react-query';
import axios from 'axios';
import './App.css'; 

const fetchPosts = async ({ pageParam = 1}) => {
  const {data} = await axios.get(`https://jsonplaceholder.typicode.com/posts?_page=${pageParam}`);
  return data; 
};

const PostsTable = () => {
  const {data,
    isLoading,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage, } = useInfiniteQuery( {
    queryKey: 'posts',
    getNextPageParam: (lastPage, pages) => lastPage.length > 0 ? pages.length + 1 : undefined,
    queryFn: fetchPosts   
  });

  useEffect(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) return <div className="loading">Loading...</div>;
  if (isError) return <div className="error">Error data: {error.message}</div>;

  return (
    <div className="container">
      <h1 className="title">Posts Table</h1>
      <table className="posts-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Content</th>
          </tr>
        </thead>
        <tbody>
          {data.pages.map((page, index) => (
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
      {isFetchingNextPage && hasNextPage && <div className="loading">Loading data...</div>}
    </div>
  );
};

export default PostsTable;
