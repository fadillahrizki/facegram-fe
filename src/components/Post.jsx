export default function Post({ post }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        {post.attachments[0] && (
            <img
            src={`${import.meta.env.VITE_STORAGE_URL}/${post.attachments[0].storage_path}`}
            alt="Post"
            className="rounded-t-lg w-full max-h-96 object-cover"
            loading="lazy"
            />
        )}
        <div className="p-5">
            <p className="font-normal text-gray-700">{post.caption}</p>
        </div>
    </div>
  );
}