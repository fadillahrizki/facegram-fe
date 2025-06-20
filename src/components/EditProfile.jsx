import { useEffect, useState } from 'react';
import api from '../api/api';
import Loading from './Loading';
import Navbar from './Navbar';

export default function EditProfile() {
  const [form, setForm] = useState({
    full_name: '', username: '', bio: '', is_private: false
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false)
  const [user] = useState(JSON.parse(localStorage.getItem("user")))

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true)
    setErrors({});
    try {
      const res = await api.put('/users/update', form);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      window.open(`/profile/me`, '_self');
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors);
      }
    } finally {
      setLoading(false)
    }
  };

  useEffect(()=>{
    setForm({
      full_name: user.full_name, username: user.username, bio: user.bio, is_private: user.is_private
    })
  }, [])

  return (
    <>
    <Navbar />
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          {['full_name', 'username', 'bio'].map(field => (
            <div key={field}>
              <label htmlFor={field} className="block text-sm/6 font-medium text-gray-900 capitalize">
                {field.replace('_', ' ')}
              </label>
              <div className="mt-2">
                <input
                  id={field}
                  name={field}
                  type={'text'}
                  required
                  value={form[field]}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6"
                  onChange={handleChange}
                />
              </div>
              {errors[field] && <div className="text-red-500 text-sm mt-2">{errors[field][0]}</div>}
            </div>
          ))}

          <div className="flex items-center">
            <input
              id="checked-checkbox"
              type="checkbox"
              name='is_private'
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              checked={form.is_private}
              onChange={handleChange}
            />
            <label
              htmlFor="checked-checkbox"
              className="ms-2 text-sm font-medium text-gray-900"
            >
              Private Account
            </label>
          </div>

          <button className={"flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 " + (loading ? "cursor-not-allowed" : "cursor-pointer")}
            disabled={loading}>{loading ? <Loading /> : 'Update'}</button>
        </form>
      </div>
    </div>
    
  </>
  );
}
