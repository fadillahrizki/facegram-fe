import { Link, useLocation } from 'react-router';
import api from '../api/api';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [notifications, setNotifications] = useState([]);
  const currentRoute = useLocation().pathname;

  const handleLogout = () => {
    api.post('/auth/logout')
      .then(() => {
        localStorage.clear();
        window.location.href = '/login';
      })
      .catch(err => {
        console.error('Logout failed', err);
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
        <a href="https://flowbite.com/" className="flex items-center space-x-3">
          <img src="https://flowbite.com/docs/images/logo.svg" className="h-8" alt="Flowbite Logo" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap">Facegram</span>
        </a>
        <ul className="font-medium flex gap-3">
          <Link to="/newsfeed" className={`cursor-pointer text-gray-600 hover:text-gray-900 ${currentRoute === '/newsfeed' ? 'font-bold' : ''}`}>
            <li>Home</li>
          </Link>
          <Link to="/profile/me" className={`cursor-pointer text-gray-600 hover:text-gray-900 ${currentRoute === '/profile/me' ? 'font-bold' : ''}`}>
            <li>Profile</li>
          </Link>
          <Link to="/users" className={`cursor-pointer text-gray-600 hover:text-gray-900 ${currentRoute === '/users' ? 'font-bold' : ''}`}>
            <li>Users</li>
          </Link>
          <Link to="/notifications" className={`cursor-pointer text-gray-600 hover:text-gray-900 ${currentRoute === '/notifications' ? 'font-bold' : ''}`}>
            <li>Notifications {notifications.length ? <span className="bg-red-500 text-white text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm">{notifications.length}</span> : null}</li>
          </Link>
          <li className="cursor-pointer text-gray-600 hover:text-gray-900" onClick={handleLogout}>Logout</li>
        </ul>
      </div>
    </nav>
  );
}
