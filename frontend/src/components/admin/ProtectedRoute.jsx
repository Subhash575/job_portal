import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

// Redirect before rendering so students never see recruiter pages; the backend is the real guard.
const ProtectedRoute = ({ children }) => {
  const { user } = useSelector(store => store.auth);
  return user?.role === 'recruiter' ? children : <Navigate to="/" replace />;
};
export default ProtectedRoute;
