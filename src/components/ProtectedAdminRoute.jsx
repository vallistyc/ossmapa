import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const ProtectedAdminRoute = ({ session, children }) => {
  if (!session) return <Navigate to="/admin/login" replace />;
  if (session.user.app_metadata?.role !== "admin") {
    return <PendingAdminAccess session={session}>{children}</PendingAdminAccess>;
  }
  return children;
};

const PendingAdminAccess = ({ session, children }) => {
  const [approved, setApproved] = useState(null);

  useEffect(() => {
    let active = true;
    supabase
      ?.from("admin_accounts")
      .select("approved")
      .eq("user_id", session.user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (active) setApproved(Boolean(data?.approved));
      });
    return () => {
      active = false;
    };
  }, [session.user.id]);

  if (approved) return children;
  return <Navigate to="/admin/login?error=pending" replace />;
};

export default ProtectedAdminRoute;
