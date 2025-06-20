import { Link, useLocation } from 'react-router';
import api from '../api/api';
import { useEffect, useRef, useState } from 'react';
import Loading from './Loading';

export default function Navbar() {
  const [notifications, setNotifications] = useState([]);
  const currentRoute = useLocation().pathname;
  const navbar = useRef(null);
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    if (loading) return;
    setLoading(true);
    api.post('/auth/logout')
      .then(() => {
        localStorage.clear();
        window.location.href = '/login';
      })
      .catch(err => {
        console.error('Logout failed', err);
      }).finally(() => {
        setLoading(false);
      });
  }

  const fetchNotifications = async () => {
        try {
            const response = await api.get(`/users/notifications`);
            setNotifications(response.data)
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    }

  useEffect(() => {
      fetchNotifications();
  }, []);

  return (
    <nav className="bg-white border border-gray-200">
      <div className="flex flex-wrap items-center justify-between w-full p-4">
        <a href="/newsfeed" className="flex items-center space-x-3 mb-2">
          <img src="https://flowbite.com/docs/images/logo.svg" className="h-8" alt="Flowbite Logo" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap">Facegram</span>
        </a>
        <button type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 " aria-expanded="false" onClick={() => {
            if (navbar.current) {
              navbar.current.classList.toggle('hidden');
            }
        }}>
            <span className="sr-only">Open main menu</span>
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
            </svg>
        </button>
        <div className="hidden w-full md:block md:w-auto" ref={navbar}>
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white">
            <Link to="/newsfeed" className={`py-2 px-3 rounded-sm  md:border-0  ${currentRoute === '/newsfeed' ? 'text-white bg-blue-700' : 'text-gray-600 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700'}`}>
              <li>Home</li>
            </Link>
            <Link to="/profile/me" className={`py-2 px-3 rounded-sm  md:border-0 ${currentRoute === '/profile/me' ? 'text-white bg-blue-700' : 'text-gray-600 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700'}`}>
              <li>Profile</li>
            </Link>
            <Link to="/create-post" className={`py-2 px-3 rounded-sm  md:border-0  ${currentRoute === '/create-post' ? 'text-white bg-blue-700' : 'text-gray-600 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700'}`}>
              <li>Create Post</li>
            </Link>
            <Link to="/users" className={`py-2 px-3 rounded-sm  md:border-0  ${currentRoute === '/users' ? 'text-white bg-blue-700' : 'text-gray-600 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700'}`}>
              <li>Users</li>
            </Link>
            <Link to="/notifications" className={`py-2 px-3 rounded-sm  md:border-0  ${currentRoute === '/notifications' ? 'text-white bg-blue-700' : 'text-gray-600 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700'}`}>
              <li>Notifications {notifications.length ? <span className="bg-red-500 text-white text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm">{notifications.length}</span> : null}</li>
            </Link>
            <li className="py-2 px-3 rounded-sm text-gray-600 cursor-pointer hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700" onClick={handleLogout}>{loading? <Loading /> : 'Logout'}</li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
