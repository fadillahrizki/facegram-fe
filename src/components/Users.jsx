import { Link } from 'react-router';
import Navbar from './Navbar';
import api from '../api/api';
import { useEffect, useState } from 'react';
import Loading from './Loading';

export default function Users() {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/users`);
            setUsers(response.data)
        } catch (error) {
            console.error('Error fetching users:', error);
            setError('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchUsers();
    }, []); 

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
                {users.map(user => (
                    <li key={user.id}>
                        <div className="flex items-center justify-between p-3">
                            <Link to={`/profile/${user.username}`}>
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    {user.full_name}
                                </p>
                                <p className="text-sm text-gray-500 truncate">
                                    @{user.username}
                                </p>
                            </Link>
                            <div className="flex items-center gap-3">
                            {/* {!user.is_rejected && !user.is_accepted ? <span className="text-sm text-blue-500">Requested</span> : null} */}
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </>
    );
    }
