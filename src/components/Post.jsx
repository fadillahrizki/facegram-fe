import Carousel from "react-multi-carousel";
import { Link } from "react-router";

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
            <Link to={`/profile/${post.user.username}`} className="font-medium hover:underline">
                {post.user.username}
            </Link>
            <p className="font-normal text-gray-700">{post.caption}</p>
        </div>
    </div>
  );
}