import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import Carousel from "react-multi-carousel";
import { Link } from "react-router";
import api from "../api/api";
import { useState } from "react";

export default function Post({ post }) {
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

  const [liked, setLiked] = useState(post.likes.find(like=>like.user_id==user.id))

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
    
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <Carousel responsive={responsive}>
            {post.attachments.map((attachment, index) => (
                <img
                    key={index}
                    src={`${import.meta.env.VITE_STORAGE_URL}/${attachment.storage_path}`}
                    alt={`Post attachment ${index + 1}`}
                    className="rounded-t-lg w-full max-h-96 object-cover"
                    loading="lazy"
                />
            ))}
        </Carousel>
        <div className="p-5">
            <div className="flex gap-2 mb-2">
              <div className="flex gap-1 items-center text-sm text-gray-800" onClick={handleLike}> 
                {liked ? <HeartSolid className="w-6 h-6" />  : <HeartOutline className="w-6 h-6" /> }
                <span>{post.likes.length>0 ? post.likes.length : ''}</span> 
              </div>
              {/* <div className="flex gap-1 items-center text-sm"> <ChatBubbleOvalLeftIcon className="w-6 h-6" /> <span>123</span> </div> */}
            </div>
            <Link to={`/profile/${post.user.username}`} className="font-medium hover:underline">
                {post.user.username}
            </Link>
            <p className="font-normal text-gray-700">{post.caption}</p>
        </div>
    </div>
  );
}