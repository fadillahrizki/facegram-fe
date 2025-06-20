import { useEffect, useState, useRef, useCallback } from 'react';
import api from '../api/api';
import Navbar from './Navbar';
import Loading from './Loading';
import Post from './Post';

export default function NewsFeed() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();
  const [loading, setLoading] = useState(false)

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const res = await api.get(`/posts?page=${page}&size=10`);
      const data = res.data.data;
      setPosts((prev) => [...prev, ...data]);
      if (data.length < 10) {
        setHasMore(false);
      }
    } catch (err) {
      console.error('Failed to fetch posts', err);
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [page]);

  const lastPostRef = useCallback((node) => {
    if (!hasMore) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setPage((prev) => prev + 1);
      }
    });

    if (node) observer.current.observe(node);
  }, [hasMore]);

  const removedPost = (post) => {
    setPosts(posts.filter(p=>p.id!=post.id))
  }

  return (
    <>
    <Navbar />
    <div className="p-5 flex flex-col gap-4 max-w-sm mx-auto">
      {posts.map((post, idx) => <div key={post.id} ref={idx === posts.length - 1 ? lastPostRef : null}><Post removedPost={removedPost} post={post} /></div>)}
      {loading && (
        <div className="text-center mt-5"><Loading isScreen={true}/></div>
      )}
      {!hasMore && (
        <div className="text-center text-muted my-4">No more posts</div>
      )}
    </div>
    </>
    
  );
}
