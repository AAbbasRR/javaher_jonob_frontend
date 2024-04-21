import { Navigate, Outlet } from "react-router-dom";

export const PrivateRoute = ({ children, isAuthenticated }) => {
	if (!isAuthenticated) {
		return <Navigate to="/signin" replace />;
	}

	return children ? children : <Outlet />;
};
