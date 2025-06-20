import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router';
import api from '../api/api';
import Navbar from './Navbar';
import Loading from './Loading';
import Post from './Post';

export default function Profile() {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingProfilePicture, setLoadingProfilePicture] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);
  const profilePictureRef = useRef(null)

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

  const handleChangeProfilePicture = async (e) => {
    const formData = new FormData();
    formData.append(`profile_picture`, e.target.files[0]);
    setLoadingProfilePicture(true)
    try {
      const res = await api.post('/users/update-profile-picture', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUser({...user, ...{profile_picture: res.data.data}})
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingProfilePicture(false);
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
        <div className="p-4 flex flex-col gap-4 max-w-sm mx-auto">
          <div className="w-full flex justify-between p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div>
              {user.is_your_account && (
                <Link to={'/profile/me/edit'}>
                <button className={"cursor-pointer mb-2 rounded-md bg-blue-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"} >Edit Profile</button>
                </Link>
              )}
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

            <div className='relative'>
              <input type="file" name="profile_picture" ref={profilePictureRef} accept="image/*" className='hidden' onChange={handleChangeProfilePicture}/>
              <div className={"absolute top-0 right-0 inline-flex items-center justify-center w-20 h-20 overflow-hidden bg-gray-600 rounded-full " + (user.is_your_account ? "hover:bg-gray-800 cursor-pointer" : "")} onClick={()=> user.is_your_account ? profilePictureRef.current.click() : null}>
                  <span className="font-medium text-gray-100 h-full text-center flex items-center">
                    {loadingProfilePicture ? <Loading /> : (
                      user.profile_picture ? <img className='h-full object-cover object-center' src={`${import.meta.env.VITE_STORAGE_URL}/${user.profile_picture.storage_path}`} alt={user.full_name} /> :  user.full_name[0].toUpperCase()
                    )}
                  </span>
                  
              </div>
            </div>
          </div>

          {(!user.is_private || user.is_your_account || user.following_status === 'following') ? (
            user.posts.length > 0 ? user.posts.map(post => <Post post={post} key={post.id} />) : <div className="text-gray-700">No posts yet.</div>
          ) : (
            <div className="text-gray-700">This account is private.</div>
          )}
        </div>
      )}
    </>
  );
}
