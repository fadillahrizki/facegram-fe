import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import api from '../api/api';
import Navbar from './Navbar';
import Loading from './Loading';

export default function Profile() {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);

  useEffect(() => {
    fetchUser()
  }, [username]);

  const fetchUser = async () => {
    setLoading(true)
    try {
      let response;
      if (username === 'me') {
        const user = JSON.parse(localStorage.getItem('user'));
        response = await api.get(`/users/${user.username}`);
      } else {
        response = await api.get(`/users/${username}`);
      }
      setUser(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleFollow = async () => {
    if(loadingAction || user.following_status == 'rejected') return
    setLoadingAction(true)
    try {
      if (user.following_status === 'not-following') {
        await api.post(`/users/${user.username}/follow`);
      } else if (user.following_status === 'following' || user.following_status == 'requested') {
        await api.delete(`/users/${user.username}/unfollow`);
      }
      
      const res = await api.get(`/users/${user.username}`);
      setUser(res.data);
    } catch (err) {
      console.error('Failed to update follow status', err);
    } finally {
      setLoadingAction(false)
    }
  }

  return (
    <>
      <Navbar />
      {loading && (
        <div className="text-center mt-5"><Loading isScreen={true}/></div>
      )}
      {!user && !loading && (
        <div className="text-center mt-5">User not found.</div>
      )}
      {user && !loading && (
        <div className="p-4 flex flex-col gap-4">
          <div className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h3 className="text-md font-bold tracking-tight text-gray-500">@{user.username}</h3>
            <h5 className='text-2xl font-bold tracking-tight text-gray-700'>{user.full_name}</h5>
            <p className="font-normal text-gray-700">{user.bio}</p>
            <div className="flex gap-3 text-gray-700">
              <span><b>{user.posts_count}</b> Posts</span>
              <span><b>{user.followers_count}</b> Followers</span>
              <span><b>{user.following_count}</b> Following</span>
            </div>
            {!user.is_your_account && (
              <div className="mt-2">
                <button onClick={handleFollow} disabled={loadingAction || user.following_status == 'rejected'} className={
                  "px-2 py-1 text-white rounded " 
                  + (loadingAction ? ' opacity-50 cursor-not-allowed ' : ' cursor-pointer ') 
                  + (
                    user.following_status === 'requested' ? ' bg-red-600 hover:bg-red-700 cursor-pointer' 
                    : user.following_status === 'following' ? ' bg-red-600 hover:bg-red-700 cursor-pointer' 
                    : user.following_status == 'rejected' ? ' bg-red-600 opacity-50 !cursor-not-allowed ' 
                    : ' bg-blue-600 hover:bg-blue-700  '
                  )
                  }>
                  {
                    loadingAction ? <Loading /> : (
                    user.following_status === 'following' ? 'Unfollow' 
                    : (user.following_status === 'requested' ? 'Cancel Request' : (user.following_status === 'rejected' ? 'Rejected' : 'Follow'))
                  )}
                </button>
              </div>
            )}
          </div>

          {(!user.is_private || user.is_your_account || user.following_status === 'following') ? (
            user.posts.length > 0 ? user.posts.map(post => (
              <div key={post.id} className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm">
                {post.attachments[0] && (
                  <img
                    src={`${import.meta.env.VITE_STORAGE_URL}/${post.attachments[0].storage_path}`}
                    alt="Post"
                    className="rounded-t-lg"
                  />
                )}
                <div className="p-5">
                    <p className="font-normal text-gray-700">{post.caption}</p>
                </div>
              </div>
            )) : <div className="text-gray-700">No posts yet.</div>
          ) : (
            <div className="text-gray-700">This account is private.</div>
          )}
        </div>
      )}
    </>
  );
}
