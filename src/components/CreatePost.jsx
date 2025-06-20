import { useState } from 'react';
import { useNavigate } from 'react-router';
import api from '../api/api';
import Navbar from './Navbar';
import Loading from './Loading';
import { showToast } from './Toast';

export default function CreatePost() {
  const [caption, setCaption] = useState('');
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    if (files.length === 0) {
      setError('Please select at least one file.');
      setLoading(false);
      return;
    }
    const formData = new FormData();
    formData.append('caption', caption);
    files.forEach((file, i) => {
      formData.append(`attachments[${i}]`, file);
    });

    try {
      await api.post('/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      showToast("Success to create post")
      navigate('/profile/me'); // atau refresh halaman
    } catch (err) {
      if (err.response?.status === 422) {
        setError('Invalid input or file type.');
      } else {
        setError('Upload failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
  
            {error && (
              <div className="mb-4 rounded-md bg-red-50 p-4">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            )}
  
            <form action="#" method="POST" className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="caption" className="mb-2 block text-sm/6 font-medium text-gray-900">
                  Caption
                </label>
                  <textarea id="caption" name='caption' rows="4" className="p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500" placeholder="Write your thoughts here..." value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    required />
              </div>

              <div className="relative inline-block w-full">
                <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="file_input">Upload Images</label>
                <input type="file" className="file:absolute file:right-0 file:bg-blue-500 file:text-white file:border-0 file:py-1 file:px-3 file:rounded-full file:shadow-xl file:shadow-blue-500/30 text-gray-600 file:cursor-pointer mb-3"
                id="file_input" name="attachments" required
                multiple accept="image/*"
                onChange={handleFileChange}/>
              </div>

              <div>
                <button
                  type="submit"
                  className={"flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 " + (loading ? "cursor-not-allowed" : "cursor-pointer")}
                  disabled={loading}
                >
                  {loading ? <Loading /> : 'Submit Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </>
  );
}
