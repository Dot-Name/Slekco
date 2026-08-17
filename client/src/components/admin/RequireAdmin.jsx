import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import StateMessage from '../ui/StateMessage';

/** Route guard: admins only, with a readable reason for everyone else. */
export default function RequireAdmin({ children }) {
  const { user, checking } = useAuth();
  const location = useLocation();

  if (checking) {
    return (
      <div className="shell py-20">
        <div className="skeleton mx-auto h-40 max-w-md rounded-2xl" />
      </div>
    );
  }

  if (!user) return <Navigate to="/account" state={{ from: location.pathname }} replace />;

  if (user.role !== 'admin') {
    return (
      <div className="shell py-20">
        <StateMessage
          icon="shield"
          title="This area is for admin accounts"
          body={`You are signed in as ${user.email}, which is a customer account. Sign in with an admin account to manage the catalogue.`}
          actionLabel="Back to the storefront"
          to="/"
        />
      </div>
    );
  }

  return children;
}
