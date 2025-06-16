import { Link } from 'react-router';
import Navbar from './Navbar';
import api from '../api/api';
import { useEffect, useState } from 'react';
import Loading from './Loading';

export default function Notifications() {

    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/users/notifications`);
            setNotifications(response.data)
        } catch (error) {
            console.error('Error fetching notifications:', error);
            setError('Failed to fetch notifications');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleAction = async (username, action) => {
        setLoading(true);
        try {
            if (action === 'accept') {
                await api.put(`/users/${username}/accept`);
            } else if (action === 'reject') {
                await api.put(`/users/${username}/reject`);
            }

            fetchNotifications();
        } catch (error) {
            console.error(`Error ${action}ing notification:`, error);
            setError(`Failed to ${action} notification`);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Navbar/>

            {loading && (
                <div className="text-center mt-5"><Loading isScreen={true} /></div>
            )}

            {error && (
                <div className="text-center mt-5 text-red-500">{error}</div>
            )}
            <ul className="divide-y divide-gray-200">
                {notifications.map(notification => (
                    <li key={notification.id}>
                        <div className="flex items-center justify-between p-3">
                            <Link to={`/profile/${notification.username}`}>
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    {notification.full_name}
                                </p>
                                <p className="text-sm text-gray-500 truncate">
                                    @{notification.username}
                                </p>
                            </Link>
                            <div className="flex items-center gap-3">
                            {notification.is_rejected ? <span className="text-sm text-red-500">Rejected</span> : null}
                            {
                            !notification.is_rejected && !notification.is_accepted ?  (
                                <>
                                    <button className="cursor-pointer text-sm px-4 py-2 font-medium text-white bg-blue-600 hover:bg-blue-800 rounded-lg" onClick={() => handleAction(notification.username, 'accept')}>
                                        Accept
                                    </button>
                                    <button className="cursor-pointer text-sm px-4 py-2 font-medium text-white bg-red-600 hover:bg-red-800 rounded-lg" onClick={() => handleAction(notification.username, 'reject')}>
                                        Reject
                                    </button>
                                </>
                            ) : null}
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </>
    );
    }
