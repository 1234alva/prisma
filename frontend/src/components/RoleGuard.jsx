import { Navigate } from 'react-router-dom';

export const RoleGuard = ({ children, allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user || !allowedRoles.includes(user.rol)) {
    return <Navigate to="/login" />;
  }

  return children;
};