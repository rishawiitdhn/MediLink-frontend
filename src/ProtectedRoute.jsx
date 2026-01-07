import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import NotAuthorised from "./components/NotAuthorised";

const ProtectedRoute = ({ currRole, allowedRole, children }) => {
  const location = useLocation();
    if (!currRole) {
      return (
        <div className="flex justify-center items-center min-h-screen">
          <CircularProgress size="3rem" />
        </div>
      );
  }

  if (currRole !== allowedRole) {
    console.log(currRole, allowedRole);
    return <Navigate to="/not-authorised" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;
