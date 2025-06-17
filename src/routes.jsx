import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import CreatePost from './components/CreatePost';
import NewsFeed from './components/NewsFeed';
import Notifications from './components/Notification';
import Users from './components/Users';
import { Analytics } from "@vercel/analytics/react"

const isLoggedIn = !!localStorage.getItem('token');

const RequireAuth = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

export default function AppRoutes() {
  return (
    <Router>
      <Analytics />
      <Routes>
        <Route path="/" element={<Navigate to={isLoggedIn ? "/profile/me" : "/login"} />} />
        <Route path="/login" element={isLoggedIn ? <Navigate to="/profile/me" /> : <Login />} />
        <Route path="/register" element={isLoggedIn ? <Navigate to="/profile/me" /> : <Register />} />
        <Route path="/profile/:username" element={<RequireAuth><Profile /></RequireAuth>} />
        <Route path="/newsfeed" element={<RequireAuth><NewsFeed /></RequireAuth>} />
        <Route path="/create-post" element={<RequireAuth><CreatePost /></RequireAuth>} />
        <Route path="/users" element={<RequireAuth><Users /></RequireAuth>} />
        <Route path="/notifications" element={<RequireAuth><Notifications /></RequireAuth>} />
      </Routes>
    </Router>
  );
}