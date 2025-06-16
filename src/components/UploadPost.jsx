import { useState } from 'react';
import { useNavigate } from 'react-router';
import api from '../api/api';

export default function UploadPost() {
  const [caption, setCaption] = useState('');
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData();
    formData.append('caption', caption);
    files.forEach((file, i) => {
      formData.append(`attachments[${i}]`, file);
    });

    try {
      await api.post('/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigate('/profile/me'); // atau refresh halaman
    } catch (err) {
      if (err.response?.status === 422) {
        setError('Invalid input or file type.');
      } else {
        setError('Upload failed.');
      }
    }
  };

  return (
    <div className="container mt-4">
      <h2>Create New Post</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Caption</label>
          <textarea
            className="form-control"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>Upload Images</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            required
          />
        </div>
        {error && <div className="text-danger mb-2">{error}</div>}
        <button type="submit" className="btn btn-primary">Upload</button>
      </form>
    </div>
  );
}
