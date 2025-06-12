import { Navigate, Outlet } from "react-router-dom";
import useAuth from "./hooks/useAuth";

const PrivateRoutes = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to={"/login"} />;

  // and return an outlet
  return <Outlet />;
};

export default PrivateRoutes;
