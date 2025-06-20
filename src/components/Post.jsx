import { EllipsisHorizontalIcon, HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { ChatBubbleOvalLeftIcon, HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import Carousel from "react-multi-carousel";
import { Link } from "react-router";
import api from "../api/api";
import { useState } from "react";
import Loading from "./Loading";
import { showToast } from "./Toast";

export default function Post({ removedPost, post }) {
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 1
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1
    }
  };

  const [user] = useState(JSON.parse(localStorage.getItem("user")))
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);
  const [liked, setLiked] = useState(post.likes.find(like=>like.user_id==user.id))
  const [showComment, setShowComment] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLike = async () => {
    try {
      const res = await api.put(`posts/like/${post.id}`)
      if(res.data.data != null) {
        post.likes = [...post.likes, res.data.data]
        setLiked(true)
      } else {
        post.likes = post.likes.filter(like=>like.user_id!=user.id)
        setLiked(false)
      }
    } catch (error) {
      console.error(error)
    }

  }

  function kFormatter(num) {
    return Math.abs(num) > 999 ? Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + 'K' : Math.sign(num)*Math.abs(num)
  }

  const handleComment = async () => {
    setLoading(true)
    try {
      const res = await api.put(`posts/comment/${post.id}`, {content})
      if(res.data.data != null) {
        post.comments = [...post.comments, res.data.data]
      }
      setContent('')
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handlePostDelete = async () => {
    setLoadingAction(true)
    try {
      await api.delete(`/posts/${post.id}`)
      showToast("Success to delete post")
      removedPost(post)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }
    
  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="px-5 py-3 flex items-center justify-between">
          <div className='flex gap-2 items-center'>
            <div className={"flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-600 rounded-full"}>
                <span className="font-medium text-gray-100 h-full text-center flex items-center">
                {(
                    post.user.profile_picture ? <img className='h-full object-cover object-center' src={`${import.meta.env.VITE_STORAGE_URL}/${post.user.profile_picture.storage_path}`} alt={post.user.full_name} /> :  post.user.full_name[0].toUpperCase()
                )}
                </span>
            </div>
            <div>
              <Link to={`/profile/${post.user.username}`} className="font-medium hover:underline">
                  {post.user.username}
              </Link>
            </div>
          </div>
          {post.user.id == user.id  && (
            <div className="relative">
              <EllipsisHorizontalIcon className="w-6 h-6 cursor-pointer" onClick={()=>setMenuOpen(!menuOpen)} />
              <div className={"absolute left-0 z-10 mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black/5 " + (menuOpen ? "" : "hidden")}>
                <button onClick={handlePostDelete} className="block px-4 py-2 text-sm rounded-md text-start text-red-500 cursor-pointer hover:bg-gray-100 w-full" disabled={loadingAction}>{loadingAction ? <Loading /> : 'Delete Post'}</button>
              </div>
            </div>
          )}
        </div>
          <Carousel responsive={responsive}>
              {post.attachments.map((attachment, index) => (
                  <img
                      key={index}
                      src={`${import.meta.env.VITE_STORAGE_URL}/${attachment.storage_path}`}
                      alt={`Post attachment ${index + 1}`}
                      className="w-full max-h-96 object-cover"
                      loading="lazy"
                  />
              ))}
          </Carousel>
          <div className="p-5">
              <div className="flex gap-2 mb-2">
                <div className="flex gap-1 items-center text-sm text-gray-800 cursor-pointer" onClick={handleLike}> 
                  {liked ? <HeartSolid className="w-6 h-6" />  : <HeartOutline className="w-6 h-6" /> }
                  <span>{post.likes.length>0 ? kFormatter(post.likes.length) : ''}</span> 
                </div>
                <div className="flex gap-1 items-center text-sm text-gray-800 cursor-pointer" onClick={()=>setShowComment(!showComment)}> 
                  <ChatBubbleOvalLeftIcon className="w-6 h-6" />
                  <span>{post.comments.length>0 ? kFormatter(post.comments.length) : ''}</span> 
                </div>
              </div>
              <Link to={`/profile/${post.user.username}`} className="font-medium hover:underline">
                  {post.user.username}
              </Link>
              <p className="font-normal text-gray-700">{post.caption}</p>
          </div>
      </div>
      {showComment && (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm mt-2">
        <ul className="divide-y divide-gray-200">
          {post.comments.map(comment => (
              <li key={comment.id}>
                  <div className="flex flex-col gap-1 py-2 px-5 text-sm">
                    <div className='flex gap-2'>
                      <div className={"flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-600 rounded-full"}>
                          <span className="font-medium text-gray-100 h-full text-center flex items-center">
                          {(
                              comment.user.profile_picture ? <img className='h-full object-cover object-center' src={`${import.meta.env.VITE_STORAGE_URL}/${comment.user.profile_picture.storage_path}`} alt={comment.user.full_name} /> :  comment.user.full_name[0].toUpperCase()
                          )}
                          </span>
                      </div>
                      <div>
                          <Link to={`/profile/${comment.user.username}`} className="font-medium text-gray-900 max-w-min truncate hover:underline">{comment.user.username}</Link>
                          <p>{comment.content}</p>
                      </div>
                    </div>
                  </div>
              </li>
          ))}
        </ul>
        <div className="py-2 px-5">
          <textarea id="caption" name='caption' rows="4" className="p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500" placeholder="Write your comments here..." disabled={loading} value={content} onChange={(e) => setContent(e.target.value)} />
          <button
            className={"rounded-md bg-blue-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 " + (loading ? "cursor-not-allowed" : "cursor-pointer")}
            disabled={loading}
            onClick={handleComment}
          >
            {loading ? <Loading /> : 'Comment'}
          </button>
        </div>
      </div>
      )}
    </>
  );
}