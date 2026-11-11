import { Navigate } from "react-router-dom";

const ProtectedAdminRoute = ({ session, children }) => {
  if (!session) return <Navigate to="/admin/login" replace />;
  if (session.user.app_metadata?.role !== "admin") {
    return <Navigate to="/admin/login?error=unauthorized" replace />;
  }
  return children;
};

export default ProtectedAdminRoute;
